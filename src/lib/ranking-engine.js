/**
 * Ranking Engine — Generates compatibility rankings for each person.
 * 
 * For every person, ranks who fits them best based on:
 * - Shared interests overlap
 * - Shared hobbies overlap
 * - Shared values alignment
 * - Personality type compatibility
 * - Communication style compatibility
 * - Overall dating chemistry from simulation
 */

/**
 * Generate rankings for all people based on dating results
 */
export function generateRankings(people, datingResults) {
  const rankings = {};
  
  for (const person of people) {
    // Get all dates involving this person
    const personDates = datingResults.filter(
      d => d.person1.id === person.id || d.person2.id === person.id
    );
    
    // Score each match
    const matches = personDates.map(date => {
      const partnerId = date.person1.id === person.id ? date.person2.id : date.person1.id;
      const partnerName = date.person1.id === person.id ? date.person2.name : date.person1.name;
      const partner = people.find(p => p.id === partnerId);
      
      // Multi-factor scoring
      const scores = calculateDetailedScores(person, partner, date);
      
      return {
        partnerId,
        partnerName,
        overallScore: scores.overall,
        breakdown: scores.breakdown,
        chemistryScore: date.chemistryScore,
        sharedInterests: date.sharedInterests || [],
        sharedHobbies: date.sharedHobbies || [],
        sharedValues: date.sharedValues || [],
        dateId: date.id,
        highlights: generateHighlights(person, partner, scores)
      };
    });
    
    // Sort by overall score (highest first)
    matches.sort((a, b) => b.overallScore - a.overallScore);
    
    // Assign ranks
    matches.forEach((match, idx) => {
      match.rank = idx + 1;
      match.tier = getTier(match.overallScore);
    });
    
    rankings[person.id] = {
      personId: person.id,
      personName: person.name,
      topMatch: matches[0] || null,
      matches,
      totalDates: matches.length,
      averageCompatibility: matches.length > 0 
        ? Math.round(matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length) 
        : 0
    };
  }
  
  return rankings;
}

function calculateDetailedScores(person, partner, date) {
  if (!person?.analysis || !partner?.analysis) {
    return {
      overall: date?.chemistryScore || 50,
      breakdown: {
        interests: 50,
        hobbies: 50,
        values: 50,
        personality: 50,
        communication: 50,
        chemistry: date?.chemistryScore || 50
      }
    };
  }
  
  const interestScore = calculateOverlapScore(
    person.analysis.interests || [],
    partner.analysis.interests || []
  );
  
  const hobbyScore = calculateOverlapScore(
    person.analysis.hobbies || [],
    partner.analysis.hobbies || []
  );
  
  const valueScore = calculateOverlapScore(
    person.analysis.values || [],
    partner.analysis.values || []
  ) * 1.3; // Values weight 30% more
  
  const personalityScore = calculatePersonalityScore(
    person.analysis.personalityType,
    partner.analysis.personalityType
  );
  
  const communicationScore = calculateCommScore(
    person.analysis.communicationStyle,
    partner.analysis.communicationStyle
  );
  
  const chemistryScore = date?.chemistryScore || 50;
  
  // Weighted average
  const overall = Math.round(
    (interestScore * 0.15) +
    (hobbyScore * 0.10) +
    (valueScore * 0.25) +
    (personalityScore * 0.20) +
    (communicationScore * 0.10) +
    (chemistryScore * 0.20)
  );
  
  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      interests: Math.round(interestScore),
      hobbies: Math.round(hobbyScore),
      values: Math.round(Math.min(100, valueScore)),
      personality: Math.round(personalityScore),
      communication: Math.round(communicationScore),
      chemistry: Math.round(chemistryScore)
    }
  };
}

function calculateOverlapScore(list1, list2) {
  if (!list1.length || !list2.length) return 30;
  
  let matches = 0;
  const total = Math.max(list1.length, list2.length);
  
  for (const item1 of list1) {
    for (const item2 of list2) {
      const s1 = item1.toLowerCase();
      const s2 = item2.toLowerCase();
      if (s1 === s2 || s1.includes(s2) || s2.includes(s1)) {
        matches++;
        break;
      }
    }
  }
  
  // Scale: 0 matches = 20, 1 = 40, 2 = 55, 3 = 70, 4+ = 80-100
  const ratio = matches / total;
  return 20 + (ratio * 80);
}

