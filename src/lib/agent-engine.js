/**
 * Agent Engine — Creates an AI agent for each person.
 * The agent reads LinkedIn + Instagram data and builds a personality profile.
 * 
 * Analysis extracts:
 * - Needs (emotional, psychological)
 * - Hobbies (activities mentioned/shown)
 * - Interests (topics they engage with)
 * - Qualities (personality traits)
 * - Communication style
 * - Values
 * - Personality type (MBTI approximation)
 */

// Comprehensive keyword-to-trait mapping
const TRAIT_KEYWORDS = {
  needs: {
    'achievement': ['CEO', 'founder', 'built', 'launched', 'created', 'achievement', 'success', 'goals', 'milestone'],
    'recognition': ['award', 'bestselling', 'NYT', 'featured', 'nominated', 'recognized', 'top', 'best'],
    'creative expression': ['artist', 'creative', 'design', 'music', 'film', 'content', 'create', 'maker', 'builder'],
    'connection': ['community', 'together', 'love', 'family', 'friends', 'connect', 'relationship', 'team'],
    'freedom': ['travel', 'nomad', 'remote', 'freelance', 'independent', 'adventure', 'explore', 'free'],
    'purpose': ['purpose', 'mission', 'impact', 'change', 'make a difference', 'why', 'meaning'],
    'growth': ['learn', 'grow', 'evolve', 'improve', 'better', 'development', 'journey', 'progress'],
    'intellectual stimulation': ['research', 'science', 'study', 'philosophy', 'AI', 'technology', 'analyze'],
    'security': ['stable', 'safe', 'secure', 'invest', 'plan', 'future', 'protect', 'family'],
    'impact': ['help', 'serve', 'advocate', 'change', 'ambassador', 'nonprofit', 'giving', 'charity'],
    'authenticity': ['real', 'authentic', 'genuine', 'honest', 'true', 'transparent', 'vulnerable'],
    'inner peace': ['meditation', 'mindful', 'calm', 'peace', 'zen', 'balance', 'yoga', 'spiritual']
  },
  hobbies: {
    'fitness': ['gym', 'workout', 'fitness', 'training', 'running', 'marathon', 'crossfit', 'lifting'],
    'yoga': ['yoga', 'meditation', 'mindfulness', 'breathwork', 'retreat'],
    'cooking': ['cook', 'recipe', 'food', 'chef', 'baking', 'meal', 'kitchen', 'cuisine'],
    'reading': ['book', 'read', 'library', 'author', 'literature', 'novel'],
    'travel': ['travel', 'explore', 'world', 'country', 'adventure', 'backpack', 'trip'],
    'photography': ['photo', 'camera', 'shoot', 'photography', 'portrait', 'landscape'],
    'music': ['music', 'guitar', 'piano', 'sing', 'concert', 'playlist', 'instrument'],
    'gaming': ['game', 'gaming', 'esports', 'stream', 'twitch', 'console'],
    'writing': ['write', 'blog', 'journal', 'essay', 'poem', 'story', 'author'],
    'art': ['art', 'paint', 'draw', 'design', 'craft', 'creative', 'sculpture'],
    'sports': ['basketball', 'soccer', 'football', 'tennis', 'golf', 'swim', 'cricket'],
    'hiking': ['hike', 'mountain', 'trail', 'outdoor', 'camp', 'nature', 'trek'],
    'dancing': ['dance', 'salsa', 'hip-hop', 'ballet', 'choreography'],
    'content creation': ['youtube', 'podcast', 'vlog', 'content', 'creator', 'influencer'],
    'martial arts': ['jiu-jitsu', 'karate', 'martial arts', 'MMA', 'boxing', 'wrestling']
  },
  interests: {
    'technology': ['tech', 'AI', 'software', 'code', 'digital', 'app', 'startup', 'innovation'],
    'entrepreneurship': ['entrepreneur', 'startup', 'business', 'founder', 'CEO', 'company', 'venture'],
    'wellness': ['health', 'wellness', 'mental health', 'self-care', 'nutrition', 'mindset'],
    'fashion': ['fashion', 'style', 'outfit', 'designer', 'runway', 'brand', 'clothing'],
    'science': ['science', 'research', 'study', 'experiment', 'data', 'lab', 'academic'],
    'social justice': ['equality', 'justice', 'rights', 'activism', 'advocate', 'diversity', 'inclusion'],
    'personal development': ['self-improvement', 'growth', 'habits', 'productivity', 'mindset', 'coaching'],
    'cinema': ['film', 'movie', 'actor', 'actress', 'director', 'cinema', 'Hollywood', 'Bollywood'],
    'philosophy': ['philosophy', 'existential', 'meaning', 'wisdom', 'Stoic', 'consciousness'],
    'environment': ['climate', 'sustainability', 'eco', 'green', 'planet', 'nature', 'conservation'],
    'education': ['teach', 'education', 'school', 'university', 'learn', 'student', 'professor'],
    'investing': ['invest', 'portfolio', 'stocks', 'crypto', 'angel', 'VC', 'fund'],
    'culture': ['culture', 'heritage', 'tradition', 'diversity', 'immigrant', 'community']
  },
  qualities: {
    'leader': ['CEO', 'founder', 'lead', 'manager', 'director', 'president', 'head'],
    'creative': ['creative', 'artist', 'design', 'innovate', 'imagine', 'build', 'craft'],
    'analytical': ['data', 'research', 'analyze', 'science', 'study', 'systematic', 'logical'],
    'empathetic': ['empathy', 'compassion', 'care', 'help', 'support', 'listen', 'understand'],
    'adventurous': ['adventure', 'explore', 'travel', 'risk', 'dare', 'bold', 'courage'],
    'disciplined': ['discipline', 'routine', 'habit', 'consistent', 'daily', 'dedicated'],
    'humorous': ['funny', 'comedy', 'laugh', 'humor', 'joke', 'witty', 'hilarious'],
    'philosophical': ['philosophy', 'think', 'reflect', 'wisdom', 'deep', 'conscious', 'meaning'],
    'passionate': ['passion', 'love', 'obsessed', 'dedicated', 'fire', 'driven', 'intense'],
    'resilient': ['overcome', 'survive', 'bounce back', 'resilient', 'strong', 'fight', 'never give up'],
    'warm': ['warm', 'kind', 'loving', 'gentle', 'nurturing', 'caring', 'sweet'],
    'ambitious': ['ambitious', 'goal', 'dream', 'aspire', 'strive', 'hustle', 'grind']
  }
};

