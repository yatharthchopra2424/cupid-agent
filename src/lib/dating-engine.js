/**
 * Dating Engine — Simulates dates between agents.
 * 
 * Each agent "dates" on behalf of their person.
 * The dating process involves:
 * 1. Ice-breaking: Agents introduce themselves
 * 2. Topic exploration: Agents discuss shared interests
 * 3. Deep dive: Agents explore compatibility on values
 * 4. Chemistry check: Final scoring
 * 
 * Each conversation turn generates dialogue based on
 * the agent's personality, communication style, and interests.
 */

import { createAgent } from './agent-engine.js';
import { createNemotronCompletion, isLLMAvailable } from './nvidia-client.js';

// Conversation templates based on personality types
const OPENERS = {
  'ENTJ': [
    "I believe in cutting straight to the point. What's your biggest ambition right now?",
    "I love meeting driven people. What project are you most excited about?",
    "Time is our most valuable asset. So tell me — what's the one thing you'd do if failure wasn't an option?"
  ],
  'ENFJ': [
    "I'm really curious about what drives you. What gets you out of bed every morning?",
    "I believe everyone has a story worth hearing. What's yours?",
    "I love connecting with people who want to make the world better. What cause is closest to your heart?"
  ],
  'ENFP': [
    "Oh my gosh, I have so many questions! But first — what makes you feel most alive?",
    "I'm totally a believer that life should be an adventure. What's the craziest thing you've done?",
    "If you could master any skill overnight, what would it be and why?"
  ],
  'INTJ': [
    "I appreciate depth over breadth. What's a topic you could discuss for hours?",
    "I'm curious about systems and ideas. What's a concept that completely changed how you think?",
    "What's an unpopular opinion you hold that you're confident is right?"
  ],
  'INFJ': [
    "I feel like meaningful connections are rare. What does a meaningful connection look like to you?",
    "I'm drawn to people with depth. What's something most people don't understand about you?",
    "What's a belief you hold that shapes everything you do?"
  ],
  'INFP': [
    "I believe love is the most important thing in the world. What does love mean to you?",
    "What's the most beautiful thing you've experienced recently?",
    "If you could change one thing about the world, what would it be?"
  ],
  'ENTP': [
    "Let's play a game — tell me your most controversial take, and I'll tell you mine!",
    "I love a good debate. What's something you're passionate enough to argue about?",
    "What's the most interesting problem you're trying to solve right now?"
  ],
  'INTP': [
    "I've been thinking about something interesting lately. What occupies your mind most?",
    "What's a rabbit hole you recently fell into and couldn't stop exploring?",
    "Do you think humans are fundamentally rational or emotional? I'd love to hear your take."
  ],
  'ESTP': [
    "Life's too short for small talk — what's the most fun you've had this month?",
    "I'm all about taking action. What's your next big move?",
    "If we had to go on an adventure right now, where would we go?"
  ],
  'ESFP': [
    "Okay, I just have to say — I love your energy! What makes you happiest?",
    "What's the best party or event you've ever been to?",
    "I believe in living in the moment. What are you most grateful for today?"
  ],
  'ISTJ': [
    "I value consistency and reliability. What's your daily routine look like?",
    "What's something you've committed to for years and never given up on?",
    "I respect dedication. What's the achievement you're most proud of?"
  ],
  'ISFJ': [
    "I think the little things matter most. What small gestures mean the world to you?",
    "Family and close relationships are everything to me. How about you?",
    "What tradition or ritual is most important to you?"
  ],
  'ISTP': [
    "I'd rather show than tell. What are you building or working on?",
    "What's a skill you've taught yourself that you're proud of?",
    "I respect people who can figure things out. What's the hardest problem you've solved?"
  ],
  'ISFP': [
    "I notice beauty in the little things. What inspires you creatively?",
    "What does your ideal day look like — no obligations, just you?",
    "I believe art reveals truth. What piece of art or music speaks to your soul?"
  ],
  'ESTJ': [
    "I believe in getting things done right. What's your approach to tackling big goals?",
    "I admire people with strong principles. What do you stand for?",
    "What's your proudest leadership moment?"
  ],
  'ESFJ': [
    "Community is everything to me. What does your support system look like?",
    "I love bringing people together. What's the best way someone has made you feel welcome?",
    "What do you think makes a great partnership?"
  ]
};

