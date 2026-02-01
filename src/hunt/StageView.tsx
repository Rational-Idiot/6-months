import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Sparkles } from "lucide-react";
import type { HuntStage } from "./stages";
import { HUNT_STAGES, getStageIndex } from "./stages";

interface StageViewProps {
  stage: HuntStage;
  completedSlugs?: string[];
}

const StageView: React.FC<StageViewProps> = ({ stage }) => {
  const [showHint, setShowHint] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [noDisintegrated, setNoDisintegrated] = useState(false);

  const currentStageIndex = getStageIndex(stage.slug);

  useEffect(() => {
    if (stage.isFinal) {
      const timer = setTimeout(() => setShowQuestion(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage.isFinal]);

  const handleAnswer = (answer: boolean) => {
    setAnswered(true);
    if (answer) {
      setTimeout(() => { }, 500);
    }
  };

  const FloatingHeart = ({ delay }: { delay: number }) => (
    <motion.div
      className="absolute text-pink-400"
      initial={{ y: "100vh", x: Math.random() * window.innerWidth, opacity: 0 }}
      animate={{
        y: "-20vh",
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Heart className="w-6 h-6 fill-pink-400" />
    </motion.div>
  );

  if (stage.isFinal) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins px-6 py-16">
        {/* Floating hearts background */}
        {!answered &&
          Array.from({ length: 15 }).map((_, i) => (
            <FloatingHeart key={i} delay={i * 0.4} />
          ))}

        <div className="absolute top-8 left-0 right-0 flex justify-center gap-3 z-10">
          {HUNT_STAGES.map((s, i) => {
            const isCompleted = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;

            if (isCurrent) {
              return (
                <motion.div
                  key={s.slug}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-6 h-6 text-blush-400 fill-blush-400" />
                </motion.div>
              );
            } else if (isCompleted) {
              return (
                <Heart
                  key={s.slug}
                  className="w-6 h-6 text-blush-400 fill-blush-400"
                />
              );
            } else {
              return (
                <Heart
                  key={s.slug}
                  className="w-6 h-6 text-gray-400 fill-gray-300/50"
                />
              );
            }
          })}
        </div>

        <motion.div
          className="relative z-10 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex justify-center mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-12 h-12 text-blush-400" />
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            YOU DID ITTT !!!!
          </motion.h1>

          <motion.p
            className="text-base text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Every clue led you here. Every step brought us closer. Now there's
            just one question left...
          </motion.p>

          <AnimatePresence>
            {showQuestion && !answered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blush-200"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-blush-500 mb-3">
                    Will you be my Valentine?
                  </h2>
                  <Heart className="w-10 h-10 mx-auto mt-3 text-blush-400 fill-blush-400" />
                </motion.div>

                <div className="flex flex-col gap-3 px-4 relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(true)}
                    className="bg-blush-400 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:bg-blush-500 transition-colors w-full"
                  >
                    Yes! 💕
                  </motion.button>

                  <div className="relative h-14">
                    <AnimatePresence>
                      {!noDisintegrated && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setNoDisintegrated(true)}
                          exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 180,
                            transition: { duration: 0.6 },
                          }}
                          className="absolute inset-0 bg-gray-400 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:bg-gray-500 transition-colors w-full"
                        >
                          No 💔
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {noDisintegrated && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.5, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            bounce: 0.5,
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(true)}
                          className="absolute inset-0 bg-lavender-400 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:bg-lavender-500 transition-colors w-full"
                        >
                          Of course! 💖
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <h2 className="text-4xl sm:text-5xl font-bold text-blush-500 mb-4">
                    🎉 YYUIIIIIPPPIIIEEEEE! 🎉
                  </h2>
                </motion.div>

                <motion.p
                  className="text-xl text-gray-700 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Dai dai daii daii daiissukkkiiiiii 💞
                </motion.p>

                <motion.div
                  className="fixed bottom-8 left-0 right-0 flex justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <Heart className="w-8 h-8 text-blush-400 fill-blush-400" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins px-6 py-16 sm:py-20">
      <div className="flex justify-center gap-4 mb-10">
        {HUNT_STAGES.map((s, i) => {
          const isCompleted = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;

          if (isCurrent) {
            return (
              <motion.div
                key={s.slug}
                animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-7 h-7 text-blush-400 fill-blush-300/60" />
              </motion.div>
            );
          } else if (isCompleted) {
            return (
              <Heart
                key={s.slug}
                className="w-7 h-7 text-blush-400 fill-blush-400"
              />
            );
          } else {
            return (
              <Heart
                key={s.slug}
                className="w-7 h-7 text-gray-400 fill-gray-300/50"
              />
            );
          }
        })}
      </div>

      <motion.div
        className="max-w-lg w-full text-center flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4 tracking-tight">
          {stage.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          {stage.description}
        </p>
        {stage.nextHint && (
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="text-sm text-lavender-600/90 hover:text-lavender-700 flex flex-col items-center gap-1 transition-colors"
          >
            <MapPin className="w-4 h-4 flex-shrink-0 mb-1" />
            {showHint ? stage.nextHint : "Hint for next clue"}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default StageView;
