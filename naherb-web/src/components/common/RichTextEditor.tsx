"use client";

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { AXIOS_INSTANCE } from '@/services/api-client';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  mediaType?: string;
}

export default function RichTextEditor({ initialValue = '', onChange, mediaType = 'GENERAL' }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const imagesUploadHandler = async (blobInfo: any, progress: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      const fileBlob = blobInfo.blob();
      const filename = blobInfo.filename();
      
      const EXT_MIME: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg',
        png: 'image/png', webp: 'image/webp', gif: 'image/gif',
      };
      const ext = filename.split('.').pop()?.toLowerCase() ?? '';
      const mimeType = fileBlob.type || EXT_MIME[ext] || 'application/octet-stream';
      const typedBlob = new Blob([fileBlob], { type: mimeType });

      formData.append('file', typedBlob, filename);
      formData.append('type', mediaType);

      try {
        // Upload to backend API (which forwards to Cloudinary)
        // Adjust endpoint base URL if necessary based on environment
        const response = await AXIOS_INSTANCE.post(
          '/v1/admin/media/upload', 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              // Add Authorization header here if needed for Admin routes
              // 'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                progress((progressEvent.loaded / progressEvent.total) * 100);
              }
            }
          }
        );

        if (response.status === 200 && response.data.location) {
          resolve(response.data.location); // URL returned from backend
        } else {
          reject('Invalid response from server');
        }
      } catch (error: any) {
        console.error('Upload failed:', error);
        reject(error.response?.data?.error || 'Image upload failed');
      }
    });
  };

  return (
    <div className="w-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image link | removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_upload_handler: imagesUploadHandler,
          automatic_uploads: true,
          file_picker_types: 'image',
          image_title: true,
        }}
      />
    </div>
  );
}
