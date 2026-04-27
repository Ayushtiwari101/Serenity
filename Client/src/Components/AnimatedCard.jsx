import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.2, 0.6, 0.2, 1] 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 } 
      }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
