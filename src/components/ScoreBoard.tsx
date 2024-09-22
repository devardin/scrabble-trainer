import React, { useEffect, useState } from 'react';

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highscore');
    if (storedHighScore) {
      setHighScore(Number(storedHighScore));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div>
      <h2>Score: {score}</h2>
      <h2>High Score: {highScore}</h2>
    </div>
  );
};

export default ScoreBoard;
