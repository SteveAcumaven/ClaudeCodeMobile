import { useState } from 'react';
import { motion } from 'framer-motion';
import { encodeResults } from '../utils/codec';

export default function Results({ name, answers, questions, onHome }) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeResults(name, answers);
  const shareUrl = `${window.location.origin}${window.location.pathname}#r=${encoded}`;

  const shareText = `🔥 I just played Family Hot Takes! Think we agree? Take the challenge → `;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Hot Takes`,
          text: shareText,
          url: shareUrl,
        });
      } catch { /* cancelled */ }
    } else {
      await copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <motion.div
      className="screen results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="big-emoji">🎉</span>
      <h2>Nice one, {name}!</h2>
      <p className="tagline">Here are your hot takes:</p>

      <div className="takes-list">
        {questions.map((q) => (
          <div key={q.id} className="take-row">
            <span className="take-q">{q.prompt}</span>
            <span className="take-a">{answers[q.id] === 'A' ? q.optionA : q.optionB}</span>
          </div>
        ))}
      </div>

      <div className="share-section">
        <p className="share-prompt">Challenge your family — see if they agree!</p>
        <motion.button
          className="btn-go"
          onClick={handleShare}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {navigator.share ? '📤 Share Challenge' : copied ? '✅ Copied!' : '📋 Copy Link'}
        </motion.button>
        {navigator.share && (
          <button className="btn-text" onClick={copyLink}>
            {copied ? '✅ Copied!' : 'Or copy link'}
          </button>
        )}
      </div>

      <button className="btn-text" onClick={onHome}>Play again</button>
    </motion.div>
  );
}
