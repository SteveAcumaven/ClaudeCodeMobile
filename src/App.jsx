import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import Play from './components/Play';
import Results from './components/Results';
import Compare from './components/Compare';
import { decodeResults } from './utils/codec';

function parseHash() {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('r=')) return { mode: 'compare', data: hash.slice(2) };
  return null;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [myName, setMyName] = useState('');
  const [myAnswers, setMyAnswers] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [compareData, setCompareData] = useState(null);

  useEffect(() => {
    const parsed = parseHash();
    if (parsed?.mode === 'compare') {
      const other = decodeResults(parsed.data);
      if (other) {
        setCompareData(other);
        setScreen('compare');
      }
    }
    const onHash = () => {
      const parsed = parseHash();
      if (parsed?.mode === 'compare') {
        const other = decodeResults(parsed.data);
        if (other) {
          setCompareData(other);
          setScreen('compare');
        }
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleStart = (name) => {
    setMyName(name);
    setScreen('play');
  };

  const handleFinish = (answers, questions) => {
    setMyAnswers(answers);
    setQuestionSet(questions);
    setScreen('results');
  };

  const handleCompareStart = (name) => {
    setMyName(name);
    setScreen('compare-play');
  };

  const handleCompareFinish = (answers, questions) => {
    setMyAnswers(answers);
    setQuestionSet(questions);
    setScreen('compare-results');
  };

  const goHome = () => {
    window.location.hash = '';
    setScreen('home');
    setMyAnswers(null);
    setQuestionSet(null);
    setCompareData(null);
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <Home key="home" onStart={handleStart} />
        )}
        {screen === 'play' && (
          <Play key="play" name={myName} onFinish={handleFinish} />
        )}
        {screen === 'results' && (
          <Results
            key="results"
            name={myName}
            answers={myAnswers}
            questions={questionSet}
            onHome={goHome}
          />
        )}
        {screen === 'compare' && compareData && (
          <Home
            key="compare-home"
            compareMode
            otherName={compareData.name}
            onStart={handleCompareStart}
          />
        )}
        {screen === 'compare-play' && compareData && (
          <Play
            key="compare-play"
            name={myName}
            fixedQuestionIds={Object.keys(compareData.answers).map(Number)}
            onFinish={handleCompareFinish}
          />
        )}
        {screen === 'compare-results' && compareData && (
          <Compare
            key="compare-results"
            myName={myName}
            myAnswers={myAnswers}
            otherName={compareData.name}
            otherAnswers={compareData.answers}
            questions={questionSet}
            onHome={goHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
