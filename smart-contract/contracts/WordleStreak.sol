// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WordleStreak {
    struct Streak {
        uint256 current;
        uint256 max;
        uint256 lastPlayed;
    }

    mapping(address => Streak) public streaks;
    // Track number of guesses per user per day
    mapping(address => mapping(uint256 => uint8)) public dailyGuesses;
    // Track if user has already won today
    mapping(address => mapping(uint256 => bool)) public dailyWin;

    event StreakUpdated(address indexed player, uint256 current, uint256 max);
    event DailyWin(address indexed player, uint256 day);

    function guessToday(bool isCorrect) external {
        uint256 today = block.timestamp / 1 days;
        require(dailyGuesses[msg.sender][today] < 5, "Max guesses reached for today");
        dailyGuesses[msg.sender][today] += 1;
        if (isCorrect && !dailyWin[msg.sender][today]) {
            _recordWin(today);
        }
    }

    function _recordWin(uint256 today) internal {
        Streak storage s = streaks[msg.sender];
        if (s.lastPlayed + 1 == today) {
            s.current += 1;
        } else {
            s.current = 1;
        }
        if (s.current > s.max) {
            s.max = s.current;
        }
        s.lastPlayed = today;
        dailyWin[msg.sender][today] = true;
        emit StreakUpdated(msg.sender, s.current, s.max);
        emit DailyWin(msg.sender, today);
    }

    function getStreak(address player) external view returns (uint256 current, uint256 max, uint256 lastPlayed) {
        Streak storage s = streaks[player];
        return (s.current, s.max, s.lastPlayed);
    }

    function guessesLeft(address player) external view returns (uint8) {
        uint256 today = block.timestamp / 1 days;
        return 5 - dailyGuesses[player][today];
    }

    function hasWonToday(address player) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return dailyWin[player][today];
    }
}

