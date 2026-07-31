const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { z } = require('zod');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { sendTelegramNotification } = require('./utils/telegram');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// ============ CONFIGURATION ============
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const ADMIN_PIN = process.env.ADMIN_PIN;
const CORS_ORIGINS = process.env.CORS_ORIGINS || '*';
const ADMIN_COOKIE_NAME = 'rtc_admin_token';
const ADMIN_COOKIE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

if (!MONGO_URL) {
  console.error('ERROR: MONGO_URL environment variable is required');
  process.exit(1);
}

if (!DB_NAME) {
  console.error('ERROR: DB_NAME environment variable is required');
  process.exit(1);
}

if (!ADMIN_PIN) {
  console.error('ERROR: ADMIN_PIN environment variable is required');
  process.exit(1);
}

// ============ UTILITY FUNCTIONS ============
function utcNowIso() {
  return new Date().toISOString();
}

function genBookingRef() {
  const suffix = Math.floor(10000 + Math.random() * 90000).toString();
  return `RTC-2026-${suffix}`;
}

function generateUuid() {
  return crypto.randomUUID();
}

// ============ ZOD VALIDATION SCHEMAS ============
const BookingCreateSchema = z.object({
  date: z.string(),
  shift: z.enum(['morning', 'evening']),
  vehicle: z.string(),
  zone: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  guests: z.number().int(),
  per_person: z.number().optional().nullable(),
  total: z.number().optional().nullable(),
  addons: z.array(z.string()).default([]),
  full_name: z.string(),
  email: z.string(),
  whatsapp: z.string(),
  age: z.number().int().optional().nullable(),
  id_proof_type: z.string().optional().nullable(),
  id_proof_number: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_number: z.string().optional().nullable(),
  is_tatkal: z.boolean().default(false)
});

const InquiryCreateSchema = z.object({
  type: z.enum(['callback', 'contact', 'package', 'hotel', 'tatkal_request', 'custom_package']),
  name: z.string(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  context: z.record(z.any()).optional().nullable()
});

const AdminLoginSchema = z.object({
  pin: z.string()
});

const ReviewCreateSchema = z.object({
  name: z.string(),
  rating: z.number().int().default(5),
  text: z.string(),
  photo: z.string().optional().nullable(),
  source_url: z.string().optional().nullable()
});

const ReviewUpdateSchema = z.object({
  hidden: z.boolean().optional().nullable()
});

const HotelCreateSchema = z.object({
  name: z.string(),
  stars: z.number(),
  distance: z.string(),
  description: z.string(),
  amenities: z.array(z.string()).default([]),
  image1: z.string().optional().nullable(),
  image2: z.string().optional().nullable()
});

const HotelUpdateSchema = z.object({
  name: z.string().optional().nullable(),
  stars: z.number().optional().nullable(),
  distance: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  image1: z.string().optional().nullable(),
  image2: z.string().optional().nullable()
});

const StatusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled'])
});

const SiteImagePayloadSchema = z.object({
  data_url: z.string()
});

// ============ EXPRESS APP SETUP ============
const app = express();

// Trust one hop of reverse proxy (Kubernetes ingress in front of this pod).
// Without this, `req.ip` is the ingress IP and rate-limiters would treat
// the entire internet as a single client. `1` means "trust one proxy" —
// safer than `true` (which trusts arbitrary X-Forwarded-For chains and
// lets clients spoof their IP).
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGINS === '*' ? '*' : CORS_ORIGINS.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// ============ MONGODB CONNECTION ============
let db;
let client;

async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// ============ MIDDLEWARE ============
// In-memory admin session store: opaque token -> expiry timestamp.
// The cookie carries a random token, never the PIN itself, so a leaked
// cookie doesn't hand over the permanent shared secret. Logout deletes the
// server-side entry, so a captured old cookie stops working immediately.
const adminSessions = new Map();

function createAdminSession() {
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, Date.now() + ADMIN_COOKIE_MAX_AGE_MS);
  return token;
}

