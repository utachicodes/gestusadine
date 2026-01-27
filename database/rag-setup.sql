CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.rag_ingested_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  category TEXT DEFAULT 'general',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rag_vectors (
  id TEXT PRIMARY KEY,
  doc_id TEXT REFERENCES public.rag_ingested_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  embedding vector(384),
  title TEXT,
  source TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE public.rag_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_ingested_documents ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Public Read, Admin Write
-- Anyone can search/read the knowledge base
CREATE POLICY "Allow public read access to rag_vectors"
  ON public.rag_vectors FOR SELECT USING (true);

CREATE POLICY "Allow public read access to rag_ingested_documents"
  ON public.rag_ingested_documents FOR SELECT USING (true);

-- Only admins can ingest or delete documents
CREATE POLICY "Allow admin manage rag_vectors"
  ON public.rag_vectors FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Allow admin manage rag_ingested_documents"
  ON public.rag_ingested_documents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Indices for performance
CREATE INDEX IF NOT EXISTS idx_rag_vectors_doc_id ON public.rag_vectors(doc_id);
CREATE INDEX IF NOT EXISTS idx_rag_vectors_category ON public.rag_vectors(category);