function calculatePersonalityScore(type1, type2) {
  if (!type1 || !type2) return 50;
  
  // MBTI compatibility matrix (higher = more compatible)
  const COMPAT = {
    'ENTJ-INFP': 85, 'ENTJ-ENFP': 75, 'ENTJ-INTJ': 65, 'ENTJ-INTP': 70,
    'ENFJ-INFP': 90, 'ENFJ-ENFP': 75, 'ENFJ-ISFP': 80, 'ENFJ-INFJ': 70,
    'ENFP-INTJ': 85, 'ENFP-INFJ': 90, 'ENFP-INFP': 70, 'ENFP-ENFJ': 75,
    'INTJ-ENFP': 85, 'INTJ-ENTP': 70, 'INTJ-ENTJ': 65, 'INTJ-INFJ': 65,
    'INFJ-ENFP': 90, 'INFJ-ENTP': 80, 'INFJ-INFP': 70, 'INFJ-ENFJ': 70,
    'INFP-ENFJ': 90, 'INFP-ENTJ': 80, 'INFP-INFJ': 70, 'INFP-ENFP': 70,
    'INTP-ENTJ': 70, 'INTP-ENFJ': 65, 'INTP-ENTP': 70, 'INTP-INTJ': 65,
    'ENTP-INFJ': 80, 'ENTP-INTJ': 70, 'ENTP-ENFP': 70, 'ENTP-INTP': 70,
    'ESTP-ISFJ': 80, 'ESTP-ISTJ': 60, 'ESTP-ESFP': 65,
    'ESFP-ISFJ': 70, 'ESFP-ISTJ': 65, 'ESFP-ESTP': 65,
    'ISTJ-ENFP': 55, 'ISTJ-ESFP': 65, 'ISTJ-ESTJ': 60,
    'ISFJ-ESTP': 80, 'ISFJ-ESFP': 70, 'ISFJ-ENFJ': 70,
    'ISTP-ESFJ': 70, 'ISTP-ESTJ': 60, 'ISTP-ENFP': 60,
    'ISFP-ENFJ': 80, 'ISFP-ESTJ': 55, 'ISFP-ESFJ': 70,
    'ESTJ-ISFP': 55, 'ESTJ-ISTP': 60, 'ESTJ-ISTJ': 55,
    'ESFJ-ISTP': 70, 'ESFJ-ISFP': 70, 'ESFJ-ISFJ': 60
  };
  
  const key1 = `${type1}-${type2}`;
  const key2 = `${type2}-${type1}`;
  
  return COMPAT[key1] || COMPAT[key2] || 50;
}

function calculateCommScore(style1, style2) {
  if (!style1 || !style2) return 50;
  
  const words1 = style1.toLowerCase().split(/[, ]+/).filter(Boolean);
  const words2 = style2.toLowerCase().split(/[, ]+/).filter(Boolean);
  
  let overlap = 0;
  words1.forEach(w1 => {
    words2.forEach(w2 => {
      if (w1 === w2 || w1.includes(w2) || w2.includes(w1)) {
        overlap++;
      }
    });
  });
  
  // Different but complementary styles can also be good
  const complementary = [
    ['analytical', 'creative'],
    ['warm', 'authoritative'],
    ['humorous', 'deep'],
    ['inspiring', 'practical']
  ];
  
  complementary.forEach(([a, b]) => {
    if ((words1.includes(a) && words2.includes(b)) || (words1.includes(b) && words2.includes(a))) {
      overlap += 0.5;
    }
  });
  
  return Math.min(100, 30 + overlap * 20);
}

function getTier(score) {
  if (score >= 80) return 'Soulmate';
  if (score >= 65) return 'Great Match';
  if (score >= 50) return 'Good Match';
  if (score >= 35) return 'Worth Exploring';
  return 'Not Ideal';
}

function generateHighlights(person, partner, scores) {
  const highlights = [];
  
  if (scores.breakdown.values >= 70) {
    highlights.push('Strong values alignment');
  }
  if (scores.breakdown.interests >= 70) {
    highlights.push('Many shared interests');
  }
  if (scores.breakdown.personality >= 75) {
    highlights.push('Complementary personalities');
  }
  if (scores.breakdown.chemistry >= 70) {
    highlights.push('Great conversation chemistry');
  }
  if (scores.breakdown.hobbies >= 60) {
    highlights.push('Would enjoy activities together');
  }
  
  if (highlights.length === 0) {
    if (scores.overall >= 50) {
      highlights.push('Potential for growth together');
    } else {
      highlights.push('Different paths, mutual respect');
    }
  }
  
  return highlights;
}
