import React from "react";

type Entry = { fid: number; username: string; streak: number };

export default function Leaderboard() {
  const [data, setData] = React.useState<Entry[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => setData(json.leaderboard as Entry[]))
      .catch(err => {
        setError(err.message);
        // fallback mock
        setData([
          { fid: 123, username: 'alice', streak: 7 },
          { fid: 456, username: 'bob', streak: 5 },
          { fid: 789, username: 'carol', streak: 3 },
        ]);
      });
  }, []);

  return (
    <div className="my-4 p-4 bg-gray-70 rounded shadow">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pr-4">User</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
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
