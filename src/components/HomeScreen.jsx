import { motion } from 'framer-motion';

const floatingEmojis = ['🎯', '🧠', '💡', '🎉', '❤️', '😂', '🏆', '⭐'];

export default function HomeScreen({ onCreateQuiz, onHowToPlay }) {
  return (
    <div className="home-screen">
      <div className="floating-emojis" aria-hidden>
        {floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="floating-emoji"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-20, -80 - i * 15],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 8)],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              fontSize: '1.6rem',
              left: `${12 + i * 10}%`,
              top: '60%',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="app-title">
          <span className="title-emoji">🎯</span>
          <span>How Well Do You</span>
          <span className="title-highlight">Know Me?</span>
        </h1>

        <p className="app-subtitle">
          Create a quiz about yourself, share the link, and find out who
          <em> really </em> knows you best!
        </p>

        <div className="home-actions">
          <motion.button
            className="btn btn-primary btn-large"
            onClick={onCreateQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create My Quiz
          </motion.button>

          <motion.button
            className="btn btn-ghost"
            onClick={onHowToPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            How It Works
          </motion.button>
        </div>

        <div className="home-steps">
          <div className="step">
            <span className="step-number">1</span>
            <span>Create questions about yourself</span>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <span className="step-number">2</span>
            <span>Share the link with family</span>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <span className="step-number">3</span>
            <span>See who knows you best!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
