# Supabase Storage Setup for File Uploads

## Step 1: Create Storage Buckets

### Via Supabase Dashboard

1. **Go to Storage**
   - Navigate to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Click **Storage** in sidebar

2. **Create verification-documents bucket**
   - Click **New bucket**
   - Name: `verification-documents`
   - Public: ❌ **Uncheck** (private bucket)
   - Click **Create**

3. **Create studio-photos bucket**
   - Click **New bucket**
   - Name: `studio-photos`
   - Public: ✅ **Check** (public bucket)
   - Click **Create**

---

## Step 2: Configure Storage Policies

### For verification-documents bucket

**Navigate to:** Storage → verification-documents → Policies

**Policy 1: Upload**
```sql
CREATE POLICY "Users can upload verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);
```

**Policy 2: Read Own**
```sql
CREATE POLICY "Users can read own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);
```

### For studio-photos bucket

**Navigate to:** Storage → studio-photos → Policies

**Policy 1: Upload**
```sql
CREATE POLICY "Users can upload studio photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'studio-photos' AND
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);
```

**Policy 2: Public Read**
```sql
CREATE POLICY "Anyone can view studio photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'studio-photos');
```

---

## Verification

After setup, verify:
- [ ] `verification-documents` bucket exists (private)
- [ ] `studio-photos` bucket exists (public)
- [ ] 2 policies on verification-documents
- [ ] 2 policies on studio-photos
