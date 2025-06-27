import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AmbientBackground.css';

const AmbientBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="ambient-glow"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: 'tween',
        ease: 'backOut',
        duration: 0.5,
      }}
    />
  );
};

export default AmbientBackground;
