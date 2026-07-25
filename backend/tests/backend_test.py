"""Backend API tests for Ranthambore Curator (Node.js/Express backend).

Covers: health, bookings, inquiries, admin auth, admin bookings/inquiries/stats,
reviews, hotels, images, and Telegram notification side-effects (via logs).
"""
import os
import re
import subprocess
import time
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing")
BASE_URL = base_url.rstrip("/")

backend_env = dotenv_values("/app/backend/.env")
ADMIN_PIN = backend_env.get("ADMIN_PIN")

NEW_EMAIL = "theranthambhorecurator@gmail.com"
OLD_EMAIL = "theranthamborecurator@gmail.com"

BACKEND_LOG = "/app/backend/backend.out.log"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "X-Admin-Pin": ADMIN_PIN})
    return s


def booking_payload(name="TEST_Booking User"):
    return {
        "date": "2026-08-15",
        "shift": "morning",
        "vehicle": "Gypsy",
        "zone": "Zone 3",
        "nationality": "Indian",
        "guests": 2,
        "per_person": 2500.0,
        "total": 5000.0,
        "addons": [],
        "full_name": name,
        "email": "test_qa@example.com",
        "whatsapp": "+919999900000",
        "is_tatkal": False,
    }


def inquiry_payload(itype="contact", name="TEST_Inquiry User"):
    return {
        "type": itype,
        "name": name,
        "phone": "+919999900001",
        "email": "test_qa@example.com",
        "message": "TEST_ automated qa message",
    }


# ---------------- Health ----------------
class TestHealth:
    def test_api_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "ok"
        assert "Ranthambore" in data["message"]

    def test_backend_is_nodejs_not_fastapi(self):
        """No Python/FastAPI files should exist in backend."""
        py_files = list(Path("/app/backend").glob("*.py"))
        assert py_files == [], f"Python files found in backend: {py_files}"
        assert Path("/app/backend/server.js").exists()

    def test_no_old_email_in_repo(self):
        out = subprocess.run(
            ["grep", "-rl", "--exclude-dir=tests", "--exclude-dir=__pycache__",
             OLD_EMAIL, "/app/backend", "/app/frontend/src", "/app/frontend/public"],
            capture_output=True, text=True,
        )
        assert out.stdout.strip() == "", f"Old email still present in: {out.stdout}"

    def test_new_email_present_in_frontend_source(self):
        content = Path("/app/frontend/src/lib/api.js").read_text()
        assert NEW_EMAIL in content


