'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

const text = "Streamline your workflow.\nShip faster, together.";

export function TypewriterHeading() {
  return (
    <h1 className="text-4xl font-bold leading-tight text-primary-foreground min-h-[96px] whitespace-pre-line">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: i * 0.05,
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="inline-block w-[3px] h-[32px] bg-primary-foreground ml-1 align-middle"
      />
    </h1>
  );
}
