// js/data.js - Alle data

export const groundPositions = [
  {
    id: "mount",
    name: "Mount",
    japanese: "Tate-shiho-gatame",
    submissions: [
      { name: "Americana", defense: "Push elbow down + grab his leg", link: "https://www.youtube.com/watch?v=5M1wkbaOYUM" },
      { name: "Armbar from Mount", defense: "Thumb down + clasp hands + stack", link: "https://www.youtube.com/watch?v=6W5eTSsM6EY" },
      { name: "Cross Collar Choke", defense: "Chin to chest + push elbows up", link: "https://www.youtube.com/watch?v=8wLWTw8G0c0" },
      { name: "Arm Triangle Choke", defense: "Pull arm out before he grips + create space", link: "https://www.youtube.com/watch?v=fqYw8uqkBgQ" }
    ]
  },
  {
    id: "guard",
    name: "Guard",
    japanese: "Do-osae",
    submissions: [
      { name: "Triangle Choke", defense: "Pull arm out + build posture + stack", link: "https://www.youtube.com/watch?v=zWDyEFwX_pI" },
      { name: "Armbar from Guard", defense: "Pull arm before leg + thumb down", link: "https://www.youtube.com/watch?v=vCx_erA3yso" },
      { name: "Kimura from Guard", defense: "Extend arm + roll with rotation", link: "https://www.youtube.com/watch?v=F3v5PpUY9o8" },
      { name: "Omoplata", defense: "Pull arm before leg + forward roll if needed", link: "https://www.youtube.com/watch?v=5Mmo-YuV5cQ" }
    ]
  },
  {
    id: "back-mount",
    name: "Back Mount",
    japanese: "Ushiro-kesa-gatame",
    submissions: [
      { name: "Rear Naked Choke", defense: "Chin to chest + grab arm + elbow down", link: "https://www.youtube.com/watch?v=5sctnAYFJ-g" },
      { name: "Armbar from Back Mount", defense: "Pull arm to chest + turn toward him", link: "https://www.youtube.com/watch?v=yrl903y9jbg" },
      { name: "Clock Choke", defense: "Chin tuck + grab wrist + rotate away", link: "https://www.youtube.com/watch?v=jAGbvarXopw" }
    ]
  },
  {
    id: "side-control",
    name: "Side Control",
    japanese: "Yoko-shiho-gatame",
    submissions: [
      { name: "Arm Triangle Choke", defense: "Pull arm out before he grips + create space", link: "https://www.youtube.com/watch?v=fqYw8uqkBgQ" },
      { name: "Kimura", defense: "Extend arm + roll with the rotation", link: "https://www.youtube.com/watch?v=F3v5PpUY9o8" },
      { name: "Americana", defense: "Elbow to mat + hand on his leg", link: "https://www.youtube.com/watch?v=5M1wkbaOYUM" },
      { name: "Crucifix Choke", defense: "Trap arm with legs + block other arm", link: "https://www.youtube.com/watch?v=bf6uxUzo0Wc" }
    ]
  }
];

export const throwsData = {
  "Arm Throws": [
    { name: "Seoi Nage", description: "One or two-arm shoulder throw", kuzushi: "Pull forward and downward", link: "https://www.youtube.com/watch?v=5shl7rRm7i4" },
    { name: "Ippon Seoi Nage", description: "One-arm shoulder throw", kuzushi: "Pull arm forward, break balance", link: "https://www.youtube.com/watch?v=5shl7rRm7i4" },
    { name: "Tai Otoshi", description: "Body drop - block leg and pull over", kuzushi: "Strong pull forward and right", link: "https://www.youtube.com/watch?v=AEwEKUtYHXI" }
  ],
  "Hip Throws": [
    { name: "O Goshi", description: "Major hip throw", kuzushi: "Pull forward, plant hip deep", link: "https://www.youtube.com/watch?v=waxH8FA28IA" },
    { name: "Harai Goshi", description: "Sweeping hip throw", kuzushi: "Pull forward and sweep leg", link: "https://www.youtube.com/watch?v=jNqVF4PTwVg" },
    { name: "Uchi Mata", description: "Inner thigh throw", kuzushi: "Pull forward and sweep up", link: "https://www.youtube.com/watch?v=Jk1TC6xvE9Y" }
  ],
  "Leg Throws": [
    { name: "Osoto Gari", description: "Major outer reap", kuzushi: "Pull back and to the side", link: "https://www.youtube.com/watch?v=5shl7rRm7i4" },
    { name: "Ouchi Gari", description: "Major inner reap", kuzushi: "Push back toward heels", link: "https://www.youtube.com/watch?v=AEwEKUtYHXI" },
    { name: "Kouchi Gari", description: "Minor inner reap", kuzushi: "Light push back", link: "https://www.youtube.com/watch?v=AEwEKUtYHXI" }
  ],
  "Shoulder Throws": [
    { name: "Koshi Guruma", description: "Hip wheel throw", kuzushi: "Pull head forward and down", link: "https://www.youtube.com/watch?v=k1EGubrfzNg" },
    { name: "Kata Guruma", description: "Shoulder wheel", kuzushi: "Pull arm and drop to knees", link: "https://www.youtube.com/watch?v=AEwEKUtYHXI" },
    { name: "Morote Seoi Nage", description: "Two-arm shoulder throw", kuzushi: "Pull strongly forward and down", link: "https://www.youtube.com/watch?v=5shl7rRm7i4" }
  ]
};