function touchAdminSession(token) {
  const expiresAt = adminSessions.get(token);
  if (!expiresAt || expiresAt < Date.now()) {
    adminSessions.delete(token);
    return false;
  }
  adminSessions.set(token, Date.now() + ADMIN_COOKIE_MAX_AGE_MS);
  return true;
}

function destroyAdminSession(token) {
  adminSessions.delete(token);
}

function setAdminCookie(res, token) {
  const maxAgeSeconds = Math.floor(ADMIN_COOKIE_MAX_AGE_MS / 1000);
  res.append('Set-Cookie',
    `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=${maxAgeSeconds}; Path=/`
  );
}

function requireAdmin(req, res, next) {
  const token = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : undefined;
  if (!token || !touchAdminSession(token)) {
    return res.status(401).json({ detail: 'Unauthorized' });
  }
  // Sliding session: refresh cookie expiry on every authenticated request.
  setAdminCookie(res, token);
  next();
}

function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(422).json({ 
        detail: 'Validation error',
        errors: error.errors 
      });
    }
  };
}

// ============ API ROUTES ============

// Root endpoint
app.get('/api/', (req, res) => {
  res.json({ message: 'Ranthambore Safari Curator API', status: 'ok' });
});

// ---- Bookings ----
app.post('/api/bookings', validateBody(BookingCreateSchema), async (req, res) => {
  try {
    const booking = {
      id: generateUuid(),
      ref: genBookingRef(),
      status: 'pending',
      created_at: utcNowIso(),
      ...req.body
    };
    
    await db.collection('bookings').insertOne(booking);
    
    // Remove MongoDB _id from response
    const { _id, ...bookingResponse } = booking;
    res.json(bookingResponse);

    // Fire-and-forget admin notification; never blocks the booking flow.
    try {
      await sendTelegramNotification(
        `🐯 New Safari Booking\n` +
        `Ref: ${booking.ref}\n` +
        `Guest: ${booking.full_name}\n` +
        `Phone: ${booking.whatsapp}\n` +
        `Email: ${booking.email}\n` +
        `Date: ${booking.date} (${booking.shift})\n` +
        `Zone: ${booking.zone || 'N/A'}\n` +
        `Vehicle: ${booking.vehicle}\n` +
        `Guests: ${booking.guests}\n` +
        `Total: ${booking.total ?? 'N/A'}\n` +
        `Tatkal: ${booking.is_tatkal ? 'Yes' : 'No'}`
      );
    } catch (notifyError) {
      console.error('Failed to send Telegram notification for booking:', notifyError);
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await db.collection('bookings')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(2000)
      .toArray();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.patch('/api/admin/bookings/:ref/status', requireAdmin, validateBody(StatusUpdateSchema), async (req, res) => {
  try {
    const { ref } = req.params;
    const { status } = req.body;
    
    const result = await db.collection('bookings').updateOne(
      { ref },
      { $set: { status } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ detail: 'Booking not found' });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Inquiries ----
app.post('/api/inquiries', validateBody(InquiryCreateSchema), async (req, res) => {
  try {
    const inquiry = {
      id: generateUuid(),
      created_at: utcNowIso(),
      ...req.body
    };
    
    await db.collection('inquiries').insertOne(inquiry);
    
    const { _id, ...inquiryResponse } = inquiry;
    res.json(inquiryResponse);

    // Fire-and-forget admin notification; never blocks the inquiry flow.
    try {
      await sendTelegramNotification(
        `📩 New Inquiry (${inquiry.type})\n` +
        `Name: ${inquiry.name}\n` +
        `Phone: ${inquiry.phone || 'N/A'}\n` +
        `Email: ${inquiry.email || 'N/A'}\n` +
        `Message: ${inquiry.message || 'N/A'}` +
        (inquiry.context ? `\nDetails: ${JSON.stringify(inquiry.context)}` : '')
      );
    } catch (notifyError) {
      console.error('Failed to send Telegram notification for inquiry:', notifyError);
    }
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/admin/inquiries', requireAdmin, async (req, res) => {
  try {
    const inquiries = await db.collection('inquiries')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(2000)
      .toArray();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Admin Auth ----

// Rate limit brute-force attempts against the admin login endpoint.
// Deliberately strict: 10 attempts per 15 minutes per IP. Legitimate admins
// only log in occasionally; this cap makes online brute force infeasible
// while leaving normal use unaffected. `standardHeaders: true` emits the
// RFC RateLimit-* headers so proxies/clients can see remaining quota.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Too many login attempts. Please try again later.' },
});

// Constant-time PIN comparison to remove timing side-channel from string ==.
// Falls back to a length-safe compare when the submitted PIN is a different
// length than the configured one (timingSafeEqual requires equal lengths).
function pinsMatch(submitted, expected) {
  const a = Buffer.from(String(submitted));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) {
    // Still spend the compare cost against `b` to avoid trivial length-based
    // timing leaks between "wrong length" and "wrong value" cases.
    const filler = Buffer.alloc(b.length);
    crypto.timingSafeEqual(filler, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

app.post('/api/admin/login', adminLoginLimiter, validateBody(AdminLoginSchema), async (req, res) => {
  try {
    const { pin } = req.body;
    if (pinsMatch(pin, ADMIN_PIN)) {
      const token = createAdminSession();
      setAdminCookie(res, token);
      return res.json({ ok: true });
    }
    res.status(401).json({ detail: 'Incorrect PIN' });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : undefined;
  if (token) destroyAdminSession(token);
  res.append('Set-Cookie',
    `${ADMIN_COOKIE_NAME}=; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0; Path=/`
  );
  res.json({ ok: true });
});

app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({ ok: true });
});

// ---- Admin Stats ----
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const bookingsCollection = db.collection('bookings');
    const inquiriesCollection = db.collection('inquiries');
    
    const [
      totalBookings,
      pending,
      confirmed,
      cancelled,
      revenueAgg,
      contactCount,
      callbackCount,
      packageCount,
      recentBookings,
      recentInquiries
    ] = await Promise.all([
      bookingsCollection.countDocuments({}),
      bookingsCollection.countDocuments({ status: 'pending' }),
      bookingsCollection.countDocuments({ status: 'confirmed' }),
      bookingsCollection.countDocuments({ status: 'cancelled' }),
      bookingsCollection.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, sum: { $sum: '$total' } } }
      ]).toArray(),
      inquiriesCollection.countDocuments({ type: 'contact' }),
      inquiriesCollection.countDocuments({ type: 'callback' }),
      inquiriesCollection.countDocuments({ type: { $in: ['package', 'custom_package'] } }),
      bookingsCollection.find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(5).toArray(),
      inquiriesCollection.find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(5).toArray()
    ]);
    
    const revenue = revenueAgg.length > 0 ? revenueAgg[0].sum : 0;
    
    res.json({
      total_bookings: totalBookings,
      pending,
      confirmed,
      cancelled,
      revenue,
      contact_inquiries: contactCount,
      callback_requests: callbackCount,
      package_inquiries: packageCount,
      recent_bookings: recentBookings,
      recent_inquiries: recentInquiries,
      last_updated: utcNowIso()
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Admin Live Feed ----
app.get('/api/admin/live-feed', requireAdmin, async (req, res) => {
  try {
    const [bookings, inquiries] = await Promise.all([
      db.collection('bookings').find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(50).toArray(),
      db.collection('inquiries').find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(50).toArray()
    ]);
    
    const feed = [];
    
    for (const b of bookings) {
      feed.push({
        kind: b.is_tatkal ? 'tatkal_request' : 'new_booking',
        title: b.is_tatkal ? 'Tatkal Request' : 'New Booking',
        name: b.full_name || '',
        detail: `${b.vehicle || ''} · Zone ${b.zone || ''} · ${b.date || ''}`,
        created_at: b.created_at,
        ref: b.ref
      });
    }
    
    const titleMap = {
      callback: 'Callback Request',
      contact: 'Contact Message',
      package: 'Package Inquiry',
      custom_package: 'Custom Package Inquiry',
      hotel: 'Hotel Inquiry'
    };
    
    for (const q of inquiries) {
      feed.push({
        kind: q.type,
        title: titleMap[q.type] || (q.type || 'Inquiry').replace(/^\w/, c => c.toUpperCase()),
        name: q.name || '',
        detail: q.message || (q.context && q.context.summary) || '',
        created_at: q.created_at
      });
    }
    
    feed.sort((a, b) => {
      const dateA = a.created_at || '';
      const dateB = b.created_at || '';
      return dateB.localeCompare(dateA);
    });
    
    res.json({ items: feed.slice(0, 50) });
  } catch (error) {
    console.error('Error fetching live feed:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Reviews ----
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await db.collection('reviews')
      .find({ hidden: { $ne: true } }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const reviews = await db.collection('reviews')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(500)
      .toArray();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.post('/api/admin/reviews', requireAdmin, validateBody(ReviewCreateSchema), async (req, res) => {
  try {
    const review = {
      id: generateUuid(),
      created_at: utcNowIso(),
      hidden: false,
      ...req.body
    };
    
    await db.collection('reviews').insertOne(review);
    
    const { _id, ...reviewResponse } = review;
    res.json(reviewResponse);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.patch('/api/admin/reviews/:review_id', requireAdmin, validateBody(ReviewUpdateSchema), async (req, res) => {
  try {
    const { review_id } = req.params;
    const update = {};
    
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== null && req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });
    
    if (Object.keys(update).length === 0) {
      return res.json({ ok: true });
    }
    
    const result = await db.collection('reviews').updateOne(
      { id: review_id },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ detail: 'Review not found' });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.delete('/api/admin/reviews/:review_id', requireAdmin, async (req, res) => {
  try {
    const { review_id } = req.params;
    
    const result = await db.collection('reviews').deleteOne({ id: review_id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: 'Review not found' });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Hotels ----
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await db.collection('hotels')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(500)
      .toArray();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/admin/hotels', requireAdmin, async (req, res) => {
  try {
    const hotels = await db.collection('hotels')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(500)
      .toArray();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching admin hotels:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.post('/api/admin/hotels', requireAdmin, validateBody(HotelCreateSchema), async (req, res) => {
  try {
    const hotel = {
      id: generateUuid(),
      created_at: utcNowIso(),
      ...req.body
    };
    
    await db.collection('hotels').insertOne(hotel);
    
    const { _id, ...hotelResponse } = hotel;
    res.json(hotelResponse);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.patch('/api/admin/hotels/:hotel_id', requireAdmin, validateBody(HotelUpdateSchema), async (req, res) => {
  try {
    const { hotel_id } = req.params;
    const update = {};
    
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== null && req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });
    
    if (Object.keys(update).length === 0) {
      return res.json({ ok: true });
    }
    
    const result = await db.collection('hotels').updateOne(
      { id: hotel_id },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ detail: 'Hotel not found' });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.delete('/api/admin/hotels/:hotel_id', requireAdmin, async (req, res) => {
  try {
    const { hotel_id } = req.params;
    
    const result = await db.collection('hotels').deleteOne({ id: hotel_id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: 'Hotel not found' });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ---- Site Images ----
app.get('/api/images', async (req, res) => {
  try {
    const images = await db.collection('site_images')
      .find({}, { projection: { _id: 0 } })
      .limit(500)
      .toArray();
    
    const imageMap = {};
    images.forEach(img => {
      if (img.key && img.data_url) {
        imageMap[img.key] = img.data_url;
      }
    });
    
    res.json(imageMap);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.put('/api/admin/images/:key', requireAdmin, validateBody(SiteImagePayloadSchema), async (req, res) => {
  try {
    const { key } = req.params;
    const { data_url } = req.body;
    
    await db.collection('site_images').updateOne(
      { key },
      { 
        $set: { 
          key, 
          data_url, 
          updated_at: utcNowIso() 
        } 
      },
      { upsert: true }
    );
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error upserting image:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.delete('/api/admin/images/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    
    await db.collection('site_images').deleteOne({ key });
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// ============ ERROR HANDLING ============
app.use((req, res) => {
  res.status(404).json({ detail: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ detail: 'Internal server error' });
});

// ============ SERVER STARTUP ============
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ranthambore Safari Curator API running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
