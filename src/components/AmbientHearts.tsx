import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AmbientHearts: React.FC = () => {
  const heartStyles = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      left: `${(i * 15 + 10) % 100}%`,
      top: `${(i * 20 + 15) % 100}%`,
      fontSize: `${Math.random() * 20 + 20}px`,
      zIndex: 10,
    }));
  }, []);

  return (
    <>
      {heartStyles.map((style, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute text-blush-200 opacity-20 pointer-events-none"
          style={style}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          💕
        </motion.div>
      ))}
    </>
  );
};

export default AmbientHearts;
