import { motion } from 'framer-motion';

const steps = [
  {
    emoji: '✍️',
    title: 'Create Your Quiz',
    desc: 'Write fun questions about yourself with multiple-choice answers. Use our templates or get creative!',
  },
  {
    emoji: '🔗',
    title: 'Share the Link',
    desc: "Get a magic link that has your entire quiz baked in. No accounts, no sign-ups — just share it!",
  },
  {
    emoji: '🎮',
    title: 'Family Plays',
    desc: "Everyone takes your quiz on their own time. No need to be online together!",
  },
  {
    emoji: '🏆',
    title: 'See Who Wins',
    desc: "Each player sees their score and how well they really know you. Bragging rights included!",
  },
];

export default function HowToPlay({ onBack, onStart }) {
  return (
    <motion.div
      className="howto-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button className="btn-back" onClick={onBack}>← Back</button>
      <h2>How It Works</h2>

      <div className="howto-steps">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="howto-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
          >
            <span className="howto-emoji">{step.emoji}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="howto-note">
        <strong>The secret sauce?</strong> Your quiz lives inside the link itself —
        no servers, no data collection, totally private. Just family fun! 🎯
      </div>

      <motion.button
        className="btn btn-primary btn-large"
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Create My Quiz →
      </motion.button>
    </motion.div>
  );
}
