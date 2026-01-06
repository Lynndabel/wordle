// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WordleStreak {
    struct Streak {
        uint256 current;
        uint256 max;
        uint256 lastPlayed;
    }

    mapping(address => Streak) public streaks;
    event StreakUpdated(address indexed player, uint256 current, uint256 max);

    function playToday() external {
        uint256 today = block.timestamp / 1 days;
        Streak storage s = streaks[msg.sender];
        require(s.lastPlayed < today, "Already played today");
        if (s.lastPlayed + 1 == today) {
            s.current += 1;
        } else {
            s.current = 1;
        }
        if (s.current > s.max) {
            s.max = s.current;
        }
        s.lastPlayed = today;
        emit StreakUpdated(msg.sender, s.current, s.max);
    }

    function getStreak(address player) external view returns (uint256 current, uint256 max, uint256 lastPlayed) {
        Streak storage s = streaks[player];
        return (s.current, s.max, s.lastPlayed);
    }
}
