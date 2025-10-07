-- Certificate storage table for managing generated certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    registration_id UUID REFERENCES registrations(id) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    regenerated_count INTEGER DEFAULT 0,
    
    -- Ensure one certificate per user per registration
    UNIQUE(user_id, registration_id)
);

-- Create storage bucket for certificates (run this in Supabase dashboard)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for certificates table
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Users can only access their own certificates
CREATE POLICY "Users can view their own certificates"
    ON certificates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
    ON certificates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates"
    ON certificates FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificates"
    ON certificates FOR DELETE
    USING (auth.uid() = user_id);

-- Storage policies for certificates bucket
CREATE POLICY "Users can upload their own certificates"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own certificates"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own certificates"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own certificates"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_registration_id ON certificates(registration_id);
CREATE INDEX IF NOT EXISTS idx_certificates_generated_at ON certificates(generated_at);