// MBTI approximation based on detected traits
const MBTI_MAP = {
  'leader+analytical': 'ENTJ',
  'leader+empathetic': 'ENFJ',
  'creative+adventurous': 'ENFP',
  'analytical+disciplined': 'ISTJ',
  'philosophical+creative': 'INFP',
  'analytical+philosophical': 'INTP',
  'empathetic+philosophical': 'INFJ',
  'leader+adventurous': 'ESTP',
  'creative+warm': 'ESFP',
  'disciplined+warm': 'ISFJ',
  'humorous+adventurous': 'ENTP',
  'creative+disciplined': 'ISTP'
};

/**
 * Analyzes scraped profile data and generates agent personality
 */
export function analyzeProfile(linkedinData, instagramData) {
  const allText = buildTextCorpus(linkedinData, instagramData);
  
  const needs = detectTraits(allText, TRAIT_KEYWORDS.needs);
  const hobbies = detectTraits(allText, TRAIT_KEYWORDS.hobbies);
  const interests = detectTraits(allText, TRAIT_KEYWORDS.interests);
  const qualities = detectTraits(allText, TRAIT_KEYWORDS.qualities);
  
  const personalityType = inferMBTI(qualities);
  const communicationStyle = inferCommunicationStyle(allText, qualities);
  const values = inferValues(needs, interests, qualities);
  
  return {
    needs: needs.length > 0 ? needs : ['Connection', 'Growth', 'Purpose'],
    hobbies: hobbies.length > 0 ? hobbies : ['Reading', 'Travel', 'Learning'],
    interests: interests.length > 0 ? interests : ['Personal development', 'Technology'],
    qualities: qualities.length > 0 ? qualities : ['Driven', 'Thoughtful', 'Creative'],
    personalityType,
    communicationStyle,
    values,
    ageRange: inferAgeRange(linkedinData),
    gender: inferGender(allText)
  };
}

