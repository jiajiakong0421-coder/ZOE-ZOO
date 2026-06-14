import { AnimalDay, Specimen } from './types';

export const CALENDAR_ANIMALS: AnimalDay[] = [
  {
    id: 1,
    date: 3,
    index: "03 / HEIGHT",
    role: "Giraffe",
    title: "Giraffe: The Sky-High Observer",
    bubble: "Do you know what the weather is like up here? It's always breezy and the leaves are incredibly tender. Being tall means I see everything before anyone else does. Don't worry, your secrets are safe in the clouds with me.",
    accentColor: "#D97706",
    gradientFrom: "#451A03",
    gradientTo: "#D97706",
    imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80",
    skills: [
      { name: "Altitude Awareness", value: 98 },
      { name: "Leaf Picking Efficiency", value: 95 },
      { name: "Graceful Walking", value: 90 }
    ],
    widgetTemplate: 'giraffe'
  },
  {
    id: 2,
    date: 6,
    index: "06 / FROST",
    role: "Polar Bear",
    title: "Polar Bear: The Arctic King of Chill",
    bubble: "Brrr... actually, it's not that cold. The ocean current is perfectly refreshing today. I'm just looking for a drifting iceberg to take a quick nap on. If you see one, give me a shout. Otherwise, sleep mode is engaged.",
    accentColor: "#06B6D4",
    gradientFrom: "#083344",
    gradientTo: "#06B6D4",
    imageUrl: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80",
    skills: [
      { name: "Cold Resistance", value: 99 },
      { name: "Heavyweight Diving", value: 92 },
      { name: "Camouflage Skills", value: 95 }
    ],
    widgetTemplate: 'polar_bear'
  },
  {
    id: 3,
    date: 9,
    index: "09 / SLIDE",
    role: "Penguin",
    title: "Penguin: The Tuxedo Slider",
    bubble: "Waddle, waddle... zoom! I might look a bit clumsy on land, but watch me glide on the belly ice! I can swim faster than some speedboats. Ready to slide into the weekend together?",
    accentColor: "#3B82F6",
    gradientFrom: "#172554",
    gradientTo: "#3B82F6",
    imageUrl: "/src/assets/images/king_penguin_1781268727298.jpg",
    skills: [
      { name: "Belly Sliding Speed", value: 97 },
      { name: "Tuxedo Dapperness", value: 100 },
      { name: "Deepwater Swimming", value: 94 }
    ],
    widgetTemplate: 'penguin'
  },
  {
    id: 4,
    date: 11,
    index: "11 / MAJESTY",
    role: "Lion",
    title: "Lion: The Sunset Roaring Monarch",
    bubble: "Yawn... Ruling the savanna is exhaustive work. Everyone respects the roar, but to be honest, I mostly just enjoy finding a giant shaded acacia tree to sleep under for 20 hours a day. Care to join the royal nap?",
    accentColor: "#F59E0B",
    gradientFrom: "#78350F",
    gradientTo: "#F59E0B",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
    skills: [
      { name: "Decibel Output", value: 99 },
      { name: "Sleep Duration", value: 95 },
      { name: "Golden Mane Pride", value: 98 }
    ],
    widgetTemplate: 'lion'
  },
  {
    id: 5,
    date: 14,
    index: "14 / PLUMP",
    role: "Seal",
    title: "Seal: The Playful Coastal Rollover",
    bubble: "Slap-slap-slap! That's the sound of me clapping my belly. It means I'm absolutely satisfied with the fresh fish I caught. If you toss me another one, I might do a double backflip for you!",
    accentColor: "#14B8A6",
    gradientFrom: "#115E59",
    gradientTo: "#14B8A6",
    imageUrl: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80",
    skills: [
      { name: "Belly Clapping", value: 96 },
      { name: "Perfect Rolling", value: 92 },
      { name: "Cute Whisker Physics", value: 98 }
    ],
    widgetTemplate: 'seal'
  },
  {
    id: 6,
    date: 16,
    index: "16 / CHATTER",
    role: "Monkey",
    title: "Monkey: The Cheeky Forest Acrobat",
    bubble: "Hey! Watch me swing from this vine! Did you see that? It was a triple flip. Oh, wait, is that a shiny phone in your pocket? Mind if I take a closer look... and maybe keep it forever?",
    accentColor: "#F97316",
    gradientFrom: "#7C2D12",
    gradientTo: "#F97316",
    imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80",
    skills: [
      { name: "Vine Swinging", value: 96 },
      { name: "Curiosity Factor", value: 99 },
      { name: "Banana Peeling Speed", value: 90 }
    ],
    widgetTemplate: 'monkey'
  }
];

