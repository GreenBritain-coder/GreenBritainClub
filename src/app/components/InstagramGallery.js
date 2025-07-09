'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const InstagramGallery = ({ maxItems = 6 }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/instagram-gallery');
      if (response.ok) {
        const items = await response.json();
        setGalleryItems(items.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-700/30 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Gallery Coming Soon</h3>
        <p className="text-green-200">Our social media gallery is being curated</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {galleryItems.map((item) => (
        <div key={item._id} className="group relative">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
            <Image
              src={item.imageUrl}
              alt={item.caption || 'Gallery image'}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Overlay with like count and caption */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
              <div className="text-white">
                {item.likes && (
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-red-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm font-medium">{item.likes.toLocaleString()}</span>
                  </div>
                )}
                {item.caption && (
                  <p className="text-sm text-white/90 line-clamp-2">{item.caption}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Instagram-style indicator if it's a video or multiple images */}
          {item.type === 'video' && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          

        </div>
      ))}
    </div>
  );
};

export default InstagramGallery; 