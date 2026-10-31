import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  ThumbsUp,
  Flag,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  AlertCircle,
  EyeOff,
  X
} from 'lucide-react';
import { apiService } from '../services/api';
import { CommunityReport } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const ScamReportsPage: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [scamCategory, setScamCategory] = useState('Banking Phishing');
  const [indicator, setIndicator] = useState('');
  const [content, setContent] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCommunityReports(filterStatus, filterCategory);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterCategory, filterStatus]);

  const handleUpvote = async (id: string) => {
    try {
      const updated = await apiService.upvoteReport(id);
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error('Upvote failed', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await apiService.submitReport({
        title: title.trim(),
        scam_category: scamCategory,
        indicator: indicator.trim() || undefined,
        content: content.trim(),
        evidence_notes: evidenceNotes.trim() || undefined
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitOpen(false);
        setSubmitSuccess(false);
        setTitle('');
        setContent('');
        setIndicator('');
        setEvidenceNotes('');
        fetchReports();
      }, 1200);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Community Scam Reporting & Moderation
            </h1>
            <Badge variant="cyan">CITIZEN WATCH</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Crowdsourced threat sightings with automatic PII redaction and community moderation.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Scam</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2">
          <EyeOff className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Citizen Privacy Guard Active: Phone numbers, bank card numbers, Aadhaar, and OTPs are automatically masked before public display.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Categories</option>
              <option value="Digital Arrest">Digital Arrest</option>
              <option value="Banking Phishing">Banking Phishing</option>
              <option value="UPI / QR Code Fraud">UPI / QR Code Fraud</option>
              <option value="Utility / Electricity">Utility / Electricity</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Statuses</option>
              <option value="VERIFIED">Verified Community Reports</option>
              <option value="PENDING">Under Community Review</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs font-mono text-slate-400">
            No community reports found matching your selection.
          </GlassCard>
        ) : (
          reports.map((report) => (
            <GlassCard key={report.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{report.id}</span>
                  <Badge variant="blue" size="sm">{report.scam_category}</Badge>
                  {report.status === 'VERIFIED' ? (
                    <Badge variant="emerald" size="sm" dot={true}>Community Verified</Badge>
                  ) : (
                    <Badge variant="amber" size="sm">Under Review</Badge>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">{report.title}</h3>
                {report.indicator && (
                  <div className="text-xs font-mono text-amber-400 mb-2">
                    Reported Indicator: <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{report.indicator}</span>
                  </div>
                )}
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                  "{report.raw_content_redacted}"
                </p>
              </div>

              {report.evidence_notes && (
                <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                  <span className="text-cyan-400 font-semibold">Evidence Note:</span>
                  <span>{report.evidence_notes}</span>
                </div>
              )}

              {/* Upvote & Moderation Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Confirm / Upvote ({report.upvotes})</span>
                </button>

                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <span>Community trust score: {(report.upvotes * 10) / (report.upvotes + report.flags + 1)}/10</span>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel-glow rounded-2xl p-6 border border-cyan-500/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Submit Suspicious Scam Report</span>
              </h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fake CBI parcel summons on WhatsApp video call"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Scam Category *
                  </label>
                  <select
                    value={scamCategory}
                    onChange={(e) => setScamCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Digital Arrest">Digital Arrest / Police</option>
                    <option value="Banking Phishing">Banking Phishing / KYC</option>
                    <option value="UPI / QR Code Fraud">UPI / QR Code Fraud</option>
                    <option value="Utility / Electricity">Utility / Electricity</option>
                    <option value="Courier / Delivery">Courier / Delivery</option>
                    <option value="Job / Prepaid Task">Job / Prepaid Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Indicator (URL, Phone, UPI handle)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. sbi-update.xyz or 9876543210@paytm"
                    value={indicator}
                    onChange={(e) => setIndicator(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Incident Narrative / Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the scam message or caller demands. Any phone numbers or card details will be auto-redacted for citizen safety."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Verification Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Confirmed with official bank branch that message was fake."
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {submitSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Report submitted successfully with PII auto-redacted!</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
