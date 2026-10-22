import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('demo_assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const AUDIO_DIR = path.join(ASSETS_DIR, 'audio');
const CLIPS_DIR = path.join(ASSETS_DIR, 'clips');
const OUTPUT_VIDEO = path.resolve('public', 'cupid_agent_demo.mp4');
const ARTIFACT_VIDEO = 'C:\\Users\\yatha\\.gemini\\antigravity-ide\\brain\\81f2bc74-9e53-45ff-8491-fb7d923b2b9a\\cupid_agent_demo.mp4';

if (!fs.existsSync(CLIPS_DIR)) {
  fs.mkdirSync(CLIPS_DIR, { recursive: true });
}

function getAudioDuration(wavPath) {
  try {
    const stdout = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`,
      { encoding: 'utf-8' }
    );
    return parseFloat(stdout.trim()) || 8.0;
  } catch (e) {
    return 8.0;
  }
}

const scenes = [
  {
    id: 'scene1',
    title: 'CUPIDAGENT // AUTONOMOUS AI DATING PLATFORM',
    subtitle: 'Where Intelligent AI Agents Date on Your Behalf'
  },
  {
    id: 'scene2',
    title: '25+ VERIFIED AGENTS // INDIAN VISIONARIES PRIORITIZED',
    subtitle: 'Official Public LinkedIn & Instagram Profile Sourcing'
  },
  {
    id: 'scene3',
    title: 'AGENT PERSONA ENGINE // PSYCHOLOGICAL SYNTHESIS',
    subtitle: 'Extracting Core Emotional Needs, Hobbies & MBTI Archetypes'
  },
  {
    id: 'scene4',
    title: 'NVIDIA NEMOTRON 120B // 40 RPM SWAPPABLE LOAD BALANCER',
    subtitle: 'Multi-Phase Dates with Internal Monologue Reasoning'
  },
  {
    id: 'scene5',
    title: '1-ON-1 DIRECT DATING // CHAT LIVE WITH REAL PERSONAS',
    subtitle: 'Real-Time Conversational Chemistry & Interactive Sparks'
  },
  {
    id: 'scene6',
    title: 'COMPATIBILITY LEADERBOARD // SOULMATE FIT RANKINGS',
    subtitle: 'Live on Vercel: https://cupid-agent-yatharth.vercel.app/'
  }
];

console.log('🎬 Starting Cinematic Demo Video Synthesis with FFmpeg...\n');

const clipPaths = [];

for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  const imgPath = path.join(IMAGES_DIR, `${scene.id}.png`);
  const audioPath = path.join(AUDIO_DIR, `${scene.id}.wav`);
  const clipPath = path.join(CLIPS_DIR, `${scene.id}.mp4`);

  const duration = getAudioDuration(audioPath) + 0.8; // add small buffer for natural pacing
  const frames = Math.ceil(duration * 30);
  console.log(`Rendering Clip ${i + 1}/${scenes.length}: ${scene.id} (Duration: ${duration.toFixed(2)}s)...`);

  // Clean scale, letterbox pad, and smooth fade transitions
  const videoFilter = `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fade=t=in:st=0:d=0.3,fade=t=out:st=${(duration - 0.3).toFixed(2)}:d=0.3`;

  // Draw modern title card banner at top using local fontfile
  const cleanTitle = scene.title.replace(/'/g, "\\'").replace(/:/g, '\\:');
  const cleanSubtitle = scene.subtitle.replace(/'/g, "\\'").replace(/:/g, '\\:');
  const drawTextFilter = `drawbox=y=0:h=90:color=black@0.75:t=fill,drawbox=y=90:h=3:color=#d946ef@0.9:t=fill,drawtext=fontfile=demo_assets/arial.ttf:text='${cleanTitle}':fontcolor=white:fontsize=32:x=40:y=20,drawtext=fontfile=demo_assets/arial.ttf:text='${cleanSubtitle}':fontcolor=#f0abfc:fontsize=20:x=40:y=58`;

  const fullVideoFilter = `${videoFilter},${drawTextFilter}`;

  // Use NVIDIA NVENC GPU hardware encoder for lightning-fast sub-second rendering
  const ffmpegCmd = `ffmpeg -y -loop 1 -t ${duration} -i "${imgPath}" -i "${audioPath}" -filter_complex "[0:v]${fullVideoFilter}[v];[1:a]afade=t=in:st=0:d=0.2,afade=t=out:st=${(duration - 0.3).toFixed(2)}:d=0.3[a]" -map "[v]" -map "[a]" -c:v h264_nvenc -preset p4 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k "${clipPath}"`;

  execSync(ffmpegCmd, { stdio: 'pipe' });
  clipPaths.push(clipPath);
  console.log(`   ✅ Clip ${i + 1} generated successfully: ${clipPath}`);
}

// Create concat list file
const listFilePath = path.join(CLIPS_DIR, 'concat_list.txt');
const listContent = clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(listFilePath, listContent);

console.log('\n🔗 Concatenating all scenes into master video...');
const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -c copy "${OUTPUT_VIDEO}"`;
execSync(concatCmd, { stdio: 'pipe' });

console.log(`✅ Master Video Generated: ${OUTPUT_VIDEO}`);

// Copy to brain artifacts directory
if (!fs.existsSync(path.dirname(ARTIFACT_VIDEO))) {
  fs.mkdirSync(path.dirname(ARTIFACT_VIDEO), { recursive: true });
}
fs.copyFileSync(OUTPUT_VIDEO, ARTIFACT_VIDEO);
console.log(`✅ Copied to Artifacts: ${ARTIFACT_VIDEO}`);

const stats = fs.statSync(OUTPUT_VIDEO);
console.log(`\n🎉 DEMO VIDEO CREATION COMPLETE! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
