import { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import QuizCreator from './components/QuizCreator';
import QuizPlayer from './components/QuizPlayer';
import HowToPlay from './components/HowToPlay';
import { decodeQuiz } from './utils/codec';

function getQuizFromUrl() {
  const hash = window.location.hash;
  const match = hash.match(/quiz=([A-Za-z0-9_-]+)/);
  if (match) {
    return decodeQuiz(match[1]);
  }
  return null;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [incomingQuiz, setIncomingQuiz] = useState(null);

  useEffect(() => {
    const quiz = getQuizFromUrl();
    if (quiz && quiz.questions?.length) {
      setIncomingQuiz(quiz);
      setScreen('play');
    }

    const handleHash = () => {
      const quiz = getQuizFromUrl();
      if (quiz && quiz.questions?.length) {
        setIncomingQuiz(quiz);
        setScreen('play');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const goHome = () => {
    window.location.hash = '';
    setScreen('home');
    setIncomingQuiz(null);
  };

  return (
    <div className="app-container">
      {screen === 'home' && (
        <HomeScreen
          onCreateQuiz={() => setScreen('create')}
          onHowToPlay={() => setScreen('howto')}
        />
      )}
      {screen === 'create' && (
        <QuizCreator onBack={goHome} />
      )}
      {screen === 'play' && incomingQuiz && (
        <QuizPlayer quiz={incomingQuiz} onBack={goHome} />
      )}
      {screen === 'howto' && (
        <HowToPlay
          onBack={goHome}
          onStart={() => setScreen('create')}
        />
      )}
    </div>
  );
}