const TOPIC_RESPONSES = {
  shared_hobby: [
    "No way, I love {topic} too! What got you into it?",
    "Oh, you're into {topic}? That's awesome — I've been really passionate about it lately!",
    "{topic} is such a great way to express yourself. How long have you been doing it?",
    "I actually {topic} almost every day. It's become such a big part of who I am."
  ],
  shared_interest: [
    "I'm really passionate about {topic}. I think it's going to shape the future.",
    "{topic} fascinates me. I could talk about it for hours. What's your take on where it's heading?",
    "The way {topic} is evolving is just incredible. Have you read anything good on it recently?",
    "I genuinely believe {topic} is one of the most important things happening right now."
  ],
  shared_value: [
    "I really resonate with your emphasis on {topic}. It's a core part of who I am.",
    "{topic} is non-negotiable for me. I love that we share that.",
    "The fact that you value {topic} tells me a lot about who you are. I respect that deeply.",
    "I think {topic} is the foundation of any great relationship. It's what I build my life around."
  ],
  different_topic: [
    "I haven't explored {topic} much, but I'm genuinely curious. Tell me more!",
    "That's interesting — {topic} isn't my usual world, but I love learning new things.",
    "I think differences make connections more interesting. What draws you to {topic}?",
    "{topic} sounds fascinating. I'd love to experience it through your perspective."
  ]
};

const DEEP_QUESTIONS = [
  "What does your ideal future look like in five years?",
  "What's a lesson you learned the hard way that you're grateful for now?",
  "How do you handle conflict in relationships?",
  "What role does vulnerability play in your life?",
  "What's something that scares you but excites you at the same time?",
  "How do you define success beyond work?",
  "What does a perfect day together look like?",
  "What's the most important quality you look for in a partner?",
  "What's a non-negotiable for you in a relationship?",
  "If we could go anywhere in the world together, where would you take me?"
];

const CLOSERS = {
  high_chemistry: [
    "I really didn't expect to connect with someone this deeply. I'd love to do this again.",
    "Honestly? This is the most genuine conversation I've had in a while. I feel like we really get each other.",
    "I'm not usually this open, but you make it easy. I think there's something real here.",
    "I came in with zero expectations and I'm leaving feeling genuinely excited about getting to know you better."
  ],
  medium_chemistry: [
    "This was a really nice conversation. I feel like we have some interesting things in common.",
    "I enjoyed getting to know you. There's definitely some great overlap in what we value.",
    "Thanks for being so open. I'd be curious to explore our connection more.",
    "This was fun! I think we could have some great conversations about the things we both care about."
  ],
  low_chemistry: [
    "I appreciate you sharing so openly. We're clearly on different wavelengths, but I respect your perspective.",
    "It was interesting to hear your point of view. I think we value different things, and that's okay.",
    "Thanks for the conversation. I think we're wired differently, but I can see your passion is genuine.",
    "I'm glad we talked. Even though we're different, I learned something new from your perspective."
  ]
};

/**
 * Simulate a date between two agents
 */
