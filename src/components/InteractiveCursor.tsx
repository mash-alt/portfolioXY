import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './InteractiveCursor.css';

const InteractiveCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setCursorVariant('hover');
    const handleMouseLeave = () => setCursorVariant('default');

    const interactiveElements = document.querySelectorAll(
      'a, button, .image-card'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: '#ff6b6b',
      mixBlendMode: 'difference'
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference'
    },
  };

  return (
    <motion.div
      className='custom-cursor'
      variants={variants}
      animate={cursorVariant}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  );
};

export default InteractiveCursor;
