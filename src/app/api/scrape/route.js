import { NextResponse } from 'next/server';
import { scrapeLinkedIn, scrapeInstagram } from '@/lib/scraper';
import { getPersonById, updatePerson } from '@/lib/store';
import { analyzeProfile } from '@/lib/agent-engine';

export async function POST(request) {
  try {
    const { personId, linkedin, instagram, useSelenium } = await request.json();
    
    let linkedinData = null;
    let instagramData = null;
    let errors = [];
    
    if (useSelenium) {
      // Attempt real scraping with Selenium
      if (linkedin) {
        const linkedinResult = await scrapeLinkedIn(linkedin);
        if (linkedinResult.success) {
          linkedinData = linkedinResult.data;
        } else {
          errors.push(`LinkedIn: ${linkedinResult.error}`);
        }
      }
      
      if (instagram) {
        const instagramResult = await scrapeInstagram(instagram);
        if (instagramResult.success) {
          instagramData = instagramResult.data;
        } else {
          errors.push(`Instagram: ${instagramResult.error}`);
        }
      }
    }
    
    // If we got data, analyze it
    if (linkedinData || instagramData) {
      const analysis = analyzeProfile(linkedinData, instagramData);
      
      if (personId) {
        // Update existing person
        const updated = updatePerson(personId, {
          scraped: { linkedin: linkedinData, instagram: instagramData },
          analysis
        });
        return NextResponse.json({ success: true, person: updated, errors });
      }
      
      return NextResponse.json({ 
        success: true, 
        scraped: { linkedin: linkedinData, instagram: instagramData },
        analysis,
        errors 
      });
    }
    
    // If Selenium failed or wasn't used, check for existing data
    if (personId) {
      const person = getPersonById(personId);
      if (person && person.scraped) {
        return NextResponse.json({
          success: true,
          person,
          message: 'Using existing scraped data',
          errors
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Scraping failed or no data available',
      errors,
      message: 'Install Chrome and chromedriver for Selenium scraping. Use demo mode with pre-seeded data instead.'
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