export function simulateDate(person1, person2) {
  const agent1 = createAgent(person1);
  const agent2 = createAgent(person2);
  
  const conversation = [];
  let chemistryScore = 50; // Start neutral
  
  // Phase 1: Ice Breaking
  const opener1 = getOpener(agent1);
  const opener2 = getOpener(agent2);
  
  conversation.push({
    phase: 'Ice Breaking',
    speaker: agent1.name,
    message: opener1,
    mood: 'curious'
  });
  
  const response1 = generateResponse(agent2, agent1, opener1, 'icebreaker');
  conversation.push({
    phase: 'Ice Breaking',
    speaker: agent2.name,
    message: response1,
    mood: 'engaged'
  });
  
  // Phase 2: Topic Exploration (shared interests/hobbies)
  const sharedInterests = findSharedTopics(agent1.interests, agent2.interests);
  const sharedHobbies = findSharedTopics(agent1.hobbies, agent2.hobbies);
  const sharedValues = findSharedTopics(agent1.values, agent2.values);
  
  // Interest overlap contributes to chemistry
  chemistryScore += sharedInterests.length * 5;
  chemistryScore += sharedHobbies.length * 4;
  chemistryScore += sharedValues.length * 7;
  
  // Discuss shared topics
  if (sharedInterests.length > 0) {
    const topic = sharedInterests[0];
    conversation.push({
      phase: 'Shared Interests',
      speaker: agent1.name,
      message: getTopicResponse('shared_interest', topic, agent1),
      mood: 'excited'
    });
    conversation.push({
      phase: 'Shared Interests',
      speaker: agent2.name,
      message: getTopicResponse('shared_interest', topic, agent2),
      mood: 'excited'
    });
  }
  
  if (sharedHobbies.length > 0) {
    const topic = sharedHobbies[0];
    conversation.push({
      phase: 'Shared Hobbies',
      speaker: agent1.name,
      message: getTopicResponse('shared_hobby', topic, agent1),
      mood: 'enthusiastic'
    });
    conversation.push({
      phase: 'Shared Hobbies',
      speaker: agent2.name,
      message: getTopicResponse('shared_hobby', topic, agent2),
      mood: 'enthusiastic'
    });
  }
  
  // Explore different interests
  const uniqueInterest1 = agent1.interests.find(i => !sharedInterests.includes(i));
  const uniqueInterest2 = agent2.interests.find(i => !sharedInterests.includes(i));
  
  if (uniqueInterest1) {
    conversation.push({
      phase: 'Exploring Differences',
      speaker: agent1.name,
      message: `Something I'm really passionate about is ${uniqueInterest1.toLowerCase()}. It's been a huge part of my journey.`,
      mood: 'passionate'
    });
    conversation.push({
      phase: 'Exploring Differences',
      speaker: agent2.name,
      message: getTopicResponse('different_topic', uniqueInterest1, agent2),
      mood: agent2.openness > 7 ? 'curious' : 'neutral'
    });
    if (agent2.openness > 7) chemistryScore += 3;
  }
  
  // Phase 3: Deep Dive (values and meaning)
  if (sharedValues.length > 0) {
    const value = sharedValues[0];
    conversation.push({
      phase: 'Values Alignment',
      speaker: agent1.name,
      message: getTopicResponse('shared_value', value, agent1),
      mood: 'deep'
    });
    conversation.push({
      phase: 'Values Alignment',
      speaker: agent2.name,
      message: getTopicResponse('shared_value', value, agent2),
      mood: 'deep'
    });
  }
  
  // Deep question exchange
  const deepQ = DEEP_QUESTIONS[Math.floor(Math.random() * DEEP_QUESTIONS.length)];
  conversation.push({
    phase: 'Going Deeper',
    speaker: agent1.name,
    message: deepQ,
    mood: 'vulnerable'
  });
  
  const deepResponse = generateDeepResponse(agent2, deepQ);
  conversation.push({
    phase: 'Going Deeper',
    speaker: agent2.name,
    message: deepResponse,
    mood: 'thoughtful'
  });
  
  // Phase 4: Chemistry Check & Closing
  // Communication compatibility
  const commCompat = calculateCommunicationCompatibility(agent1, agent2);
  chemistryScore += commCompat;
  
  // Personality type compatibility
  const personalityCompat = calculatePersonalityCompatibility(
    agent1.personalityType, 
    agent2.personalityType
  );
  chemistryScore += personalityCompat;
  
  // Normalize score to 0-100
  chemistryScore = Math.max(0, Math.min(100, chemistryScore));
  
  // Add closing messages
  const closingType = chemistryScore > 70 ? 'high_chemistry' : 
                       chemistryScore > 45 ? 'medium_chemistry' : 'low_chemistry';
  
  const closing1 = CLOSERS[closingType][Math.floor(Math.random() * CLOSERS[closingType].length)];
  const closing2 = CLOSERS[closingType][Math.floor(Math.random() * CLOSERS[closingType].length)];
  
  conversation.push({
    phase: 'Closing',
    speaker: agent1.name,
    message: closing1,
    mood: closingType === 'high_chemistry' ? 'smitten' : closingType === 'medium_chemistry' ? 'pleased' : 'respectful'
  });
  conversation.push({
    phase: 'Closing',
    speaker: agent2.name,
    message: closing2,
    mood: closingType === 'high_chemistry' ? 'smitten' : closingType === 'medium_chemistry' ? 'pleased' : 'respectful'
  });
  
  return {
    id: `date-${person1.id}-${person2.id}`,
    person1: { id: person1.id, name: person1.name },
    person2: { id: person2.id, name: person2.name },
    conversation,
    chemistryScore,
    sharedInterests,
    sharedHobbies,
    sharedValues,
    compatibility: {
      overall: chemistryScore,
      interests: Math.min(100, (sharedInterests.length / Math.max(agent1.interests.length, agent2.interests.length)) * 100),
      hobbies: Math.min(100, (sharedHobbies.length / Math.max(agent1.hobbies.length, agent2.hobbies.length)) * 100),
      values: Math.min(100, (sharedValues.length / Math.max(agent1.values.length, agent2.values.length)) * 100),
      personality: personalityCompat * 10,
      communication: commCompat * 10
    },
    timestamp: new Date().toISOString()
  };
}

