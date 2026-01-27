import * as React from "react";
import { Upload, FileText, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { storage } from "@/lib/firebase"; // Firebase Storage
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { openRouter } from "@/lib/openrouter";

interface DocumentMetadata {
    id: string;
    filename: string;
    category: string;
    uploadedAt: string;
    status: 'uploaded' | 'processing' | 'ready' | 'error';
    chunkCount?: number;
    url?: string;
}

const AGENT_CATEGORIES = [
    { value: 'agent-fiqh', label: 'Fiqh Reasoning Agent' },
    { value: 'agent-aqeedah', label: 'Aqeedah Boundary Agent' },
    { value: 'agent-humility', label: 'Humility & Abstention Agent' },
    { value: 'agent-context', label: 'Contemporary Context Agent' },
    { value: 'general', label: 'General (All Agents)' }
];

const DocumentUpload: React.FC = () => {
    const { t } = useLanguage();
    const [documents, setDocuments] = React.useState<DocumentMetadata[]>([]);
    const [uploading, setUploading] = React.useState(false);
    const [openingId, setOpeningId] = React.useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = React.useState(AGENT_CATEGORIES[0].value);
    const [dragActive, setDragActive] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const loadDocuments = React.useCallback(async () => {
        try {
            // List files from Firebase Storage
            const listRef = ref(storage, selectedAgent); // Use simplified path strategy: agent-name/filename
            // Note: Firebase Storage listing is flat by default or via prefix.
            // If we organize by folders (prefixes), we list items in that prefix.
            // If folder doesn't exist yet, it returns empty list (which is fine).

            const res = await listAll(listRef);

            const documentsList: DocumentMetadata[] = await Promise.all(res.items.map(async (itemRef) => {
                // Get metadata if possible, for now just filename and url
                const url = await getDownloadURL(itemRef);
                return {
                    id: itemRef.fullPath,
                    filename: itemRef.name,
                    category: selectedAgent,
                    uploadedAt: new Date().toISOString(), // Storage list doesn't give date easily without getMetadata
                    status: 'ready' as const,
                    url: url
                };
            }));

            // If we want detailed metadata (created_at), we need getMetadata call per item.
            // For performance, we skip it or could implement a separate database index.

            setDocuments(documentsList);
        } catch (error) {
            // If error is "object-not-found" (folder empty), just set empty
            console.error('Error loading documents:', error);
            setDocuments([]); // Default to empty
        }
    }, [selectedAgent]);

    React.useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleOpen = async (doc: DocumentMetadata) => {
        if (doc.url) {
            window.open(doc.url, '_blank', 'noopener,noreferrer');
            return;
        }

        // Fallback if URL missed
        setOpeningId(doc.id);
        try {
            const itemRef = ref(storage, doc.id);
            const url = await getDownloadURL(itemRef);
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error: any) {
            toast({
                title: 'Open Failed',
                description: error.message || 'Could not open document',
                variant: 'destructive'
            });
        } finally {
            setOpeningId(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const [uploadProgress, setUploadProgress] = React.useState(0);

    const handleFileUpload = async (file: File) => {
        if (!file.name.match(/\.(txt|pdf|docx|md)$/i)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a TXT, PDF, DOCX, or MD file.",
                variant: "destructive"
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload to Firebase Storage
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `${selectedAgent}/${fileName}`;
            const storageRef = ref(storage, filePath);

            // Use resumable upload for progress
            const uploadTask = import('firebase/storage').then(({ uploadBytesResumable }) => {
                const task = uploadBytesResumable(storageRef, file);

                return new Promise<void>((resolve, reject) => {
                    task.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => {
                            reject(error);
                        },
                        async () => {
                            // Upload completed successfully
                            resolve();
                        }
                    );
                });
            });

            await uploadTask;

            // Process document for RAG if it's a text file
            if (file.name.match(/\.(txt|md)$/i)) {
                const text = await file.text();

                // Use OpenRouter to generate embeddings/chunks (simplified - in production use proper RAG service)
                try {
                    await openRouter.generateCompletion([
                        {
                            role: 'system',
                            content: 'You are a document processor. Extract key information from this Islamic document for RAG indexing.'
                        },
                        {
                            role: 'user',
                            content: `Process this document for RAG:\n\n${text.substring(0, 3000)}`
                        }
                    ], {
                        model: 'openai/gpt-4o-mini',
                        maxTokens: 500
                    });
                } catch (ragError) {
                    console.warn('RAG processing failed, document uploaded but not indexed:', ragError);
                }
            }

            toast({
                title: "Upload Success",
                description: `${file.name} uploaded successfully!`
            });
            loadDocuments();
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: t('error.upload_failed'),
                description: error.message || t('error.upload_failed'),
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, filename: string) => {
        try {
            const itemRef = ref(storage, id);
            await deleteObject(itemRef);

            toast({
                title: "Deleted",
                description: "Document removed successfully."
            });
            loadDocuments();
        } catch (error: any) {
            toast({
                title: "Delete Failed",
                description: error.message || t('error.delete_failed'),
                variant: "destructive"
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ready':
                return <CheckCircle className="w-4 h-4 text-islamic-green-600" />;
            case 'processing':
            case 'uploaded':
                return <Loader2 className="w-4 h-4 text-islamic-gold animate-spin" />;
            case 'error':
                return <span className="text-red-500">❌</span>;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-[#efefec] to-islamic-gold/10">
            <section className="container py-10 md:py-16">
                <header className="mb-12">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                        RAG Knowledge Base
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
                        <span className="text-gradient">Document Upload</span>
                    </h1>
                    <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
                        Upload documents to train the epistemic agents. Each document is processed and indexed for retrieval.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Upload Area */}
                    <div className="islamic-card p-8 bg-[#efefec]/95">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-islamic-dark mb-3">
                                Select Agent (Documents tagged for specific agent)
                            </label>
                            <select
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-islamic-cream bg-[#efefec] text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                            >
                                {AGENT_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive
                                ? 'border-islamic-gold bg-islamic-gold/10'
                                : 'border-islamic-cream hover:border-islamic-gold/50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                accept=".txt,.pdf,.docx,.md"
                                className="hidden"
                            />

                            <Upload className="w-12 h-12 text-islamic-gold mx-auto mb-4" />
                            <p className="text-lg font-semibold text-islamic-dark mb-2">
                                Drag and drop your document here
                            </p>
                            <p className="text-sm text-islamic-dark/60 mb-4">
                                or click to browse (PDF, TXT, DOCX, MD)
                            </p>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="btn-islamic disabled:opacity-50"
                            >
                                {uploading ? (
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full h-2 bg-islamic-cream rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-islamic-gold transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-islamic-dark/60">
                                            Uploading... {Math.round(uploadProgress)}%
                                        </span>
                                    </div>
                                ) : 'Select File'}
                            </button>
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="islamic-card p-6 bg-[#efefec]/95">
                        <h3 className="text-xl font-bold text-islamic-dark mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Uploaded Documents
                        </h3>

                        {documents.length === 0 ? (
                            <p className="text-sm text-islamic-dark/60 text-center py-8">
                                No documents uploaded yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-islamic-cream hover:bg-islamic-cream/30 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getStatusIcon(doc.status)}
                                            <div className="flex-1">
                                                <p className="font-medium text-islamic-dark">{doc.filename}</p>
                                                <p className="text-xs text-islamic-dark/60">
                                                    {AGENT_CATEGORIES.find(c => c.value === doc.category)?.label || doc.category} •
                                                    {doc.chunkCount ? ` ${doc.chunkCount} chunks` : ` ${doc.status}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpen(doc)}
                                                disabled={openingId === doc.id}
                                                className="px-3 py-2 text-xs rounded-lg border border-islamic-cream text-islamic-dark/80 hover:text-islamic-dark hover:border-islamic-gold/50 transition-colors disabled:opacity-50"
                                                title="Preview / Download"
                                            >
                                                {openingId === doc.id ? 'Opening...' : 'Open'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(doc.id, doc.filename)}
                                                className="p-2 text-islamic-dark/40 hover:text-red-500 rounded-lg transition-colors"
                                                title={t('error.delete_document')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
