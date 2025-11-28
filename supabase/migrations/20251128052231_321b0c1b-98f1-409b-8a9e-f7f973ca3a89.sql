-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
);

-- Allow authenticated users to upload files
CREATE POLICY "Admins can upload study materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view study materials"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'study-materials');

-- Allow admins to delete files
CREATE POLICY "Admins can delete study materials"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to insert study materials metadata
CREATE POLICY "Admins can create study materials"
ON public.study_materials
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete study materials metadata
CREATE POLICY "Admins can delete study materials"
ON public.study_materials
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));