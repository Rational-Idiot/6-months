import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import MiniGame from './components/MiniGame';
import PhotoGallery from './components/PhotoGallery';
import LoveNotes from './components/LoveNotes';
import SurpriseReveal from './components/SurpriseReveal';
import FloatingHearts from './components/FloatingHearts';

function App() {
  const [showFloatingHearts, setShowFloatingHearts] = useState(true);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [keySequence, setKeySequence] = useState('');

  //Aap source code tak bhi pohunch gaye, "love" type karke dekh bhi lo phir
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key.toLowerCase()).slice(-4);
      setKeySequence(newSequence);
      
      if (newSequence === 'love') {
        setSecretUnlocked(true);
        setTimeout(() => setSecretUnlocked(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins overflow-x-hidden">
      {showFloatingHearts && <FloatingHearts />}
      
      {secretUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-4xl mb-4"
            >
              💕
            </motion.div>
            <h3 className="text-2xl font-bold text-blush-600 mb-2">Secret Unlocked!</h3>
            <p className="text-gray-600 italic">
              "Areyy wahh,<br />
              Bohot Secrets dhoondhe jaa rahe hai,<br />
              There is something special hidden for you here,<br />
              Send me a screeshot of this message and I will get +5 fouls"
            </p>
          </div>
        </motion.div>
      )}

      <div className="relative">
        <Hero />
        <Timeline />
        <MiniGame />
        <PhotoGallery />
        <LoveNotes />
        <SurpriseReveal />
        
        <footer className="bg-gradient-to-r from-blush-100 to-lavender-100 py-8 text-center">
          <div className="container mx-auto px-4">
            <p className="text-gray-600 mb-2">Made with 💕 for our 6-month journey</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <button
                onClick={() => setShowFloatingHearts(!showFloatingHearts)}
                className="hover:text-blush-500 transition-colors"
              >
                {showFloatingHearts ? '🫶 Hide Hearts' : '💕 Show Hearts'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;