function buildTextCorpus(linkedin, instagram) {
  const parts = [];
  
  if (linkedin) {
    if (linkedin.headline) parts.push(linkedin.headline);
    if (linkedin.summary) parts.push(linkedin.summary);
    if (linkedin.experience) parts.push(linkedin.experience.join(' '));
    if (linkedin.skills) parts.push(linkedin.skills.join(' '));
    if (linkedin.education) parts.push(linkedin.education);
    if (linkedin.location) parts.push(linkedin.location);
  }
  
  if (instagram) {
    if (instagram.bio) parts.push(instagram.bio);
    if (instagram.themes) parts.push(instagram.themes.join(' '));
    if (instagram.recentCaptions) parts.push(instagram.recentCaptions.join(' '));
  }
  
  return parts.join(' ').toLowerCase();
}

function detectTraits(text, traitMap) {
  const detected = [];
  
  for (const [trait, keywords] of Object.entries(traitMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score >= 1) {
      detected.push({ trait: capitalizeFirst(trait), score });
    }
  }
  
  // Sort by score and return top traits
  detected.sort((a, b) => b.score - a.score);
  return detected.slice(0, 6).map(d => d.trait);
}

function inferMBTI(qualities) {
  if (qualities.length < 2) return 'ENFP';
  
  const q1 = qualities[0]?.toLowerCase() || '';
  const q2 = qualities[1]?.toLowerCase() || '';
  const key = `${q1}+${q2}`;
  
  return MBTI_MAP[key] || inferMBTIFromQualities(qualities);
}

function inferMBTIFromQualities(qualities) {
  const qs = qualities.map(q => q.toLowerCase());
  
  let e_i = qs.some(q => ['leader', 'humorous', 'adventurous', 'warm'].includes(q)) ? 'E' : 'I';
  let s_n = qs.some(q => ['analytical', 'disciplined'].includes(q)) ? 'S' : 'N';
  let t_f = qs.some(q => ['empathetic', 'warm', 'passionate'].includes(q)) ? 'F' : 'T';
  let j_p = qs.some(q => ['disciplined', 'leader', 'ambitious'].includes(q)) ? 'J' : 'P';
  
  return `${e_i}${s_n}${t_f}${j_p}`;
}

function inferCommunicationStyle(text, qualities) {
  const styles = [];
  
  if (text.includes('motivation') || text.includes('inspire')) styles.push('Inspirational');
  if (text.includes('funny') || text.includes('comedy') || text.includes('laugh')) styles.push('Humorous');
  if (text.includes('research') || text.includes('data') || text.includes('science')) styles.push('Analytical');
  if (text.includes('story') || text.includes('narrative')) styles.push('Storytelling');
  if (qualities.some(q => q.toLowerCase().includes('warm'))) styles.push('Warm');
  if (qualities.some(q => q.toLowerCase().includes('leader'))) styles.push('Authoritative');
  if (text.includes('authentic') || text.includes('real') || text.includes('honest')) styles.push('Authentic');
  
  return styles.length > 0 ? styles.slice(0, 3).join(', ') : 'Engaging, thoughtful';
}

function inferValues(needs, interests, qualities) {
  const values = new Set();
  
  needs.forEach(n => {
    if (n.toLowerCase().includes('growth')) values.add('Growth');
    if (n.toLowerCase().includes('connection')) values.add('Connection');
    if (n.toLowerCase().includes('purpose')) values.add('Purpose');
    if (n.toLowerCase().includes('freedom')) values.add('Freedom');
    if (n.toLowerCase().includes('creative')) values.add('Creativity');
    if (n.toLowerCase().includes('impact')) values.add('Impact');
    if (n.toLowerCase().includes('authentic')) values.add('Authenticity');
  });
  
  interests.forEach(i => {
    if (i.toLowerCase().includes('justice')) values.add('Justice');
    if (i.toLowerCase().includes('education')) values.add('Education');
    if (i.toLowerCase().includes('wellness')) values.add('Wellness');
  });
  
  if (values.size < 3) {
    values.add('Integrity');
    values.add('Excellence');
    values.add('Compassion');
  }
  
  return [...values].slice(0, 5);
}

