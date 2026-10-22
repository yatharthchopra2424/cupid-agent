import { NextResponse } from 'next/server';
import { getAllPeople, addPerson, removePerson, resetStore } from '@/lib/store';
import { analyzeProfile } from '@/lib/agent-engine';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const people = getAllPeople();
    return NextResponse.json({ success: true, people, count: people.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, linkedin, instagram, action } = body;
    
    if (action === 'reset') {
      const store = resetStore();
      return NextResponse.json({ success: true, people: store.people, count: store.people.length });
    }
    
    if (!name || !linkedin || !instagram) {
      return NextResponse.json(
        { success: false, error: 'Name, LinkedIn URL, and Instagram URL are required' },
        { status: 400 }
      );
    }
    
    // Validate URLs
    if (!linkedin.includes('linkedin.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid LinkedIn URL' },
        { status: 400 }
      );
    }
    if (!instagram.includes('instagram.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Instagram URL' },
        { status: 400 }
      );
    }
    
    const id = `person-${uuidv4().slice(0, 8)}`;
    
    // Create mock scraped data for demo (in production, Selenium would scrape)
    const mockLinkedIn = {
      headline: `${name} - Professional`,
      location: 'Location not scraped',
      summary: body.linkedinSummary || `Professional profile for ${name}`,
      experience: body.experience || [],
      skills: body.skills || [],
      education: body.education || ''
    };
    
    const mockInstagram = {
      bio: body.instagramBio || `${name} on Instagram`,
      followers: body.followers || '0',
      following: body.following || '0',
      posts: body.posts || 0,
      themes: body.themes || [],
      recentCaptions: body.captions || []
    };
    
    // Analyze profile
    const analysis = analyzeProfile(mockLinkedIn, mockInstagram);
    
    const person = {
      id,
      name,
      linkedin,
      instagram,
      avatar: null,
      scraped: {
        linkedin: mockLinkedIn,
        instagram: mockInstagram
      },
      analysis
    };
    
    addPerson(person);
    
    return NextResponse.json({ success: true, person });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    removePerson(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
