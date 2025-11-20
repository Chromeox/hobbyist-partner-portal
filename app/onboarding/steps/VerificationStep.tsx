'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { uploadFile } from '@/lib/storage';
import PrivacyPolicyBanner from '@/components/common/PrivacyPolicyBanner';

interface VerificationStepProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  data: any;
}

export default function VerificationStep({ onNext, onPrevious, data }: VerificationStepProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessLicense: data.verification?.businessLicense || null,
    insuranceCert: data.verification?.insuranceCert || null,
    bankStatement: data.verification?.bankStatement || null,
    taxDocument: data.verification?.taxDocument || null,
    certifications: data.verification?.certifications || [],
  });

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});

  const handleFileUpload = async (field: string, file: File) => {
    if (!user) {
      setUploadErrors(prev => ({ ...prev, [field]: 'Please sign in to upload files' }));
      setUploadStatus(prev => ({ ...prev, [field]: 'error' }));
      return;
    }

    setUploadStatus(prev => ({ ...prev, [field]: 'uploading' }));
    setUploadErrors(prev => ({ ...prev, [field]: '' }));

    try {
      const result = await uploadFile(file, user.id, {
        bucket: 'verification-documents',
        folder: 'onboarding',
        maxSizeMB: 10,
        allowedTypes: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ]
      });

      if (result.error) {
        setUploadStatus(prev => ({ ...prev, [field]: 'error' }));
        setUploadErrors(prev => ({ ...prev, [field]: result.error! }));
        return;
      }

      // Store the URL
      setFormData(prev => ({ ...prev, [field]: result.url }));
      setUploadStatus(prev => ({ ...prev, [field]: 'success' }));
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [field]: 'error' }));
      setUploadErrors(prev => ({
        ...prev,
        [field]: error instanceof Error ? error.message : 'Upload failed'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ verification: formData });
  };

  const requirements = [
    {
      id: 'businessLicense',
      label: 'Business License',
      description: 'Valid business license or registration document',
      required: true,
    },
    {
      id: 'insuranceCert',
      label: 'Liability Insurance',
      description: 'General liability insurance certificate',
      required: true,
    },
    {
      id: 'bankStatement',
      label: 'Bank Statement',
      description: 'Recent bank statement (last 3 months)',
      required: false,
    },
    {
      id: 'taxDocument',
      label: 'Tax Document',
      description: 'W-9 form or tax registration document',
      required: true,
    },
  ];

  const FileUploadArea = ({ requirement }: { requirement: any }) => {
    const status = uploadStatus[requirement.id];
    const hasFile = formData[requirement.id as keyof typeof formData];

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : status === 'uploading' ? (
              <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {requirement.label}
            {requirement.required && <span className="text-red-500 ml-1">*</span>}
          </h3>

          <p className="text-gray-600 mb-4">{requirement.description}</p>

          {hasFile ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">{hasFile}</span>
              </div>
            </div>
          ) : null}

          <input
            type="file"
            id={`upload-${requirement.id}`}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(requirement.id, file);
            }}
            className="hidden"
            disabled={status === 'uploading'}
          />

          <label
            htmlFor={`upload-${requirement.id}`}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors cursor-pointer ${status === 'uploading'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : hasFile
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {status === 'uploading'
              ? 'Uploading...'
              : hasFile
                ? 'Replace File'
                : 'Choose File'
            }
          </label>

          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </div>
    );
  };

  const canProceed = requirements
    .filter(req => req.required)
    .every(req => formData[req.id as keyof typeof formData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h2>
        <p className="text-gray-600">
          Upload the required documents to verify your business. This helps us ensure compliance and build trust with students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirements.map((requirement) => (
            <FileUploadArea key={requirement.id} requirement={requirement} />
          ))}
        </div>

        {/* Additional Certifications */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Professional Certifications (Optional)
          </h3>
          <p className="text-gray-600 mb-4">
            Upload any professional certifications for your instructors to showcase expertise.
          </p>

          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
            <input
              type="file"
              id="certifications-upload"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0 || !user) return;

                setUploadStatus(prev => ({ ...prev, certifications: 'uploading' }));

                try {
                  const uploadPromises = files.map(async (file) => {
                    const result = await uploadFile(file, user.id, {
                      bucket: 'verification-documents',
                      folder: 'certifications',
                      maxSizeMB: 10,
                      allowedTypes: [
                        'application/pdf',
                        'image/jpeg',
                        'image/png',
                        'image/jpg'
                      ]
                    });

                    if (result.error) {
                      console.error('Certification upload error:', result.error);
                      return null;
                    }

                    return result.url;
                  });

                  const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
                  setFormData(prev => ({
                    ...prev,
                    certifications: [...prev.certifications, ...uploadedUrls]
                  }));
                  setUploadStatus(prev => ({ ...prev, certifications: 'success' }));
                } catch (error) {
                  console.error('Certifications upload exception:', error);
                  setUploadStatus(prev => ({ ...prev, certifications: 'error' }));
                }
              }}
              className="hidden"
            />

            <label
              htmlFor="certifications-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadStatus.certifications === 'uploading' ? 'Uploading...' : 'Upload Certifications'}
            </label>

            {formData.certifications.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  {formData.certifications.length} certification(s) uploaded
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((certUrl: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Cert {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Verification Process</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Document verification typically takes 1-3 business days. You'll receive email updates on your verification status.
                You can continue with setup while verification is in progress.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <PrivacyPolicyBanner
            variant="inline"
            context="onboarding"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canProceed}
            className={`px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${canProceed
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}