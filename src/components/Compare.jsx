import { motion } from 'framer-motion';
import ReactConfettiExplosion from 'react-confetti-explosion';
import { getCompatibility } from '../utils/codec';

const vibes = [
  { min: 90, emoji: '👯', label: 'Basically twins', color: '#10b981' },
  { min: 70, emoji: '🤝', label: 'Great minds think alike', color: '#6c3ce0' },
  { min: 50, emoji: '😏', label: 'Agree to disagree', color: '#f59e0b' },
  { min: 30, emoji: '🌶️', label: 'Spicy differences', color: '#ef4444' },
  { min: 0,  emoji: '💥', label: 'Total opposites!', color: '#dc2626' },
];

function getVibe(pct) {
  return vibes.find((v) => pct >= v.min);
}

export default function Compare({ myName, myAnswers, otherName, otherAnswers, questions, onHome }) {
  const compat = getCompatibility(myAnswers, otherAnswers);
  const vibe = getVibe(compat.pct);

  return (
    <motion.div
      className="screen compare"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {compat.pct >= 70 && (
        <ReactConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1200} />
      )}

      <span className="big-emoji">{vibe.emoji}</span>
      <h2>{myName} & {otherName}</h2>

      <div className="compat-score" style={{ '--vibe-color': vibe.color }}>
        <span className="compat-pct">{compat.pct}%</span>
        <span className="compat-label">{vibe.label}</span>
      </div>

      <div className="compare-list">
        {compat.details.map(({ id, same }) => {
          const q = questions.find((qu) => qu.id === id);
          if (!q) return null;
          return (
            <motion.div
              key={id}
              className={`compare-row ${same ? 'match' : 'diff'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: compat.details.indexOf(compat.details.find(d => d.id === id)) * 0.06 }}
            >
              <div className="compare-q">{q.prompt}</div>
              <div className="compare-answers">
                <span className="compare-ans mine">
                  {myAnswers[id] === 'A' ? q.optionA : q.optionB}
                </span>
                {!same && (
                  <span className="compare-ans theirs">
                    {otherAnswers[id] === 'A' ? q.optionA : q.optionB}
                  </span>
                )}
                {same && <span className="match-badge">Match!</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="score-summary">
        You agreed on {compat.score} out of {compat.total} questions
      </p>

      <motion.button
        className="btn-go"
        onClick={onHome}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
}
