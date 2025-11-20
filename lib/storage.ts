import { supabase } from './supabase';

export interface UploadOptions {
    bucket: 'verification-documents' | 'studio-photos';
    folder?: string;
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export interface UploadResult {
    url: string;
    path: string;
    error?: string;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
    file: File,
    userId: string,
    options: UploadOptions
): Promise<UploadResult> {
    const {
        bucket,
        folder = '',
        maxSizeMB = 10,
        allowedTypes = []
    } = options;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            url: '',
            path: '',
            error: `File size exceeds ${maxSizeMB}MB limit`
        };
    }

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
            url: '',
            path: '',
            error: `File type ${file.type} not allowed`
        };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;

    // Build file path: userId/folder/filename
    const filePath = folder
        ? `${userId}/${folder}/${fileName}`
        : `${userId}/${fileName}`;

    try {
        // Upload file
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return {
                url: '',
                path: '',
                error: error.message
            };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            url: publicUrl,
            path: filePath,
            error: undefined
        };
    } catch (error) {
        console.error('Upload exception:', error);
        return {
            url: '',
            path: '',
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
    bucket: 'verification-documents' | 'studio-photos',
    filePath: string
): Promise<{ error?: string }> {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            return { error: error.message };
        }

        return {};
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Delete failed'
        };
    }
}

/**
 * Compress image before upload (client-side)
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Compression failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Image load failed'));
        };

        reader.onerror = () => reject(new Error('File read failed'));
    });
}
