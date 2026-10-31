import re
from typing import Dict, List, Any, Optional

# Pattern rules specialized for Indian cybersecurity and digital fraud vectors
SCAM_RULES = [
    {
        "id": "UPI_RECEIVE_PIN_FRAUD",
        "category": "UPI Fraud",
        "severity": "CRITICAL",
        "score": 50,
        "patterns": [
            r"(enter|type|submit)\s+(your\s+)?(upi\s+)?pin\s+(to\s+)?(receive|credit|collect|claim|refund)",
            r"(scan|open)\s+(the\s+)?qr\s+code\s+(to\s+)?(receive|get|claim)\s+(money|cashback|payment|funds|amount)",
            r"qr\s+code\s+scan\s+kare.*(paise|rupaye)\s+pane\s+ke\s+liye",
            r"पैसे\s+(पाने|प्राप्त\s+करने)\s+के\s+लिए\s+(यूपीआई\s+)?पिन\s+दर्ज\s+करें",
            r"पैसे\s+प्राप्त\s+करने\s+के\s+लिए\s+क्यूआर\s+कोड\s+स्कैन\s+करें"
        ],
        "explanation": "Critical UPI Fraud Indicator: Legitimate UPI architecture (NPCI) never requires entering a PIN to receive money. Entering a PIN always debits money from your bank account.",
        "independent_verification": "Check your official UPI banking app (BHIM, PhonePe, Google Pay, Paytm) transaction history. Do NOT enter your PIN on any prompt.",
        "recommended_action": "Cancel the request immediately. Block and report the sender on your UPI application and cybercrime.gov.in."
    },
    {
        "id": "DIGITAL_ARREST_POLICE_IMPERSONATION",
        "category": "Digital Arrest / Law Enforcement Impersonation",
        "severity": "CRITICAL",
        "score": 55,
        "patterns": [
            r"(cbi|mumbai\s+police|delhi\s+police|cyber\s+crime\s+branch|enforcement\s+directorate|narcotics\s+control\s+bureau|ncb|customs)\s+(summons|warrant|interrogation|investigation|case\s+registered)",
            r"parcel\s+(seized|intercepted|detained).*(mdma|drugs|contraband|illegal\s+passports)",
            r"(skype|video\s+call)\s+(interrogation|investigation|digital\s+arrest)",
            r"digital\s+arrest",
            r"(transfer|deposit|send)\s+(funds|money|balance)\s+(to\s+)?(rbi|government|verification)\s+(secure\s+)?account",
            r"डिजिटल\s+अरेस्ट",
            r"सीबीआई|मुंबई\s+पुलिस|दिल्ली\s+पुलिस|साइबर\s+क्राइम"
        ],
        "explanation": "Digital Arrest Scam: Genuine law enforcement agencies (CBI, Police, ED, Customs) never conduct arrests, warrants, or court proceedings via WhatsApp/Skype video calls. The Government of India has confirmed that 'Digital Arrest' has no legal basis.",
        "independent_verification": "Directly contact your nearest local police station or call the National Cyber Crime Helpline at 1930.",
        "recommended_action": "Disconnect the call immediately. Do NOT transfer funds to any 'verification account'. Report to cybercrime.gov.in."
    },
    {
        "id": "BANK_KYC_ACCOUNT_FREEZE_URGENCY",
        "category": "Fake Bank KYC / Account Block",
        "severity": "CRITICAL",
        "score": 45,
        "patterns": [
            r"(dear|valued)\s+(sbi|hdfc|icici|pnb|axis|bob|canara|bank)\s+(user|customer)",
            r"(account|yono|netbanking|debit\s+card)\s+(will\s+be\s+)?(suspended|blocked|deactivated|frozen|terminated)\s+(today|within\s+24\s+hours|immediately)",
            r"(update|link|complete)\s+(your\s+)?(pan|aadhaar|kyc)\s+(immediately|to\s+avoid)",
            r"प्रिय\s+ग्राहक.*(खाता|बैंक|पैन\s+कार्ड)\s+(बंद|ब्लॉक)",
            r"तुरंत\s+पैन\s+कार्ड\s+अपडेट\s+करें"
        ],
        "explanation": "Fake Bank KYC / Urgent Account Suspension Scam: Fraudsters generate panic by threatening imminent account termination. RBI guidelines prohibit banks from sending clickable links via SMS to update confidential KYC documents.",
        "independent_verification": "Log in to your bank's official internet banking portal by typing the bank URL directly, or visit your branch in person.",
        "recommended_action": "Do not click any embedded link. Forward the SMS to 1909 (TRAI DND complaint) and your bank's fraud reporting email."
    },
    {
        "id": "ELECTRICITY_POWER_DISCONNECTION",
        "category": "Utility / Electricity Bill Scam",
        "severity": "HIGH",
        "score": 40,
        "patterns": [
            r"electricity\s+(power\s+)?(will\s+be\s+)?disconnected\s+(tonight|at\s+\d{1,2}:\d{2}\s*(pm|am)?)",
            r"(previous\s+month\s+bill|bill\s+was\s+not\s+updated)",
            r"contact\s+(our\s+)?electricity\s+officer\s+at\s+\d{10}",
            r"बिजली\s+(कट|काट)\s+दी\s+जाएगी",
            r"बिजली\s+बिल\s+भुगतान"
        ],
        "explanation": "Utility Disconnection Threat: Scammers impersonate state electricity discoms (e.g. BESCOM, Mahavitaran, TPDDL, UPPCL) claiming power will be disconnected in hours. Personal mobile numbers are provided instead of official helplines.",
        "independent_verification": "Check your electricity bill status using your official discom mobile app or website using your Consumer Account number.",
        "recommended_action": "Never call the phone number provided in such messages. Never install any remote desktop apps (AnyDesk, TeamViewer) at their request."
    },
    {
        "id": "COURIER_INDIA_POST_DELIVERY_FRAUD",
        "category": "Fake Courier / Delivery Notice",
        "severity": "HIGH",
        "score": 35,
        "patterns": [
            r"(india\s+post|fedex|blue\s+dart|delhivery|dtdc)\s+package\s+(cannot\s+be\s+delivered|held|stopped)",
            r"(incorrect|incomplete|invalid)\s+address",
            r"(pay|update\s+address\s+fee)\s+(rs\.?|inr|₹)?\s*[0-9]{1,3}\s+(within|to\s+reschedule)",
            r"पार्सल\s+(डिलीवर|पहुंचा).*पता\s+गलत"
        ],
        "explanation": "Fake India Post / Courier Smishing: Messages claim a parcel cannot be delivered due to an incorrect address and ask for a nominal fee (e.g., ₹5 or ₹25). The payment link captures net banking or credit card details to drain accounts.",
        "independent_verification": "Visit official tracking pages (e.g., indiapost.gov.in) and enter your consignment number.",
        "recommended_action": "Do not open the link or make small token payments. India Post never sends SMS from personal numbers or unofficial domains."
    },
    {
        "id": "JOB_WFH_TELEGRAM_PREPAID_TASK",
        "category": "Job / Work From Home Scam",
        "severity": "HIGH",
        "score": 40,
        "patterns": [
            r"(part\s+time|work\s+from\s+home|wfh)\s+job",
            r"(earn|make)\s+(rs\.?|inr|₹)?\s*\d{3,5}\s*(to|-)\s*(rs\.?|inr|₹)?\s*\d{3,5}\s*(daily|per\s+day)",
            r"(like|subscribe)\s+(youtube\s+videos|google\s+reviews|hotel\s+ratings)",
            r"(telegram|whatsapp)\s+(prepaid|task\s+group|receptionist)",
            r"घर\s+बैठे\s+(कमाएं|कमाए).*(रुपये|प्रति\s+दिन)"
        ],
        "explanation": "Part-Time Task & Telegram Pre-Paid Scam: Victims are initially paid small amounts (₹150-₹500) for liking YouTube videos, then coerced into investing large sums into fraudulent crypto/trading accounts for 'advanced tasks'.",
        "independent_verification": "Legitimate global corporations never hire or run payroll through anonymous Telegram channels.",
        "recommended_action": "Stop communicating immediately. Do not send any advance deposit or crypto transfer."
    },
    {
        "id": "LOTTERY_KBC_PRIZE_SCAM",
        "category": "Lottery / Lucky Draw Scam",
        "severity": "HIGH",
        "score": 35,
        "patterns": [
            r"(kbc|kaun\s+banega\s+crorepati|jio\s+lottery|whatsapp\s+lottery)\s+winner",
            r"(won|congratulations\s+you\s+won)\s+(rs\.?|inr|₹)?\s*\d{1,3}\s*(lakh|crore)",
            r"deposit\s+(processing|tax|gst|clearance)\s+fee",
            r"लॉटरी\s+विजेता.*लाख"
        ],
        "explanation": "Lottery / KBC Fraud: Impersonates Kaun Banega Crorepati or telco lotteries. Requests an advance 'tax clearance fee' or 'registration fee' to disburse prize money that does not exist.",
        "independent_verification": "Sony Entertainment Television and KBC have stated repeatedly that they never run lucky draw lotteries via WhatsApp or SMS.",
        "recommended_action": "Do not respond or send any processing fee. Block the contact."
    },
    {
        "id": "REMOTE_ACCESS_APP_SOLICITATION",
        "category": "Malicious App / Remote Access",
        "severity": "CRITICAL",
        "score": 45,
        "patterns": [
            r"(install|download)\s+(anydesk|teamviewer|rustdesk|quicksupport|screen\s+share)",
            r"(download|install)\s+(apk|app\s+from\s+link)",
            r"apk\s+फाइल\s+(डाउनलोड|इंस्टॉल)\s+करें"
        ],
        "explanation": "Remote Screen Control / Malicious APK: Scammers instruct victims to install remote desktop apps to view their screens and intercept SMS OTPs during net banking sessions.",
        "independent_verification": "No legitimate bank or government officer will ever ask you to install AnyDesk or TeamViewer.",
        "recommended_action": "Do NOT install remote desktop tools or download APK files from SMS links. Uninstall immediately if already downloaded."
    }
]

