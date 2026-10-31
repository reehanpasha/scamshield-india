import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.init_db import init_database

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_database()

client = TestClient(app)

def test_root_endpoint():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "ScamShield India" in data["platform"]

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "HEALTHY"
    assert data["database_connected"] is True

def test_url_analyze_api():
    resp = client.post("/api/url/analyze", json={"url": "http://sbi-kyc-update.xyz/login"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["valid"] is True
    assert data["risk_score"] >= 60

def test_message_analyze_api():
    resp = client.post("/api/message/analyze", json={
        "content": "Enter UPI PIN to receive ₹2000 cashback immediately in bank.",
        "message_type": "SMS"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["valid"] is True
    assert data["risk_score"] >= 50

def test_dashboard_analytics_api():
    resp = client.get("/api/analytics/dashboard")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_analyses"] > 0
    assert "risk_distribution" in data
