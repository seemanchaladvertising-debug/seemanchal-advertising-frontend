'use client';

import { useState } from 'react';

interface Image {
  url: string;
}

const ImageGallery = ({ images }: { images: Image[] }) => {
  const galleryImages = (images || []).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = galleryImages[activeIndex]?.url;

  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div
        className="relative w-full max-w-[1280px] mx-auto rounded-lg shadow-md overflow-hidden bg-gray-100"
        style={{ aspectRatio: '1280 / 820' }}
      >
        <img
          src="https://via.placeholder.com/1280x820"
          alt="Placeholder"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % galleryImages.length);

  return (
    <div className="w-full max-w-[1280px] mx-auto">
      <div
        className="relative w-full rounded-lg shadow-md mb-4 overflow-hidden bg-black/5"
        style={{ aspectRatio: '1280 / 820' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="h-full flex transition-transform duration-300"
            style={{ width: `${galleryImages.length * 100}%`, transform: `translateX(-${activeIndex * (100 / galleryImages.length)}%)` }}
          >
            {galleryImages.map((img, idx) => (
              <div key={idx} className="h-full" style={{ width: `${100 / galleryImages.length}%` }}>
                <img src={img.url} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {galleryImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow"
              aria-label="Next"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="flex gap-2">
          {galleryImages.map((image, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-14 rounded-md overflow-hidden border ${index === activeIndex ? 'border-indigo-500' : 'border-transparent'} bg-gray-100`}
              aria-label={`Image ${index + 1}`}
            >
              <img src={image.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="sr-only">{mainImage}</div>
    </div>
  );
};

export default ImageGallery;
