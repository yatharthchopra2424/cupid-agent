import { NextResponse } from 'next/server';
import { getAllPeople, getDatingResults, setRankings, getRankings } from '@/lib/store';
import { generateRankings } from '@/lib/ranking-engine';

export async function GET() {
  try {
    const rankings = getRankings();
    return NextResponse.json({ success: true, rankings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const people = getAllPeople();
    const datingResults = getDatingResults();
    
    if (datingResults.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No dating results yet. Run dates first.' },
        { status: 400 }
      );
    }
    
    const rankings = generateRankings(people, datingResults);
    setRankings(rankings);
    
    return NextResponse.json({ 
      success: true, 
      rankings,
      message: `Generated rankings for ${Object.keys(rankings).length} people`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
