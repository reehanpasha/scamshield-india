import json
from datetime import datetime, timedelta
from app.db.session import engine, Base, SessionLocal
from app.db.models import ScanRecord, ThreatIndicator, CommunityReport, Investigation, InvestigationEvidence, AuditLog

def init_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if database already has seed data
    if db.query(ThreatIndicator).first():
        db.close()
        return

    now = datetime.utcnow()

    # 1. Seed Threat Indicators (Explicitly labeled as Simulated Demonstration Benchmarks)
    demo_threats = [
        ThreatIndicator(
            indicator_value="sbi-kyc-verification.top",
            indicator_type="DOMAIN",
            scam_category="BANKING_PHISH",
            risk_level="CRITICAL",
            first_seen=now - timedelta(days=5),
            last_seen=now - timedelta(hours=2),
            reported_count=42,
            verified=False, # Labeled as simulated fixture, not live external intelligence
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Deceptive banking lookalike domain structure impersonating State Bank of India with high-abuse .top TLD. Used for heuristic evaluation."
        ),
        ThreatIndicator(
            indicator_value="refund-electricity-bescom.xyz",
            indicator_type="DOMAIN",
            scam_category="UTILITY_SCAM",
            risk_level="HIGH",
            first_seen=now - timedelta(days=3),
            last_seen=now - timedelta(hours=6),
            reported_count=19,
            verified=False,
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Utility impersonation domain pattern targeting Bangalore electricity consumers threatening power disconnection."
        ),
        ThreatIndicator(
            indicator_value="cbi.delhi.investigation-portal.xyz",
            indicator_type="DOMAIN",
            scam_category="DIGITAL_ARREST",
            risk_level="CRITICAL",
            first_seen=now - timedelta(days=7),
            last_seen=now - timedelta(minutes=45),
            reported_count=58,
            verified=False,
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Counterfeit CBI arrest warrant portal signature used in Skype extortion demonstrations."
        ),
        ThreatIndicator(
            indicator_value="indiapost-track-parcel.info",
            indicator_type="DOMAIN",
            scam_category="COURIER_FRAUD",
            risk_level="HIGH",
            first_seen=now - timedelta(days=4),
            last_seen=now - timedelta(hours=1),
            reported_count=27,
            verified=False,
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Smishing lure signature requesting ₹5 payment for fake incomplete address update."
        ),
        ThreatIndicator(
            indicator_value="9876543210@paytm",
            indicator_type="UPI_VPA",
            scam_category="UPI_FRAUD",
            risk_level="CRITICAL",
            first_seen=now - timedelta(days=2),
            last_seen=now - timedelta(hours=4),
            reported_count=31,
            verified=False,
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Fraudulent merchant handle pattern associated with marketplace advance-payment scams."
        ),
        ThreatIndicator(
            indicator_value="http://192.241.168.42/hdfc/login",
            indicator_type="URL_PATH",
            scam_category="BANKING_PHISH",
            risk_level="CRITICAL",
            first_seen=now - timedelta(days=1),
            last_seen=now - timedelta(minutes=15),
            reported_count=14,
            verified=False,
            source="Simulated Benchmark Fixture (Demonstration)",
            description="[SIMULATED DEMONSTRATION RECORD] Bare IP hosting credential harvesting structure mimicking HDFC NetBanking."
        )
    ]
    db.add_all(demo_threats)

    # 2. Seed Community Reports (Clearly labeled as Simulated Demonstration Reports)
    demo_reports = [
        CommunityReport(
            id="REP-2026-9041",
            title="[SIMULATED DEMO] Fake CBI narcotics courier call (Digital Arrest attempt)",
            scam_category="Digital Arrest",
            indicator="WhatsApp Call from +91-98XXXXXX21",
            raw_content_redacted="Caller claimed a parcel sent to Taiwan contained MDMA and demanded victim stay on Skype video call for interrogation.",
            evidence_notes="[SIMULATED CASE] Forged police letterhead test specimen. Demonstrates PII auto-redaction.",
            status="VERIFIED",
            upvotes=84,
            flags=0,
            created_at=now - timedelta(days=2)
        ),
        CommunityReport(
            id="REP-2026-9042",
            title="[SIMULATED DEMO] BESCOM Electricity Disconnection SMS with personal number",
            scam_category="Utility / Electricity",
            indicator="SMS from VM-BESCOM",
            raw_content_redacted="Dear customer your electricity power will be disconnected tonight at 9:30 PM call officer immediately on [REDACTED_PHONE_NUMBER].",
            evidence_notes="[SIMULATED CASE] Demonstrates discom impersonation pattern.",
            status="VERIFIED",
            upvotes=46,
            flags=1,
            created_at=now - timedelta(days=3)
        ),
        CommunityReport(
            id="REP-2026-9043",
            title="[SIMULATED DEMO] SBI Yono Rewards link to claim ₹9,850 cashback",
            scam_category="Banking Phishing",
            indicator="http://sbi-reward-points-claim.top",
            raw_content_redacted="Congratulation! Your SBI credit card points worth 9850 is expiring today. Redeem in account click link.",
            evidence_notes="[SIMULATED CASE] Phishing lure capturing banking credentials.",
            status="VERIFIED",
            upvotes=102,
            flags=0,
            created_at=now - timedelta(days=1)
        )
    ]
    db.add_all(demo_reports)

    # 3. Seed Investigations (Clearly marked as Simulated Docket)
    inv1 = Investigation(
        case_number="INV-2026-0041",
        title="[SIMULATED DOCKET] Operation Thunder: Inter-state Digital Arrest Syndicate",
        description="[SIMULATED INVESTIGATION FOR DEMONSTRATION] Investigation docket modeling Skype video call extortion rings using counterfeit CBI and Enforcement Directorate notices.",
        priority="CRITICAL",
        status="ACTIVE",
        assigned_analyst="Demonstration Forensic Desk",
        tags="Simulated,Digital Arrest,Skype,Extortion",
        notes_json=json.dumps([
            {"author": "Demonstration Analyst", "time": (now - timedelta(days=3)).isoformat(), "text": "Discovered 4 related mock landing domains hosted on AS-13854."},
            {"author": "Demonstration Analyst", "time": (now - timedelta(days=1)).isoformat(), "text": "Correlated fraudulent mule accounts reported across demonstration benchmark."}
        ]),
        timeline_json=json.dumps([
            {"time": (now - timedelta(days=4)).isoformat(), "event": "Simulated case docket initialized from benchmark reports."},
            {"time": (now - timedelta(days=2)).isoformat(), "event": "SHA-256 evidence integrity digest cataloged for transcript fixture."}
        ]),
        created_at=now - timedelta(days=4)
    )
    db.add(inv1)
    db.flush()

    # Evidence for inv1
    evidence1 = InvestigationEvidence(
        investigation_id=inv1.id,
        file_name="simulated_cbi_notice_transcript.txt",
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        file_size=4096,
        mime_type="text/plain",
        description="[SIMULATED BENCHMARK EVIDENCE] Chat transcript fixture demonstrating SHA-256 integrity digest computation.",
        uploaded_at=now - timedelta(days=2)
    )
    db.add(evidence1)

    # 4. Seed Baseline Scan Telemetry (Clearly designated as baseline telemetry)
    scan1 = ScanRecord(
        scan_type="url",
        input_target="http://sbi-kyc-verification.top/login",
        risk_score=95,
        risk_level="CRITICAL",
        confidence=96.0,
        category="Banking Phishing",
        details_json=json.dumps({
            "hostname": "sbi-kyc-verification.top",
            "findings": ["SUSPICIOUS_TLD", "BRAND_IMPERSONATION_SBI", "SUSPICIOUS_PATH_KEYWORDS"],
            "summary": "[SIMULATED BENCHMARK] Brand impersonation signature targeting State Bank of India."
        }),
        created_at=now - timedelta(hours=3)
    )
    scan2 = ScanRecord(
        scan_type="message",
        input_target="Dear user, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately.",
        risk_score=85,
        risk_level="CRITICAL",
        confidence=92.0,
        category="Utility Scam",
        details_json=json.dumps({
            "detected_language": "ENGLISH",
            "categories": ["Utility / Electricity Bill Scam"],
            "summary": "[SIMULATED BENCHMARK] Utility disconnection lure impersonating electricity discom."
        }),
        created_at=now - timedelta(hours=5)
    )
    scan3 = ScanRecord(
        scan_type="url",
        input_target="https://onlinesbi.sbi",
        risk_score=0,
        risk_level="LOW",
        confidence=98.0,
        category="Legitimate Financial Service",
        details_json=json.dumps({
            "hostname": "onlinesbi.sbi",
            "findings": [],
            "summary": "Verified official State Bank of India domain."
        }),
        created_at=now - timedelta(hours=7)
    )
    db.add_all([scan1, scan2, scan3])

    db.commit()
    db.close()
