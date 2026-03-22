import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home({ onStart, compareMode, otherName }) {
  const [name, setName] = useState('');

  return (
    <motion.div
      className="screen home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="home-hero">
        <span className="big-emoji">🔥</span>
        <h1>Family<br />Hot Takes</h1>
        <p className="tagline">
          {compareMode
            ? <><strong>{otherName}</strong> challenged you! Answer the same questions and see how you match up.</>
            : <>Tap your way through spicy "this or that" questions, then compare with family!</>
          }
        </p>
      </div>

      <div className="home-form">
        <input
          type="text"
          className="name-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim())}
        />
        <motion.button
          className="btn-go"
          disabled={!name.trim()}
          onClick={() => onStart(name.trim())}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {compareMode ? "Let's go!" : "Play →"}
        </motion.button>
      </div>
    </motion.div>
  );
}
