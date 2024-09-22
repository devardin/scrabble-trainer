import React, { useState, useEffect } from 'react';
import './App.css';
import { scrabbleWords } from './utils/scrabbleWords';

const getRandomVowel = () => {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  return vowels[Math.floor(Math.random() * vowels.length)];
};

const getRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateTwoLetterWord = () => {
  const randomVowel = getRandomVowel();
  const randomLetter = getRandomLetter();
  const letters = shuffleArray([randomVowel, randomLetter]);
  return letters.join('');
};

const generateThreeLetterWord = () => {
  const randomVowel = getRandomVowel();
  const randomLetter1 = getRandomLetter();
  const randomLetter2 = getRandomLetter();
  const letters = shuffleArray([randomVowel, randomLetter1, randomLetter2]);
  return letters.join('');
};

const useScrabbleGame = (wordLength: 2 | 3) => {
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScore')) || 0);
  const [timer, setTimer] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    if (isGameActive && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsGameActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('highScore', String(score));
      }
    }
  }, [isGameActive, timer, score, highScore]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimer(60);
    setCurrentWord(wordLength === 2 ? generateTwoLetterWord() : generateThreeLetterWord());
  };

  const handleAnswer = (isYes: boolean, handleFlash: (result: 'correct' | 'incorrect') => void) => {
    if (!isGameActive) return;

    const isValidWord = scrabbleWords.has(currentWord);

    if (isYes === isValidWord) {
      setScore((s) => s + 1);
      handleFlash('correct'); // Flash green
    } else {
      setScore((s) => s - 1);
      handleFlash('incorrect'); // Flash red
    }

    setCurrentWord(wordLength === 2 ? generateTwoLetterWord() : generateThreeLetterWord());
  };

  return {
    currentWord,
    score,
    highScore,
    timer,
    isGameActive,
    startGame,
    handleAnswer,
  };
};

const GamePage = ({ wordLength, handleFlash }: { wordLength: 2 | 3; handleFlash: (result: 'correct' | 'incorrect') => void; }) => {
  const { currentWord, score, highScore, timer, isGameActive, startGame, handleAnswer } = useScrabbleGame(wordLength);

  return (
    <div className="game-page">
      <h1>{wordLength}-Letter Scrabble Game</h1>
      <div>
        <h2>Word: {currentWord}</h2>
        <h3>Score: {score}</h3>
        <h3>High Score: {highScore}</h3>
        <h3>Time Left: {timer}</h3>
      </div>
      {!isGameActive ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div>
          <p>Is this a valid Scrabble word?</p>
          <div className="button-group">
            <button onClick={() => handleAnswer(true, handleFlash)}>Yes</button>
            <button onClick={() => handleAnswer(false, handleFlash)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [flashClass, setFlashClass] = useState('');
  const [page, setPage] = useState<'home' | 'twoLetter' | 'threeLetter'>('home');

  const handleFlash = (result: 'correct' | 'incorrect') => {
    setFlashClass(result);
    setTimeout(() => setFlashClass(''), 300); // Reset flash after 300ms
  };

  return (
    <div className="App">
      <div className={`flash ${flashClass}`}></div> {/* Flash effect div */}
      {page === 'home' && (
        <div className="home-page">
          <h1>Scrabble Trainer</h1>
          <h2>Welcome to the Scrabble Trainer!</h2>
          <button onClick={() => setPage('twoLetter')}>2-Letter Words</button>
          <button onClick={() => setPage('threeLetter')}>3-Letter Words</button>
        </div>
      )}
      {page === 'twoLetter' && <GamePage wordLength={2} handleFlash={handleFlash} />}
      {page === 'threeLetter' && <GamePage wordLength={3} handleFlash={handleFlash} />}
    </div>
  );
};

export default App;
