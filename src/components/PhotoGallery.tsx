import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Camera, Heart } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
}

const PhotoGallery: React.FC = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      url: "/Assets/1.jpg"
    },
    {
      id: 2,
      url: "/Assets/2.jpg"
    },
    {
      id: 3,
      url: "/Assets/3.jpg"
    },
    {
      id: 4,
      url: "/Assets/4.jpg"
    },
    {
      id: 5,
      url: "/Assets/5.jpg"
    },
    {
      id: 6,
      url: "/Assets/6.jpg"
    },
    {
      id: 7,
      url: "/Assets/7.jpg"
    },
    {
      id: 8,
      url: "/Assets/8.jpg"
    },
    {
      id: 9,
      url: "/Assets/9.jpg"
    },
    {
      id: 10,
      url: "/Assets/10.jpg"
    },
    {
      id: 11,
      url: "/Assets/11.jpg"
    },
    {
      id: 12,
      url: "/Assets/12.jpg"
    }
  ]);

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-mint-50 to-blush-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-mint-500 to-blush-500 bg-clip-text text-transparent">
              Our Photo Gallery
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          I love every single photo together with you, and I can't wait to make more memories with you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="bg-white rounded-3xl p-4 shadow-2xl">
              <div 
                className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src={photos[currentPhoto].url}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                </div>
            </div>
          </div>
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPhoto}
              className="bg-white shadow-lg rounded-full p-4 text-mint-500 hover:bg-mint-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                {currentPhoto + 1} of {photos.length}
              </div>
              <div className="flex space-x-2">
                {photos.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setCurrentPhoto(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPhoto 
                        ? 'bg-mint-500' 
                        : 'bg-gray-300 hover:bg-mint-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPhoto}
              className="bg-white shadow-lg rounded-full p-4 text-mint-500 hover:bg-mint-50 transition-colors"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPhoto(index)}
                className={`
                  aspect-square rounded-lg overflow-hidden cursor-pointer
                  ${index === currentPhoto ? 'ring-4 ring-mint-400 ring-opacity-50' : ''}
                `}
              >
                <img 
                  src={photo.url}
                  className="w-full h-full object-cover transition-opacity hover:opacity-80"
                />
              </motion.div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={photos[currentPhoto].url}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <X size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <Heart size={16} className="inline mr-1 text-blush-400" />
  I had to stop myself from just adding more and more photos
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoGallery;