# 🥋 Jiu-Jitsu Techniekboek

Een moderne, modulaire webapp voor Jiu-Jitsu beoefenaars die hun zwarte band willen halen.

## ✨ Features

- **Grond Posities** → 4 posities met 3-4 submissions per positie + verdediging + video
- **Worpen** → 4 categorieën (Arm, Hip, Leg, Shoulder Throws) met 3 voorbeelden per categorie
- **Dark Mode** — Schakel tussen licht en donker thema
- **Volledig offline** werkbaar
- **Mobiel vriendelijk**

## 🚀 Hoe start je de app

### Optie 1: Lokaal (voor ontwikkeling)

```bash
# Installeer http-server (eenmalig)
npm install -g http-server

# Start de server
cd jiu-jitsu-modular-v2
http-server -p 8000
```

Open dan `http://localhost:8000` in je browser.

### Optie 2: GitHub Pages (aanbevolen voor telefoon)

1. Push deze map naar een GitHub repository
2. Ga naar **Settings → Pages**
3. Kies branch `main` en folder `/ (root)`
4. Je app draait live op: `https://jouw-gebruikersnaam.github.io/repo-naam`

## 📁 Projectstructuur

```
jiu-jitsu-modular-v2/
├── index.html          # Hoofdbestand (laadt de modules)
├── styles/
│   └── main.css        # Alle styling + dark mode
└── js/
    ├── app.js          # Hoofdlogica + state management
    ├── data.js         # Alle data (posities + worpen)
    └── ui.js           # Rendering functies
```

## 🛠️ Volgende stappen (Roadmap)

- [ ] Progress Dashboard (mastery per positie, streak, statistieken)
- [ ] Mastery systeem (0-5 sterren per techniek)
- [ ] Training Log (sessies bijhouden)
- [ ] Meer posities en worpen toevoegen
- [ ] PWA (Progressive Web App) maken

## 📱 Gebruik op telefoon

De app werkt het beste via **GitHub Pages** of een lokale server.  
Direct openen via `file://` kan problemen geven met modules op sommige telefoons.

## 🤝 Bijdragen

Ideeën, bug reports of nieuwe technieken? Maak een issue of pull request!

---

**Gemaakt met ❤️ voor Jiu-Jitsu beoefenaars die hun zwarte band nastreven.**