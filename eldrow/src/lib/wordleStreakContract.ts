import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x1bb2101D0eF3C81a892457C55C123A09602855A0";
export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{"indexed": true, "internalType": "address", "name": "player", "type": "address"},
			{"indexed": false, "internalType": "uint256", "name": "day", "type": "uint256"}
		],
		"name": "DailyWin",
		"type": "event"
	},
	{
		"inputs": [
			{"internalType": "bool", "name": "isCorrect", "type": "bool"}
		],
		"name": "guessToday",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{"indexed": true, "internalType": "address", "name": "player", "type": "address"},
			{"indexed": false, "internalType": "uint256", "name": "current", "type": "uint256"},
			{"indexed": false, "internalType": "uint256", "name": "max", "type": "uint256"}
		],
		"name": "StreakUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "", "type": "address"},
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"name": "dailyGuesses",
		"outputs": [
			{"internalType": "uint8", "name": "", "type": "uint8"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "", "type": "address"},
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"name": "dailyWin",
		"outputs": [
			{"internalType": "bool", "name": "", "type": "bool"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "player", "type": "address"}
		],
		"name": "getStreak",
		"outputs": [
			{"internalType": "uint256", "name": "current", "type": "uint256"},
			{"internalType": "uint256", "name": "max", "type": "uint256"},
			{"internalType": "uint256", "name": "lastPlayed", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "player", "type": "address"}
		],
		"name": "guessesLeft",
		"outputs": [
			{"internalType": "uint8", "name": "", "type": "uint8"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "player", "type": "address"}
		],
		"name": "hasWonToday",
		"outputs": [
			{"internalType": "bool", "name": "", "type": "bool"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "address", "name": "", "type": "address"}
		],
		"name": "streaks",
		"outputs": [
			{"internalType": "uint256", "name": "current", "type": "uint256"},
			{"internalType": "uint256", "name": "max", "type": "uint256"},
			{"internalType": "uint256", "name": "lastPlayed", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export function getWordleStreakContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}
