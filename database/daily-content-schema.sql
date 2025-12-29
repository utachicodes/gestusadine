-- Daily Content Schema for XamSaDine AI
-- Stores daily Islamic content: Ayahs, Duas, Facts, and Quizzes

CREATE TABLE IF NOT EXISTS public.daily_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('ayah', 'dua', 'fact', 'quiz')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Ayah fields
  reference TEXT,
  arabic TEXT,
  translation_en TEXT,
  translation_fr TEXT,
  translation_wo TEXT,
  
  -- Fact fields
  fact_en TEXT,
  fact_fr TEXT,
  fact_wo TEXT,
  
  -- Quiz fields
  language TEXT CHECK (language IN ('en', 'fr', 'wo')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'advanced')),
  question TEXT,
  options TEXT[], -- Array of answer options
  correct TEXT, -- Correct answer
  hint TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_content_date ON public.daily_content(date);
CREATE INDEX IF NOT EXISTS idx_daily_content_type ON public.daily_content(content_type);
CREATE INDEX IF NOT EXISTS idx_daily_content_type_date ON public.daily_content(content_type, date);

-- RLS Policies
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;

-- Public can read daily content
CREATE POLICY "Public read access to daily content"
ON public.daily_content FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admin write access to daily content"
ON public.daily_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_daily_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_content_timestamp
BEFORE UPDATE ON public.daily_content
FOR EACH ROW
EXECUTE FUNCTION update_daily_content_updated_at();
