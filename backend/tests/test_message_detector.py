import pytest
from app.engine.message_detector import analyze_message_content

def test_upi_pin_fraud_detection():
    msg = "Congratulations! You have received ₹3,500 cashback. Enter UPI PIN to claim amount in your bank account."
    res = analyze_message_content(msg, "SMS")
    assert res["valid"] is True
    assert res["risk_score"] >= 50
    assert "UPI Fraud" in res["categories"]
    assert len(res["highlights"]) > 0

def test_digital_arrest_scam_detection():
    msg = "This is CBI officer Sharma. A parcel containing MDMA narcotics was seized in your name. Join Skype interrogation for digital arrest."
    res = analyze_message_content(msg, "WhatsApp")
    assert res["valid"] is True
    assert res["risk_score"] >= 55
    assert "Digital Arrest / Law Enforcement Impersonation" in res["categories"]

def test_fake_kyc_hindi_detection():
    msg = "प्रिय ग्राहक, आपका बैंक खाता आज बंद कर दिया जाएगा। तुरंत पैन कार्ड अपडेट करें।"
    res = analyze_message_content(msg, "SMS")
    assert res["valid"] is True
    assert res["risk_score"] >= 40
    assert res["detected_language"] == "HINDI"

def test_legitimate_otp_message():
    msg = "584920 is your OTP for login to your account. Valid for 10 minutes. Do not share with anyone including bank officials."
    res = analyze_message_content(msg, "SMS")
    assert res["valid"] is True
    assert res["risk_level"] == "LOW"

def test_telegram_task_job_scam():
    msg = "Work from home part time job! Earn Rs 3000 to Rs 8000 daily by liking YouTube videos. Contact Telegram receptionist."
    res = analyze_message_content(msg, "WhatsApp")
    assert res["valid"] is True
    assert res["risk_score"] >= 40
    assert "Job / Work From Home Scam" in res["categories"]
