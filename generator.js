/* ========================================
   Phantom-User — Username Generator Engine

   Rules enforced:
   - Pronounceable and simple
   - Main name first (e.g. "DuckRebirthed" > "RebirthDuck")
   - Longer & clean > short & mangled
   - No numbers, underscores, repeated letters at word joins
   - No articles (the, a, an)
   - No letter-to-number swaps
   - Easy to spell
   - 1-2 syllable words preferred
   - English-sounding (real or fictional)
   ======================================== */

const PhantomGenerator = (() => {
  // ── Word Banks (all 1-2 syllable, pronounceable, no articles) ──

  const banks = {
    soft: {
      primary: [
        'Haze', 'Loom', 'Veil', 'Mist', 'Plume', 'Fawn', 'Silk', 'Dew',
        'Moon', 'Lush', 'Glow', 'Soft', 'Hush', 'Calm', 'Drift', 'Shore',
        'Cloud', 'Pearl', 'Sage', 'Moss', 'Bloom', 'Vale', 'Willow', 'Briar',
        'Shallow', 'Meadow', 'Hollow', 'Whisper', 'Feather', 'Velvet',
        'Ivory', 'Petal', 'Ember', 'Luna', 'Coral', 'Cedar', 'Maple',
        'Clover', 'Hazel', 'Iris', 'Lily', 'Wren', 'Robin', 'Lark',
        'Dove', 'Fern', 'Reed', 'Glen', 'Dale', 'Haven'
      ],
      suffix: [
        'fall', 'song', 'light', 'shade', 'bloom', 'grace', 'wish',
        'born', 'dusk', 'dawn', 'wind', 'tone', 'breeze', 'leaf',
        'stream', 'field', 'wood', 'gale', 'crest', 'vale',
        'dream', 'swept', 'kissed', 'bound', 'weave', 'lore'
      ]
    },

    sharp: {
      primary: [
        'Bolt', 'Spike', 'Blade', 'Jet', 'Punk', 'Crash', 'Blitz',
        'Grip', 'Flint', 'Brick', 'Clash', 'Grit', 'Brisk', 'Kick',
        'Crack', 'Pilot', 'Rebel', 'Viper', 'Titan', 'Apex',
        'Piston', 'Trigger', 'Dagger', 'Bullet', 'Rocket', 'Turbo',
        'Spartan', 'Bandit', 'Raptor', 'Falcon', 'Cobra', 'Panther',
        'Hunter', 'Striker', 'Blaster', 'Sniper', 'Tank', 'Riot',
        'Fury', 'Storm', 'Rage', 'Fang', 'Claw', 'Thorn',
        'Pike', 'Dart', 'Barb', 'Spur'
      ],
      suffix: [
        'strike', 'shot', 'rush', 'blast', 'force', 'lock', 'break',
        'core', 'edge', 'mark', 'bound', 'clash', 'born', 'bent',
        'forged', 'craft', 'cast', 'built', 'run', 'charged'
      ]
    },

    mythic: {
      primary: [
        'Rune', 'Shade', 'Wraith', 'Dusk', 'Phantom', 'Shroud',
        'Eclipse', 'Raven', 'Obsidian', 'Onyx', 'Crimson', 'Frost',
        'Aether', 'Arcane', 'Cipher', 'Oracle', 'Seraph', 'Specter',
        'Nether', 'Omen', 'Sigil', 'Glyph', 'Myth', 'Saga',
        'Throne', 'Crown', 'Reign', 'Fate', 'Doom', 'Bane',
        'Sable', 'Ashen', 'Warden', 'Sentinel', 'Harbinger', 'Paragon',
        'Zenith', 'Nexus', 'Prism', 'Vertex', 'Obelisk', 'Monolith',
        'Aegis', 'Bastion', 'Citadel', 'Requiem', 'Elysian', 'Abyssal'
      ],
      suffix: [
        'sworn', 'walker', 'bane', 'wrath', 'soul', 'fang', 'heart',
        'spell', 'forge', 'keep', 'ward', 'vow', 'oath', 'rite',
        'seer', 'lord', 'mage', 'knight', 'shade', 'flame'
      ]
    },

    techy: {
      primary: [
        'Pixel', 'Node', 'Byte', 'Flux', 'Sync', 'Glitch', 'Neon',
        'Logic', 'Code', 'Patch', 'Debug', 'Stack', 'Hash', 'Parse',
        'Kernel', 'Socket', 'Vector', 'Cipher', 'Binary', 'Module',
        'Render', 'Vertex', 'Proxy', 'Cache', 'Query', 'Syntax',
        'Bit', 'Port', 'Grid', 'Loop', 'Ping', 'Root',
        'Script', 'Proto', 'Meta', 'Nano', 'Macro', 'Core',
        'Hexa', 'Deca', 'Giga', 'Tera', 'Nexus', 'Datum',
        'Codec', 'Signal', 'Beacon', 'Photon'
      ],
      suffix: [
        'wave', 'link', 'hub', 'net', 'craft', 'ops', 'lab',
        'forge', 'sys', 'dev', 'flow', 'base', 'zone', 'shift',
        'stack', 'grid', 'mode', 'state', 'pulse', 'sync'
      ]
    },

    nature: {
      primary: [
        'Wolf', 'Bear', 'Fox', 'Elk', 'Hawk', 'Lynx', 'Otter',
        'Birch', 'Pine', 'Oak', 'Ash', 'Ivy', 'Moss', 'Fern',
        'River', 'Stone', 'Creek', 'Ridge', 'Summit', 'Canyon',
        'Salmon', 'Osprey', 'Badger', 'Raven', 'Heron', 'Crane',
        'Timber', 'Quarry', 'Boulder', 'Pebble', 'Glacier', 'Tundra',
        'Marsh', 'Dune', 'Cliff', 'Cove', 'Bluff', 'Gorge',
        'Spruce', 'Cypress', 'Lotus', 'Orchid', 'Jasper', 'Agate',
        'Cobalt', 'Flint', 'Slate', 'Basalt'
      ],
      suffix: [
        'born', 'run', 'trail', 'peak', 'root', 'wild', 'grove',
        'ridge', 'wood', 'field', 'fall', 'spring', 'bark', 'leaf',
        'bloom', 'drift', 'frost', 'shade', 'stone', 'creek'
      ]
    },

    dark: {
      primary: [
        'Void', 'Null', 'Grim', 'Hex', 'Ash', 'Blight', 'Dread',
        'Murk', 'Smog', 'Rust', 'Scar', 'Scorch', 'Char', 'Bleak',
        'Shadow', 'Venom', 'Phantom', 'Specter', 'Wraith', 'Ghoul',
        'Hollow', 'Wicked', 'Sinister', 'Malice', 'Plague', 'Blight',
        'Thorn', 'Spine', 'Fang', 'Claw', 'Bone', 'Skull',
        'Rogue', 'Vagrant', 'Exile', 'Outcast', 'Pariah', 'Nomad',
        'Cinder', 'Ember', 'Inferno', 'Abyss', 'Oblivion', 'Eclipse',
        'Havoc', 'Chaos', 'Anarch', 'Vandal'
      ],
      suffix: [
        'born', 'sworn', 'bound', 'forged', 'cursed', 'marked',
        'brand', 'wraith', 'shade', 'bane', 'fall', 'rot',
        'grip', 'lock', 'chain', 'ward', 'veil', 'shroud',
        'torn', 'bent'
      ]
    }
  };

  // ── Fictional / English-sounding words (Skybaffy, Booser style) ──

  const fictionalRoots = [
    'Sky', 'Boo', 'Zap', 'Quip', 'Jib', 'Tux', 'Pog', 'Bop',
    'Zeb', 'Kip', 'Dex', 'Pip', 'Nix', 'Rux', 'Vox', 'Lux',
    'Jax', 'Rex', 'Zed', 'Kai', 'Rio', 'Leo', 'Neo', 'Ace',
    'Max', 'Sol', 'Zen', 'Koda', 'Milo', 'Arlo', 'Finn', 'Dash',
    'Cruz', 'Knox', 'Nash', 'Sage', 'Cole', 'Blake', 'Reed', 'Quinn'
  ];

  const fictionalEndings = [
    'baffy', 'ser', 'ling', 'wick', 'sby', 'ley', 'ton',
    'mond', 'well', 'worth', 'ford', 'land', 'dale', 'wood',
    'ridge', 'cliff', 'stone', 'brook', 'field', 'croft',
    'bury', 'ham', 'gate', 'fen', 'moor', 'den', 'holm'
  ];

  // ── Utility Helpers ──

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Check for repeated letters at the join of two words
  function hasJoinRepeat(word1, word2) {
    if (!word1 || !word2) return false;
    const end = word1.slice(-1).toLowerCase();
    const start = word2.charAt(0).toLowerCase();
    return end === start;
  }

  // Check if a word is an article
  function isArticle(word) {
    return ['the', 'a', 'an'].includes(word.toLowerCase());
  }

  // Apply casing style
  function applyCase(name, style) {
    switch (style) {
      case 'lowercase': return name.toLowerCase();
      case 'UPPERCASE': return name.toUpperCase();
      case 'PascalCase':
      default: return name; // already PascalCase from generation
    }
  }

  // Check length constraints
  function matchesLength(name, pref) {
    const len = name.length;
    switch (pref) {
      case 'short': return len <= 10;
      case 'medium': return len >= 11 && len <= 15;
      case 'long': return len >= 16;
      default: return true;
    }
  }

  // ── Generation Strategies ──

  // Strategy 1: Primary + Suffix (e.g., "MistFall", "BoltStrike")
  function primarySuffix(vibe) {
    const bank = banks[vibe] || banks[pick(Object.keys(banks))];
    let primary = pick(bank.primary);
    let suffix = pick(bank.suffix);

    // Avoid repeated letters at join
    let attempts = 0;
    while (hasJoinRepeat(primary, suffix) && attempts < 10) {
      suffix = pick(bank.suffix);
      attempts++;
    }

    return capitalize(primary) + capitalize(suffix);
  }

  // Strategy 2: Primary + Primary (e.g., "SalmonTree", "WolfStone")
  function primaryPrimary(vibe) {
    const vibeKeys = Object.keys(banks);
    const bank1 = banks[vibe] || banks[pick(vibeKeys)];
    const bank2 = banks[pick(vibeKeys)];

    let word1 = pick(bank1.primary);
    let word2 = pick(bank2.primary);

    let attempts = 0;
    while ((word1 === word2 || hasJoinRepeat(word1, word2)) && attempts < 15) {
      word2 = pick(bank2.primary);
      attempts++;
    }

    return capitalize(word1) + capitalize(word2);
  }

  // Strategy 3: Fictional root + English ending (e.g., "Skybaffy", "Booser")
  function fictional() {
    const root = pick(fictionalRoots);
    let ending = pick(fictionalEndings);

    let attempts = 0;
    while (hasJoinRepeat(root, ending) && attempts < 10) {
      ending = pick(fictionalEndings);
      attempts++;
    }

    return capitalize(root) + ending.toLowerCase();
  }

  // Strategy 4: Seed-based — use seed word as the primary, pair with something
  function seedBased(seed, vibe) {
    const cleanSeed = seed.replace(/[^a-zA-Z]/g, '');
    if (!cleanSeed) return primarySuffix(vibe);

    const capSeed = capitalize(cleanSeed);
    const strategies = [
      // Seed + suffix
      () => {
        const bank = banks[vibe] || banks[pick(Object.keys(banks))];
        let suffix = pick(bank.suffix);
        let attempts = 0;
        while (hasJoinRepeat(capSeed, suffix) && attempts < 10) {
          suffix = pick(bank.suffix);
          attempts++;
        }
        return capSeed + capitalize(suffix);
      },
      // Seed + primary from any bank
      () => {
        const bank = banks[pick(Object.keys(banks))];
        let word = pick(bank.primary);
        let attempts = 0;
        while ((word.toLowerCase() === cleanSeed.toLowerCase() || hasJoinRepeat(capSeed, word)) && attempts < 10) {
          word = pick(bank.primary);
          attempts++;
        }
        return capSeed + capitalize(word);
      },
      // Seed + fictional ending
      () => {
        let ending = pick(fictionalEndings);
        let attempts = 0;
        while (hasJoinRepeat(capSeed, ending) && attempts < 10) {
          ending = pick(fictionalEndings);
          attempts++;
        }
        return capSeed + ending.toLowerCase();
      },
      // Seed + short suffix from any bank
      () => {
        const allSuffixes = Object.values(banks).flatMap(b => b.suffix);
        const shortSuffixes = allSuffixes.filter(s => s.length <= 4);
        let suffix = pick(shortSuffixes);
        let attempts = 0;
        while (hasJoinRepeat(capSeed, suffix) && attempts < 10) {
          suffix = pick(shortSuffixes);
          attempts++;
        }
        return capSeed + capitalize(suffix);
      }
    ];

    return pick(strategies)();
  }

  // Strategy 5: Primary + "Rebirthed/Evolved" style modifiers
  function primaryModifier(vibe) {
    const modifiers = [
      'Reborn', 'Rising', 'Evolved', 'Forged', 'Unbound', 'Awoken',
      'Exiled', 'Untamed', 'Fabled', 'Risen', 'Ascended', 'Branded',
      'Claimed', 'Crowned', 'Gifted', 'Primed', 'Rooted', 'Veiled'
    ];

    const bank = banks[vibe] || banks[pick(Object.keys(banks))];
    const primary = pick(bank.primary);
    let mod = pick(modifiers);

    let attempts = 0;
    while (hasJoinRepeat(primary, mod) && attempts < 10) {
      mod = pick(modifiers);
      attempts++;
    }

    return capitalize(primary) + capitalize(mod);
  }

  // ── Main Generate Function ──

  function generate(options = {}) {
    const {
      seed = '',
      vibe = 'any',
      caseStyle = 'PascalCase',
      lengthPref = 'any',
      count = 12
    } = options;

    const resolvedVibe = vibe === 'any' ? null : vibe;
    const results = new Set();
    let safetyLimit = count * 20;

    while (results.size < count && safetyLimit > 0) {
      safetyLimit--;

      let name;
      const strategy = Math.random();

      if (seed && seed.trim()) {
        // When seed is provided, heavily favor seed-based generation
        if (strategy < 0.65) {
          name = seedBased(seed.trim(), resolvedVibe);
        } else if (strategy < 0.8) {
          name = primarySuffix(resolvedVibe || pick(Object.keys(banks)));
        } else if (strategy < 0.9) {
          name = fictional();
        } else {
          name = primaryModifier(resolvedVibe || pick(Object.keys(banks)));
        }
      } else {
        // No seed — mix all strategies
        if (strategy < 0.3) {
          name = primarySuffix(resolvedVibe || pick(Object.keys(banks)));
        } else if (strategy < 0.55) {
          name = primaryPrimary(resolvedVibe || pick(Object.keys(banks)));
        } else if (strategy < 0.7) {
          name = fictional();
        } else if (strategy < 0.85) {
          name = primaryModifier(resolvedVibe || pick(Object.keys(banks)));
        } else {
          // Cross-vibe mashup
          const vibeKeys = Object.keys(banks);
          const v1 = resolvedVibe || pick(vibeKeys);
          const v2 = pick(vibeKeys.filter(v => v !== v1));
          const word1 = pick(banks[v1].primary);
          const word2 = pick(banks[v2].suffix);
          if (!hasJoinRepeat(word1, word2)) {
            name = capitalize(word1) + capitalize(word2);
          }
        }
      }

      if (!name) continue;

      // Validation pass
      const rawName = name.replace(/[^a-zA-Z]/g, '');
      if (rawName.length < 4) continue;
      if (!matchesLength(rawName, lengthPref)) continue;

      const finalName = applyCase(rawName, caseStyle);

      // Skip duplicates (case-insensitive)
      if ([...results].some(r => r.toLowerCase() === finalName.toLowerCase())) continue;

      results.add(finalName);
    }

    return [...results];
  }

  // Public API
  return { generate };
})();
