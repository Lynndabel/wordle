import React, { useState } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const DAILY_WORD = 'CRANE'; // Placeholder, replace with daily logic

export default function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    if (currentGuess === DAILY_WORD) {
      setStatus('won');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost');
    }
  };

  return (
    <div className="wordle-game">
      <h2>Wordle Game</h2>
      <div>
        {guesses.map((guess, idx) => (
          <div key={idx}>{guess}</div>
        ))}
      </div>
      {status === 'playing' && (
        <div>
          <input
            maxLength={WORD_LENGTH}
            value={currentGuess}
            onChange={handleInput}
            disabled={status !== 'playing'}
          />
          <button onClick={handleGuess} disabled={currentGuess.length !== WORD_LENGTH}>
            Guess
          </button>
        </div>
      )}
      {status === 'won' && <div>🎉 You won!</div>}
      {status === 'lost' && <div>Game over! The word was {DAILY_WORD}.</div>}
    </div>
  );
}
