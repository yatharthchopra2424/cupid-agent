import { NextResponse } from 'next/server';
import { getPersonById, getAllPeople } from '@/lib/store';
import { createNemotronCompletion } from '@/lib/nvidia-client';

export const maxDuration = 60;

function generateFallbackResponse(person, userMessage, historyLength) {
  const analysis = person.analysis || {};
  const interests = analysis.interests || ['entrepreneurship', 'growth', 'culture'];
  const hobbies = analysis.hobbies || ['traveling', 'reading', 'fitness'];
  const style = analysis.communicationStyle || 'warm and engaging';
  const name = person.name;

  const responses = [
    `I love that you brought that up. In my journey, especially building and investing, authenticity is everything. What drew you into that direction?`,
    `Haha, that's sharp! You clearly have a unique perspective. When I'm not occupied with work, I often lean into ${hobbies[0] || 'reading'} to decompress. What's your go-to way to unwind?`,
    `Fascinating point. I look for depth and intellectual chemistry above all else. Are you usually more driven by intuition or calculated risk?`,
    `That reminds me of a conversation I had recently about ${interests[0] || 'passion'}. There's something electric about someone who knows what they want. Tell me more.`,
    `You have a really intriguing vibe. I appreciate people who don't just stick to small talk. What's a core value you never compromise on?`
  ];

  const pick = responses[historyLength % responses.length];

  return {
    content: pick,
    mood: historyLength % 2 === 0 ? 'engaged' : 'curious',
    reasoning: `Deterministic persona fallback for ${name} (${style}). Focused on ${interests[0]} and emotional rapport.`,
    isRealLLM: false
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { personId, messages = [], userMessage } = body;

    if (!personId) {
      return NextResponse.json({ success: false, error: 'personId is required' }, { status: 400 });
    }

    const person = getPersonById(personId);
    if (!person) {
      return NextResponse.json({ success: false, error: 'Agent profile not found' }, { status: 404 });
    }

    const analysis = person.analysis || {};
    const linkedin = person.scraped?.linkedin || {};
    const instagram = person.scraped?.instagram || {};

    // Build the dynamic persona system prompt
    const systemPrompt = `You are ${person.name}, on a private 1-on-1 date with the user.
Your background & real-world persona:
- Role/Headline: ${linkedin.headline || 'Innovator & Visionary'}
- Location: ${person.location || person.region || 'Global'}
- Background Summary: ${linkedin.summary || 'Accomplished public figure'}
- Key Experiences: ${Array.isArray(linkedin.experience) ? linkedin.experience.join(', ') : 'Leadership & innovation'}
- Instagram Lifestyle & Aesthetic: ${instagram.bio || ''} (Aesthetic: ${instagram.aesthetic || 'Dynamic & ambitious'})
- Active Hobbies: ${analysis.hobbies?.join(', ') || 'Reading, travel, fitness'}
- Intellectual Passions: ${analysis.interests?.join(', ') || 'Tech, venture, culture'}
- Core Emotional Needs in a Partner: ${analysis.needs?.join(', ') || 'Intellectual stimulation, emotional authenticity, mutual ambition'}
- Personality Archetype: ${analysis.personalityType || 'Leader'} (${analysis.gender || 'Person'})
- Communication Style: ${analysis.communicationStyle || 'Charismatic, articulate, and thoughtful'}

Dating Context & Rules:
1. You are actively on a 1-on-1 date with the human user chatting with you right now.
2. Stay strictly in-character as ${person.name}. Embody their authentic voice, vocabulary, worldview, charm, and cadence.
3. Be attentive, flirty when appropriate, perceptively curious about the user, and intellectually engaging.
4. Keep your responses concise and conversational (2 to 4 sentences max). Never sound like an AI assistant.
5. React to what the user shares and ask thoughtful follow-ups to gauge compatibility.`;

    // Format chat messages for Nemotron 120B
    const formattedMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Append history
    for (const msg of messages.slice(-10)) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        formattedMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    if (userMessage) {
      formattedMessages.push({ role: 'user', content: userMessage });
    }

    try {
      const nemotronCall = createNemotronCompletion({
        messages: formattedMessages,
        temperature: 0.85,
        max_tokens: 450,
        enableThinking: true
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Nemotron 1-on-1 chat timeout on serverless')), 12000)
      );

      const completion = await Promise.race([nemotronCall, timeoutPromise]);

      return NextResponse.json({
        success: true,
        reply: {
          role: 'assistant',
          content: completion.content,
          mood: 'engaged',
          reasoning: completion.reasoning || null,
          isRealLLM: true,
          modelUsed: completion.modelUsed,
          keyIndexUsed: completion.keyIndexUsed
        }
      });
    } catch (llmError) {
      console.warn(`[1-on-1 Chat] LLM call failed or timed out: ${llmError.message}. Using persona fallback.`);
      const fallback = generateFallbackResponse(person, userMessage, messages.length);
      return NextResponse.json({
        success: true,
        reply: {
          role: 'assistant',
          content: fallback.content,
          mood: fallback.mood,
          reasoning: fallback.reasoning,
          isRealLLM: false,
          fallbackReason: llmError.message
        }
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
