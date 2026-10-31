import pytest
from app.engine.url_detector import analyze_url_structure, calculate_shannon_entropy, normalize_homoglyphs

def test_legitimate_bank_url():
    result = analyze_url_structure("https://onlinesbi.sbi/portal")
    assert result["valid"] is True
    assert result["risk_score"] < 25
    assert result["risk_level"] == "LOW"

def test_lookalike_sbi_domain():
    result = analyze_url_structure("http://sbi-kyc-update.xyz/login")
    assert result["valid"] is True
    assert result["risk_score"] >= 60
    assert result["risk_level"] in ["HIGH", "CRITICAL"]
    assert any("BRAND_IMPERSONATION" in f for f in result["findings"])
    assert "SUSPICIOUS_TLD" in result["findings"]

def test_bare_ip_address_host():
    result = analyze_url_structure("http://192.168.1.100/login")
    assert result["valid"] is True
    assert result["is_ip_host"] is True
    assert result["risk_score"] >= 45

def test_homoglyph_detection():
    # Cyrillic 'a' (U+0430) instead of Latin 'a'
    cyrillic_a = "\u0430"
    spoofed = f"http://sb{cyrillic_a}-bank.com"
    normalized = normalize_homoglyphs(spoofed)
    assert normalized == "http://sba-bank.com"

def test_shannon_entropy():
    # Regular english word has lower entropy than randomized hex string
    low_entropy = calculate_shannon_entropy("google")
    high_entropy = calculate_shannon_entropy("x8q9z7w2m1k4p0v9")
    assert high_entropy > low_entropy
