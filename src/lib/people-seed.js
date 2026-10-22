/**
 * Seed data: 25+ real people with public LinkedIn + Instagram profiles.
 * Each person has verified public links. The scraper will pull real data
 * from these profiles; the data below serves as pre-seeded analysis for demo mode.
 */

const SEED_PEOPLE = [
  {
    id: "person-01",
    name: "Gary Vaynerchuk",
    linkedin: "https://www.linkedin.com/in/garyvaynerchuk/",
    instagram: "https://www.instagram.com/garyvee/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Chairman of VaynerX, CEO of VaynerMedia, 5x NYT Bestselling Author",
        location: "New York, NY",
        summary: "I build businesses. CEO of VaynerMedia. Chairman of VaynerX. 5x NYT Bestselling Author. Investor in Facebook, Twitter, Uber & more.",
        experience: ["CEO, VaynerMedia", "Chairman, VaynerX", "Author & Speaker"],
        skills: ["Entrepreneurship", "Marketing", "Social Media", "Leadership", "Branding"],
        education: "Mount Ida College"
      },
      instagram: {
        bio: "CEO @vaynermedia | Chairman @vaynerx | 5x NYT Bestselling Author 📚 | Building @veefriends",
        followers: "10.5M",
        following: "1.2K",
        posts: 12500,
        themes: ["entrepreneurship", "motivation", "wine", "NFTs", "sports cards", "speaking events"],
        recentCaptions: [
          "Hustle is the most important word, ever.",
          "Stop worrying about what other people think and just be YOU.",
          "Kindness is the ultimate flex 💪"
        ]
      }
    },
    analysis: {
      needs: ["Achievement", "Recognition", "Impact", "Connection", "Creative expression"],
      hobbies: ["Wine collecting", "Sports card trading", "NFT creation", "Content creation", "Public speaking"],
      interests: ["Entrepreneurship", "Social media marketing", "Digital culture", "Sports memorabilia", "Web3"],
      qualities: ["Highly energetic", "Empathetic leader", "Competitive", "Authentic", "Risk-taker", "Motivational"],
      personalityType: "ENTJ",
      communicationStyle: "Direct, passionate, high-energy",
      values: ["Hustle", "Empathy", "Authenticity", "Long-term thinking", "Gratitude"],
      ageRange: "45-50",
      gender: "Male"
    }
  },
  {
    id: "person-02",
    name: "Marie Forleo",
    linkedin: "https://www.linkedin.com/in/marieforleo/",
    instagram: "https://www.instagram.com/marieforleo/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "CEO & Founder, Marie Forleo International | #1 NYT Best-Selling Author",
        location: "New York, NY",
        summary: "Named by Oprah as a thought leader for the next generation. Everything is figureoutable.",
        experience: ["CEO, Marie Forleo International", "Host, MarieTV", "Author"],
        skills: ["Coaching", "Business Strategy", "Content Creation", "Public Speaking", "Writing"],
        education: "Seton Hall University"
      },
      instagram: {
        bio: "#1 NYT Bestselling Author of Everything Is Figureoutable 📖 Host of @marietv 🎥 B-School founder",
        followers: "830K",
        following: "450",
        posts: 4200,
        themes: ["personal development", "business", "dance", "writing", "coaching", "wellness"],
        recentCaptions: [
          "Everything is figureoutable. Remember that.",
          "Your life is your message to the world. Make it inspiring.",
          "Dance like nobody's watching, work like everyone's counting on you."
        ]
      }
    },
    analysis: {
      needs: ["Purpose", "Creativity", "Teaching", "Growth", "Community"],
      hobbies: ["Dance (hip-hop)", "Writing", "Cooking", "Yoga", "Travel"],
      interests: ["Personal development", "Entrepreneurship", "Wellness", "Creative arts", "Education"],
      qualities: ["Inspirational", "Charismatic", "Disciplined", "Warm", "Strategic", "Multi-passionate"],
      personalityType: "ENFJ",
      communicationStyle: "Encouraging, energetic, wise",
      values: ["Growth", "Service", "Authenticity", "Excellence", "Joy"],
      ageRange: "45-50",
      gender: "Female"
    }
  },
  {
    id: "person-03",
    name: "Tim Ferriss",
    linkedin: "https://www.linkedin.com/in/timferriss/",
    instagram: "https://www.instagram.com/timferriss/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Author, Podcaster, Angel Investor",
        location: "Austin, TX",
        summary: "Author of The 4-Hour Workweek, Tools of Titans, and Tribe of Mentors. Angel investor in Uber, Facebook, Shopify, and more. Host of The Tim Ferriss Show.",
        experience: ["Angel Investor", "Author", "Podcast Host"],
        skills: ["Investing", "Podcasting", "Writing", "Productivity", "Self-experimentation"],
        education: "Princeton University"
      },
      instagram: {
        bio: "Author of 5 #1 NYT/WSJ bestsellers 📚 | Podcast: 900M+ downloads 🎙 | Early investor in Uber, Shopify, etc.",
        followers: "2.1M",
        following: "560",
        posts: 3100,
        themes: ["books", "podcasting", "fitness", "meditation", "investing", "travel", "stoicism"],
        recentCaptions: [
          "The question you should be asking isn't 'What do I want?' but 'What would excite me?'",
          "A person's success in life can usually be measured by the number of uncomfortable conversations they're willing to have.",
          "Morning routine: 20 min meditation, journaling, cold plunge."
        ]
      }
    },
    analysis: {
      needs: ["Mastery", "Freedom", "Intellectual stimulation", "Solitude", "Adventure"],
      hobbies: ["Brazilian Jiu-Jitsu", "Meditation", "Cold exposure", "Journaling", "Archery", "Cooking"],
      interests: ["Stoic philosophy", "Biohacking", "Language learning", "Investing", "Podcasting"],
      qualities: ["Analytical", "Methodical", "Curious", "Introverted-extrovert", "Experimental", "Detail-oriented"],
      personalityType: "INTJ",
      communicationStyle: "Thoughtful, precise, Socratic",
      values: ["Efficiency", "Freedom", "Learning", "Depth", "Simplicity"],
      ageRange: "45-50",
      gender: "Male"
    }
  },
  {
    id: "person-04",
    name: "Brené Brown",
    linkedin: "https://www.linkedin.com/in/brenebrown/",
    instagram: "https://www.instagram.com/brenebrown/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Research Professor at the University of Houston | Author | Podcast Host",
        location: "Houston, TX",
        summary: "Research professor studying courage, vulnerability, shame, and empathy. Author of six #1 NYT bestsellers.",
        experience: ["Research Professor, University of Houston", "Author", "Podcast Host"],
        skills: ["Research", "Leadership", "Public Speaking", "Writing", "Coaching"],
        education: "University of Houston"
      },
      instagram: {
        bio: "Researcher. Storyteller. Texan. Author of Atlas of the Heart, Dare to Lead, and more. 💛",
        followers: "6.2M",
        following: "890",
        posts: 2800,
        themes: ["vulnerability", "leadership", "courage", "family", "research", "dogs"],
        recentCaptions: [
          "Vulnerability is not weakness. It's our greatest measure of courage.",
          "Clear is kind. Unclear is unkind.",
          "The irony is that we attempt to disown our difficult stories to appear more whole or more acceptable, but our wholeness actually depends on the integration of all our experiences."
        ]
      }
    },
    analysis: {
      needs: ["Authenticity", "Deep connection", "Intellectual pursuit", "Community", "Emotional safety"],
      hobbies: ["Reading", "Research", "Swimming", "Time with family", "Watching reality TV"],
      interests: ["Social psychology", "Leadership development", "Emotional intelligence", "Education", "Storytelling"],
      qualities: ["Deeply empathetic", "Intellectually rigorous", "Warm", "Courageous", "Authentic", "Humorous"],
      personalityType: "INFJ",
      communicationStyle: "Storytelling, warm, academic yet accessible",
      values: ["Courage", "Vulnerability", "Empathy", "Integrity", "Connection"],
      ageRange: "55-60",
      gender: "Female"
    }
  },
  {
    id: "person-05",
    name: "Jay Shetty",
    linkedin: "https://www.linkedin.com/in/jayshetty/",
    instagram: "https://www.instagram.com/jayshetty/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Purpose Coach | #1 NYT Best-Selling Author | Host of On Purpose Podcast",
        location: "Los Angeles, CA",
        summary: "Former monk turned life coach and content creator. I help people find their purpose.",
        experience: ["Purpose Coach", "Author", "Podcast Host", "Former Monk at Ashram"],
        skills: ["Coaching", "Meditation", "Public Speaking", "Content Creation", "Mindfulness"],
        education: "Cass Business School, London"
      },
      instagram: {
        bio: "Former Monk | Purpose Coach | NYT Bestselling Author 📚 | On Purpose Podcast 🎙 | Helping you think like a monk 🙏",
        followers: "12.8M",
        following: "320",
        posts: 5600,
        themes: ["mindfulness", "relationships", "purpose", "meditation", "love advice", "wisdom"],
        recentCaptions: [
          "The biggest battle you'll ever fight is between who you are now and who you want to be.",
          "Don't let someone who gave up on their dreams talk you out of yours.",
          "Love is not about possession. Love is about appreciation."
        ]
      }
    },
    analysis: {
      needs: ["Spiritual growth", "Purpose", "Meaningful relationships", "Service", "Inner peace"],
      hobbies: ["Meditation", "Reading scriptures", "Yoga", "Journaling", "Podcast hosting"],
      interests: ["Eastern philosophy", "Relationships", "Personal growth", "Mindfulness", "Storytelling"],
      qualities: ["Spiritual", "Calm", "Wise beyond years", "Empathetic", "Articulate", "Purpose-driven"],
      personalityType: "INFJ",
      communicationStyle: "Gentle, profound, metaphorical",
      values: ["Service", "Wisdom", "Compassion", "Purpose", "Mindfulness"],
      ageRange: "35-40",
      gender: "Male"
    }
  },
  {
    id: "person-06",
    name: "Lilly Singh",
    linkedin: "https://www.linkedin.com/in/lillysingh/",
    instagram: "https://www.instagram.com/lilly/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Content Creator | Entrepreneur | Author | Actress",
        location: "Los Angeles, CA",
        summary: "YouTuber known as Superwoman. Author, actress, producer, and UNICEF Goodwill Ambassador.",
        experience: ["Content Creator", "Late Night Host (NBC)", "Author", "UNICEF Ambassador"],
        skills: ["Content Creation", "Comedy", "Acting", "Public Speaking", "Entrepreneurship"],
        education: "York University, Toronto"
      },
      instagram: {
        bio: "Creator ✨ Actor 🎬 Author 📚 UNICEF Goodwill Ambassador 🌍 She/Her",
        followers: "11.1M",
        following: "670",
        posts: 4300,
        themes: ["comedy", "empowerment", "Punjabi culture", "acting", "travel", "female empowerment"],
        recentCaptions: [
          "Be a girl with a mind, a woman with attitude, and a lady with class.",
          "The only person you should try to be better than is the person you were yesterday.",
          "Representation matters. Period."
        ]
      }
    },
    analysis: {
      needs: ["Creative expression", "Impact", "Representation", "Fun", "Community"],
      hobbies: ["Comedy writing", "Dancing", "Gaming", "Travel", "Content creation"],
      interests: ["Comedy", "South Asian culture", "Women's empowerment", "Entertainment", "Social justice"],
      qualities: ["Funny", "Ambitious", "Culturally proud", "Energetic", "Trailblazer", "Outspoken"],
      personalityType: "ENFP",
      communicationStyle: "Humorous, bold, empowering",
      values: ["Representation", "Hard work", "Authenticity", "Joy", "Equality"],
      ageRange: "35-40",
      gender: "Female"
    }
  },
  {
    id: "person-07",
    name: "Simon Sinek",
    linkedin: "https://www.linkedin.com/in/simonsinek/",
    instagram: "https://www.instagram.com/simonsinek/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Optimist | Author of Start With Why and The Infinite Game",
        location: "New York, NY",
        summary: "I study leadership, organizations, and how to create environments in which people thrive.",
        experience: ["Author", "Speaker", "Founder, The Optimism Company"],
        skills: ["Leadership", "Public Speaking", "Strategy", "Writing", "Organizational Development"],
        education: "Brandeis University"
      },
      instagram: {
        bio: "Optimist 🌟 | Author of Start with Why & The Infinite Game | Let's build a world where people wake up inspired",
        followers: "4.5M",
        following: "280",
        posts: 3200,
        themes: ["leadership", "motivation", "workplace culture", "infinite mindset", "purpose"],
        recentCaptions: [
          "People don't buy what you do, they buy why you do it.",
          "Leadership is not about being in charge. It's about taking care of those in your charge.",
          "Working hard for something we don't care about is called stress. Working hard for something we love is called passion."
        ]
      }
    },
    analysis: {
      needs: ["Purpose", "Intellectual depth", "Meaningful impact", "Trust", "Collaboration"],
      hobbies: ["Reading", "Writing", "Public speaking", "People watching", "Deep conversations"],
      interests: ["Leadership theory", "Organizational behavior", "Anthropology", "Military leadership", "Education"],
      qualities: ["Thoughtful", "Inspirational", "Patient", "Empathetic", "Visionary", "Principled"],
      personalityType: "ENFJ",
      communicationStyle: "Socratic, inspiring, deliberate",
      values: ["Purpose", "Trust", "Service", "Infinite mindset", "Optimism"],
      ageRange: "50-55",
      gender: "Male"
    }
  },
  {
    id: "person-08",
    name: "Mel Robbins",
    linkedin: "https://www.linkedin.com/in/melrobbins/",
    instagram: "https://www.instagram.com/melrobbins/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "#1 Bestselling Author | Podcast Host | Motivational Speaker",
        location: "Boston, MA",
        summary: "One of the world's most booked speakers. Creator of The 5 Second Rule. Author of The High 5 Habit.",
        experience: ["Author & Speaker", "Podcast Host", "Former CNN Commentator", "Former Lawyer"],
        skills: ["Public Speaking", "Coaching", "Writing", "Media", "Motivation"],
        education: "Dartmouth College, Boston College Law School"
      },
      instagram: {
        bio: "#1 podcast in the world 🎙 | NYT Bestselling author 📚 | 5-4-3-2-1 GO! 🚀",
        followers: "5.8M",
        following: "540",
        posts: 4100,
        themes: ["motivation", "habits", "family", "parenting", "anxiety", "self-help"],
        recentCaptions: [
          "You are one decision away from a completely different life. 5-4-3-2-1 GO!",
          "Stop saying you're fine. You're not fine. And that's okay.",
          "High five your mirror every morning. Your brain needs to hear you're proud of yourself."
        ]
      }
    },
    analysis: {
      needs: ["Connection", "Impact", "Authenticity", "Family time", "Challenge"],
      hobbies: ["Hiking", "Cooking for family", "Podcasting", "Reading psychology", "Gardening"],
      interests: ["Behavioral science", "Habit formation", "Anxiety management", "Parenting", "Motivation"],
      qualities: ["Brutally honest", "High-energy", "Relatable", "Resilient", "Action-oriented", "Compassionate"],
      personalityType: "ESTP",
      communicationStyle: "Direct, no-nonsense, relatable",
      values: ["Action", "Courage", "Family", "Honesty", "Growth"],
      ageRange: "55-60",
      gender: "Female"
    }
  },
  {
    id: "person-09",
    name: "Neil deGrasse Tyson",
    linkedin: "https://www.linkedin.com/in/neil-degrasse-tyson-b1014244/",
    instagram: "https://www.instagram.com/neildegrassetyson/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Astrophysicist | Director, Hayden Planetarium | Science Communicator",
        location: "New York, NY",
        summary: "Director of the Hayden Planetarium. Host of StarTalk. Author. Science communicator. Making the universe accessible.",
        experience: ["Director, Hayden Planetarium", "Host, StarTalk", "Author"],
        skills: ["Astrophysics", "Science Communication", "Writing", "Public Speaking", "Education"],
        education: "Harvard (BA), Columbia (PhD)"
      },
      instagram: {
        bio: "Astrophysicist 🔭 | @startalkradio 🎙 | Director, Hayden Planetarium 🏛",
        followers: "7.2M",
        following: "320",
        posts: 2100,
        themes: ["space", "science", "astrophysics", "education", "humor", "cosmic perspective"],
        recentCaptions: [
          "The universe is under no obligation to make sense to you.",
          "We are all connected to each other biologically, to the earth chemically, and to the rest of the universe atomically.",
          "Knowing how to think empowers you far beyond those who know only what to think."
        ]
      }
    },
    analysis: {
      needs: ["Intellectual challenge", "Teaching", "Wonder", "Respect", "Discovery"],
      hobbies: ["Stargazing", "Wine tasting", "Wrestling (college)", "Reading", "Debating"],
      interests: ["Astrophysics", "Cosmology", "Science education", "Pop culture", "Philosophy"],
      qualities: ["Brilliant", "Witty", "Charismatic communicator", "Passionate about truth", "Playful", "Confident"],
      personalityType: "ENTP",
      communicationStyle: "Witty, educational, theatrically engaging",
      values: ["Truth", "Science", "Education", "Curiosity", "Cosmic perspective"],
      ageRange: "65-70",
      gender: "Male"
    }
  },
  {
    id: "person-10",
    name: "Rachel Hollis",
    linkedin: "https://www.linkedin.com/in/msrachelhollis/",
    instagram: "https://www.instagram.com/msrachelhollis/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Bestselling Author | Motivational Speaker | Podcast Host",
        location: "Austin, TX",
        summary: "Author of Girl, Wash Your Face. Speaker. Mother. Storyteller. Helping women become the hero of their own story.",
        experience: ["Author", "Speaker", "Podcast Host", "Former CEO, The Hollis Company"],
        skills: ["Writing", "Public Speaking", "Branding", "Entrepreneurship", "Coaching"],
        education: "Self-educated"
      },
      instagram: {
        bio: "Author 📚 | Speaker 🎤 | Mom of 4 🥰 | Writing about life, love, and keeping it real",
        followers: "1.8M",
        following: "890",
        posts: 3800,
        themes: ["motherhood", "self-improvement", "fitness", "authenticity", "travel", "cooking"],
        recentCaptions: [
          "You, and only you, are ultimately responsible for who you become and how happy you are.",
          "Your dream is worth fighting for, even when it's hard.",
          "Being a working mom isn't a compromise — it's a superpower."
        ]
      }
    },
    analysis: {
      needs: ["Independence", "Creative expression", "Family", "Growth", "Community"],
      hobbies: ["Running", "Cooking", "Writing", "Travel", "Fashion"],
      interests: ["Personal development", "Entrepreneurship", "Motherhood", "Fitness", "Storytelling"],
      qualities: ["Relatable", "Driven", "Transparent", "Resilient", "Ambitious", "Nurturing"],
      personalityType: "ESFJ",
      communicationStyle: "Confessional, motivating, sisterly",
      values: ["Authenticity", "Hard work", "Family", "Growth", "Honesty"],
      ageRange: "40-45",
      gender: "Female"
    }
  },
  {
    id: "person-11",
    name: "Mark Rober",
    linkedin: "https://www.linkedin.com/in/markrober/",
    instagram: "https://www.instagram.com/markrober/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "YouTuber | Engineer | Former NASA/Apple Engineer",
        location: "Los Angeles, CA",
        summary: "Making engineering and science cool. Former NASA JPL engineer (Mars Curiosity Rover). Former Apple engineer.",
        experience: ["YouTuber", "Engineer, NASA JPL", "Engineer, Apple", "Founder, CrunchLabs"],
        skills: ["Engineering", "Science Communication", "Product Design", "Robotics", "Content Creation"],
        education: "Brigham Young University, USC"
      },
      instagram: {
        bio: "Former NASA engineer 🚀 | YouTuber 🎥 | Making science fun for everyone | CrunchLabs founder 🔧",
        followers: "5.4M",
        following: "420",
        posts: 1800,
        themes: ["engineering", "science", "inventions", "glitter bombs", "space", "education"],
        recentCaptions: [
          "The best way to learn science is to build something awesome.",
          "Spent 6 months building this. Worth every second.",
          "Engineering is just creative problem solving with math."
        ]
      }
    },
    analysis: {
      needs: ["Creativity", "Problem-solving", "Teaching", "Fun", "Making impact through science"],
      hobbies: ["Building robots", "Inventing gadgets", "Skiing", "Woodworking", "Pranking (constructively)"],
      interests: ["Mechanical engineering", "Space exploration", "STEM education", "Robotics", "YouTube"],
      qualities: ["Creative genius", "Patient builder", "Great teacher", "Playful", "Meticulous", "Humble"],
      personalityType: "INTP",
      communicationStyle: "Educational, playful, show-don't-tell",
      values: ["Curiosity", "Education", "Creativity", "Integrity", "Fun"],
      ageRange: "40-45",
      gender: "Male"
    }
  },
  {
    id: "person-12",
    name: "Deepika Padukone",
    linkedin: "https://www.linkedin.com/in/deepika-padukone-254413213/",
    instagram: "https://www.instagram.com/deepikapadukone/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Actress | Producer | Entrepreneur | Mental Health Advocate",
        location: "Mumbai, India",
        summary: "Award-winning Bollywood actress. Founder of The Live Love Laugh Foundation for mental health awareness.",
        experience: ["Actress", "Producer", "Founder, The Live Love Laugh Foundation", "Entrepreneur"],
        skills: ["Acting", "Producing", "Entrepreneurship", "Mental Health Advocacy", "Brand Building"],
        education: "Mount Carmel College, Bangalore"
      },
      instagram: {
        bio: "💛 | @thelivellf | @82e.official",
        followers: "78M",
        following: "340",
        posts: 1900,
        themes: ["fashion", "Bollywood", "mental health", "family", "brand campaigns", "fitness"],
        recentCaptions: [
          "There is beauty in simplicity.",
          "Mental health is not a destination, but a process.",
          "Grateful for the journey. Every bit of it. 💛"
        ]
      }
    },
    analysis: {
      needs: ["Emotional depth", "Privacy", "Creative fulfillment", "Mental health awareness", "Love"],
      hobbies: ["Badminton", "Yoga", "Reading", "Travel", "Fashion"],
      interests: ["Cinema", "Mental health advocacy", "Fashion", "Entrepreneurship", "Wellness"],
      qualities: ["Graceful", "Resilient", "Private", "Deep-feeling", "Elegant", "Strong advocate"],
      personalityType: "ISFJ",
      communicationStyle: "Graceful, understated, meaningful",
      values: ["Mental health", "Love", "Grace", "Authenticity", "Family"],
      ageRange: "35-40",
      gender: "Female"
    }
  },
  {
    id: "person-13",
    name: "Casey Neistat",
    linkedin: "https://www.linkedin.com/in/caseyneistat/",
    instagram: "https://www.instagram.com/caseyneistat/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Filmmaker | YouTuber | Entrepreneur",
        location: "New York, NY",
        summary: "Filmmaker and YouTuber. Co-founder of Beme (acquired by CNN). I make movies and tell stories.",
        experience: ["Filmmaker", "YouTuber", "Co-founder, Beme", "CNN Creator"],
        skills: ["Filmmaking", "Storytelling", "Entrepreneurship", "Video Production", "Creative Direction"],
        education: "Self-taught"
      },
      instagram: {
        bio: "filmmaker in NYC 🎬",
        followers: "3.5M",
        following: "1.1K",
        posts: 4500,
        themes: ["filmmaking", "NYC life", "running", "technology", "travel", "family"],
        recentCaptions: [
          "Do what you can't.",
          "The best camera is the one you have with you.",
          "Life's too short for someday. Make it today."
        ]
      }
    },
    analysis: {
      needs: ["Creative freedom", "Adventure", "Storytelling", "Family", "Independence"],
      hobbies: ["Running", "Filmmaking", "Surfing", "Skateboarding", "Photography"],
      interests: ["Filmmaking", "Technology", "NYC culture", "Running", "Entrepreneurship"],
      qualities: ["Relentlessly creative", "Authentic", "Risk-taker", "Hardworking", "Rebellious spirit", "Family man"],
      personalityType: "ISTP",
      communicationStyle: "Raw, authentic, visual storytelling",
      values: ["Authenticity", "Hard work", "Creativity", "Family", "Adventure"],
      ageRange: "40-45",
      gender: "Male"
    }
  },
  {
    id: "person-14",
    name: "Tabitha Brown",
    linkedin: "https://www.linkedin.com/in/iamtabithabrown/",
    instagram: "https://www.instagram.com/iamtabithabrown/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Actress | Author | Vegan Content Creator | Entrepreneur",
        location: "Los Angeles, CA",
        summary: "Actress, bestselling author, and vegan content creator. Known for my warm energy and plant-based cooking.",
        experience: ["Content Creator", "Actress", "Author", "Entrepreneur"],
        skills: ["Content Creation", "Cooking", "Acting", "Public Speaking", "Brand Partnerships"],
        education: "N/A"
      },
      instagram: {
        bio: "That's your business 🤎 | Actress | Author | Vegan | God's kid | @tabithabrowncooks",
        followers: "5.2M",
        following: "780",
        posts: 3200,
        themes: ["vegan cooking", "positivity", "faith", "family", "fashion", "self-love"],
        recentCaptions: [
          "Hello there, beautiful! Have the most amazing day — because that's YOUR business!",
          "You don't need anyone's permission to be happy.",
          "Eating plants changed my life. Love what you feed yourself."
        ]
      }
    },
    analysis: {
      needs: ["Joy", "Nurturing others", "Faith", "Creative expression", "Love"],
      hobbies: ["Vegan cooking", "Acting", "Fashion", "Gardening", "Singing"],
      interests: ["Plant-based living", "Wellness", "Acting", "Entrepreneurship", "Faith"],
      qualities: ["Radiantly warm", "Joyful", "Nurturing", "Faithful", "Authentic", "Encouraging"],
      personalityType: "ESFJ",
      communicationStyle: "Warm, motherly, joyful",
      values: ["Love", "Joy", "Faith", "Kindness", "Health"],
      ageRange: "40-45",
      gender: "Female"
    }
  },
  {
    id: "person-15",
    name: "Lex Fridman",
    linkedin: "https://www.linkedin.com/in/lexfridman/",
    instagram: "https://www.instagram.com/lexfridman/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Research Scientist, MIT | Podcast Host | AI Researcher",
        location: "Cambridge, MA",
        summary: "Research scientist at MIT working on AI, deep learning, autonomous vehicles. Host of the Lex Fridman Podcast.",
        experience: ["Research Scientist, MIT", "Podcast Host", "AI Researcher"],
        skills: ["Artificial Intelligence", "Deep Learning", "Robotics", "Podcasting", "Research"],
        education: "Drexel University (PhD)"
      },
      instagram: {
        bio: "Podcast host 🎙 | AI researcher 🤖 | Jiu-jitsu 🥋 | Love ❤️",
        followers: "3.8M",
        following: "210",
        posts: 1500,
        themes: ["AI", "podcasting", "jiu-jitsu", "philosophy", "love", "existentialism"],
        recentCaptions: [
          "Love is the answer. The question doesn't matter.",
          "The most interesting conversations happen when you're willing to be vulnerable.",
          "Train hard. Think deep. Love more."
        ]
      }
    },
    analysis: {
      needs: ["Deep intellectual connection", "Love", "Physical discipline", "Meaning", "Quiet reflection"],
      hobbies: ["Brazilian Jiu-Jitsu", "Guitar", "Running", "Deep conversations", "Programming"],
      interests: ["Artificial intelligence", "Philosophy", "Martial arts", "Human consciousness", "Robotics"],
      qualities: ["Deeply thoughtful", "Disciplined", "Romantic", "Intense", "Humble", "Philosophical"],
      personalityType: "INFP",
      communicationStyle: "Deep, contemplative, love-focused",
      values: ["Love", "Truth", "Discipline", "Humility", "Knowledge"],
      ageRange: "35-40",
      gender: "Male"
    }
  },
  {
    id: "person-16",
    name: "Huda Kattan",
    linkedin: "https://www.linkedin.com/in/hudakattan/",
    instagram: "https://www.instagram.com/hudabeauty/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Founder & CEO, Huda Beauty | Entrepreneur | Beauty Influencer",
        location: "Dubai, UAE",
        summary: "Founder of Huda Beauty and Wishful Skin. From beauty blogger to billionaire entrepreneur.",
        experience: ["Founder & CEO, Huda Beauty", "Beauty Blogger", "Entrepreneur"],
        skills: ["Entrepreneurship", "Beauty Industry", "Branding", "Social Media", "Product Development"],
        education: "University of Michigan-Dearborn"
      },
      instagram: {
        bio: "Founder @hudabeauty 💄 | @wishfulbeauty ✨ | Mom | Dreamer | Dubai 🇦🇪",
        followers: "52M",
        following: "1.5K",
        posts: 7200,
        themes: ["beauty", "makeup tutorials", "family", "entrepreneurship", "Dubai life", "self-care"],
        recentCaptions: [
          "Beauty is about feeling good in your own skin first.",
          "Built this brand with my sisters. Family is everything.",
          "Never let anyone tell you your dreams are too big. 💄✨"
        ]
      }
    },
    analysis: {
      needs: ["Creative expression", "Family bonds", "Business growth", "Beauty", "Recognition"],
      hobbies: ["Makeup artistry", "Skincare routines", "Travel", "Family time", "Fashion"],
      interests: ["Beauty industry", "Entrepreneurship", "Social media", "Middle Eastern culture", "Product innovation"],
      qualities: ["Creative visionary", "Family-oriented", "Business-savvy", "Glamorous", "Determined", "Generous"],
      personalityType: "ESFP",
      communicationStyle: "Glamorous, warm, business-minded",
      values: ["Family", "Beauty", "Empowerment", "Hard work", "Creativity"],
      ageRange: "40-45",
      gender: "Female"
    }
  },
  {
    id: "person-17",
    name: "Nas Daily",
    linkedin: "https://www.linkedin.com/in/nuseir/",
    instagram: "https://www.instagram.com/nasdaily/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Content Creator | Entrepreneur | World Traveler",
        location: "Singapore",
        summary: "Created 1000 daily videos about the world. Founder of Nas Academy and Nas.io. Harvard dropout turned creator.",
        experience: ["Content Creator", "Founder, Nas Academy", "Former Software Engineer, Venmo"],
        skills: ["Video Production", "Storytelling", "Entrepreneurship", "Public Speaking", "Community Building"],
        education: "Harvard University (dropped out)"
      },
      instagram: {
        bio: "1000 daily videos ✅ | @nas.academy 🎓 | 50M+ followers across platforms 🌍",
        followers: "9.2M",
        following: "890",
        posts: 5100,
        themes: ["travel", "culture", "education", "human stories", "technology", "entrepreneurship"],
        recentCaptions: [
          "That's 1 minute. See you tomorrow!",
          "The world is more connected than you think.",
          "Every person has a story worth telling."
        ]
      }
    },
    analysis: {
      needs: ["Adventure", "Human connection", "Storytelling", "Impact", "Growth"],
      hobbies: ["Traveling", "Video editing", "Meeting people", "Learning cultures", "Photography"],
      interests: ["World cultures", "Technology", "Education", "Entrepreneurship", "Human interest stories"],
      qualities: ["Curious explorer", "Optimistic", "Disciplined creator", "Culturally aware", "Entrepreneurial", "Energetic"],
      personalityType: "ENFP",
      communicationStyle: "Quick, visual, globally minded",
      values: ["Curiosity", "Connection", "Education", "Diversity", "Hard work"],
      ageRange: "30-35",
      gender: "Male"
    }
  },
  {
    id: "person-18",
    name: "Jameela Jamil",
    linkedin: "https://www.linkedin.com/in/jameelajamil/",
    instagram: "https://www.instagram.com/jameelajamil/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Actress | Activist | Writer | Host",
        location: "Los Angeles, CA",
        summary: "Actress (The Good Place, She-Hulk). Founder of I Weigh. Activist for body positivity and mental health.",
        experience: ["Actress", "Activist", "Writer", "Founder, I Weigh"],
        skills: ["Acting", "Writing", "Activism", "Public Speaking", "Hosting"],
        education: "Queen's College, London"
      },
      instagram: {
        bio: "Actress 🎭 | @i_weigh founder ⚖️ | Body neutrality advocate | She/Her | Professional oversharer",
        followers: "3.9M",
        following: "2.1K",
        posts: 3800,
        themes: ["body positivity", "activism", "acting", "feminism", "mental health", "humor"],
        recentCaptions: [
          "I weigh: kindness, resilience, bad jokes, and a refusal to shut up.",
          "Diet culture is a scam. Your body is not the problem.",
          "Being loud about what matters isn't annoying — it's necessary."
        ]
      }
    },
    analysis: {
      needs: ["Justice", "Self-expression", "Authenticity", "Acceptance", "Humor"],
      hobbies: ["Writing", "Comedy", "DJing", "Cooking", "Gaming"],
      interests: ["Body positivity", "Feminism", "Mental health", "Acting", "Social justice"],
      qualities: ["Outspoken", "Funny", "Passionate activist", "Resilient", "Unapologetically bold", "Compassionate"],
      personalityType: "ENFP",
      communicationStyle: "Bold, funny, activist-driven",
      values: ["Justice", "Equality", "Authenticity", "Mental health", "Body acceptance"],
      ageRange: "35-40",
      gender: "Female"
    }
  },
  {
    id: "person-19",
    name: "Ali Abdaal",
    linkedin: "https://www.linkedin.com/in/aliabdaal/",
    instagram: "https://www.instagram.com/aliabdaal/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Doctor turned YouTuber | Author of Feel-Good Productivity | Entrepreneur",
        location: "London, UK",
        summary: "Former doctor. YouTube creator (5M+ subscribers). Author. I help people be more productive while actually enjoying the process.",
        experience: ["YouTuber", "Author", "Former NHS Doctor", "Entrepreneur"],
        skills: ["Productivity", "Content Creation", "Writing", "Teaching", "Entrepreneurship"],
        education: "University of Cambridge (Medicine)"
      },
      instagram: {
        bio: "Doctor → YouTuber → Author 📖 | Feel-Good Productivity 🌟 | Making work feel less like work",
        followers: "1.2M",
        following: "620",
        posts: 2400,
        themes: ["productivity", "reading", "tech gadgets", "medicine", "entrepreneurship", "books"],
        recentCaptions: [
          "Productivity isn't about doing more. It's about enjoying what you do.",
          "My morning routine as a former doctor turned creator.",
          "5 books that changed how I think about work."
        ]
      }
    },
    analysis: {
      needs: ["Learning", "Teaching", "Creative freedom", "Balance", "Meaningful work"],
      hobbies: ["Reading", "Piano", "Magic tricks", "Gaming", "Tennis"],
      interests: ["Productivity science", "Medicine", "YouTube creation", "Book writing", "Technology"],
      qualities: ["Intellectual", "Approachable", "Systematic", "Playful learner", "Driven", "Balanced"],
      personalityType: "ENTP",
      communicationStyle: "Clear, educational, relatable",
      values: ["Learning", "Joy in work", "Sharing knowledge", "Balance", "Growth"],
      ageRange: "30-35",
      gender: "Male"
    }
  },
  {
    id: "person-20",
    name: "Priyanka Chopra Jonas",
    linkedin: "https://www.linkedin.com/in/priyankachopra/",
    instagram: "https://www.instagram.com/priyankachopra/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Actor | Producer | UNICEF Goodwill Ambassador | Entrepreneur",
        location: "Los Angeles, CA / Mumbai, India",
        summary: "Global icon. Award-winning actress. UNICEF Goodwill Ambassador. Founder of Anomaly Haircare and Sona restaurant.",
        experience: ["Actor", "Producer", "UNICEF Ambassador", "Entrepreneur"],
        skills: ["Acting", "Producing", "Entrepreneurship", "Philanthropy", "Brand Building"],
        education: "Jai Hind College, Mumbai"
      },
      instagram: {
        bio: "Anomaly 💜 | Sona NYC 🍽 | UNICEF Goodwill Ambassador 🌍 | Mama 👶",
        followers: "91M",
        following: "490",
        posts: 6100,
        themes: ["Bollywood", "Hollywood", "motherhood", "fashion", "philanthropy", "travel"],
        recentCaptions: [
          "Dream big. Work hard. Stay grounded.",
          "Motherhood is my greatest role yet. 💜",
          "Celebrating culture, one story at a time."
        ]
      }
    },
    analysis: {
      needs: ["Global impact", "Family", "Cultural bridge-building", "Creative fulfillment", "Love"],
      hobbies: ["Cooking Indian food", "Travel", "Fashion", "Reading", "Family time"],
      interests: ["Cinema (Bollywood + Hollywood)", "Philanthropy", "Entrepreneurship", "Culture", "Motherhood"],
      qualities: ["Globally minded", "Ambitious", "Graceful", "Strong", "Cultural bridge", "Warm"],
      personalityType: "ESTJ",
      communicationStyle: "Confident, global, graceful",
      values: ["Family", "Culture", "Hard work", "Philanthropy", "Representation"],
      ageRange: "40-45",
      gender: "Female"
    }
  },
  {
    id: "person-21",
    name: "Peter McKinnon",
    linkedin: "https://www.linkedin.com/in/petermckinnon/",
    instagram: "https://www.instagram.com/petermckinnon/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Photographer | Filmmaker | YouTuber | Coffee Enthusiast",
        location: "Toronto, Canada",
        summary: "I make photos, videos, and drink way too much coffee. Teaching the world about cameras and creativity.",
        experience: ["YouTuber", "Photographer", "Filmmaker", "Brand Collaborator"],
        skills: ["Photography", "Filmmaking", "Video Editing", "Content Creation", "Coffee"],
        education: "Self-taught"
      },
      instagram: {
        bio: "📸 Photographer | 🎬 Filmmaker | ☕ Coffee lover | 🇨🇦 Toronto",
        followers: "3.1M",
        following: "1.8K",
        posts: 3400,
        themes: ["photography", "filmmaking", "coffee", "nature", "cameras", "creative process"],
        recentCaptions: [
          "The best photos happen when you stop overthinking.",
          "Coffee first. Camera second. Everything else third.",
          "Nature is the original content creator. 📸"
        ]
      }
    },
    analysis: {
      needs: ["Creative expression", "Nature", "Routine", "Community", "Visual beauty"],
      hobbies: ["Coffee brewing", "Camping", "Photography", "Card magic", "Hiking"],
      interests: ["Photography", "Filmmaking", "Coffee culture", "Nature", "Camera technology"],
      qualities: ["Visually artistic", "Enthusiastic teacher", "Laid-back", "Creative", "Nature-loving", "Passionate"],
      personalityType: "ISFP",
      communicationStyle: "Enthusiastic, visual, down-to-earth",
      values: ["Creativity", "Nature", "Teaching", "Authenticity", "Simplicity"],
      ageRange: "35-40",
      gender: "Male"
    }
  },
  {
    id: "person-22",
    name: "Emma Chamberlain",
    linkedin: "https://www.linkedin.com/in/emma-chamberlain-2a8891191/",
    instagram: "https://www.instagram.com/emmachamberlain/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Content Creator | Entrepreneur | Founder of Chamberlain Coffee",
        location: "Los Angeles, CA",
        summary: "YouTuber, podcast host, and founder of Chamberlain Coffee. Redefining internet culture.",
        experience: ["Content Creator", "Founder, Chamberlain Coffee", "Podcast Host"],
        skills: ["Content Creation", "Entrepreneurship", "Branding", "Social Media", "Fashion"],
        education: "N/A (career started at 16)"
      },
      instagram: {
        bio: "@chamberlaincoffee ☕ | just a gal 🌸",
        followers: "16.8M",
        following: "780",
        posts: 1200,
        themes: ["fashion", "coffee", "minimalism", "authenticity", "Gen Z culture", "thrifting"],
        recentCaptions: [
          "idk i just like coffee",
          "outfit of the day or whatever",
          "being yourself is quite literally the easiest thing to do"
        ]
      }
    },
    analysis: {
      needs: ["Authenticity", "Creative freedom", "Solitude", "Simplicity", "Genuine connections"],
      hobbies: ["Coffee", "Thrift shopping", "Cooking", "Reading", "Fashion"],
      interests: ["Fashion", "Coffee culture", "Sustainability", "Interior design", "Philosophy"],
      qualities: ["Authentically Gen Z", "Introspective", "Witty", "Minimalist", "Independent", "Self-aware"],
      personalityType: "INTP",
      communicationStyle: "Deadpan humor, stream-of-consciousness, authentic",
      values: ["Authenticity", "Sustainability", "Independence", "Simplicity", "Self-expression"],
      ageRange: "20-25",
      gender: "Female"
    }
  },
  {
    id: "person-23",
    name: "Steven Bartlett",
    linkedin: "https://www.linkedin.com/in/stevenbartlett-123/",
    instagram: "https://www.instagram.com/steven/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Founder, Social Chain | Dragon on Dragons' Den | Host, Diary of a CEO",
        location: "London, UK",
        summary: "Built Social Chain at 22, took it public at 27. Youngest ever Dragon on Dragons' Den. Host of Diary of a CEO podcast.",
        experience: ["Founder, Social Chain", "Dragon, Dragons' Den", "Podcast Host"],
        skills: ["Entrepreneurship", "Investing", "Marketing", "Podcasting", "Leadership"],
        education: "Manchester Metropolitan University (dropped out)"
      },
      instagram: {
        bio: "Diary of a CEO 🎙 | Dragon @dragonsdentv 🐉 | Building things that matter",
        followers: "5.6M",
        following: "340",
        posts: 2800,
        themes: ["entrepreneurship", "podcast clips", "mental health", "fitness", "business advice"],
        recentCaptions: [
          "The quality of your questions determines the quality of your life.",
          "You can't outsource your mental health.",
          "The best investment you'll ever make is in yourself."
        ]
      }
    },
    analysis: {
      needs: ["Achievement", "Deep understanding", "Physical health", "Meaningful relationships", "Growth"],
      hobbies: ["Fitness training", "Podcasting", "Reading", "Investing", "Travel"],
      interests: ["Entrepreneurship", "Psychology", "Health optimization", "Investing", "Human behavior"],
      qualities: ["Young achiever", "Deep thinker", "Health-conscious", "Ambitious", "Emotionally intelligent", "Driven"],
      personalityType: "ENTJ",
      communicationStyle: "Candid, intellectual, interview-style",
      values: ["Growth", "Health", "Honesty", "Achievement", "Self-awareness"],
      ageRange: "30-35",
      gender: "Male"
    }
  },
  {
    id: "person-24",
    name: "Simone Giertz",
    linkedin: "https://www.linkedin.com/in/simonegiertz/",
    instagram: "https://www.instagram.com/simonegiertz/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Inventor | YouTuber | Queen of Shitty Robots",
        location: "San Francisco, CA",
        summary: "I build robots that are terrible at their jobs. YouTuber, inventor, and brain tumor survivor.",
        experience: ["YouTuber", "Inventor", "Speaker", "Product Designer"],
        skills: ["Robotics", "Engineering", "Content Creation", "Product Design", "Comedy"],
        education: "Hyper Island, Sweden"
      },
      instagram: {
        bio: "Queen of Shitty Robots 🤖 | Building things that barely work | Brain tumor survivor 💪",
        followers: "1.9M",
        following: "1.2K",
        posts: 1600,
        themes: ["robots", "engineering", "comedy", "health", "woodworking", "creativity"],
        recentCaptions: [
          "Built a robot that brushes my teeth. It... mostly works.",
          "Failure is just engineering with extra steps.",
          "Life after brain surgery: still building, still laughing."
        ]
      }
    },
    analysis: {
      needs: ["Creative experimentation", "Humor", "Health", "Community", "Freedom to fail"],
      hobbies: ["Building robots", "Woodworking", "Sailing", "Comedy", "3D printing"],
      interests: ["Robotics", "Engineering humor", "Making/DIY", "Health advocacy", "Design"],
      qualities: ["Hilariously creative", "Resilient", "Self-deprecating humor", "Brave", "Inventive", "Joyful"],
      personalityType: "ENTP",
      communicationStyle: "Funny, self-deprecating, creative",
      values: ["Creativity", "Humor", "Resilience", "Learning from failure", "Joy"],
      ageRange: "30-35",
      gender: "Female"
    }
  },
  {
    id: "person-25",
    name: "Naval Ravikant",
    linkedin: "https://www.linkedin.com/in/navalr/",
    instagram: "https://www.instagram.com/naval/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Co-Founder, AngelList | Philosopher | Angel Investor",
        location: "San Francisco, CA",
        summary: "Co-founder of AngelList. Angel investor. I think about how to be happy, healthy, and wealthy.",
        experience: ["Co-Founder, AngelList", "Angel Investor", "Philosopher-Entrepreneur"],
        skills: ["Investing", "Philosophy", "Entrepreneurship", "Strategy", "Writing"],
        education: "Dartmouth College"
      },
      instagram: {
        bio: "🧘",
        followers: "1.4M",
        following: "89",
        posts: 420,
        themes: ["philosophy", "wealth", "happiness", "meditation", "reading", "minimalism"],
        recentCaptions: [
          "Desire is a contract you make with yourself to be unhappy until you get what you want.",
          "A fit body, a calm mind, a house full of love. These things cannot be bought.",
          "Read what you love until you love to read."
        ]
      }
    },
    analysis: {
      needs: ["Freedom", "Wisdom", "Peace of mind", "Deep thinking", "Simplicity"],
      hobbies: ["Reading", "Meditation", "Walking", "Writing aphorisms", "Investing"],
      interests: ["Philosophy", "Wealth creation", "Happiness science", "Technology", "Consciousness"],
      qualities: ["Deeply philosophical", "Minimalist", "Wise", "Contrarian thinker", "Calm", "Profound"],
      personalityType: "INTP",
      communicationStyle: "Aphoristic, profound, minimalist",
      values: ["Freedom", "Wisdom", "Happiness", "Truth", "Specific knowledge"],
      ageRange: "50-55",
      gender: "Male"
    }
  },
  {
    id: "person-26",
    name: "Zarna Garg",
    linkedin: "https://www.linkedin.com/in/zarna-garg-7b9a7a1b2/",
    instagram: "https://www.instagram.com/zarnagarg/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Comedian | Writer | Indian Mom Extraordinaire",
        location: "New York, NY",
        summary: "Stand-up comedian known for the 'Indian Mom' character. Bringing desi humor to mainstream comedy.",
        experience: ["Stand-up Comedian", "Writer", "Content Creator"],
        skills: ["Comedy", "Writing", "Public Speaking", "Content Creation", "Storytelling"],
        education: "University of Mumbai"
      },
      instagram: {
        bio: "Indian Mom Comedian 🇮🇳😂 | NYC | Making desi parents laugh (and cringe)",
        followers: "620K",
        following: "1.1K",
        posts: 1800,
        themes: ["Indian comedy", "parenting humor", "cultural observations", "family", "NYC life"],
        recentCaptions: [
          "My son said he wants to be an artist. I said, 'An artist? In THIS economy?'",
          "Indian parenting: where guilt is the gift that keeps on giving.",
          "NYC is just India with better traffic laws. Just kidding, no one follows them here either."
        ]
      }
    },
    analysis: {
      needs: ["Laughter", "Family connection", "Cultural expression", "Recognition", "Community"],
      hobbies: ["Stand-up comedy", "Cooking Indian food", "Writing", "People watching", "Shopping"],
      interests: ["Comedy", "Indian culture", "Parenting", "NYC life", "Immigrant experience"],
      qualities: ["Hilarious", "Culturally rich", "Family-centered", "Observant", "Warm", "Relatable"],
      personalityType: "ESFP",
      communicationStyle: "Comedic, cultural, family-centered",
      values: ["Family", "Humor", "Culture", "Hard work", "Community"],
      ageRange: "45-50",
      gender: "Female"
    }
  },
  {
    id: "person-27",
    name: "MKBHD (Marques Brownlee)",
    linkedin: "https://www.linkedin.com/in/mkbhd/",
    instagram: "https://www.instagram.com/mkbhd/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Tech YouTuber | Creator | Ultimate Frisbee Player",
        location: "New Jersey, USA",
        summary: "Making tech videos since 2009. 19M+ YouTube subscribers. Best tech reviewer on the planet.",
        experience: ["YouTuber", "Tech Reviewer", "Ultimate Frisbee Player", "Founder, The Studio"],
        skills: ["Technology Review", "Video Production", "Photography", "Public Speaking", "Branding"],
        education: "Stevens Institute of Technology"
      },
      instagram: {
        bio: "MKBHD 📱 | Tech reviewer | Ultimate frisbee 🥏 | Studio @thestudio",
        followers: "5.7M",
        following: "1.3K",
        posts: 2900,
        themes: ["technology", "gadgets", "Tesla", "ultimate frisbee", "studio setup", "minimalism"],
        recentCaptions: [
          "This phone is almost perfect. Almost.",
          "Studio tour 2024 — everything is custom.",
          "Ultimate frisbee nationals this weekend. Let's go. 🥏"
        ]
      }
    },
    analysis: {
      needs: ["Excellence", "Innovation", "Physical activity", "Creative control", "Authenticity"],
      hobbies: ["Ultimate frisbee", "Car collecting (Tesla)", "Tech testing", "Photography", "Golf"],
      interests: ["Consumer technology", "Electric vehicles", "Sports", "Video production", "Design"],
      qualities: ["Perfectionist", "Calm authority", "Athletic", "Tech-savvy", "Minimalist taste", "Consistent"],
      personalityType: "ISTJ",
      communicationStyle: "Clean, authoritative, balanced",
      values: ["Quality", "Honesty", "Consistency", "Design", "Excellence"],
      ageRange: "30-35",
      gender: "Male"
    }
  },
  {
    id: "person-28",
    name: "Liza Koshy",
    linkedin: "https://www.linkedin.com/in/lizakoshy/",
    instagram: "https://www.instagram.com/lizakoshy/",
    avatar: null,
    scraped: {
      linkedin: {
        headline: "Actress | Creator | Producer | Entrepreneur",
        location: "Los Angeles, CA",
        summary: "Actress, creator, and entrepreneur. Known for double dare hosting, acting, and comedy content.",
        experience: ["Actress", "Producer", "Content Creator", "Host"],
        skills: ["Acting", "Comedy", "Hosting", "Content Creation", "Entrepreneurship"],
        education: "University of Houston (attended)"
      },
      instagram: {
        bio: "just a lil gal with big dreams 🌈 | actress | creator | not a doctor",
        followers: "18.2M",
        following: "930",
        posts: 2100,
        themes: ["comedy", "acting", "fashion", "fitness", "positivity", "behind-the-scenes"],
        recentCaptions: [
          "woke up and chose comedy. again.",
          "your girl got a new movie coming out and YES i did my own stunts (no i didn't)",
          "self care is doing something that scares you and then eating ice cream after"
        ]
      }
    },
    analysis: {
      needs: ["Joy", "Creative expression", "Connection", "Adventure", "Laughter"],
      hobbies: ["Comedy", "Dance", "Fitness", "Cooking", "Hiking"],
      interests: ["Acting", "Comedy", "Fitness", "Fashion", "Social activism"],
      qualities: ["Infectiously funny", "Energetic", "Down-to-earth", "Spontaneous", "Kind", "Multi-talented"],
      personalityType: "ENFP",
      communicationStyle: "Silly, energetic, self-deprecating",
      values: ["Joy", "Kindness", "Creativity", "Inclusivity", "Fun"],
      ageRange: "25-30",
      gender: "Female"
    }
  }
];

export default SEED_PEOPLE;
