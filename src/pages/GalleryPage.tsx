import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Sparkles, X } from 'lucide-react';
import { useEvent } from '../contexts/EventContext';

export const GalleryPage: React.FC = () => {
  const { activeEvent } = useEvent();

  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const photos = [
    { id: '1', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80', caption: 'Laxmi Vilas Palace Royal Entrance' },
    { id: '2', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', caption: 'Science City Auditorium Keynote Stage' },
    { id: '3', url: 'https://images.unsplash.com/photo-1545232979-fbf34fc3e0d8?auto=format&fit=crop&w=1200&q=80', caption: 'Royal Floral Mandap Setup' },
    { id: '4', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Chandelier Evening Reception Hall' },
    { id: '5', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', caption: 'Surya Palace Luxury Banquet' },
    { id: '6', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80', caption: 'Rooftop Cocktail Lounge Evening' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-google-blue uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Memories</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Photo Gallery & Lightbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Album showcase and high-resolution photo highlights for {activeEvent?.title}.
          </p>
        </div>

        <button
          onClick={() => alert('Photo upload simulation active. In production, this syncs with Cloud Storage.')}
          className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 shadow-md transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhotoModal(photo.url)}
            className="rounded-3xl overflow-hidden bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer group hover:border-google-blue/50 transition-all"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold">{photo.caption}</span>
              </div>
            </div>
            <div className="p-3 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {photo.caption}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-google-red p-2 font-bold"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePhotoModal}
              alt="Full Preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