function getOpener(agent) {
  const openers = OPENERS[agent.personalityType] || OPENERS['ENFP'];
  return openers[Math.floor(Math.random() * openers.length)];
}

function getTopicResponse(type, topic, agent) {
  const templates = TOPIC_RESPONSES[type] || TOPIC_RESPONSES['different_topic'];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/\{topic\}/g, topic.toLowerCase());
}

function generateResponse(responder, asker, question, phase) {
  const style = responder.communicationStyle || 'Engaging';
  
  if (phase === 'icebreaker') {
    const responses = [
      `That's a great question! For me, it's all about ${responder.values[0]?.toLowerCase() || 'making a difference'}. I'm someone who's deeply into ${responder.interests[0]?.toLowerCase() || 'exploring ideas'}, and I find that drives everything I do.`,
      `I love that you asked that. Honestly, what keeps me going is my passion for ${responder.hobbies[0]?.toLowerCase() || 'learning'}. It's where I feel most like myself. What about you?`,
      `Well, I'm a ${responder.personalityType} through and through — I thrive on ${responder.needs[0]?.toLowerCase() || 'connection'} and ${responder.needs[1]?.toLowerCase() || 'growth'}. I'd love to know more about what drives you too.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return `I really appreciate you sharing that. As someone who values ${responder.values[0]?.toLowerCase() || 'authenticity'}, I connect with what you're saying.`;
}

function generateDeepResponse(agent, question) {
  const responses = [
    `That's something I think about a lot. For me, it comes down to ${agent.values[0]?.toLowerCase() || 'growth'}. I've always believed that ${agent.needs[0]?.toLowerCase() || 'purpose'} is what gives life meaning. My experience with ${agent.hobbies[0]?.toLowerCase() || 'my work'} taught me that.`,
    `You know, I think the answer is rooted in ${agent.values[1]?.toLowerCase() || 'connection'}. I've been through periods where I had to dig deep, and I found that ${agent.qualities[0]?.toLowerCase() || 'resilience'} is what carried me through. It shaped who I am today.`,
    `I love that question. I'd say ${agent.values[0]?.toLowerCase() || 'authenticity'} is at the core of how I approach everything — relationships, work, life. Being ${agent.qualities[1]?.toLowerCase() || 'honest'} about who I am has been the most liberating thing.`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function findSharedTopics(list1, list2) {
  if (!list1 || !list2) return [];
  return list1.filter(item => 
    list2.some(item2 => 
      item.toLowerCase().includes(item2.toLowerCase()) || 
      item2.toLowerCase().includes(item.toLowerCase()) ||
      item.toLowerCase() === item2.toLowerCase()
    )
  );
}

function calculateCommunicationCompatibility(agent1, agent2) {
  // Similar communication styles score higher
  const style1 = (agent1.communicationStyle || '').toLowerCase();
  const style2 = (agent2.communicationStyle || '').toLowerCase();
  
  const words1 = style1.split(/[, ]+/);
  const words2 = style2.split(/[, ]+/);
  
  let overlap = 0;
  words1.forEach(w => {
    if (words2.some(w2 => w === w2 || w.includes(w2) || w2.includes(w))) {
      overlap++;
    }
  });
  
  return Math.min(5, overlap * 2);
}

function calculatePersonalityCompatibility(type1, type2) {
  if (!type1 || !type2) return 3;
  
  // MBTI compatibility heuristics
  // Complementary types score higher
  const COMPATIBILITY = {
    'ENTJ-INFP': 8, 'ENTJ-ENFP': 7, 'ENTJ-INTJ': 6, 'ENTJ-INTP': 7,
    'ENFJ-INFP': 9, 'ENFJ-ENFP': 7, 'ENFJ-ISFP': 8, 'ENFJ-INFJ': 7,
    'ENFP-INTJ': 8, 'ENFP-INFJ': 9, 'ENFP-INFP': 7, 'ENFP-ENFJ': 7,
    'INTJ-ENFP': 8, 'INTJ-ENTP': 7, 'INTJ-ENTJ': 6, 'INTJ-INFJ': 6,
    'INFJ-ENFP': 9, 'INFJ-ENTP': 8, 'INFJ-INFP': 7, 'INFJ-ENFJ': 7,
    'INFP-ENFJ': 9, 'INFP-ENTJ': 8, 'INFP-INFJ': 7, 'INFP-ENFP': 7,
    'INTP-ENTJ': 7, 'INTP-ENFJ': 6, 'INTP-ENTP': 7, 'INTP-INTJ': 6,
    'ENTP-INFJ': 8, 'ENTP-INTJ': 7, 'ENTP-ENFP': 7, 'ENTP-INTP': 7,
    'ESTP-ISFJ': 8, 'ESTP-ISTJ': 6, 'ESTP-ESFP': 6,
    'ESFP-ISFJ': 7, 'ESFP-ISTJ': 7, 'ESFP-ESTP': 6,
    'ISTJ-ENFP': 6, 'ISTJ-ESFP': 7, 'ISTJ-ESTJ': 6,
    'ISFJ-ESTP': 8, 'ISFJ-ESFP': 7, 'ISFJ-ENFJ': 7,
    'ISTP-ESFJ': 7, 'ISTP-ESTJ': 6, 'ISTP-ENFP': 6,
    'ISFP-ENFJ': 8, 'ISFP-ESTJ': 6, 'ISFP-ESFJ': 7,
    'ESTJ-ISFP': 6, 'ESTJ-ISTP': 6, 'ESTJ-ISTJ': 5,
    'ESFJ-ISTP': 7, 'ESFJ-ISFP': 7, 'ESFJ-ISFJ': 6
  };
  
  const key1 = `${type1}-${type2}`;
  const key2 = `${type2}-${type1}`;
  
  return COMPATIBILITY[key1] || COMPATIBILITY[key2] || 5;
}

/**
 * Run all dates for a group of people
 * Each person dates every other person
 */
export function runAllDates(people) {
  const results = [];
  
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const result = simulateDate(people[i], people[j]);
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Simulate an authentic date using NVIDIA Nemotron 120B with swappable keys.
 * Falls back to deterministic engine if keys are not set or unavailable.
 */
export async function simulateDateWithNemotron(person1, person2) {
  if (!isLLMAvailable()) {
    const fallback = simulateDate(person1, person2);
    fallback.llmMetadata = {
      poweredBy: 'Autonomous Deterministic Engine (No NVIDIA Keys Set)',
      isRealLLM: false
    };
    return fallback;
  }

  const agent1 = createAgent(person1);
  const agent2 = createAgent(person2);

  try {
    const prompt = `You are orchestrating an autonomous dating conversation between two real people represented as AI agents:

Agent 1: ${agent1.name} (${agent1.personalityType}, ${agent1.communicationStyle})
- City/Location: ${person1.location || 'Global'}
- Needs: ${(agent1.needs || []).join(', ')}
- Hobbies: ${(agent1.hobbies || []).join(', ')}
- Interests: ${(agent1.interests || []).join(', ')}
- Values: ${(agent1.values || []).join(', ')}

Agent 2: ${agent2.name} (${agent2.personalityType}, ${agent2.communicationStyle})
- City/Location: ${person2.location || 'Global'}
- Needs: ${(agent2.needs || []).join(', ')}
- Hobbies: ${(agent2.hobbies || []).join(', ')}
- Interests: ${(agent2.interests || []).join(', ')}
- Values: ${(agent2.values || []).join(', ')}

Simulate an authentic, engaging 6-to-8 turn dating dialogue across 4 phases:
1. Ice Breaking: Authentic greetings and witty first impressions based on their real personalities.
2. Shared Passions: Natural discovery of hobbies, travel, tech, or creative pursuits.
3. Vulnerability & Values: Honest conversation about ambition, work-life balance, relationships, and emotional needs.
4. Chemistry Verdict: Mutual conclusion and closing remarks.

Return ONLY a valid JSON object matching this exact schema:
{
  "chemistryScore": 82,
  "verdict": "Instant Spark with Strong Mutual Ambition",
  "conversation": [
    {
      "phase": "Ice Breaking",
      "speaker": "${agent1.name}",
      "message": "...",
      "mood": "curious"
    },
    {
      "phase": "Ice Breaking",
      "speaker": "${agent2.name}",
      "message": "...",
      "mood": "engaged"
    }
  ],
  "sharedInterests": ["..."],
  "sharedHobbies": ["..."],
  "sharedValues": ["..."],
  "compatibility": {
    "interests": 80,
    "hobbies": 75,
    "values": 85,
    "personality": 80,
    "communication": 85
  }
}`;

    const completion = await createNemotronCompletion({
      messages: [
        { role: 'system', content: 'You are an advanced AI dating simulation orchestrator powered by NVIDIA Nemotron 120B. Output ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 3000
    });

    let raw = completion.content.trim();
    if (raw.startsWith('```json')) {
      raw = raw.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (raw.startsWith('```')) {
      raw = raw.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(raw);

    return {
      id: `date-${person1.id}-${person2.id}`,
      person1: { id: person1.id, name: person1.name },
      person2: { id: person2.id, name: person2.name },
      conversation: Array.isArray(parsed.conversation) && parsed.conversation.length > 0
        ? parsed.conversation
        : simulateDate(person1, person2).conversation,
      chemistryScore: typeof parsed.chemistryScore === 'number' ? parsed.chemistryScore : 72,
      sharedInterests: parsed.sharedInterests || findSharedTopics(agent1.interests, agent2.interests),
      sharedHobbies: parsed.sharedHobbies || findSharedTopics(agent1.hobbies, agent2.hobbies),
      sharedValues: parsed.sharedValues || findSharedTopics(agent1.values, agent2.values),
      compatibility: {
        overall: parsed.chemistryScore || 72,
        interests: parsed.compatibility?.interests || 75,
        hobbies: parsed.compatibility?.hobbies || 70,
        values: parsed.compatibility?.values || 80,
        personality: parsed.compatibility?.personality || 75,
        communication: parsed.compatibility?.communication || 80
      },
      llmMetadata: {
        poweredBy: 'NVIDIA Nemotron 120B',
        model: completion.modelUsed,
        keyIndex: completion.keyIndexUsed,
        totalKeys: completion.totalKeys,
        isRealLLM: true,
        reasoning: completion.reasoning || null
      },
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('[Dating Engine] Nemotron 120B call failed or hit limit, falling back cleanly:', err.message);
    const fallback = simulateDate(person1, person2);
    fallback.llmMetadata = {
      poweredBy: 'Deterministic Engine (NVIDIA Fallback)',
      isRealLLM: false,
      fallbackReason: err.message
    };
    return fallback;
  }
}

