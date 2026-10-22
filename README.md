# 💘 CupidAgent: Autonomous AI Dating Network

> **Where Autonomous AI Agents Date on Your Behalf — Powered by NVIDIA Nemotron 120B Super-VL with 4-Key Swappable 40 RPM Load Balancing.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-blueviolet)](https://turbo.build/)
[![NVIDIA Nemotron 120B](https://img.shields.io/badge/NVIDIA-Nemotron--120B--Super--VL-76B900?logo=nvidia)](https://build.nvidia.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌟 Overview

**CupidAgent** is an autonomous dating platform designed around a radical premise: **real people are represented by AI agents that date on their behalf.**

1. **Real People Directory**: Sourced from verified public profiles — each person has two official links: their verified public **LinkedIn** and public **Instagram**.
2. **Indian Cohort Priority**: Indian innovators, founders, and creators are explicitly prioritized and showcased at the top of the directory, accompanied by global tech pioneers.
3. **Agent Persona Synthesis**: Each agent analyzes its person to extract:
   - Core Emotional Needs (e.g. intellectual sparring, psychological safety, ambitious encouragement)
   - Active Hobbies & Intellectual Passions
   - Character Qualities, MBTI Archetypes, and Communication Styles
4. **Autonomous 4-Phase Dating Simulation**:
   - **Phase 1: Ice-breakers & First Impressions**
   - **Phase 2: Topic & Passion Exploration** (shared hobbies & contrasts)
   - **Phase 3: Deep Dive & Values Alignment** (vulnerable exchanges & long-term goals)
   - **Phase 4: Chemistry Check & Verdict** (with multi-factor numerical score)
5. **NVIDIA Nemotron 120B Super-VL with 4-Key 40 RPM Architecture**:
   - Integrates `nvidia/nemotron-3.5-super-vl-120b-a12b` via the official OpenAI SDK.
   - Built-in multi-account key rotator supporting **4 swappable API keys** to distribute traffic and hit **40 RPM**.
   - Automatic 60-second cooldown handling on HTTP 429 rate limits with instant key failover.
   - Live stream capture of internal monologue and reasoning (`reasoning_content`).
6. **Comprehensive Fit Rankings**:
   - For every person, an ordered suitor leaderboard is calculated from **#1 Soulmate** down to **Divergent Path**.
   - Multi-factor breakdown: Interests (30%), Hobbies (20%), Values (25%), Personality (15%), Communication (10%).
   - Transparent natural language rationale explaining *why* they fit or clash.

---

## 🇮🇳 Verified Real People Directory

CupidAgent includes **25+ verified real public profiles**, highlighting Indian entrepreneurial icons at the top followed by global pioneers:

| Rank | Name | Role / Known For | Region | LinkedIn & Instagram |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Anupam Mittal** | Founder & CEO, Shaadi.com • Shark Tank India | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/anupammittal/) • [Instagram](https://www.instagram.com/anupammittal.me/) |
| **02** | **Nikhil Kamath** | Co-Founder, Zerodha & True Beacon • WTF Podcast | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/nikhilkamathcio/) • [Instagram](https://www.instagram.com/nikhilkamath88/) |
| **03** | **Deepika Padukone** | Global Icon, Actor & Founder, 82°E • Mental Health Advocate | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/deepika-padukone/) • [Instagram](https://www.instagram.com/deepikapadukone/) |
| **04** | **Ghazal Alagh** | Co-Founder & CIO, Mamaearth (Honasa Consumer) | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/ghazal-alagh/) • [Instagram](https://www.instagram.com/ghazalalagh/) |
| **05** | **Aman Gupta** | Co-Founder & CMO, boAt Lifestyle | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/amangupta82/) • [Instagram](https://www.instagram.com/boatxaman/) |
| **06** | **Radhika Gupta** | MD & CEO, Edelweiss Mutual Fund • "Girl with the Broken Neck" | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/radhikaguptaedebuzz/) • [Instagram](https://www.instagram.com/radhikagupta500/) |
| **07** | **Ranveer Allahbadia** | Founder, BeerBiceps & Monk-E • Host, The Ranveer Show | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/ranveer-allahbadia/) • [Instagram](https://www.instagram.com/beerbiceps/) |
| **08** | **Priyanka Chopra Jonas** | Global Icon, Producer, Philanthropist & Investor | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/priyankachopra/) • [Instagram](https://www.instagram.com/priyankachopra/) |
| **09** | **Ritesh Agarwal** | Founder & Group CEO, OYO Rooms | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/riteshagar/) • [Instagram](https://www.instagram.com/riteshagar/) |
| **10** | **Zarna Garg** | Global Stand-up Comedian, Screenwriter & Podcaster | 🇮🇳 India | [LinkedIn](https://www.linkedin.com/in/zarna-garg/) • [Instagram](https://www.instagram.com/zarnagarg/) |
| **11-25**| **Global Pioneers** | Gary Vaynerchuk, Tim Ferriss, Marie Forleo, Alexis Ohanian, Sara Blakely, Reid Hoffman, Whitney Wolfe Herd, Brian Chesky, Mel Robbins, Andrew Huberman, etc. | 🌍 Global | Verified LinkedIn & Public Instagram profiles |

---

## 🤖 NVIDIA Nemotron 120B Super-VL Architecture

```
                                  [ User Date Request ]
                                            │
                                            ▼
                           ┌───────────────────────────────────┐
                           │   NvidiaKeyRotator (Round-Robin)  │
                           └─────────────────┬─────────────────┘
                                             │
             ┌─────────────────┬─────────────┴───┬─────────────────┐
             ▼                 ▼                 ▼                 ▼
      [ Key #1 Account ] [ Key #2 Account ] [ Key #3 Account ] [ Key #4 Account ]
             │                 │                 │                 │
             └─────────────────┴─────────────┬───┴─────────────────┘
                                             ▼
                        [ NVIDIA NIM API Base URL ]
                   https://integrate.api.nvidia.com/v1
                                             │
                                             ▼
                      [ Model: nemotron-3.5-super-vl-120b ]
                          chat_template_kwargs: {
                             "enable_thinking": true
                          }
                          stream: true
                                             │
                                             ▼
                        ┌───────────────────────────────┐
                        │   Reasoning & Monologue       │
                        │   delta.reasoning_content     │
                        ├───────────────────────────────┤
                        │   Multi-Turn Conversation     │
                        │   delta.content (4 Phases)    │
                        └───────────────────────────────┘
```

### 4-Key Swappable Rotator Details:
- **Rate Limit Resilience**: NVIDIA free/standard tiers typically allow 10–15 RPM per account. By round-robining across 4 account keys, CupidAgent sustains **40 RPM**.
- **Self-Healing Cooldown**: When any key receives an HTTP `429`, the rotator isolates that key on a 60s cooldown and immediately retries with the next active key.
- **Thinking Monologue**: Nemotron's step-by-step reasoning is streamed and accessible in the UI through the expandable *"🧠 View Nemotron 120B Monologue"* drawer.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yatharthchopra2424/cupid-agent.git
cd cupid-agent
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your NVIDIA NGC/NIM keys:
```env
NVIDIA_API_KEY_1=nvapi-key-from-account-1
NVIDIA_API_KEY_2=nvapi-key-from-account-2
NVIDIA_API_KEY_3=nvapi-key-from-account-3
NVIDIA_API_KEY_4=nvapi-key-from-account-4

NVIDIA_MODEL=nvidia/nemotron-3.5-super-vl-120b-a12b
```
*(Note: If no keys are provided, CupidAgent runs seamlessly in hybrid/fallback mode with its built-in deterministic dating and ranking engine).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deploying to Vercel

CupidAgent is configured specifically for zero-config Vercel deployment:
- **Serverless File Persistence**: Utilizes dynamic `/tmp/people.json` pathing on Vercel (`process.env.VERCEL`) to prevent `EROFS` read-only errors.
- **Turbopack & Next.js 16 Compatible**: Full App Router route handlers with dynamic streaming evaluation.

### Deploy Steps:
1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import `cupid-agent`.
3. In the **Environment Variables** section, add:
   - `NVIDIA_API_KEY_1`
   - `NVIDIA_API_KEY_2`
   - `NVIDIA_API_KEY_3`
   - `NVIDIA_API_KEY_4`
   - `NVIDIA_MODEL` (set to `nvidia/nemotron-3.5-super-vl-120b-a12b`)
4. Click **Deploy**. Your autonomous AI dating network will be live in seconds!

---

## 🧪 Testing

Run the included verification suite:
```bash
node src/lib/nvidia-client.js
```
Or run the full production build:
```bash
npm run build
```

---

## 📄 License
MIT © 2026 Yatharth Chopra.
