import OpenAI from 'openai';

/**
 * Multi-Key Load Balancer & Rotator for NVIDIA Nemotron 120B API.
 * Supports up to 4+ swappable keys across accounts to achieve 40+ RPM throughput.
 * Automatically rotates keys, handles 429 rate-limiting with cooldowns, and retries.
 */

class NvidiaKeyRotator {
  constructor() {
    this.currentIndex = 0;
    this.cooldowns = new Map(); // key -> cooldownExpiryTimestamp
    this.invalidKeys = new Set(); // permanently failed (401/403)
    this.cooldownDurationMs = 60 * 1000; // 60s cooldown on 429
  }

  getAvailableKeys() {
    const rawKeys = [
      process.env.NVIDIA_API_KEY_1,
      process.env.NVIDIA_API_KEY_2,
      process.env.NVIDIA_API_KEY_3,
      process.env.NVIDIA_API_KEY_4,
      ...(process.env.NVIDIA_API_KEYS ? process.env.NVIDIA_API_KEYS.split(',') : []),
      process.env.NVIDIA_API_KEY
    ];

    const keys = rawKeys
      .map(k => (k || '').trim())
      .filter(k => k.length > 5 && !this.invalidKeys.has(k));

    // Deduplicate preserving order
    return Array.from(new Set(keys));
  }

  getNextKey() {
    const keys = this.getAvailableKeys();
    if (keys.length === 0) return null;

    const now = Date.now();
    // Try to find a key not in cooldown
    for (let i = 0; i < keys.length; i++) {
      const idx = (this.currentIndex + i) % keys.length;
      const key = keys[idx];
      const cooldownUntil = this.cooldowns.get(key) || 0;

      if (now > cooldownUntil) {
        this.currentIndex = (idx + 1) % keys.length;
        return { key, keyIndex: idx, totalKeys: keys.length };
      }
    }

    // All keys are on cooldown: pick the one that clears soonest
    let earliestKey = keys[0];
    let earliestTime = Infinity;
    keys.forEach((key, idx) => {
      const time = this.cooldowns.get(key) || 0;
      if (time < earliestTime) {
        earliestTime = time;
        earliestKey = key;
        this.currentIndex = (idx + 1) % keys.length;
      }
    });

    return { key: earliestKey, keyIndex: this.currentIndex, totalKeys: keys.length, onCooldown: true };
  }

  markRateLimited(key) {
    this.cooldowns.set(key, Date.now() + this.cooldownDurationMs);
    console.warn(`[NVIDIA Key Rotator] Key ...${key.slice(-4)} hit 429 rate limit. Cooling down for 60s.`);
  }

  markUnauthorized(key) {
    this.invalidKeys.add(key);
    console.warn(`[NVIDIA Key Rotator] Key ...${key.slice(-4)} authorization failed (403/401). Marked inactive.`);
  }

  getStatus() {
    const keys = this.getAvailableKeys();
    const now = Date.now();
    const activeKeys = keys.filter(k => (this.cooldowns.get(k) || 0) <= now).length;
    return {
      configuredKeysCount: keys.length,
      activeKeysCount: activeKeys,
      invalidKeysCount: this.invalidKeys.size,
      isAvailable: keys.length > 0,
      targetModel: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b'
    };
  }
}

export const keyRotator = new NvidiaKeyRotator();

export function isLLMAvailable() {
  return keyRotator.getAvailableKeys().length > 0;
}

/**
 * Execute chat completion using NVIDIA Nemotron 120B with automatic key swapping.
 */
export async function createNemotronCompletion({
  messages,
  temperature = 0.8,
  top_p = 0.95,
  max_tokens = 2048,
  model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b',
  enableThinking = true
}) {
  const keys = keyRotator.getAvailableKeys();
  if (keys.length === 0) {
    throw new Error('No valid NVIDIA API keys available.');
  }

  const maxAttempts = Math.min(keys.length, 3);
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const keyInfo = keyRotator.getNextKey();
    if (!keyInfo) break;

    try {
      const client = new OpenAI({
        apiKey: keyInfo.key,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        timeout: 10000,
        maxRetries: 0
      });

      const streamResponse = await client.chat.completions.create({
        model,
        messages,
        temperature,
        top_p,
        max_tokens,
        chat_template_kwargs: enableThinking ? { enable_thinking: true } : undefined,
        stream: true
      });

      let reasoning = '';
      let content = '';

      for await (const chunk of streamResponse) {
        const deltaReasoning = chunk.choices[0]?.delta?.reasoning_content;
        if (deltaReasoning) {
          reasoning += deltaReasoning;
        }
        const deltaContent = chunk.choices[0]?.delta?.content || '';
        if (deltaContent) {
          content += deltaContent;
        }
      }

      return {
        success: true,
        content: content.trim(),
        reasoning: reasoning.trim(),
        modelUsed: model,
        keyIndexUsed: keyInfo.keyIndex + 1,
        totalKeys: keyInfo.totalKeys
      };
    } catch (err) {
      lastError = err;
      const status = err.status || err.statusCode;
      const isRateLimit = status === 429 || (err.message && err.message.includes('429'));
      const isAuthError = status === 401 || status === 403 || (err.message && (err.message.includes('401') || err.message.includes('403')));
      const isServerTransient = status >= 500 && status < 600;

      if (isRateLimit) {
        keyRotator.markRateLimited(keyInfo.key);
        continue;
      }

      if (isAuthError) {
        keyRotator.markUnauthorized(keyInfo.key);
        continue;
      }

      if (isServerTransient) {
        keyRotator.markRateLimited(keyInfo.key);
        continue;
      }

      console.error(`[NVIDIA Nemotron Error] Attempt ${attempt + 1}:`, err.message);
      if (attempt === maxAttempts - 1) throw err;
    }
  }

  throw lastError || new Error('All NVIDIA keys exhausted or rate-limited.');
}
