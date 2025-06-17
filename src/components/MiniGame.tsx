import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Heart, Sparkles } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MiniGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const cardEmojis = ['💕', '💖', '💗', '💝', '💘', '💞'];

  const initializeGame = () => {
    const gameCards = [...cardEmojis, ...cardEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setGameWon(false);
    setMoves(0);
    setShowConfetti(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === cardEmojis.length) {
      setGameWon(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [matches]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => {
        const [first, second] = flippedCards;
        const firstCard = cards.find(card => card.id === first);
        const secondCard = cards.find(card => card.id === second);

        if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
        } else {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
        setMoves(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-coral-50 to-sunny-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-coral-500 to-sunny-500 bg-clip-text text-transparent">
              Memory Game
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Match the hearts to unlock a sweet surprise! 
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Game Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex justify-between items-center text-center">
              <div>
                <div className="text-2xl font-bold text-coral-600">{moves}</div>
                <div className="text-sm text-gray-600">Moves</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sunny-600">{matches}</div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                className="bg-gradient-to-r from-coral-500 to-sunny-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Reset
              </motion.button>
            </div>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-2xl shadow-lg cursor-pointer
                  ${card.isMatched ? 'bg-gradient-to-br from-mint-200 to-mint-300' : 'bg-white'}
                  ${card.isFlipped || card.isMatched ? '' : 'hover:shadow-xl'}
                `}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  <AnimatePresence mode="wait">
                    {card.isFlipped || card.isMatched ? (
                      <motion.span
                        key="emoji"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                        className={card.isMatched ? 'animate-pulse' : ''}
                      >
                        {card.emoji}
                      </motion.span>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 bg-gradient-to-br from-blush-300 to-lavender-300 rounded-full flex items-center justify-center"
                      >
                        <Heart size={24} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Win Message */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-gradient-to-r from-mint-400 to-sunny-400 text-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold mb-2">You Did It!</h3>
                <p className="text-lg mb-4">
                  Completed in {moves} moves! If it was more than 8 moves then you have +5 fouls, don't worry I will know automatically 💕
                </p>
                <div className="flex justify-center items-center">
                  <Trophy className="mr-2" size={24} />
                  <span className="font-semibold">Perfect Match, Just Like Us!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    y: -100,
                    x: Math.random() * window.innerWidth,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: 0,
                    y: window.innerHeight + 100,
                    rotate: 360,
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    ease: "easeOut",
                  }}
                  className="absolute text-2xl"
                >
                  {['💕', '💖', '💗', '✨', '🎉'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MiniGame;