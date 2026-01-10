import React, { useState } from 'react';

import { getDailyWord } from "../lib/dailyWord";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const DAILY_WORD = getDailyWord();

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

import { getWordleStreakContract } from "../lib/wordleStreakContract";
import { useWallet } from "../lib/WalletContext";
import { useMiniApp } from "@neynar/react";

export default function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const { context } = useMiniApp();
  const { wallet, account, connectWallet, isConnecting, error } = useWallet();
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [streak, setStreak] = useState<{current: number, max: number, lastPlayed: number} | null>(null);
  const [txStatus, setTxStatus] = useState<string>('');


  React.useEffect(() => {
    if (wallet && account) {
      const contract = getWordleStreakContract(wallet);
      contract.getStreak(account).then(([current, max, lastPlayed]: any) => {
        setStreak({ current: Number(current), max: Number(max), lastPlayed: Number(lastPlayed) });
      });
    }
  }, [wallet, account]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    if (currentGuess === DAILY_WORD) {
      setStatus('won');
      // On win, call contract
      if (wallet && account) {
        const signer = await wallet.getSigner();
        const contract = getWordleStreakContract(signer);
        setTxStatus('Submitting streak...');
        try {
          const tx = await contract.guessToday(true);
          await tx.wait();
          setTxStatus('Streak updated!');
        } catch (e) {
          setTxStatus('Error submitting streak');
          console.error(e);
        }
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost');
      // On loss, call contract with false
      if (wallet && account) {
        const signer = await wallet.getSigner();
        const contract = getWordleStreakContract(signer);
        setTxStatus('Submitting play...');
        try {
          const tx = await contract.guessToday(false);
          await tx.wait();
          setTxStatus('Play submitted!');
        } catch (e) {
          setTxStatus('Error submitting play');
          console.error(e);
        }
      }
    }
  };


  return (
    <div className="wordle-game">
      <h2 className="mb-4 text-xl font-bold">Wordle Game</h2>
      {context?.user && (
        <div className="mb-2 text-sm text-purple-700">
          Farcaster: {context.user.displayName || context.user.username} (FID: {context.user.fid})
        </div>
      )}
      {account ? (
        <div className="mb-2 text-sm text-green-700">Connected: {account}</div>
      ) : (
        <button onClick={connectWallet} disabled={isConnecting} className="mb-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">
          {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        </button>
      )}
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      {streak && (
        <div className="mb-2 text-sm">Streak: {streak.current} | Max: {streak.max}</div>
      )}
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
      {account && status === 'playing' && (
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
      {(status === 'won' || status === 'lost') && (
        <button
          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded"
          onClick={async () => {
            const castActions = (context as any)?.actions;
            if (castActions?.cast) {
              const resultMsg = status === 'won'
                ? `I solved today's Wordle! My streak: ${streak?.current || 1}`
                : `Tried today's Wordle. The word was ${DAILY_WORD}. Try to beat my streak!`;
              await castActions.cast({ text: resultMsg });
            } else if ((globalThis.window as any)?.farcaster) {
              // fallback: try window.farcaster if available
              (globalThis.window as any).farcaster.cast?.({ text: `Wordle result: ${status}` });
            } else {
              alert("Farcaster cast action not available in this context.");
            }
          }}
        >
          Share to Farcaster
        </button>
      )}
      {txStatus && <div className="mt-2 text-sm text-blue-600">{txStatus}</div>}
    </div>
  );
}
