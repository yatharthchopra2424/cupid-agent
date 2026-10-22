import { NextResponse } from 'next/server';
import { getAllPeople, getDatingResults, setDatingResults } from '@/lib/store';
import { simulateDate, runAllDates } from '@/lib/dating-engine';

export async function GET() {
  try {
    const results = getDatingResults();
    return NextResponse.json({ success: true, results, count: results.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, person1Id, person2Id } = body;
    
    if (action === 'single') {
      // Single date between two people
      const people = getAllPeople();
      const p1 = people.find(p => p.id === person1Id);
      const p2 = people.find(p => p.id === person2Id);
      
      if (!p1 || !p2) {
        return NextResponse.json(
          { success: false, error: 'Both people must exist' },
          { status: 400 }
        );
      }
      
      const result = simulateDate(p1, p2);
      
      // Add to existing results
      const existing = getDatingResults();
      // Remove any existing date between these two
      const filtered = existing.filter(
        r => !(
          (r.person1.id === p1.id && r.person2.id === p2.id) ||
          (r.person1.id === p2.id && r.person2.id === p1.id)
        )
      );
      filtered.push(result);
      setDatingResults(filtered);
      
      return NextResponse.json({ success: true, result });
    }
    
    if (action === 'all') {
      // Run all dates
      const people = getAllPeople();
      
      if (people.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Need at least 2 people to date' },
          { status: 400 }
        );
      }
      
      const results = runAllDates(people);
      setDatingResults(results);
      
      return NextResponse.json({ 
        success: true, 
        results, 
        count: results.length,
        message: `Simulated ${results.length} dates between ${people.length} people`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "single" or "all"' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
