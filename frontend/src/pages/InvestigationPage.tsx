import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Hash,
  Upload,
  Clock,
  User,
  Shield,
  FileText,
  AlertTriangle,
  Download,
  CheckCircle2,
  Lock,
  Layers,
  Send
} from 'lucide-react';
import { apiService } from '../services/api';
import { InvestigationItem } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const InvestigationPage: React.FC = () => {
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<InvestigationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hashResult, setHashResult] = useState<any>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await apiService.getInvestigations();
      setInvestigations(data);
      if (data.length > 0 && !selectedCase) {
        setSelectedCase(data[0]);
      } else if (selectedCase) {
        const refreshed = data.find((c) => c.id === selectedCase.id);
        if (refreshed) setSelectedCase(refreshed);
      }
    } catch (err) {
      console.error('Failed to load investigations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNote.trim()) return;

    try {
      await apiService.addInvestigationNote(selectedCase.id, 'Senior Analyst - Desk 4', newNote.trim());
      setNewNote('');
      fetchCases();
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCase) return;

    setUploading(true);
    setHashResult(null);
    try {
      const result = await apiService.uploadEvidence(selectedCase.id, file, `Uploaded evidence file: ${file.name}`);
      setHashResult(result);
      fetchCases();
    } catch (err) {
      console.error('Evidence upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleExportDossier = () => {
    if (!selectedCase) return;
    const notes = JSON.parse(selectedCase.notes_json || '[]');
    const timeline = JSON.parse(selectedCase.timeline_json || '[]');

    const content = `=====================================================
SCAMSHIELD INDIA - FORENSIC INVESTIGATION DOSSIER
Case Number: ${selectedCase.case_number}
Docket Title: ${selectedCase.title}
Priority: ${selectedCase.priority} | Status: ${selectedCase.status}
Assigned Desk: ${selectedCase.assigned_analyst}
Opened Date: ${new Date(selectedCase.created_at).toUTCString()}
Tags: ${selectedCase.tags}
=====================================================

DESCRIPTION & INCIDENT SUMMARY:
${selectedCase.description}

EVIDENCE INTEGRITY REGISTRY (SHA-256):
${selectedCase.evidence_items && selectedCase.evidence_items.length > 0
  ? selectedCase.evidence_items.map((e) => `[File: ${e.file_name}] SHA-256: ${e.sha256_hash} (${e.file_size} bytes)`).join('\n')
  : 'No binary evidence catalogued.'}

ANALYST LOGS:
${notes.map((n: any) => `[${n.time}] ${n.author}: ${n.text}`).join('\n')}

CASE TIMELINE:
${timeline.map((t: any) => `[${t.time}] ${t.event}`).join('\n')}

LEGAL INTEGRITY DISCLAIMER:
Cryptographic SHA-256 hashing preserves digital evidence state to verify absence of post-collection modification. Hashing does not independently establish origin authenticity or courtroom admissibility.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCase.case_number}_dossier.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parsedNotes = selectedCase ? JSON.parse(selectedCase.notes_json || '[]') : [];
  const parsedTimeline = selectedCase ? JSON.parse(selectedCase.timeline_json || '[]') : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Investigation Workspace & Evidence Vault
            </h1>
            <Badge variant="cyan">CHAIN OF CUSTODY</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Track multi-stage Indian cyber fraud syndicates with cryptographic SHA-256 integrity hashing.
          </p>
        </div>

        {selectedCase && (
          <button
            onClick={handleExportDossier}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-mono flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Case Dossier</span>
          </button>
        )}
      </div>

      {/* Case Management Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Cases Roster (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>ACTIVE DOCKETS ({investigations.length})</span>
            <span className="text-cyan-400">DESK TIER 1</span>
          </div>

          <div className="space-y-2">
            {investigations.map((item) => {
              const isSelected = selectedCase?.id === item.id;
              return (
                <GlassCard
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{item.case_number}</span>
                    <Badge riskLevel={item.priority} size="sm">{item.priority}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span className="truncate">{item.assigned_analyst}</span>
                    <span className="text-emerald-400 font-medium">{item.status}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Deep Dive & Forensic Log (8 cols) */}
        {selectedCase && (
          <div className="lg:col-span-8 space-y-4">
            {/* Case Summary Panel */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{selectedCase.case_number}</span>
                    <Badge variant="emerald" size="sm">{selectedCase.status}</Badge>
                    <Badge riskLevel={selectedCase.priority} size="sm">{selectedCase.priority} PRIORITY</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedCase.title}</h2>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  <span>Assigned: </span>
                  <span className="text-slate-200">{selectedCase.assigned_analyst}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {selectedCase.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedCase.tags.split(',').map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Evidence Vault & SHA-256 Hashing */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-cyan-400" />
                    <span>Cryptographic Evidence Vault</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    SHA-256 checksum generation for chat transcripts, forged summons, and payment receipts.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Hashing...' : 'Attach Evidence'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {hashResult && (
                <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono space-y-1 animate-in fade-in">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Evidence Attached & Cryptographically Hashed:</span>
                  </div>
                  <div className="text-slate-300">File: {hashResult.file_name} ({hashResult.file_size} bytes)</div>
                  <div className="text-white break-all bg-black/60 p-2 rounded">
                    SHA-256: <span className="text-cyan-300">{hashResult.sha256_hash}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{hashResult.integrity_notice}</p>
                </div>
              )}

              {/* Evidence Registry Table */}
              <div className="space-y-2">
                {(!selectedCase.evidence_items || selectedCase.evidence_items.length === 0) ? (
                  <div className="py-4 text-center text-xs font-mono text-slate-500">
                    No files attached to this case. Upload a safe text or transcript file to generate SHA-256 digest.
                  </div>
                ) : (
                  selectedCase.evidence_items.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{ev.file_name}</span>
                        <span className="text-slate-400 text-[10px]">{ev.file_size} bytes</span>
                      </div>
                      <div className="text-[11px] text-cyan-400 break-all bg-black/40 px-2 py-1 rounded">
                        SHA-256: {ev.sha256_hash}
                      </div>
                      {ev.description && <div className="text-slate-400 text-[11px]">{ev.description}</div>}
                    </div>
                  ))
                )}
              </div>

              {/* Legal Notice Box */}
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-white/5 text-[11px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold">Forensic Integrity Disclaimer: </span>
                SHA-256 digests mathematically guarantee file integrity against accidental or intentional post-collection tampering, but do not independently verify legal authenticity or identify authorial origin.
              </div>
            </GlassCard>

            {/* Analyst Timeline & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Timeline (Actions) */}
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audit Timeline</span>
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {parsedTimeline.map((item: any, idx: number) => (
                    <div key={idx} className="relative pl-4 border-l border-cyan-500/30 text-xs font-mono">
                      <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="text-[10px] text-slate-500">{new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-slate-300 mt-0.5">{item.event}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Analyst Notes */}
              <GlassCard className="p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Analyst Field Notes ({parsedNotes.length})</span>
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {parsedNotes.map((note: any, idx: number) => (
                      <div key={idx} className="p-2 rounded bg-slate-950/60 border border-white/5 text-xs font-mono">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="text-indigo-300 font-semibold">{note.author}</span>
                          <span>{new Date(note.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-300">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Log investigative finding..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
