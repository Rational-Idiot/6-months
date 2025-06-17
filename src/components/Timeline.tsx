import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Heart } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  emoji: string;
  location?: string;
}

const Timeline: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 1,
      date: "Month 1",
      title: "The mystical night on the clocktower",
      description: "Remebering it still brings so many butterflies in my stomach, I still can't truly get over the warm embrace of that night. The way you looked at me, the way we talked, the way you held me and your cute face while you struggled through the proposal",
      emoji: "✨",
      location: "The magical clocktower"
    },
    {
      id: 2,
      date: "Month 2",
      title: "Our First Kiss and 'I love you'",
      description: "The moment everything changed. A kiss that sealed our love and made my heart skip a beat. Ever since Lohri and your cute face, I couldn't stop thinking about you, and when that moment came at the roof it was just perfect. The fastest 2hrs of my life btw",
      emoji: "😙",
      location: "The one and only CC3"
    },
    {
      id: 3,
      date: "Month 3",
      title: "Daily love adventures",
      description: "And then follows the most beautiful 3 months of my life, filled with daily adventures, laughter, and love. From our late-night talks to spontaneous outings, every moment with you is a treasure.",
      emoji: "🗺️",
      location: "Everywhere with you"
    },
    {
      id: 4,
      date: "Month 4",
      title: "The Moment We Knew",
      description: "All the little moments, everyday we spent together all of it compounded into one beautiful realization: I love you more than anything in this world and cant imagine a day without you. All the cooking dates and snooker was just the cherry on top of this beautiful cake.",
      emoji: "💕",
      location: "Always around the SAC"
    },
    {
      id: 5,
      date: "Month 5",
      title: "Top class DSA coaching centre",
      description: "As the endsems drew closer the mix of sneaking out during studying time to play snooker and all the fun we had in the libraray defiently had it's pros and cons",
      emoji: "👨‍💻",
      location: "Family Dinner"
    },
    {
      id: 6,
      date: "Month 6",
      title: "Here We Are!",
      description: "Six beautiful months of love, growth, laughter, and countless memories. Here's to many more adventures together!",
      emoji: "🎉",
      location: "Painfully apart but still together"
    }
  ]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleEdit = (id: number, field: keyof TimelineEvent, value: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-lavender-50 to-mint-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-lavender-500 to-mint-500 bg-clip-text text-transparent">
              Our Story Timeline
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every moment with you has been a chapter in our beautiful love story
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{events[currentSlide].emoji}</div>
              <div className="flex items-center justify-center text-blush-500 mb-2">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">{events[currentSlide].date}</span>
              </div>
              {events[currentSlide].location && (
                <div className="flex items-center justify-center text-mint-600 mb-4">
                  <MapPin size={16} className="mr-2" />
                  <span 
                    onBlur={(e) => handleEdit(events[currentSlide].id, 'location', e.target.textContent || '')}
                    className="hover:bg-mint-50 px-2 py-1 rounded transition-colors cursor-text"
                  >
                    {events[currentSlide].location}
                  </span>
                </div>
              )}
            </div>

            <h3 
              
              onBlur={(e) => handleEdit(events[currentSlide].id, 'title', e.target.textContent || '')}
              className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-text"
            >
              {events[currentSlide].title}
            </h3>
            
            <p 
              
              onBlur={(e) => handleEdit(events[currentSlide].id, 'description', e.target.textContent || '')}
              className="text-gray-600 text-center leading-relaxed hover:bg-gray-50 px-4 py-2 rounded transition-colors cursor-text"
            >
              {events[currentSlide].description}
            </p>
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="bg-white shadow-lg rounded-full p-3 text-blush-500 hover:bg-blush-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="bg-white shadow-lg rounded-full p-3 text-blush-500 hover:bg-blush-50 transition-colors"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          <div className="flex justify-center space-x-3">
            {events.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-blush-500' 
                    : 'bg-gray-300 hover:bg-blush-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Touch/Swipe Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <Heart size={16} className="inline mr-2" />
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;