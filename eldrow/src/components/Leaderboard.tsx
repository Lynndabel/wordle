import React from "react";

// Placeholder leaderboard data; replace with API/onchain indexer fetch
const mockLeaderboard = [
  { fid: 123, username: "alice", streak: 7 },
  { fid: 456, username: "bob", streak: 5 },
  { fid: 789, username: "carol", streak: 3 },
];

export default function Leaderboard() {
  return (
    <div className="my-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pr-4">User</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {mockLeaderboard.map((entry) => (
            <tr key={entry.fid}>
              <td className="pr-4">{entry.username} (FID: {entry.fid})</td>
              <td>{entry.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
