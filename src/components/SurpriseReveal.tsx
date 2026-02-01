import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const SurpriseReveal: React.FC = () => {
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [showFloatingHearts, setShowFloatingHearts] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleReveal = () => {
    setSecretUnlocked(true);
    setShowFloatingHearts(true);
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSecretUnlocked(false);
      setShowFloatingHearts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins overflow-x-hidden flex flex-col items-center justify-center relative py-20 px-4">
      {/* Floating Hearts */}
      {showFloatingHearts && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: -100,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute text-2xl"
            >
              💕
            </motion.div>
          ))}
        </div>
      )}

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 z-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blush-500 to-lavender-500 bg-clip-text text-transparent">
            A Special Surprise
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          There's something special waiting for you... Click the heart to
          discover it! 💕
        </p>
      </motion.div>

      {/* Heart Button */}
      <motion.button
        onClick={handleReveal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-8xl text-blush-400 drop-shadow-lg z-20 relative"
      >
        💕
      </motion.button>

      {/* Instructional Text */}
      {!secretUnlocked && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-gray-500 text-sm flex items-center justify-center z-20"
        >
          <Heart size={16} className="mr-2" />
          Click the heart above for a special surprise!
        </motion.p>
      )}

      {/* Modal */}
      <AnimatePresence>
        {secretUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleCloseModal}
          >
            <div
              ref={modalRef}
              className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-4xl mb-4"
              >
                💕
              </motion.div>

              <h3 className="text-2xl font-bold text-blush-600 mb-2">
                My Love Letter to You
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed text-left whitespace-pre-line">
                {"My dearest loveliest Vaishali,"}
                {
                  "\n\nYou have no idea the amount of life that you have breathed into each and every moment of my life ever since I met you. I cherish every single moment that I have spent with you."
                }
                {
                  "\n\nYou have been healing every part of me since we've met. I never liked my smile, my hair, my face, my thoughts—but you make me see them so differently. You are the soul that embodies my being, and I truly could not be whole without you."
                }
                {
                  "\n\nIn the grand life that we have planned, 6 months does not seem like a lot—but just this much was enough to make me realize the genuine joy that you bring to my life and the love that we share."
                }
                {
                  "\n\nI care so deeply about you and love every single part of your being. I don't say this enough."
                }
                {
                  "\n\nI LLLOOVVVEEE YOUOUUUU VERRYRYYY MUUCCCHHHHH, YOUU ARE SSSOOO PREECIOUSS MY GOBLIN 🤍✨"
                }
                {"\n\n—"}
                {"\n\n"}
                <span className="text-xs italic text-gray-500">
                  {
                    "Mere dimaag mai subah se pata nahi ek hi gana kyu chal raha hai:\n“Main god mein rakh loon agar sar, too mujko sula degi kya?”"
                  }
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SurpriseReveal;