# ---------------- Bookings ----------------
class TestBookings:
    created_refs = []

    def test_create_booking_and_persist(self, api_client, admin_client):
        payload = booking_payload()
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "_id" not in data, "MongoDB _id leaked in response"
        assert re.match(r"^RTC-2026-\d{5}$", data["ref"]), data.get("ref")
        assert data["status"] == "pending"
        assert data["full_name"] == payload["full_name"]
        assert data["guests"] == 2
        assert isinstance(data["id"], str)
        TestBookings.created_refs.append(data["ref"])

        # verify persisted via admin listing
        g = admin_client.get(f"{BASE_URL}/api/admin/bookings")
        assert g.status_code == 200
        refs = [b["ref"] for b in g.json()]
        assert data["ref"] in refs

    def test_create_booking_invalid_shift(self, api_client):
        p = booking_payload()
        p["shift"] = "midnight"
        r = api_client.post(f"{BASE_URL}/api/bookings", json=p)
        assert r.status_code == 422, r.status_code

    def test_create_booking_missing_required(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/bookings", json={"shift": "morning"})
        assert r.status_code == 422

    def test_update_booking_status(self, api_client, admin_client):
        r = api_client.post(f"{BASE_URL}/api/bookings", json=booking_payload("TEST_Status User"))
        ref = r.json()["ref"]
        TestBookings.created_refs.append(ref)

        u = admin_client.patch(f"{BASE_URL}/api/admin/bookings/{ref}/status", json={"status": "confirmed"})
        assert u.status_code == 200, u.text
        assert u.json()["ok"] is True

        g = admin_client.get(f"{BASE_URL}/api/admin/bookings")
        match = [b for b in g.json() if b["ref"] == ref]
        assert match and match[0]["status"] == "confirmed"

    def test_update_status_not_found(self, admin_client):
        r = admin_client.patch(f"{BASE_URL}/api/admin/bookings/RTC-2026-00000/status", json={"status": "confirmed"})
        assert r.status_code == 404

    def test_admin_bookings_requires_pin(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/bookings")
        assert r.status_code in (401, 403), r.status_code

    def test_admin_bookings_wrong_pin(self):
        r = requests.get(f"{BASE_URL}/api/admin/bookings", headers={"X-Admin-Pin": "00000000"})
        assert r.status_code in (401, 403)


# ---------------- Inquiries ----------------
class TestInquiries:
    @pytest.mark.parametrize("itype", ["contact", "callback", "package", "hotel"])
    def test_create_inquiry_types(self, api_client, admin_client, itype):
        payload = inquiry_payload(itype, f"TEST_{itype} User")
        r = api_client.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "_id" not in data
        assert data["type"] == itype
        assert data["name"] == payload["name"]
        assert isinstance(data["id"], str)
        assert "created_at" in data

        g = admin_client.get(f"{BASE_URL}/api/admin/inquiries")
        assert g.status_code == 200
        assert any(i["id"] == data["id"] for i in g.json())

    def test_inquiry_invalid_type(self, api_client):
        p = inquiry_payload()
        p["type"] = "bogus"
        r = api_client.post(f"{BASE_URL}/api/inquiries", json=p)
        assert r.status_code == 422

    def test_admin_inquiries_requires_pin(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/inquiries")
        assert r.status_code in (401, 403)


# ---------------- Admin auth & stats ----------------
class TestAdmin:
    def test_login_success(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/admin/login", json={"pin": ADMIN_PIN})
        assert r.status_code == 200, r.text
        assert r.json().get("ok") is True

    def test_login_failure(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/admin/login", json={"pin": "11111111"})
        assert r.status_code in (401, 403), r.status_code

    def test_stats(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/stats")
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, dict) and len(data) > 0
        assert "_id" not in str(data)

    def test_live_feed(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/live-feed")
        assert r.status_code == 200, r.text


# ---------------- Public content endpoints ----------------
class TestPublicContent:
    def test_reviews(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/reviews")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_hotels(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/hotels")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_images(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/images")
        assert r.status_code == 200

    def test_404_unknown_route(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/does-not-exist")
        assert r.status_code == 404


# ---------------- Admin CRUD: reviews & hotels ----------------
class TestAdminCrud:
    def test_review_crud(self, admin_client):
        c = admin_client.post(f"{BASE_URL}/api/admin/reviews",
                              json={"name": "TEST_Reviewer", "rating": 5, "text": "TEST_ great trip"})
        assert c.status_code == 200, c.text
        rev = c.json()
        assert "_id" not in rev
        rid = rev.get("id") or rev.get("review_id")
        assert rid

        g = admin_client.get(f"{BASE_URL}/api/admin/reviews")
        assert any(x.get("id") == rid for x in g.json())

        u = admin_client.patch(f"{BASE_URL}/api/admin/reviews/{rid}", json={"hidden": True})
        assert u.status_code == 200, u.text

        d = admin_client.delete(f"{BASE_URL}/api/admin/reviews/{rid}")
        assert d.status_code in (200, 204)
        g2 = admin_client.get(f"{BASE_URL}/api/admin/reviews")
        assert not any(x.get("id") == rid for x in g2.json())

    def test_hotel_crud(self, admin_client):
        c = admin_client.post(f"{BASE_URL}/api/admin/hotels", json={
            "name": "TEST_Hotel", "stars": 4, "distance": "2 km",
            "description": "TEST_ hotel", "amenities": ["wifi"]})
        assert c.status_code == 200, c.text
        h = c.json()
        assert "_id" not in h
        hid = h.get("id") or h.get("hotel_id")
        assert hid

        u = admin_client.patch(f"{BASE_URL}/api/admin/hotels/{hid}", json={"name": "TEST_Hotel Renamed"})
        assert u.status_code == 200, u.text

        g = admin_client.get(f"{BASE_URL}/api/admin/hotels")
        match = [x for x in g.json() if x.get("id") == hid]
        assert match and match[0]["name"] == "TEST_Hotel Renamed"

        d = admin_client.delete(f"{BASE_URL}/api/admin/hotels/{hid}")
        assert d.status_code in (200, 204)


# ---------------- Telegram notification ----------------
class TestTelegramNotification:
    def _read_logs(self):
        out = subprocess.run(["tail", "-n", "200", "/var/log/supervisor/backend.out.log"],
                             capture_output=True, text=True)
        err = subprocess.run(["tail", "-n", "200", "/var/log/supervisor/backend.err.log"],
                             capture_output=True, text=True)
        return out.stdout + err.stdout

    def test_env_vars_configured(self):
        assert backend_env.get("TELEGRAM_BOT_TOKEN"), "TELEGRAM_BOT_TOKEN missing in backend/.env"
        assert backend_env.get("TELEGRAM_CHAT_ID"), "TELEGRAM_CHAT_ID missing in backend/.env"

    def test_booking_triggers_telegram_without_skip_or_error(self, api_client):
        before = len(self._read_logs())
        r = api_client.post(f"{BASE_URL}/api/bookings", json=booking_payload("TEST_Telegram Booking"))
        assert r.status_code == 200
        time.sleep(4)
        new_logs = self._read_logs()[before:]
        assert "Telegram notification skipped" not in new_logs, \
            "Telegram env vars not loaded at module import time (dotenv.config runs AFTER require)"
        assert "Telegram notification failed" not in new_logs, new_logs

    def test_inquiry_triggers_telegram_without_skip_or_error(self, api_client):
        before = len(self._read_logs())
        r = api_client.post(f"{BASE_URL}/api/inquiries", json=inquiry_payload("contact", "TEST_Telegram Inquiry"))
        assert r.status_code == 200
        time.sleep(4)
        new_logs = self._read_logs()[before:]
        assert "Telegram notification skipped" not in new_logs, \
            "Telegram env vars not loaded at module import time"
        assert "Telegram notification failed" not in new_logs, new_logs
