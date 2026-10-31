import math
import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, List, Any, Optional
from app.core.ssrf import validate_url_safety_ssrf

# Target Indian Financial & Govt Brands for Lookalike Detection
INDIAN_TARGET_BRANDS = [
    "sbi", "onlinesbi", "statebank", "hdfc", "hdfcbank", "icici", "icicibank",
    "pnb", "punjabbank", "axisbank", "kotak", "kotakbank", "bankofbaroda",
    "canarabank", "indusind", "yesbank", "unionbank",
    "uidai", "aadhaar", "incometax", "incometaxindia", "epfindia", "parivahan",
    "passportindia", "indiapost", "irctc", "digitallocker", "cybercrime",
    "paytm", "phonepe", "gpay", "googlepay", "bhim", "cred",
    "jio", "airtel", "amazon", "flipkart", "bluedart", "delhivery"
]

SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "fit", "work", "click", "buzz",
    "cfd", "rest", "cam", "vip", "club", "space", "live", "link", "monster", "icu"
}

KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "cutt.ly", "is.gd", "rb.gy", "shorturl.at",
    "ow.ly", "buff.ly", "rebrand.ly", "t2mio.com", "tiny.cc"
}

# Homoglyph character mapping (Cyrillic/Greek/Latin lookalikes)
HOMOGLYPH_MAP = {
    'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y',
    'і': 'i', 'ј': 'j', 'ѕ': 's', 'ԁ': 'd', 'ԛ': 'q', '0': 'o', '1': 'l'
}

def calculate_shannon_entropy(text: str) -> float:
    """Calculate the Shannon entropy of a string to detect randomized DGA domains."""
    if not text:
        return 0.0
    entropy = 0.0
    length = len(text)
    counts = {}
    for char in text:
        counts[char] = counts.get(char, 0) + 1
    for count in counts.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 3)

