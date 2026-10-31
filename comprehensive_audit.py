import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = r"C:\Users\rehan\.gemini\antigravity\scratch\scamshield-india"

print("=" * 60)
print("SCAMSHIELD INDIA — DEEP CODEBASE SECURITY & DATA AUDIT")
print("=" * 60)

# 1. Search for Exposed Secrets
SECRET_REGEXES = {
    "OpenAI/Anthropic/Generic API Key": r'(?:api[_-]?key|secret|token)[\s:=]+["\']([a-zA-Z0-9_\-]{20,})["\']',
    "Google API Key": r'AIza[0-9A-Za-z\-_]{35}',
    "GitHub Token": r'gh[pous]_[0-9a-zA-Z]{36}',
    "RSA/DSA/EC Private Key": r'-----BEGIN\s+[A-Z\s]+PRIVATE\s+KEY-----',
    "Hardcoded Password": r'(?:password|passwd)[\s:=]+["\']([^"\']{6,})["\']'
}

exposed_secrets = []
for root, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.pytest_cache', '.git']]
    for file in files:
        if file.endswith(('.py', '.ts', '.tsx', '.json', '.env', '.example', '.bat', '.md', '.txt')):
            fpath = os.path.join(root, file)
            relpath = os.path.relpath(fpath, ROOT)
            if file == "comprehensive_audit.py":
                continue
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for name, regex in SECRET_REGEXES.items():
                        matches = re.finditer(regex, content, re.IGNORECASE)
                        for m in matches:
                            # Filter out harmless env var placeholders like os.getenv("API_KEY", "") or description text
                            val = m.group(0)
                            if '""' in val or "''" in val or "os.getenv" in val or "placeholder" in val.lower():
                                continue
                            line_no = content[:m.start()].count('\n') + 1
                            exposed_secrets.append((relpath, line_no, name, val[:60]))
            except Exception as e:
                pass

print("\n--- 1. EXPOSED SECRETS AUDIT ---")
if not exposed_secrets:
    print("[PASS] No exposed secrets, production tokens, or private keys found.")
else:
    print(f"[FAIL] Found {len(exposed_secrets)} potential secret matches:")
    for path, line, name, snippet in exposed_secrets:
        print(f"  - {path}:{line} [{name}] -> {snippet}")


# 2. Search for Unsafe URL Fetching (SSRF / Outbound requests to target links)
FETCH_REGEXES = {
    "requests outbound": r'requests\.(?:get|post|put|delete|patch|head)\s*\(\s*([^,\)]+)',
    "httpx outbound": r'httpx\.(?:get|post|put|delete|patch|head|AsyncClient)\s*\(\s*([^,\)]+)',
    "urllib outbound": r'urllib\.request\.urlopen\s*\(\s*([^,\)]+)',
    "aiohttp outbound": r'aiohttp\.ClientSession\s*\(',
    "socket connect": r'socket\.connect\s*\('
}

print("\n--- 2. UNSAFE OUTBOUND URL-FETCHING LOGIC (SSRF AUDIT) ---")
outbound_calls = []
for root, dirs, files in os.walk(os.path.join(ROOT, "backend")):
    dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.pytest_cache', '__pycache__', 'tests']]
    for file in files:
        if file.endswith('.py'):
            fpath = os.path.join(root, file)
            relpath = os.path.relpath(fpath, ROOT)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                for name, regex in FETCH_REGEXES.items():
                    matches = re.finditer(regex, content)
                    for m in matches:
                        line_no = content[:m.start()].count('\n') + 1
                        outbound_calls.append((relpath, line_no, name, m.group(0)[:70]))

if not outbound_calls:
    print("[PASS] URL Detector strictly operates deterministically with zero arbitrary outbound HTTP/socket calls to user-submitted targets.")
else:
    print(f"[WARN] Found outbound call patterns in backend:")
    for path, line, name, snippet in outbound_calls:
        print(f"  - {path}:{line} [{name}] -> {snippet}")


# 3. Comprehensive Indicator Audit: Demo / Hardcoded Threat Indicators
KNOWN_INDICATOR_STRINGS = [
    "sbi-kyc-verification.top",
    "sbi-kyc-update.xyz",
    "refund-electricity-bescom.xyz",
    "cbi.delhi.investigation-portal.xyz",
    "indiapost-track-parcel.info",
    "9876543210@paytm",
    "http://192.241.168.42/hdfc/login",
    "REP-2026-9041",
    "REP-2026-9042",
    "REP-2026-9043",
    "INV-2026-0041"
]

print("\n--- 3. HARDCODED & DEMO THREAT INDICATORS IN CODEBASE ---")
indicator_locations = []
for root, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.pytest_cache', '.git']]
    for file in files:
        if file.endswith(('.py', '.ts', '.tsx', '.json', '.md')):
            if file == "comprehensive_audit.py":
                continue
            fpath = os.path.join(root, file)
            relpath = os.path.relpath(fpath, ROOT)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    for ind in KNOWN_INDICATOR_STRINGS:
                        if ind in line:
                            indicator_locations.append((relpath, i + 1, ind, line.strip()[:100]))

print(f"Found {len(indicator_locations)} occurrences of demo threat indicators:")
for path, line_no, ind, snippet in indicator_locations:
    print(f"  - {path}:{line_no} [{ind}] -> {snippet}")


# 4. Check for Demo Indicators Marked as `verified: True` / `verified: true`
print("\n--- 4. AUDIT: DEMO INDICATORS MARKED AS `verified: True` ---")
verified_true_demos = []
for root, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.pytest_cache', '.git']]
    for file in files:
        if file.endswith(('.py', '.ts', '.tsx', '.json')):
            if file == "comprehensive_audit.py":
                continue
            fpath = os.path.join(root, file)
            relpath = os.path.relpath(fpath, ROOT)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                # Check for threat indicator blocks where verified is True
                for ind in KNOWN_INDICATOR_STRINGS:
                    if ind in content:
                        # Find occurrences of verified=True or verified: true near this indicator
                        # Regex search within 400 chars of indicator
                        for m in re.finditer(re.escape(ind), content):
                            window = content[max(0, m.start() - 200):min(len(content), m.end() + 300)]
                            if re.search(r'verified[\s:=]+(?:True|true)', window):
                                line_no = content[:m.start()].count('\n') + 1
                                verified_true_demos.append((relpath, line_no, ind, "Has verified: true/True in object definition"))

if not verified_true_demos:
    print("[PASS] Zero demonstration indicators are marked as verified: true.")
else:
    print(f"[FAIL] Found {len(verified_true_demos)} demonstration indicators marked as verified: true:")
    for path, line_no, ind, reason in verified_true_demos:
        print(f"  - {path}:{line_no} [{ind}] -> {reason}")

print("\n" + "=" * 60)
print("AUDIT SCRIPT COMPLETED")
print("=" * 60)
