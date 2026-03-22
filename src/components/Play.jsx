import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions as allQuestions, pickQuestions } from '../data/questions';

export default function Play({ name, onFinish, fixedQuestionIds }) {
  const questionSet = useMemo(() => {
    if (fixedQuestionIds) {
      return fixedQuestionIds.map((id) => allQuestions.find((q) => q.id === id)).filter(Boolean);
    }
    return pickQuestions(10);
  }, [fixedQuestionIds]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(0);

  const current = questionSet[index];
  const progress = ((index) / questionSet.length) * 100;

  const pick = useCallback((choice) => {
    setAnswers((prev) => ({ ...prev, [current.id]: choice }));
    setDirection(choice === 'A' ? -1 : 1);

    setTimeout(() => {
      if (index + 1 >= questionSet.length) {
        const finalAnswers = { ...answers, [current.id]: choice };
        onFinish(finalAnswers, questionSet);
      } else {
        setIndex((i) => i + 1);
      }
    }, 300);
  }, [current, index, questionSet, answers, onFinish]);

  return (
    <motion.div
      className="screen play"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="play-header">
        <span className="play-count">{index + 1} / {questionSet.length}</span>
        <div className="progress-track">
          <motion.div
            className="progress-bar"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      <div className="play-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="question-card"
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="prompt">{current.prompt}</h2>

            <div className="choices">
              <motion.button
                className="choice choice-a"
                onClick={() => pick('A')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                {current.optionA}
              </motion.button>

              <span className="vs">or</span>

              <motion.button
                className="choice choice-b"
                onClick={() => pick('B')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                {current.optionB}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
