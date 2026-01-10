import { NextResponse } from 'next/server';

// Temporary mock data; swap with your indexer results later
const mockLeaderboard = [
  { fid: 123, username: 'alice', streak: 7 },
  { fid: 456, username: 'bob', streak: 5 },
  { fid: 789, username: 'carol', streak: 3 },
];

export async function GET() {
  return NextResponse.json({ leaderboard: mockLeaderboard });
}
