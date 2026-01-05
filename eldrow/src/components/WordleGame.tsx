import React, { useState } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const DAILY_WORD = 'CRANE'; // Placeholder, replace with daily logic

function getFeedback(guess: string, answer: string): Array<'green' | 'yellow' | 'gray'> {
  const feedback: Array<'green' | 'yellow' | 'gray'> = Array(WORD_LENGTH).fill('gray');
  const answerArr = answer.split('');
  const guessArr = guess.split('');
  const used = Array(WORD_LENGTH).fill(false);

  // First pass: green for correct position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === answerArr[i]) {
      feedback[i] = 'green';
      used[i] = true;
    }
  }
  // Second pass: yellow for correct letter, wrong position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (feedback[i] !== 'green') {
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && guessArr[i] === answerArr[j]) {
          feedback[i] = 'yellow';
          used[j] = true;
          break;
        }
      }
    }
  }
  return feedback;
}

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
      <h2 className="mb-4 text-xl font-bold">Wordle Game</h2>
      <div className="space-y-2 mb-4">
        {[...Array(MAX_GUESSES)].map((_, idx) => {
          const guess = guesses[idx] || '';
          const feedback = guess ? getFeedback(guess, DAILY_WORD) : [];
          return (
            <div key={idx} className="flex justify-center space-x-1">
              {[...Array(WORD_LENGTH)].map((_, i) => {
                const char = guess[i] || '';
                const color =
                  feedback[i] === 'green'
                    ? 'bg-green-500 text-white'
                    : feedback[i] === 'yellow'
                    ? 'bg-yellow-400 text-white'
                    : char
                    ? 'bg-gray-400 text-white'
                    : 'bg-gray-200';
                return (
                  <span
                    key={i}
                    className={`inline-block w-10 h-10 text-2xl font-bold text-center align-middle leading-10 rounded ${color}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      {status === 'playing' && (
        <div className="flex justify-center space-x-2 mb-2">
          <input
            maxLength={WORD_LENGTH}
            value={currentGuess}
            onChange={handleInput}
            disabled={status !== 'playing'}
            className="border px-2 py-1 text-lg uppercase text-center w-40"
            placeholder="GUESS"
          />
          <button
            onClick={handleGuess}
            disabled={currentGuess.length !== WORD_LENGTH}
            className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            Guess
          </button>
        </div>
      )}
      {status === 'won' && <div className="text-green-600 font-bold text-lg">🎉 You won!</div>}
      {status === 'lost' && <div className="text-red-600 font-bold text-lg">Game over! The word was {DAILY_WORD}.</div>}
    </div>
  );
}
