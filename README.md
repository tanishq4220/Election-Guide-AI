# Election Guide AI: The Zero-Gravity Democracy Assistant 🌌🗳️

## 🌐 Live Demo
👉 **Live App**: [https://election-guide-ai-frontend-bmb4e3v2mq-uc.a.run.app](https://election-guide-ai-frontend-bmb4e3v2mq-uc.a.run.app)  
👉 **Backend API**: [https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app](https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app)  
👉 **Health Check**: [https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app/health](https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app/health)

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
- **📊 Deep Google Cloud Integration**: 
    - **Google BigQuery**: Real-time analytics pipeline tracking all chat interactions, response times, and usage patterns (`backend/services/analytics.js`).
    - **Google Cloud Logging**: Structured logging with severity levels (INFO/WARN/ERROR) for production monitoring (`backend/services/logger.js`).
    - **Google Secret Manager**: Secure API key and credential management in production (`backend/services/secrets.js`).
    - **Firebase Auth**: Secure Google Login.
    - **Cloud Firestore**: Persistent chat history storage.
    - **Gemini Pro (via Google Generative AI SDK)**: Advanced NLP for election queries.
    - **Google Cloud Run**: Production deployment with auto-scaling containers.
- **♿ WCAG 2.1 AA Accessibility**: 
    - **Skip Navigation Link**: For keyboard-only users to bypass repetitive content.
    - **`aria-live="polite"`**: Screen readers announce new chat messages automatically.
    - **`role="log"`**: Chat message area is semantically marked as a live log.
    - **`role="dialog"` + `aria-modal`**: Chat window is properly identified as a modal dialog.
    - **`role="radiogroup"`**: Mode toggle uses proper ARIA radio group pattern.
    - **`role="progressbar"`**: Quiz progress bar with `aria-valuenow` tracking.
    - **`aria-expanded`**: Chat FAB indicates its open/close state.
    - **`aria-pressed`**: Motion toggle indicates its current state.
    - **`aria-labelledby`**: All sections use properly linked heading references.
    - **Reduced Motion Mode**: For users with vestibular disorders.
    - **Text-to-Speech**: AI responses can be read aloud.
    - **Focus Management**: Auto-focus on chat input when opened.
    - **Focus Ring Styles**: Visible focus indicators on all interactive elements.
    - **Semantic HTML5**: `<article>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<main>`.
    - **PWA Manifest**: Installable as a progressive web app.
- **🎯 Readiness Quiz**: Gamified check with dedicated API (`/api/quiz`) that provides instant feedback, progress bar, and scoring.
- **🛡️ Production Security**:
    - **Helmet**: CSP headers, x-frame-options, x-content-type-options, x-dns-prefetch-control.
    - **Rate Limiting**: Global (100 req/15min) + stricter chat-specific (30 req/15min) with standard headers.
    - **Input Validation & Sanitization**: XSS prevention, payload size limits (10KB), prompt length enforcement (2000 chars).
    - **SQL Injection Protection**: Handled gracefully via sanitization layer.
    - **Prototype Pollution Prevention**: Request body validation.
- **📐 Code Quality**:
    - **Centralized Constants Module**: All magic numbers and strings extracted to `constants.js`.
    - **Named Regex Patterns**: HTML_TAG_PATTERN, DANGEROUS_CHAR_PATTERN for maintainability.
    - **JSDoc Documentation**: Every module, function, and parameter fully documented.
    - **TypeScript Interfaces**: Proper type definitions across all frontend components.
    - **ESLint with Strict Rules**: Enforcing quotes, semicolons, trailing commas, curly braces.

---

## 🛠️ Technology Stack & Justification

| Tech | Purpose | Why? |
| :--- | :--- | :--- |
| **Next.js 16** | Frontend Framework | For optimal performance, SEO, and App Router benefits. |
| **Tailwind CSS 4** | Styling | For rapid, modern, and highly customized "Glassmorphism" UI. |
| **Framer Motion** | Animations | To achieve the "Anti-Gravity" physics-based motion. |
| **Google Gemini API** | Intelligence | State-of-the-art LLM for accurate procedural explanation. |
| **Firebase** | Auth & DB | For seamless scaling, real-time history, and secure user management. |
| **Express.js** | Backend | Robust middleware support for rate limiting and security. |
| **Google BigQuery** | Analytics | Real-time chat event tracking and usage analytics pipeline. |
| **Google Cloud Logging** | Monitoring | Structured production logging with severity-based alerting. |
| **Google Secret Manager** | Security | Secure credential management for API keys in production. |
| **Google Cloud Run** | Deployment | Auto-scaling serverless containers with zero cold-start config. |
| **Jest + Supertest** | Testing | 100+ passing tests covering API, middleware, cache, constants, and utilities. |
| **ESLint** | Code Quality | Enforced code standards with automated linting (strict mode). |
| **node-cache** | Efficiency | In-memory caching for AI responses and GET endpoints. |
| **compression** | Performance | Gzip compression middleware reducing response sizes by ~70%. |

---

## 🏗️ System Architecture

```text
[ USER CLIENT ] <---> [ NEXT.JS FRONTEND ] <---> [ EXPRESS BACKEND ]
      ^                      |                        |
      |                      v                        v
      +-------------- [ FIREBASE AUTH ]       [ GOOGLE GEMINI AI ]
                             |                        |
                             v                        v
                     [ CLOUD FIRESTORE ]      [ BIGQUERY ANALYTICS ]
                                                      |
                                                      v
                                              [ CLOUD LOGGING ]
                                                      |
                                                      v
                                              [ SECRET MANAGER ]
```

---

## 🧪 Testing & Reliability (100+ Tests Passing ✅)

We don't just write code; we ensure it works.

### Test Suites
| Suite | Tests | Coverage |
| :--- | :--- | :--- |
| `backend/tests/api.test.js` | 50+ tests | Chat validation, health endpoint, quiz API, scoring, 404 handling, headers |
| `backend/tests/middleware.test.js` | 13 tests | CORS, Helmet headers, CSP, XSS sanitization, rate limiting, SQL injection |
| `backend/tests/utils.test.js` | 30 tests | sanitizePrompt, validateElectionQuery, truncateHistory, hashPrompt |
| `backend/tests/cache.test.js` | 7 tests | Cache set/get, case-insensitivity, clearing, stats, overwriting |
| `backend/tests/constants.test.js` | 11 tests | All exported constants validated, HTTP codes, rate limits, BigQuery config |

### Running Tests
```bash
cd backend
npm test           # Run all 100+ tests with coverage
npm run test:ci    # CI mode with coverage + forceExit
npm run lint       # ESLint code quality check
```

### Edge Cases Handled
- Empty, null, numeric, and oversized prompts rejected with 400 status.
- XSS/HTML injection stripped via `sanitizePrompt()`.
- SQL injection attempts handled gracefully.
- Prototype pollution attacks prevented.
- Chat history capped at 20 messages to prevent context overflow.
- Firebase Auth failures handled with fallback UI states.
- API Rate Limiting (30 req/15min per IP) to prevent abuse.
- AI response caching to reduce redundant API calls.

### CI/CD Pipeline
- **GitHub Actions** (`.github/workflows/test.yml`): Automated tests run on every push and PR.
- **Code Coverage**: Generated via Jest with lcov reports.

### Performance
- Optimized for **60fps** animations even on low-end devices.
- **Compression**: Gzip response compression via `compression` middleware.
- **Caching**: In-memory cache (node-cache) for AI responses (30 min TTL) and GET endpoints.
- **Response Time**: X-Response-Time header on all responses.

---

## 📁 Project Structure

```
Election-Guide-AI/
├── .github/workflows/test.yml    # CI pipeline
├── backend/
│   ├── server.js                 # Express app with all middleware
│   ├── constants.js              # Centralized constants & error messages
│   ├── utils.js                  # Sanitization, validation, hashing
│   ├── .eslintrc.js              # Strict code quality config
│   ├── .env.example              # Environment variable template
│   ├── middleware/
│   │   ├── cache.js              # In-memory caching layer with stats
│   │   └── security.js           # Rate limiting & input validation
│   ├── routes/
│   │   ├── aiRoutes.js           # Chat endpoint with caching + analytics
│   │   ├── healthRoutes.js       # Health + stats endpoints
│   │   └── quizRoutes.js         # Election readiness quiz API
│   ├── services/
│   │   ├── aiService.js          # Gemini AI integration
│   │   ├── analytics.js          # Google BigQuery event logging
│   │   ├── logger.js             # Google Cloud Logging
│   │   └── secrets.js            # Google Secret Manager
│   └── tests/
│       ├── api.test.js           # 50+ API endpoint tests
│       ├── middleware.test.js     # 13 security middleware tests
│       ├── utils.test.js         # 30 utility function tests
│       ├── cache.test.js         # 7 cache module tests
│       └── constants.test.js     # 11 constants validation tests
├── frontend/
│   ├── src/app/layout.tsx        # SEO metadata, skip-nav, viewport, PWA
│   ├── src/app/page.tsx          # Main page with full ARIA accessibility
│   ├── src/components/chat/      # FloatingOrb with dialog, radiogroup, aria-live
│   ├── src/components/election/  # Timeline (list), Quiz (progressbar)
│   ├── src/components/ui/        # FloatingCard (article), CursorTrail
│   ├── public/manifest.json      # PWA manifest
│   └── next.config.ts            # API rewrites, standalone output
└── README.md
```

---

## 🔮 Future Scope

1.  **Real-Time Poll API**: Live integration with official election results.
2.  **AR Navigation**: Using Google Maps AR to lead voters inside polling stations.
3.  **Blockchain ID**: Secure voter registration verification via decentralized identity.

---

## 👨‍💻 Installation & Setup

1.  **Clone the Repo**: `git clone https://github.com/tanishq4220/Election-Guide-AI.git`
2.  **Backend**: 
    ```bash
    cd backend && npm install && cp .env.example .env
    # Configure .env with your API keys
    npm test    # Verify 100+ tests pass
    npm start   # Start server on port 8080
    ```
3.  **Frontend**: 
    ```bash
    cd frontend && npm install
    # Configure .env.local with Firebase keys
    npm run dev   # Start dev server on port 3000
    ```

---

**Developed for the 2026 Innovation Hackathon.**
*"Making Democracy as Intuitive as Space Flight."*