export const ENCYCLOPEDIA_SPECIMENS: Specimen[] = [
  {
    id: "001",
    category: "mammals",
    title: "SNOW LEOPARD",
    scientific: "Panthera uncia",
    range: "43.19° N, 84.12° E",
    status: "VULNERABLE (IUCN)",
    desc: "An elusive sentinel of alpine summits. Known as the 'ghost of the mountain,' its magnificent smoke-gray spotted coat provides perfect camouflage in cold craggy terrains.",
    gradient: "linear-gradient(135deg, #1c305d 0%, #EE7752 100%)",
    accent: "#F8A282",
    ambient: ["#1c305d", "#331a24"],
    imageUrl: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'diagonal'
  },
  {
    id: "002",
    category: "marine",
    title: "GIANT MANTA",
    scientific: "Mobula birostris",
    range: "21.12° S, 113.98° W",
    status: "ENDANGERED (IUCN)",
    desc: "A mesmerizing glider of deep pelagic waters. Possessing a massive wingspan, this highly intelligent filter-feeder dances gracefully with ocean currents.",
    gradient: "linear-gradient(135deg, #1c305d 0%, #F8A282 100%)",
    accent: "#EE7752",
    ambient: ["#1c305d", "#4b281f"],
    imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'half_moon'
  },
  {
    id: "003",
    category: "mammals",
    title: "POLAR BEAR",
    scientific: "Ursus maritimus",
    range: "71.70° N, 42.60° W",
    status: "VULNERABLE (IUCN)",
    desc: "The magnificent apex predator of the frozen north. Perfectly adapted to sub-zero temperatures, they traverse vast polar ice fields with supreme grace, power, and highly specialized endurance.",
    gradient: "linear-gradient(135deg, #1c305d 0%, #F8A282 100%)",
    accent: "#EE7752",
    ambient: ["#1c305d", "#47281c"],
    imageUrl: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'grid'
  },
  {
    id: "004",
    category: "mammals",
    title: "GIRAFFE",
    scientific: "Giraffa camelopardalis",
    range: "1.29° S, 36.82° E",
    status: "VULNERABLE (IUCN)",
    desc: "The elegant giant of the African savannah. Possessing an extraordinary towering stature, long prehensile tongue, and beautiful unique coat patterns that blend seamlessly with sun-dappled acacias.",
    gradient: "linear-gradient(135deg, #EE7752 0%, #1c305d 100%)",
    accent: "#F8A282",
    ambient: ["#4a3728", "#1c305d"],
    imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'concentric'
  },
  {
    id: "005",
    category: "mammals",
    title: "GOLDEN MONKEY",
    scientific: "Rhinopithecus roxellana",
    range: "33.95° N, 107.88° E",
    status: "ENDANGERED (IUCN)",
    desc: "A treasure of high-altitude misty forests. Renowned for its brilliant golden guard-hairs, vibrant blue facial mask, and remarkable cold-resistant social groups.",
    gradient: "linear-gradient(135deg, #F8A282 0%, #1c305d 100%)",
    accent: "#EE7752",
    ambient: ["#3b251a", "#1c305d"],
    imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=1200&q=85",
    symbolCode: 'circle_cross'
  },
  {
    id: "006",
    category: "aviary",
    title: "PEREGRINE FALCON",
    scientific: "Falco peregrinus",
    range: "56.13° N, 3.43° W",
    status: "LEAST CONCERN (IUCN)",
    desc: "The fastest living organism. Celebrated for its breathtaking high-velocity hunting dives exceeding 320 km/h, showcasing extreme aerodynamic design.",
    gradient: "linear-gradient(135deg, #1c305d 0%, #EE7752 100%)",
    accent: "#F8A282",
    ambient: ["#1c305d", "#3a1e19"],
    imageUrl: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'waves'
  },
  {
    id: "007",
    category: "aviary",
    title: "EMPEROR PENGUIN",
    scientific: "Aptenodytes forsteri",
    range: "76.41° S, 144.15° W",
    status: "NEAR THREATENED (IUCN)",
    desc: "The tallest and heaviest of all living penguin species. Endearing yet incredibly resilient, they endure the brutal Antarctic winter to breed on sea ice.",
    gradient: "linear-gradient(135deg, #1c305d 0%, #F8A282 100%)",
    accent: "#EE7752",
    ambient: ["#1c305d", "#121d33"],
    imageUrl: "/src/assets/images/king_penguin_1781268727298.jpg",
    symbolCode: 'circle_cross'
  },
  {
    id: "008",
    category: "mammals",
    title: "AFRICAN LION",
    scientific: "Panthera leo",
    range: "3.06° S, 37.35° E",
    status: "VULNERABLE (IUCN)",
    desc: "The legendary apex social predator of the African plains. Living in highly cooperative family groups called prides, the lion represents raw power, complex social bonds, and majestic beauty.",
    gradient: "linear-gradient(135deg, #EE7752 0%, #1c305d 100%)",
    accent: "#F8A282",
    ambient: ["#4a2414", "#1c305d"],
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
    symbolCode: 'concentric'
  }
];
