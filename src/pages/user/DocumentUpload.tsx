import * as React from "react";
import { Upload, FileText, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { useTr, type Loc } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { toast } from "sonner";

interface DocumentMetadata {
  id: string;
  filename: string;
  category: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "ready" | "error";
  url?: string;
}

const AGENT_CATEGORIES = ["agent-fiqh", "agent-aqeedah", "agent-humility", "agent-context", "general"];

const AGENT_LABELS: Record<string, Loc> = {
  "agent-fiqh": { en: "Fiqh Reasoning Agent", fr: "Agent de raisonnement Fiqh" },
  "agent-aqeedah": { en: "Aqeedah Boundary Agent", fr: "Agent gardien de l'Aqida" },
  "agent-humility": { en: "Humility & Abstention Agent", fr: "Agent d'humilité" },
  "agent-context": { en: "Contemporary Context Agent", fr: "Agent de contexte contemporain" },
  general: { en: "General (All Agents)", fr: "Général (tous les agents)" },
};

const DocumentUpload: React.FC = () => {
  const tr = useTr();
  const documents = useQuery(api.rag.listDocuments) ?? [];
  const upsertDocumentAction = useAction(api.rag.upsertDocument);

  const [uploading, setUploading] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState(AGENT_CATEGORIES[0]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(txt|pdf|docx|md)$/i)) {
      toast.error(tr({ en: "Invalid file type. Use TXT, PDF, DOCX, or MD.", fr: "Type de fichier non valide. Utilisez TXT, PDF, DOCX ou MD." }));
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const fileId = `${Date.now()}_${file.name}`;

      await upsertDocumentAction({
        title: file.name,
        content: text,
        source: file.name,
        category: selectedAgent,
      });

      toast.success(tr({ en: "Uploaded & indexed for RAG", fr: "Téléversé et indexé pour le RAG" }));
    } catch (error: any) {
      toast.error(error.message || tr({ en: "Upload failed", fr: "Échec du téléversement" }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle className="w-4 h-4 text-islamic-green-600" />;
      case "processing": return <Loader2 className="w-4 h-4 text-islamic-gold animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-[#efefec] to-islamic-gold/10">
      <section className="container py-10 md:py-16">
        <header className="mb-12">
          <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
            {tr({ en: "RAG Knowledge Base", fr: "Base de connaissances RAG" })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
            <span className="text-gradient">{tr({ en: "Document Upload", fr: "Téléversement de documents" })}</span>
          </h1>
          <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
            {tr({ en: "Upload documents to train the epistemic agents. Each document is embedded and indexed for RAG retrieval server-side.", fr: "Téléversez des documents pour entraîner les agents. Chaque document est encodé et indexé pour le RAG côté serveur." })}
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="islamic-card p-8 bg-[#efefec]/95">
            <div className="mb-6">
              <label className="block text-sm font-medium text-islamic-dark mb-3">
                {tr({ en: "Target Agent", fr: "Agent cible" })}
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-islamic-cream bg-[#efefec] text-islamic-dark"
              >
                {AGENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{tr(AGENT_LABELS[cat])}</option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive ? "border-islamic-gold bg-islamic-gold/10" : "border-islamic-cream hover:border-islamic-gold/50"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} accept=".txt,.pdf,.docx,.md" className="hidden" />
              <Upload className="w-12 h-12 text-islamic-gold mx-auto mb-4" />
              <p className="text-lg font-semibold text-islamic-dark mb-2">{tr({ en: "Drag and drop your document here", fr: "Glissez-déposez votre document ici" })}</p>
              <p className="text-sm text-islamic-dark/60 mb-4">{tr({ en: "or click to browse (PDF, TXT, DOCX, MD)", fr: "ou cliquez pour parcourir (PDF, TXT, DOCX, MD)" })}</p>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-islamic disabled:opacity-50">
                {uploading ? tr({ en: "Uploading...", fr: "Téléversement..." }) : tr({ en: "Select File", fr: "Choisir un fichier" })}
              </button>
            </div>
          </div>

          <div className="islamic-card p-6 bg-[#efefec]/95">
            <h3 className="text-xl font-bold text-islamic-dark mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {tr({ en: "Indexed Documents", fr: "Documents indexés" })}
            </h3>

            {(documents as any[]).length === 0 ? (
              <p className="text-sm text-islamic-dark/60 text-center py-8">{tr({ en: "No documents uploaded yet.", fr: "Aucun document téléversé." })}</p>
            ) : (
              <div className="space-y-3">
                {(documents as any[]).map((doc: any) => (
                  <div key={doc._id} className="flex items-center justify-between p-4 rounded-lg border border-islamic-cream hover:bg-islamic-cream/30 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon("ready")}
                      <div className="flex-1">
                        <p className="font-medium text-islamic-dark">{doc.title}</p>
                        <p className="text-xs text-islamic-dark/60">
                          {AGENT_LABELS[doc.category] ? tr(AGENT_LABELS[doc.category]) : doc.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentUpload;
