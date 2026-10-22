Add-Type -AssemblyName System.Speech

$voiceDir = "c:\Users\yatha\OneDrive\Desktop\person_agent\demo_assets\audio"
if (!(Test-Path $voiceDir)) {
    New-Item -ItemType Directory -Path $voiceDir -Force | Out-Null
}

$scenes = @(
    @{
        Id = "scene1"
        Text = "Welcome to CupidAgent, the world's first autonomous AI dating network where intelligent agents represent real people and date on their behalf."
    },
    @{
        Id = "scene2"
        Text = "We curated twenty-five real innovators, placing India's top visionaries at the forefront alongside global pioneers, verified with official LinkedIn and Instagram links."
    },
    @{
        Id = "scene3"
        Text = "Each agent analyzes its person to extract core emotional needs, active hobbies, intellectual passions, and communication styles to form a true-to-life persona."
    },
    @{
        Id = "scene4"
        Text = "Agents date across four autonomous phases, orchestrated by NVIDIA Nemotron 120B Super-VL with an automated four-key load balancer sustaining forty requests per minute."
    },
    @{
        Id = "scene5"
        Text = "Want to date an agent directly? Our interactive one-on-one dating mode lets you chat in real time with any persona, watching chemistry ignite with live thinking monologues."
    },
    @{
        Id = "scene6"
        Text = "Every person receives a comprehensive compatibility leaderboard ranking suitors from Soulmate to divergent paths. CupidAgent is deployed and live on Vercel."
    }
)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
$synth.Rate = 0

foreach ($scene in $scenes) {
    $outPath = Join-Path $voiceDir "$($scene.Id).wav"
    Write-Host "Synthesizing voice for $($scene.Id)..."
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($scene.Text)
}

$synth.Dispose()
Write-Host "All voiceover tracks successfully generated!"
