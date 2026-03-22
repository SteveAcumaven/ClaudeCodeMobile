import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfettiExplosion from 'react-confetti-explosion';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const reactions = {
  perfect: { emoji: '🏆', title: 'PERFECT SCORE!', subtitle: 'You know {name} better than anyone!' },
  great: { emoji: '🌟', title: 'Amazing!', subtitle: 'You really know {name} well!' },
  good: { emoji: '😊', title: 'Not Bad!', subtitle: "You know {name} pretty well!" },
  ok: { emoji: '🤔', title: 'Could Be Better...', subtitle: "Time to catch up with {name}!" },
  bad: { emoji: '😬', title: 'Oof...', subtitle: "Do you even know {name}?! 😂" },
};

function getReaction(score, total) {
  const pct = score / total;
  if (pct === 1) return reactions.perfect;
  if (pct >= 0.75) return reactions.great;
  if (pct >= 0.5) return reactions.good;
  if (pct >= 0.25) return reactions.ok;
  return reactions.bad;
}

export default function QuizPlayer({ quiz, onBack }) {
  const [playerName, setPlayerName] = useState('');
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const shuffledOptions = useMemo(() => {
    return quiz.questions.map((q) =>
      shuffleArray([q.correctAnswer, ...q.wrongAnswers])
    );
  }, [quiz]);

  const currentQuestion = quiz.questions[currentIndex];
  const currentOptions = shuffledOptions[currentIndex];

  const handleAnswer = useCallback((answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;

    setTimeout(() => {
      setAnswers((prev) => [...prev, { answer, isCorrect }]);
      setShowResult(true);
    }, 600);
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= quiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIndex, quiz.questions.length]);

  const score = answers.filter((a) => a.isCorrect).length;

  if (!started) {
    return (
      <motion.div
        className="player-screen intro-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="quiz-intro">
          <span className="intro-emoji">🎯</span>
          <h2>
            {quiz.creator}'s Quiz
          </h2>
          <p className="subtitle">
            Think you know <strong>{quiz.creator}</strong>? Let's find out!
          </p>
          <p className="question-count">{quiz.questions.length} questions</p>
        </div>

        <input
          className="input-name"
          type="text"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={30}
          autoFocus
        />

        <motion.button
          className="btn btn-primary btn-large"
          disabled={!playerName.trim()}
          onClick={() => setStarted(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Quiz →
        </motion.button>
      </motion.div>
    );
  }

  if (finished) {
    const reaction = getReaction(score, quiz.questions.length);
    const pct = Math.round((score / quiz.questions.length) * 100);

    return (
      <motion.div
        className="player-screen results-screen"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {pct >= 75 && (
          <ReactConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={150}
            width={1600}
          />
        )}

        <span className="result-emoji">{reaction.emoji}</span>
        <h2>{reaction.title}</h2>
        <p className="subtitle">
          {reaction.subtitle.replace('{name}', quiz.creator)}
        </p>

        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{quiz.questions.length}</span>
          </div>
          <span className="score-pct">{pct}%</span>
        </div>

        <div className="results-breakdown">
          <h3>Your Answers</h3>
          {quiz.questions.map((q, i) => (
            <div key={i} className={`result-row ${answers[i]?.isCorrect ? 'correct' : 'wrong'}`}>
              <span className="result-icon">{answers[i]?.isCorrect ? '✅' : '❌'}</span>
              <div className="result-detail">
                <span className="result-question">{q.text}</span>
                {!answers[i]?.isCorrect && (
                  <span className="result-correct-answer">
                    Answer: {q.correctAnswer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <motion.button
            className="btn btn-primary"
            onClick={() => {
              setFinished(false);
              setStarted(false);
              setCurrentIndex(0);
              setAnswers([]);
              setSelectedAnswer(null);
              setShowResult(false);
              setPlayerName('');
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Play Again
          </motion.button>
          <motion.button
            className="btn btn-ghost"
            onClick={onBack}
            whileTap={{ scale: 0.97 }}
          >
            Create My Own Quiz
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="player-screen game-screen">
      <div className="game-header">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${((currentIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="game-meta">
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span className="score-inline">{score} ✓</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={`q-${currentIndex}`}
            className="question-area"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <h3 className="question-text">{currentQuestion.text}</h3>

            <div className="options-grid">
              {currentOptions.map((option, i) => {
                let className = 'option-btn';
                if (selectedAnswer !== null) {
                  if (option === currentQuestion.correctAnswer) className += ' correct';
                  else if (option === selectedAnswer) className += ' wrong';
                  else className += ' dimmed';
                }

                return (
                  <motion.button
                    key={i}
                    className={className}
                    onClick={() => handleAnswer(option)}
                    whileHover={selectedAnswer === null ? { scale: 1.03 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`r-${currentIndex}`}
            className="feedback-area"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="feedback-emoji">
              {answers[currentIndex]?.isCorrect ? '🎉' : '😅'}
            </span>
            <h3>
              {answers[currentIndex]?.isCorrect ? 'Correct!' : 'Not quite!'}
            </h3>
            {!answers[currentIndex]?.isCorrect && (
              <p className="correct-was">
                The answer was: <strong>{currentQuestion.correctAnswer}</strong>
              </p>
            )}
            <motion.button
              className="btn btn-primary"
              onClick={nextQuestion}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {currentIndex + 1 >= quiz.questions.length ? 'See Results' : 'Next Question →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
