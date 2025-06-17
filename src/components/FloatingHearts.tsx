import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import AmbientHearts from './AmbientHearts';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  opacity: number;
}

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '💞', '❤️', '🧡', '💛', '💚', '💙', '💜'];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX - 15);
      y.set(e.clientY - 15);

      if (Math.random() > 0.96) {
        addHeart(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        x.set(touch.clientX - 12);
        y.set(touch.clientY - 12);

        if (Math.random() > 0.94) {
          addHeart(touch.clientX, touch.clientY);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          addHeart(
            e.clientX + (Math.random() - 0.5) * 40,
            e.clientY + (Math.random() - 0.5) * 40
          );
        }, i * 100);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            addHeart(
              touch.clientX + (Math.random() - 0.5) * 30,
              touch.clientY + (Math.random() - 0.5) * 30
            );
          }, i * 150);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addHeart(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addHeart = (x: number, y: number) => {
    const newHeart: Heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 20 + 15,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      opacity: Math.random() * 0.5 + 0.3,
    };

    setHearts(prev => [...prev, newHeart]);

    setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 3000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AmbientHearts />

      <motion.div
        style={{
          x: springX,
          y: springY,
          zIndex: 25,
        }}
        className="absolute w-8 h-8 text-2xl opacity-40"
      >
        💕
      </motion.div>

      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: heart.opacity,
            scale: 0,
          }}
          animate={{
            y: heart.y - 150,
            opacity: 0,
            scale: 1.1,
            rotate: Math.random() * 20 - 10,
          }}
          transition={{
            duration: 3,
            ease: 'easeOut',
          }}
          className="absolute pointer-events-none"
          style={{
            fontSize: `${heart.size}px`,
            zIndex: 20,
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