def detect_language(text: str) -> str:
    """Detect primary language: Hindi (Devanagari), Kannada, or English."""
    devanagari_count = len(re.findall(r'[\u0900-\u097F]', text))
    kannada_count = len(re.findall(r'[\u0C80-\u0CFF]', text))
    total_len = max(1, len(text.strip()))

    if devanagari_count / total_len > 0.15:
        return "HINDI"
    elif kannada_count / total_len > 0.15:
        return "KANNADA"
    return "ENGLISH"

def analyze_message_content(content: str, message_type: str = "SMS", declared_lang: Optional[str] = None) -> Dict[str, Any]:
    """
    Analyzes SMS, WhatsApp, Email, or chat messages for Indian cyber threat signatures.
    Extracts highlighted phrases with character offsets, explains why it was flagged,
    and provides clear verification protocols.
    """
    if not content or len(content.strip()) < 5:
        return {
            "valid": False,
            "error": "Message is too short to analyze.",
            "risk_score": 0,
            "risk_level": "LOW",
            "findings": [],
            "highlights": []
        }

    detected_lang = detect_language(content)
    active_lang = declared_lang if declared_lang and declared_lang != "AUTO" else detected_lang

    triggered_rules = []
    highlights = []
    total_score = 0
    categories = set()

    # Scan content against pattern library
    for rule in SCAM_RULES:
        rule_matched = False
        for pattern in rule["patterns"]:
            matches = list(re.finditer(pattern, content, re.IGNORECASE))
            if matches:
                rule_matched = True
                for match in matches:
                    highlights.append({
                        "start": match.start(),
                        "end": match.end(),
                        "matched_text": match.group(0),
                        "rule_id": rule["id"],
                        "category": rule["category"],
                        "severity": rule["severity"]
                    })

        if rule_matched:
            triggered_rules.append(rule)
            total_score += rule["score"]
            categories.add(rule["category"])

    # Look for embedded suspicious URLs in message
    url_matches = list(re.finditer(r'https?://[^\s<>"]+|www\.[^\s<>"]+', content))
    for u_match in url_matches:
        url_text = u_match.group(0)
        highlights.append({
            "start": u_match.start(),
            "end": u_match.end(),
            "matched_text": url_text,
            "rule_id": "EMBEDDED_LINK",
            "category": "Suspicious Link",
            "severity": "HIGH"
        })
        total_score += 15

    # Look for urgent timeframes (e.g. "within 2 hours", "today by 9:30 PM")
    urgency_matches = list(re.finditer(r'(immediately|urgent|within\s+\d{1,2}\s+(hours|mins|minutes)|today\s+night|tonight|24\s+hours)', content, re.IGNORECASE))
    if urgency_matches and not any(r["id"] == "BANK_KYC_ACCOUNT_FREEZE_URGENCY" for r in triggered_rules):
        total_score += 15
        for um in urgency_matches:
            highlights.append({
                "start": um.start(),
                "end": um.end(),
                "matched_text": um.group(0),
                "rule_id": "ARTIFICIAL_URGENCY",
                "category": "Social Engineering",
                "severity": "MEDIUM"
            })

    # Sort and remove duplicate/overlapping highlights
    highlights.sort(key=lambda x: x["start"])
    deduped_highlights = []
    last_end = -1
    for h in highlights:
        if h["start"] >= last_end:
            deduped_highlights.append(h)
            last_end = h["end"]

    # Calculate final score (0 - 100)
    risk_score = min(100, total_score)
    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 50:
        risk_level = "HIGH"
    elif risk_score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    confidence = 90.0 if triggered_rules else 95.0

    # Build evidence and action cards
    evidence_cards = []
    for r in triggered_rules:
        evidence_cards.append({
            "rule_id": r["id"],
            "category": r["category"],
            "severity": r["severity"],
            "score": r["score"],
            "what_detected": f"Detected indicators matching {r['category']}.",
            "why_suspicious": r["explanation"],
            "what_to_verify": r["independent_verification"],
            "action_to_take": r["recommended_action"]
        })

    return {
        "valid": True,
        "message_type": message_type,
        "detected_language": detected_lang,
        "analyzed_language": active_lang,
        "char_count": len(content),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence,
        "categories": list(categories),
        "triggered_rules_count": len(triggered_rules),
        "evidence_cards": evidence_cards,
        "highlights": deduped_highlights,
        "summary": (
            f"Message exhibits {len(triggered_rules)} critical threat signatures commonly observed in Indian cyber fraud campaigns."
            if triggered_rules else
            "No high-confidence cyber fraud or phishing patterns were detected in this message. Always exercise vigilance."
        )
    }
