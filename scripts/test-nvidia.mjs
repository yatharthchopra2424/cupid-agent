import OpenAI from 'openai';
import { keyRotator, createNemotronCompletion } from '../src/lib/nvidia-client.js';
import { getAllPeople } from '../src/lib/store.js';
import { simulateDateWithNemotron } from '../src/lib/dating-engine.js';

function maskKey(key) {
  if (!key || key.length < 8) return 'invalid-key';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

async function testSingleKey(key, index, model) {
  const masked = maskKey(key);
  console.log(`\n🔑 Testing Key #${index + 1}: ${masked}`);
  const startTime = Date.now();

  try {
    const client = new OpenAI({
      apiKey: key,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const completion = await client.chat.completions.create({
      model: model || 'nvidia/nemotron-3.5-super-vl-120b-a12b',
      messages: [{ role: 'user', content: 'Say "NVIDIA Nemotron Active" in 3 words.' }],
      max_tokens: 64,
      temperature: 0.2,
      chat_template_kwargs: { enable_thinking: true },
      stream: true,
    });

    let reasoning = '';
    let content = '';

    for await (const chunk of completion) {
      const deltaR = chunk.choices[0]?.delta?.reasoning_content;
      if (deltaR) reasoning += deltaR;
      const deltaC = chunk.choices[0]?.delta?.content || '';
      if (deltaC) content += deltaC;
    }

    const duration = Date.now() - startTime;
    console.log(`   ✅ Status: ACTIVE & VALID (${duration}ms)`);
    console.log(`   💬 Reply: "${content.trim()}"`);
    console.log(`   🧠 Thinking captured: ${reasoning ? `Yes (${reasoning.length} chars)` : 'No'}`);
    return { success: true, key: masked, duration, reasoning: Boolean(reasoning) };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.log(`   ❌ Error: ${err.message} (${duration}ms)`);
    return { success: false, key: masked, error: err.message };
  }
}

async function run() {
  console.log('====================================================');
  console.log('   NVIDIA Nemotron 120B Multi-Key Diagnostic Test  ');
  console.log('====================================================');

  const rawKeys = keyRotator.getAvailableKeys();
  const targetModel = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b';

  console.log(`Configured Model: ${targetModel}`);
  console.log(`Detected Keys in .env: ${rawKeys.length}`);

  if (rawKeys.length === 0) {
    console.error('❌ No keys detected in process.env. Please verify .env has NVIDIA_API_KEY_1..4 or NVIDIA_API_KEY');
    process.exit(1);
  }

  const results = [];
  for (let i = 0; i < rawKeys.length; i++) {
    const res = await testSingleKey(rawKeys[i], i, targetModel);
    results.push(res);
  }

  console.log('\n====================================================');
  console.log('   Testing End-to-End Autonomous Date Simulation    ');
  console.log('====================================================');
  try {
    const people = getAllPeople();
    const p1 = people[0];
    const p2 = people[1];
    console.log(`Launching Nemotron 120B date: ${p1.name} x ${p2.name}...`);
    const dateResult = await simulateDateWithNemotron(p1, p2);
    console.log(`✅ Simulation Success!`);
    console.log(`- Model: ${dateResult.llmMetadata?.model || 'nvidia/nemotron-3.5-super-vl-120b-a12b'}`);
    console.log(`- Served by: ${dateResult.llmMetadata?.poweredBy} (Key #${dateResult.llmMetadata?.keyIndex || 1})`);
    console.log(`- Chemistry Score: ${dateResult.chemistryScore}%`);
    console.log(`- Total Conversation Turns: ${dateResult.conversation?.length}`);
    if (dateResult.llmMetadata?.reasoning) {
      console.log(`- Thinking Monologue: "${dateResult.llmMetadata.reasoning.slice(0, 140)}..."`);
    }
  } catch (err) {
    console.error('❌ Simulation Error:', err.message);
  }

  console.log('\n====================================================');
  console.log('   Summary Report                                   ');
  console.log('====================================================');
  const validCount = results.filter(r => r.success).length;
  console.log(`Total Keys Tested: ${results.length}`);
  console.log(`Active Valid Keys: ${validCount} / ${results.length}`);
  console.log(`40 RPM Capacity: ${validCount >= 3 ? '✅ Ready (3-4 keys load balanced)' : '⚠️ Moderate (add 4 keys for full 40 RPM)'}`);
}

run();
