'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ImageUploader({ value, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  
  // Collection of cannabis-related Unsplash images
  const unsplashImages = [
    'https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603909223429-69bb7101f92d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485149476586-20f33627b8c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457573358540-3f000e9d2d8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  ];
  
  const handleUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, this would be an actual upload to a server/CDN
      // For demo purposes, we'll use a random Unsplash image
      const randomImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
      setPreviewUrl(randomImage);
      onChange(randomImage);
      setIsUploading(false);
    }, 1500);
  };
  
  const handleCustomUrl = (e) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onChange(url);
  };
  
  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
          Featured Image URL
        </label>
        <input
          type="text"
          value={previewUrl}
          onChange={handleCustomUrl}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px'
          }}
          placeholder="Enter image URL or generate one below"
        />
      </div>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={{
            padding: '10px 15px',
            background: isUploading ? '#16a34a' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          type="button"
        >
          {isUploading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Generating...
            </>
          ) : (
            <>🖼️ Generate Random Image</>
          )}
        </button>
        
        <button
          onClick={() => {
            setPreviewUrl('');
            onChange('');
          }}
          style={{
            padding: '10px 15px',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          type="button"
        >
          Clear
        </button>
      </div>
      
      {previewUrl && (
        <div style={{ 
          marginTop: '15px', 
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '200px'
        }}>
          <Image
            src={previewUrl}
            alt="Featured image preview"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
} 