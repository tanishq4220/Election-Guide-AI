# Election Guide AI: The Zero-Gravity Democracy Assistant 🌌🗳️

## 🌐 Live Demo
👉 **Frontend**: [https://election-guide-ai.vercel.app](https://election-guide-ai.vercel.app)  
👉 **Backend**: [https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app](https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app)

## 📂 GitHub Repository
👉 [https://github.com/tanishq4220/Election-Guide-AI](https://github.com/tanishq4220/Election-Guide-AI)

> **"This system reduces confusion for first-time voters by converting complex election procedures into interactive, personalized guidance."**

Election Guide AI is a premium, production-grade assistant designed to solve the informational gap in democratic processes. Using a stunning **Anti-Gravity UI** and **Google Gemini AI**, it transforms dry procedural data into an immersive, cosmic journey.

---

## 🎯 The Problem & Our Solution

### **The Problem**
First-time voters and citizens often feel overwhelmed by fragmented election information, leading to low turnout and procedural errors. Existing portals are often static, text-heavy, and inaccessible.

### **Our Solution**
A context-aware, intelligent ecosystem that provides:
1.  **Immersive Visualization**: An orbital timeline of the election lifecycle.
2.  **Actionable Intelligence**: A "Readiness Check" that gives a personalized score and steps.
3.  **Conversational Support**: A Gemini-powered assistant with "Simple" and "Detailed" modes.
4.  **Premium Experience**: A zero-gravity UI that keeps users engaged through motion and depth.

---

## 🚀 Key Features (Hackathon "WOW" Factors)

- **🌌 Anti-Gravity UI**: Floating cards with smooth drift, mouse-based parallax, and a custom cursor trail for a high-end "Apple/Google" feel.
- **🧠 Context-Aware AI**: Gemini Pro integration that remembers chat history and adapts its tone (Simple vs. Detailed).
- **📊 Deep Google Integration**: 
    - **Firebase Auth**: Secure Google Login.
    - **Cloud Firestore**: Persistent chat history storage.
    - **Gemini Pro**: Advanced NLP for election queries.
- **♿ Extreme Accessibility**: 
    - **Reduced Motion Mode**: For users with vestibular disorders.
    - **Text-to-Speech**: AI responses can be read aloud.
    - **Keyboard Nav & ARIA**: 100% compliant semantic HTML.
- **🎯 Readiness Quiz**: Gamified check that provides instant feedback and confetti on completion.

---

## 🛠️ Technology Stack & Justification

| Tech | Purpose | Why? |
| :--- | :--- | :--- |
| **Next.js 15** | Frontend Framework | For optimal performance, SEO, and App Router benefits. |
| **Tailwind CSS 4** | Styling | For rapid, modern, and highly customized "Glassmorphism" UI. |
| **Framer Motion** | Animations | To achieve the "Anti-Gravity" physics-based motion. |
| **Google Gemini API** | Intelligence | State-of-the-art LLM for accurate procedural explanation. |
| **Firebase** | Auth & DB | For seamless scaling, real-time history, and secure user management. |
| **Express.js** | Backend | Robust middleware support for rate limiting and security. |

---

## 🏗️ System Architecture

```text
[ USER CLIENT ] <---> [ NEXT.JS FRONTEND ] <---> [ EXPRESS BACKEND ]
      ^                      |                        |
      |                      v                        v
      +-------------- [ FIREBASE AUTH ]       [ GOOGLE GEMINI AI ]
                             |                        |
                             v                        v
                     [ CLOUD FIRESTORE ]      [ ANALYTICS EVENTS ]
```

---

## 🧪 Testing & Reliability

We don't just write code; we ensure it works.
- **Backend**: Jest & Supertest for API reliability.
- **Edge Cases**:
    - Handled empty prompts with AI fallback.
    - Handled Firebase Auth failures gracefully.
    - Implemented API Rate Limiting to prevent abuse.
- **Performance**: Optimized for **60fps** animations even on low-end devices.

---

## 🔮 Future Scope

1.  **Real-Time Poll API**: Live integration with official election results.
2.  **AR Navigation**: Using Google Maps AR to lead voters inside polling stations.
3.  **Blockchain ID**: Secure voter registration verification via decentralized identity.

---

## 👨‍💻 Installation & Setup

1.  **Clone the Repo**: `git clone ...`
2.  **Backend**: `cd backend && npm install && npm start` (Configure `.env`)
3.  **Frontend**: `cd frontend && npm install && npm run dev` (Configure `.env.local`)

---

**Developed for the 2026 Innovation Hackathon.**
*"Making Democracy as Intuitive as Space Flight."*
