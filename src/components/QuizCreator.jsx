import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questionTemplates, categoryEmojis } from '../data/sampleQuestions';
import { encodeQuiz } from '../utils/codec';

const EMPTY_QUESTION = {
  text: '',
  correctAnswer: '',
  wrongAnswers: ['', '', ''],
  category: 'favorites',
};

export default function QuizCreator({ onQuizReady, onBack }) {
  const [creatorName, setCreatorName] = useState('');
  const [questions, setQuestions] = useState([{ ...EMPTY_QUESTION, wrongAnswers: ['', '', ''] }]);
  const [currentStep, setCurrentStep] = useState('name'); // 'name' | 'questions' | 'done'
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateWrongAnswer = (qIndex, aIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const wrongAnswers = [...updated[qIndex].wrongAnswers];
      wrongAnswers[aIndex] = value;
      updated[qIndex] = { ...updated[qIndex], wrongAnswers };
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION, wrongAnswers: ['', '', ''] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const useTemplate = (template, index) => {
    updateQuestion(index, 'text', template.text);
    updateQuestion(index, 'category', template.category);
  };

  const isQuestionValid = (q) =>
    q.text.trim() &&
    q.correctAnswer.trim() &&
    q.wrongAnswers.filter((a) => a.trim()).length >= 1;

  const validQuestions = questions.filter(isQuestionValid);

  const generateQuiz = () => {
    const quiz = {
      creator: creatorName,
      questions: validQuestions.map((q) => ({
        text: q.text,
        correctAnswer: q.correctAnswer,
        wrongAnswers: q.wrongAnswers.filter((a) => a.trim()),
        category: q.category,
      })),
      createdAt: Date.now(),
    };

    const encoded = encodeQuiz(quiz);
    const url = `${window.location.origin}${window.location.pathname}#quiz=${encoded}`;
    setShareUrl(url);
    setCurrentStep('done');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
      const el = document.querySelector('.share-url-text');
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${creatorName}'s "How Well Do You Know Me?" Quiz`,
          text: `Think you know ${creatorName}? Take this quiz and find out! 🎯`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copyLink();
    }
  };

  // Unused templates (not already used in a question)
  const usedTexts = new Set(questions.map((q) => q.text));
  const availableTemplates = questionTemplates.filter((t) => !usedTexts.has(t.text));

  if (currentStep === 'name') {
    return (
      <motion.div
        className="creator-screen"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>First, what's your name?</h2>
        <p className="subtitle">This is so people know whose quiz they're taking!</p>
        <input
          className="input-name"
          type="text"
          placeholder="Your name..."
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          maxLength={30}
          autoFocus
        />
        <motion.button
          className="btn btn-primary"
          disabled={!creatorName.trim()}
          onClick={() => setCurrentStep('questions')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Let's Go! →
        </motion.button>
      </motion.div>
    );
  }

  if (currentStep === 'done') {
    return (
      <motion.div
        className="creator-screen share-screen"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2>Your quiz is ready! 🎉</h2>
        <p className="subtitle">
          Share this link with your family and see who knows you best!
        </p>

        <div className="share-url-box">
          <p className="share-url-text">{shareUrl}</p>
        </div>

        <div className="share-actions">
          <motion.button
            className="btn btn-primary"
            onClick={shareLink}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {navigator.share ? '📤 Share Link' : copied ? '✅ Copied!' : '📋 Copy Link'}
          </motion.button>

          {navigator.share && (
            <motion.button
              className="btn btn-secondary"
              onClick={copyLink}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </motion.button>
          )}
        </div>

        <div className="quiz-stats">
          <span>{validQuestions.length} questions</span>
          <span>·</span>
          <span>by {creatorName}</span>
        </div>

        <motion.button
          className="btn btn-ghost"
          onClick={() => {
            setCurrentStep('name');
            setQuestions([{ ...EMPTY_QUESTION, wrongAnswers: ['', '', ''] }]);
            setCreatorName('');
            setShareUrl('');
          }}
          whileTap={{ scale: 0.97 }}
        >
          Create Another Quiz
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="creator-screen"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <button className="btn-back" onClick={() => setCurrentStep('name')}>← Back</button>
      <h2>{creatorName}'s Quiz</h2>
      <p className="subtitle">
        Write questions about yourself. Add the correct answer and a few wrong ones!
      </p>

      <div className="questions-list">
        <AnimatePresence>
          {questions.map((q, qi) => (
            <motion.div
              key={qi}
              className="question-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <div className="question-header">
                <span className="question-number">Q{qi + 1}</span>
                {questions.length > 1 && (
                  <button className="btn-remove" onClick={() => removeQuestion(qi)}>✕</button>
                )}
              </div>

              <input
                className="input-question"
                placeholder="Type a question about yourself..."
                value={q.text}
                onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
              />

              {availableTemplates.length > 0 && !q.text && (
                <div className="template-suggestions">
                  <span className="template-label">Try:</span>
                  {availableTemplates.slice(0, 3).map((t, ti) => (
                    <button
                      key={ti}
                      className="template-chip"
                      onClick={() => useTemplate(t, qi)}
                    >
                      {categoryEmojis[t.category]} {t.text}
                    </button>
                  ))}
                </div>
              )}

              <div className="answers-section">
                <div className="answer-row correct">
                  <span className="answer-badge">✓</span>
                  <input
                    placeholder="Correct answer"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qi, 'correctAnswer', e.target.value)}
                  />
                </div>
                {q.wrongAnswers.map((a, ai) => (
                  <div key={ai} className="answer-row wrong">
                    <span className="answer-badge">✗</span>
                    <input
                      placeholder={`Wrong answer ${ai + 1}${ai === 0 ? '' : ' (optional)'}`}
                      value={a}
                      onChange={(e) => updateWrongAnswer(qi, ai, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        className="btn btn-dashed"
        onClick={addQuestion}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Add Another Question
      </motion.button>

      <div className="creator-footer">
        <span className="valid-count">
          {validQuestions.length} valid question{validQuestions.length !== 1 ? 's' : ''}
        </span>
        <motion.button
          className="btn btn-primary btn-large"
          disabled={validQuestions.length < 3}
          onClick={generateQuiz}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Generate Quiz Link ✨
        </motion.button>
        {validQuestions.length < 3 && (
          <span className="hint">Need at least 3 complete questions</span>
        )}
      </div>
    </motion.div>
  );
}
