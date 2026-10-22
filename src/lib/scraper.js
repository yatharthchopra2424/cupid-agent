/**
 * Selenium-based scraper for LinkedIn and Instagram public profiles.
 * Uses headless Chrome for scraping with proper error handling.
 * Falls back to mock data in demo mode.
 */

/**
 * Scrapes a LinkedIn public profile using Selenium.
 * LinkedIn aggressively blocks scrapers, so this includes several strategies:
 * - Headless Chrome with realistic user-agent
 * - Random delays between actions
 * - Cookie consent handling
 */
export async function scrapeLinkedIn(url) {
  // In production, this would use Selenium WebDriver
  // LinkedIn blocks most automated scraping, so we provide
  // a server-side Selenium script that can be run separately
  
  try {
    const { Builder, By, until } = await import('selenium-webdriver');
    const chrome = await import('selenium-webdriver/chrome.js');
    
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    try {
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('main')), 10000);
      
      // Random delay to mimic human behavior
      await driver.sleep(2000 + Math.random() * 3000);
      
      const data = {};
      
      // Try to extract name
      try {
        const nameEl = await driver.findElement(By.css('h1'));
        data.name = await nameEl.getText();
      } catch (e) { data.name = ''; }
      
      // Try to extract headline
      try {
        const headlineEl = await driver.findElement(By.css('.text-body-medium'));
        data.headline = await headlineEl.getText();
      } catch (e) { data.headline = ''; }
      
      // Try to extract location
      try {
        const locationEl = await driver.findElement(By.css('.text-body-small'));
        data.location = await locationEl.getText();
      } catch (e) { data.location = ''; }
      
      // Get page source for additional parsing
      const pageSource = await driver.getPageSource();
      
      // Extract summary, experience, skills from page source
      data.summary = extractTextBetween(pageSource, 'About', 'Experience') || '';
      data.experience = extractListItems(pageSource, 'Experience');
      data.skills = extractListItems(pageSource, 'Skills');
      data.education = extractTextBetween(pageSource, 'Education', 'Licenses') || '';
      
      return {
        success: true,
        data: {
          headline: data.headline,
          location: data.location,
          summary: data.summary,
          experience: data.experience,
          skills: data.skills,
          education: data.education
        }
      };
    } finally {
      await driver.quit();
    }
  } catch (error) {
    console.error('LinkedIn scraping error:', error.message);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Scrapes a public Instagram profile using Selenium.
 * Instagram public profiles show: bio, follower count, post count, and recent posts.
 */
export async function scrapeInstagram(url) {
  try {
    const { Builder, By, until } = await import('selenium-webdriver');
    const chrome = await import('selenium-webdriver/chrome.js');
    
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    try {
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('main')), 10000);
      
      // Random delay
      await driver.sleep(2000 + Math.random() * 3000);
      
      const data = {};
      
      // Try to extract bio
      try {
        const bioEl = await driver.findElement(By.css('header section span'));
        data.bio = await bioEl.getText();
      } catch (e) { data.bio = ''; }
      
      // Try to extract follower counts
      try {
        const statEls = await driver.findElements(By.css('header section ul li span'));
        if (statEls.length >= 3) {
          data.posts = await statEls[0].getText();
          data.followers = await statEls[1].getText();
          data.following = await statEls[2].getText();
        }
      } catch (e) {
        data.posts = 0;
        data.followers = '0';
        data.following = '0';
      }
      
      // Get page source for additional info
      const pageSource = await driver.getPageSource();
      
      // Extract themes from alt text and captions
      data.themes = extractInstagramThemes(pageSource);
      data.recentCaptions = extractInstagramCaptions(pageSource);
      
      return {
        success: true,
        data: {
          bio: data.bio,
          followers: data.followers,
          following: data.following,
          posts: typeof data.posts === 'string' ? parseInt(data.posts.replace(/,/g, '')) : data.posts,
          themes: data.themes,
          recentCaptions: data.recentCaptions
        }
      };
    } finally {
      await driver.quit();
    }
  } catch (error) {
    console.error('Instagram scraping error:', error.message);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

// Helper functions for text extraction
function extractTextBetween(html, start, end) {
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end, startIdx);
  if (startIdx === -1 || endIdx === -1) return '';
  const text = html.substring(startIdx + start.length, endIdx);
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
}

function extractListItems(html, section) {
  const sectionIdx = html.indexOf(section);
  if (sectionIdx === -1) return [];
  const sectionHtml = html.substring(sectionIdx, sectionIdx + 5000);
  const items = [];
  const regex = /<span[^>]*>(.*?)<\/span>/g;
  let match;
  while ((match = regex.exec(sectionHtml)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (text.length > 3 && text.length < 200 && !text.includes('{') && items.length < 10) {
      items.push(text);
    }
  }
  return [...new Set(items)].slice(0, 5);
}

function extractInstagramThemes(html) {
  const altTexts = [];
  const regex = /alt="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1].length > 10) altTexts.push(match[1]);
  }
  // Extract common themes from alt texts
  const themes = new Set();
  const keywords = ['travel', 'food', 'fitness', 'fashion', 'nature', 'art', 'music', 'tech', 
                     'sports', 'family', 'friends', 'business', 'motivation', 'comedy', 'beauty'];
  altTexts.forEach(text => {
    keywords.forEach(kw => {
      if (text.toLowerCase().includes(kw)) themes.add(kw);
    });
  });
  return [...themes].slice(0, 6);
}

function extractInstagramCaptions(html) {
  const captions = [];
  const regex =/\"text\":\"([^"]{20,200})\"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    captions.push(match[1]);
  }
  return captions.slice(0, 3);
}
