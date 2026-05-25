// js/data.js - Alle data centraal

export const groundPositions = [
  {
    id: "mount",
    name: "Mount",
    japanese: "Tate-shiho-gatame",
    color: "#c0392b",
    submissions: [
      {
        name: "Americana",
        defense: "Push elbow down + grab his leg with free hand",
        link: "https://www.youtube.com/watch?v=5M1wkbaOYUM"
      },
      {
        name: "Armbar from Mount",
        defense: "Thumb down + clasp hands + stack his legs",
        link: "https://www.youtube.com/watch?v=6W5eTSsM6EY"
      },
      {
        name: "Cross Collar Choke",
        defense: "Chin to chest + push his elbows upward",
        link: "https://www.youtube.com/watch?v=8wLWTw8G0c0"
      },
      {
        name: "Arm Triangle Choke",
        defense: "Pull arm out before he grips + create space",
        link: "https://www.youtube.com/watch?v=fqYw8uqkBgQ"
      }
    ]
  },
  {
    id: "guard",
    name: "Guard",
    japanese: "Do-osae",
    color: "#2980b9",
    submissions: [
      {
        name: "Triangle Choke",
        defense: "Pull arm out immediately + build posture + stack",
        link: "https://www.youtube.com/watch?v=zWDyEFwX_pI"
      },
      {
        name: "Armbar from Guard",
        defense: "Pull arm before his leg comes over + thumb down",
        link: "https://www.youtube.com/watch?v=vCx_erA3yso"
      },
      {
        name: "Kimura from Guard",
        defense: "Extend the arm straight + roll in direction of rotation",
        link: "https://www.youtube.com/watch?v=F3v5PpUY9o8"
      },
      {
        name: "Omoplata",
        defense: "Pull arm before leg + forward roll if locked",
        link: "https://www.youtube.com/watch?v=5Mmo-YuV5cQ"
      }
    ]
  },
  {
    id: "back-mount",
    name: "Back Mount",
    japanese: "Ushiro-kesa-gatame",
    color: "#e67e22",
    submissions: [
      {
        name: "Rear Naked Choke",
        defense: "Chin to chest + grab attacking arm + pull elbow down",
        link: "https://www.youtube.com/watch?v=5sctnAYFJ-g"
      },
      {
        name: "Armbar from Back Mount",
        defense: "Pull arm to chest + turn toward him",
        link: "https://www.youtube.com/watch?v=yrl903y9jbg"
      },
      {
        name: "Clock Choke",
        defense: "Chin tuck + grab wrist + rotate away from rotation",
        link: "https://www.youtube.com/watch?v=jAGbvarXopw"
      }
    ]
  },
  {
    id: "side-control",
    name: "Side Control",
    japanese: "Yoko-shiho-gatame",
    color: "#8e44ad",
    submissions: [
      {
        name: "Arm Triangle Choke",
        defense: "Pull arm out before he can grip + create space",
        link: "https://www.youtube.com/watch?v=fqYw8uqkBgQ"
      },
      {
        name: "Kimura",
        defense: "Extend arm fully + roll with the direction of rotation",
        link: "https://www.youtube.com/watch?v=F3v5PpUY9o8"
      },
      {
        name: "Americana",
        defense: "Drive elbow to mat + place hand on his leg",
        link: "https://www.youtube.com/watch?v=5M1wkbaOYUM"
      },
      {
        name: "Crucifix Choke",
        defense: "Trap one arm with legs + block the other arm",
        link: "https://www.youtube.com/watch?v=bf6uxUzo0Wc"
      }
    ]
  }
];

export const throwsData = {
  "Arm Throws": [
    {
      name: "Seoi Nage",
      description: "One or two-arm shoulder throw. Drop under opponent and throw over your back.",
      kuzushi: "Pull him forward and downward strongly",
      link: "https://www.youtube.com/watch?v=5shl7rRm7i4"
    },
    {
      name: "Ippon Seoi Nage",
      description: "One-arm shoulder throw. Arm under his armpit with elbow up as lever.",
      kuzushi: "Pull arm forward and break balance forward-right",
      link: "https://www.youtube.com/watch?v=5shl7rRm7i4"
    },
    {
      name: "Tai Otoshi",
      description: "Body drop. Block his leg with yours and pull him over it with both arms.",
      kuzushi: "Strong pull forward and to the right",
      link: "https://www.youtube.com/watch?v=AEwEKUtYHXI"
    }
  ],
  "Hip Throws": [
    {
      name: "O Goshi",
      description: "Major hip throw. Arm around his waist, drive hip in, throw him over your hip.",
      kuzushi: "Pull forward and plant hip deep inside his stance",
      link: "https://www.youtube.com/watch?v=waxH8FA28IA"
    },
    {
      name: "Harai Goshi",
      description: "Sweeping hip throw. Hip in + actively sweep his leg while throwing.",
      kuzushi: "Pull forward and up while sweeping his leg",
      link: "https://www.youtube.com/watch?v=jNqVF4PTwVg"
    },
    {
      name: "Uchi Mata",
      description: "Inner thigh throw. Throw your leg between his legs and sweep upward.",
      kuzushi: "Pull forward and sideways, leg explosively upward",
      link: "https://www.youtube.com/watch?v=Jk1TC6xvE9Y"
    }
  ],
  "Leg Throws": [
    {
      name: "Osoto Gari",
      description: "Major outer reap. Reap his leg from the outside while pulling him backward.",
      kuzushi: "Pull him back and slightly to the side",
      link: "https://www.youtube.com/watch?v=5shl7rRm7i4"
    },
    {
      name: "Ouchi Gari",
      description: "Major inner reap. Reap his leg from the inside and pull him backward.",
      kuzushi: "Push him back toward his heels",
      link: "https://www.youtube.com/watch?v=AEwEKUtYHXI"
    },
    {
      name: "Kouchi Gari",
      description: "Minor inner reap. Small, quick reap of his ankle from the inside.",
      kuzushi: "Light push back with small, compact movement",
      link: "https://www.youtube.com/watch?v=AEwEKUtYHXI"
    }
  ],
  "Shoulder Throws": [
    {
      name: "Koshi Guruma",
      description: "Hip wheel. Arm around his neck, rotate on your hip and throw him over.",
      kuzushi: "Pull his head forward and down strongly",
      link: "https://www.youtube.com/watch?v=k1EGubrfzNg"
    },
    {
      name: "Kata Guruma",
      description: "Shoulder wheel. Drop to your knees, lift him onto your shoulders and throw.",
      kuzushi: "Pull his arm forward and drop quickly to knees",
      link: "https://www.youtube.com/watch?v=AEwEKUtYHXI"
    },
    {
      name: "Morote Seoi Nage",
      description: "Two-arm shoulder throw. Both arms grip and throw him over your back.",
      kuzushi: "Pull strongly forward and down with both arms",
      link: "https://www.youtube.com/watch?v=5shl7rRm7i4"
    }
  ]
};