function inferAgeRange(linkedin) {
  if (!linkedin || !linkedin.experience) return 'Unknown';
  // Rough estimation based on career length
  const experienceLength = Array.isArray(linkedin.experience) ? linkedin.experience.length : 0;
  if (experienceLength >= 5) return '40-50';
  if (experienceLength >= 3) return '30-40';
  return '25-35';
}

function inferGender(text) {
  const femaleIndicators = ['she', 'her', 'mother', 'mom', 'woman', 'girl', 'actress', 'queen', 'sister'];
  const maleIndicators = ['he', 'him', 'father', 'dad', 'man', 'guy', 'king', 'brother'];
  
  let femaleScore = 0;
  let maleScore = 0;
  
  femaleIndicators.forEach(ind => { if (text.includes(ind)) femaleScore++; });
  maleIndicators.forEach(ind => { if (text.includes(ind)) maleScore++; });
  
  if (femaleScore > maleScore) return 'Female';
  if (maleScore > femaleScore) return 'Male';
  return 'Not specified';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Creates an agent for a person based on their analysis
 */
export function createAgent(person) {
  const analysis = person.analysis;
  
  return {
    id: person.id,
    name: person.name,
    personalityType: analysis.personalityType,
    communicationStyle: analysis.communicationStyle,
    needs: analysis.needs,
    hobbies: analysis.hobbies,
    interests: analysis.interests,
    qualities: analysis.qualities,
    values: analysis.values,
    
    // Agent behavior parameters
    openness: calculateOpenness(analysis),
    agreeableness: calculateAgreeableness(analysis),
    extraversion: calculateExtraversion(analysis),
    
    // Conversation preferences
    preferredTopics: [...analysis.interests, ...analysis.hobbies].slice(0, 8),
    conversationStyle: analysis.communicationStyle,
    dealBreakers: inferDealBreakers(analysis),
    attractedTo: inferAttractedTo(analysis)
  };
}

function calculateOpenness(analysis) {
  const openTraits = ['creative', 'adventurous', 'philosophical', 'curious'];
  const score = analysis.qualities.filter(q => 
    openTraits.some(t => q.toLowerCase().includes(t))
  ).length;
  return Math.min(10, 5 + score * 2);
}

function calculateAgreeableness(analysis) {
  const agreeableTraits = ['empathetic', 'warm', 'kind', 'nurturing', 'compassionate'];
  const score = analysis.qualities.filter(q => 
    agreeableTraits.some(t => q.toLowerCase().includes(t))
  ).length;
  return Math.min(10, 4 + score * 2);
}

function calculateExtraversion(analysis) {
  const extrovertTypes = ['E'];
  const isExtrovert = analysis.personalityType?.startsWith('E') ? 3 : 0;
  return Math.min(10, 4 + isExtrovert);
}

function inferDealBreakers(analysis) {
  const breaks = [];
  if (analysis.values.includes('Authenticity')) breaks.push('Dishonesty');
  if (analysis.values.includes('Growth')) breaks.push('Stagnation');
  if (analysis.values.includes('Connection')) breaks.push('Emotional unavailability');
  if (analysis.values.includes('Freedom')) breaks.push('Controlling behavior');
  return breaks;
}

function inferAttractedTo(analysis) {
  const attractions = [];
  if (analysis.qualities.some(q => q.toLowerCase().includes('intellectual'))) {
    attractions.push('Intelligence', 'Deep conversations');
  }
  if (analysis.qualities.some(q => q.toLowerCase().includes('adventurous'))) {
    attractions.push('Spontaneity', 'Adventure');
  }
  if (analysis.qualities.some(q => q.toLowerCase().includes('warm'))) {
    attractions.push('Kindness', 'Emotional depth');
  }
  if (analysis.qualities.some(q => q.toLowerCase().includes('ambitious'))) {
    attractions.push('Drive', 'Passion');
  }
  if (attractions.length === 0) {
    attractions.push('Authenticity', 'Humor', 'Ambition');
  }
  return attractions;
}