def levenshtein_distance(s1: str, s2: str) -> int:
    """Compute standard Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def normalize_homoglyphs(text: str) -> str:
    normalized = []
    for char in text.lower():
        normalized.append(HOMOGLYPH_MAP.get(char, char))
    return "".join(normalized)

def analyze_url_structure(raw_url: str) -> Dict[str, Any]:
    """
    Comprehensive deterministic URL Intelligence engine for Indian cybersecurity threats.
    Provides verified execution stages, structural breakdown, and indicator scoring.
    """
    stages = [
        {"name": "Input Validation", "status": "PENDING", "detail": "Validating URL syntax & characters"},
        {"name": "URL Normalization", "status": "PENDING", "detail": "Standardizing canonical structure"},
        {"name": "Domain Structure Analysis", "status": "PENDING", "detail": "Inspecting hierarchy, TLD, and entropy"},
        {"name": "Suspicious Pattern Detection", "status": "PENDING", "detail": "Checking lookalikes, homoglyphs, and keywords"},
        {"name": "Reputation & SSRF Safety", "status": "PENDING", "detail": "Evaluating network safety and threat registries"},
        {"name": "Risk Calculation", "status": "PENDING", "detail": "Synthesizing weighted risk score and confidence"},
        {"name": "Final Report Generation", "status": "PENDING", "detail": "Assembling actionable cyber guidance"}
    ]

    # Stage 1: Validation
    if not raw_url or len(raw_url.strip()) < 3:
        stages[0]["status"] = "FAILED"
        stages[0]["detail"] = "URL input is empty or invalid"
        return {
            "valid": False,
            "error": "URL cannot be empty",
            "stages": stages
        }

    raw_url = raw_url.strip()
    if not raw_url.startswith(("http://", "https://")):
        # Prepend scheme for proper parsing while noting omission
        normalized_url = "https://" + raw_url
        scheme_added = True
    else:
        normalized_url = raw_url
        scheme_added = False

    stages[0]["status"] = "COMPLETED"
    stages[0]["detail"] = "Input validated successfully"

    # Stage 2: Normalization
    try:
        parsed = urlparse(normalized_url)
    except Exception as e:
        stages[1]["status"] = "FAILED"
        stages[1]["detail"] = f"Failed to parse URL: {str(e)}"
        return {"valid": False, "error": f"Invalid URL: {str(e)}", "stages": stages}

    hostname = (parsed.hostname or "").lower()
    port = parsed.port
    path = parsed.path or "/"
    query = parsed.query
    stages[1]["status"] = "COMPLETED"
    stages[1]["detail"] = f"Normalized host: {hostname}"

    # Stage 3 & 4: Analysis & Patterns
    findings = []
    evidence = []
    base_score = 0

    # SSRF & IP Detection
    is_safe_ssrf, ssrf_msg = validate_url_safety_ssrf(normalized_url)
    is_ip_host = False
    
    # Check IP hostname pattern
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        is_ip_host = True
        findings.append("IP_ADDRESS_HOST")
        evidence.append({
            "title": "Direct IP Address Host Detected",
            "severity": "CRITICAL",
            "score_impact": 45,
            "description": f"URL uses raw IP '{hostname}' instead of a verified registered domain. Legitimate Indian institutions never serve customer login portals over bare IP addresses.",
            "recommendation": "Do not enter passwords, OTPs, or financial information on bare IP addresses."
        })
        base_score += 45

    if not is_safe_ssrf:
        findings.append("RESTRICTED_OR_PRIVATE_IP")
        evidence.append({
            "title": "Private or Cloud Internal Network Target",
            "severity": "CRITICAL",
            "score_impact": 50,
            "description": f"Target resolves to internal or restricted network address ({ssrf_msg}).",
            "recommendation": "Block communication immediately."
        })
        base_score += 50

    # Domain structure breakdown
    domain_parts = hostname.split(".")
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    subdomains = domain_parts[:-2] if len(domain_parts) > 2 else []
    apex_domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else hostname

    stages[2]["status"] = "COMPLETED"
    stages[2]["detail"] = f"Apex: {apex_domain} | TLD: .{tld} | Subdomains: {len(subdomains)}"

    # Check Suspicious TLD
    if tld in SUSPICIOUS_TLDS:
        findings.append("SUSPICIOUS_TLD")
        evidence.append({
            "title": f"High-Abuse Top-Level Domain (.{tld})",
            "severity": "HIGH",
            "score_impact": 25,
            "description": f"The top-level domain '.{tld}' has a statistically elevated frequency of phishing, malware, and impersonation scams in India.",
            "recommendation": "Verify whether the legitimate organisation officially uses this TLD before interacting."
        })
        base_score += 25

    # Check URL Shortener
    is_shortener = hostname in KNOWN_SHORTENERS
    if is_shortener:
        findings.append("URL_SHORTENER")
        evidence.append({
            "title": "URL Shortener Detected",
            "severity": "MEDIUM",
            "score_impact": 20,
            "description": f"The link uses shortening service '{hostname}' which hides the final landing destination and bypasses basic filters.",
            "recommendation": "Use an unshortener tool to inspect the real destination before navigating."
        })
        base_score += 20

    # Lookalike Brand Detection
    detected_brand = None
    normalized_host_chars = normalize_homoglyphs(hostname)
    has_homoglyph = normalized_host_chars != hostname.lower()

    if has_homoglyph:
        findings.append("HOMOGLYPH_SPOOFING")
        evidence.append({
            "title": "Cyrillic / Lookalike Character Substitution",
            "severity": "CRITICAL",
            "score_impact": 40,
            "description": "The domain name contains visual lookalike characters (such as Cyrillic or numeric substitutions) designed to deceive human eyes into reading a legitimate brand.",
            "recommendation": "This is a classic signature of sophisticated targeted phishing. Do NOT proceed."
        })
        base_score += 40

    # Verify against official whitelist
    is_official_entity = (
        hostname.endswith(".gov.in") or
        hostname.endswith(".nic.in") or
        any(hostname == legit or hostname.endswith("." + legit) for legit in [
            "onlinesbi.sbi", "sbi.co.in", "bank.sbi", "onlinesbi.com",
            "hdfcbank.com", "hdfc.com", "icicibank.com", "icicibank.co.in",
            "axisbank.com", "kotak.com", "pnbindia.in", "bankofbaroda.in",
            "canarabank.com", "paytm.com", "phonepe.com", "google.com",
            "amazon.in", "flipkart.com", "irctc.co.in"
        ])
    )

    if not is_official_entity:
        for brand in INDIAN_TARGET_BRANDS:
            # Check if brand is in domain or subdomains
            if brand in hostname:
                detected_brand = brand
                findings.append(f"BRAND_IMPERSONATION_{brand.upper()}")
                evidence.append({
                    "title": f"Potential Brand Impersonation: {brand.upper()}",
                    "severity": "CRITICAL",
                    "score_impact": 45,
                    "description": f"Domain references trusted Indian institution '{brand.upper()}' but is hosted on unofficial host '{hostname}'. This is a frequent indicator of bank KYC phishing or fake refund portals.",
                    "recommendation": f"Access {brand.upper()} only through their verified official URL or mobile application."
                })
                base_score += 45
                break

    # Deceptive Subdomain trick (e.g., sbi.co.in.attacker-portal.com)
    for legit_root in ["sbi.co.in", "hdfcbank.com", "icicibank.com", "gov.in", "nic.in", "indiapost.gov.in"]:
        if legit_root in hostname and not hostname.endswith("." + legit_root) and hostname != legit_root:
            findings.append("DECEPTIVE_SUBDOMAIN_EMBEDDING")
            evidence.append({
                "title": "Subdomain Trickery / Deceptive Hierarchy",
                "severity": "CRITICAL",
                "score_impact": 35,
                "description": f"The URL embeds legitimate entity '{legit_root}' as a subdomain or prefix, while the actual apex domain is '{apex_domain}'.",
                "recommendation": "The true owner of this website is '{apex_domain}', not {legit_root}."
            })
            base_score += 35
            break

    # Domain Entropy (DGA detection)
    clean_domain_name = domain_parts[0] if domain_parts else ""
    entropy = calculate_shannon_entropy(clean_domain_name)
    if entropy > 3.8 and len(clean_domain_name) > 10:
        findings.append("HIGH_SHANNON_ENTROPY")
        evidence.append({
            "title": f"High Domain Randomness (Entropy: {entropy})",
            "severity": "MEDIUM",
            "score_impact": 15,
            "description": f"Domain label '{clean_domain_name}' exhibits unusually high randomness, a property typical of dynamically generated disposable domains.",
            "recommendation": "Exercise caution with unbranded random domains."
        })
        base_score += 15

    # Path & Query Keywords
    full_path_query = (path + "?" + query).lower()
    suspicious_keywords = [
        ("kyc", "KYC update or verification lure"),
        ("pan-link", "Aadhaar/PAN card linking request"),
        ("reward", "Lottery or cashback claim"),
        ("refund", "UPI or IT refund lure"),
        ("apk", "Android application package download"),
        ("digital-arrest", "Impersonation of law enforcement"),
        ("sim-block", "SIM card deactivation threat"),
        ("bill-overdue", "Electricity or utility disconnection alert")
    ]

    matched_keywords = []
    for kw, kw_desc in suspicious_keywords:
        if kw in full_path_query:
            matched_keywords.append(f"{kw} ({kw_desc})")

    if matched_keywords:
        findings.append("SUSPICIOUS_PATH_KEYWORDS")
        evidence.append({
            "title": "Urgency & Phishing Lures in URL Path",
            "severity": "HIGH",
            "score_impact": 20,
            "description": f"URL path/query contains indicators commonly associated with digital fraud: {', '.join(matched_keywords)}.",
            "recommendation": "Do not download unknown APK files or provide Aadhaar/PAN details."
        })
        base_score += 20

    # Plain HTTP warning
    if parsed.scheme == "http":
        findings.append("UNENCRYPTED_HTTP")
        evidence.append({
            "title": "Unencrypted HTTP Connection",
            "severity": "LOW",
            "score_impact": 10,
            "description": "Connection does not use TLS/HTTPS encryption. Any submitted credentials or data can be intercepted.",
            "recommendation": "Modern Indian banking and financial portals strictly require HTTPS with HSTS."
        })
        base_score += 10

    stages[3]["status"] = "COMPLETED"
    stages[3]["detail"] = f"Identified {len(findings)} technical indicators"

    # Stage 5: Reputation lookup (Clearly labeled whether local or external)
    stages[4]["status"] = "COMPLETED"
    stages[4]["detail"] = "Local threat heuristics applied (External threat lookup disabled in local mode)"

    # Stage 6: Scoring
    risk_score = min(100, max(0, base_score))
    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 50:
        risk_level = "HIGH"
    elif risk_score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    confidence = 88.0 if findings else 95.0

    stages[5]["status"] = "COMPLETED"
    stages[5]["detail"] = f"Computed risk score: {risk_score}/100 ({risk_level})"

    # Stage 7: Final report
    stages[6]["status"] = "COMPLETED"
    stages[6]["detail"] = "Report synthesized with threat explainability"

    return {
        "valid": True,
        "input_url": raw_url,
        "normalized_url": normalized_url,
        "scheme": parsed.scheme,
        "hostname": hostname,
        "apex_domain": apex_domain,
        "tld": tld,
        "path": path,
        "query": query,
        "port": port,
        "is_ip_host": is_ip_host,
        "is_shortener": is_shortener,
        "entropy": entropy,
        "detected_brand": detected_brand,
        "has_homoglyphs": has_homoglyph,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence,
        "findings": findings,
        "evidence": evidence,
        "stages": stages,
        "safety_notes": [
            "Never open suspicious links directly in your primary browser.",
            "Government websites in India invariably terminate in .gov.in or .nic.in.",
            "Banks never ask customers to update KYC via third-party SMS links."
        ]
    }
