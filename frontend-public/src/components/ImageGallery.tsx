'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { getImageUrl, ORANGE_BLUR_PLACEHOLDER } from '@/lib/images';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  blurPlaceholder?: string;
}

export default function ImageGallery({
  images,
  alt,
  blurPlaceholder = ORANGE_BLUR_PLACEHOLDER,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const next = prev + direction;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, navigate]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      navigate(diff > 0 ? 1 : -1);
    }
  };

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-orange-200/80 rounded-full flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div
        className="relative w-full h-full bg-gray-200 dark:bg-gray-700 cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={getImageUrl(images[currentIndex])}
          alt={alt}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          data-testid="gallery-main-image"
        />

        {/* Expand button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Open lightbox"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-orange-500 ring-2 ring-orange-200'
                  : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:text-gray-300 z-50"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Main image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] m-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={getImageUrl(images[currentIndex])}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              data-testid="lightbox-image"
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
