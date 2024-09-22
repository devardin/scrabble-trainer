import React, { useEffect, useState } from 'react';

interface GameTimerProps {
  onTimeUp: () => void;
  timeLimit: number;
}

const GameTimer: React.FC<GameTimerProps> = ({ onTimeUp, timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return <h1>Time Left: {timeLeft}s</h1>;
};

export default GameTimer;
