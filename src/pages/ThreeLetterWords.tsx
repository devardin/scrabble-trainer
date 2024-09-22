import React, { useState } from 'react';
import { scrabbleWords } from '../utils/scrabbleWords';
import GameTimer from '../components/GameTimer';
import ScoreBoard from '../components/ScoreBoard';

const vowels = ['A', 'E', 'I', 'O', 'U'];

const getRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const getRandomVowel = () => {
  return vowels[Math.floor(Math.random() * vowels.length)];
};

const ThreeLetterWords: React.FC = () => {
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateWord = () => {
    const vowel = getRandomVowel();
    const randomLetter1 = getRandomLetter();
    const randomLetter2 = getRandomLetter();
    const newWord = [vowel, randomLetter1, randomLetter2].sort(() => Math.random() - 0.5).join('');
    setWord(newWord);
  };

  const handleKeyPress = (key: string) => {
    const isValidWord = scrabbleWords.has(word);
    if ((key === 'y' && isValidWord) || (key === 'n' && !isValidWord)) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
    generateWord();
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleStart = () => {
    setGameOver(false);
    setScore(0);
    generateWord();
  };

  React.useEffect(() => {
    const handleUserKeyPress = (event: KeyboardEvent) => {
      if (!gameOver && (event.key === 'y' || event.key === 'n')) {
        handleKeyPress(event.key);
      }
    };
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [word, gameOver]);

  return (
    <div>
      <h1>3-Letter Word Game</h1>
      {!gameOver ? (
        <>
          <GameTimer onTimeUp={handleGameOver} timeLimit={60} />
          <h2>{word}</h2>
          <p>Press "Y" for Yes, "N" for No</p>
          <ScoreBoard score={score} />
        </>
      ) : (
        <button onClick={handleStart}>Start Game</button>
      )}
    </div>
  );
};

export default ThreeLetterWords;
