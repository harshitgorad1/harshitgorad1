"use client";

import { useState, useEffect, useRef } from "react";

// --- Mock Data & Constants ---
const SERVICES = [
  { name: "API Gateway", color: "#4facfe", status: "Online", ok: true },
  { name: "AI Service (Python)", color: "#a855f7", status: "Online", ok: true },
  { name: "Chat Service", color: "#4facfe", status: "Online", ok: true },
  { name: "MongoDB", color: "#43e97b", status: "Online", ok: true },
  { name: "Redis Cache", color: "#f5576c", status: "Online", ok: true },
  { name: "Analytics", color: "#fbbf24", status: "Online", ok: true },
];

const NLP_RESPONSES: Record<string, string[]> = {
  greet: [
    `Hello! 👋 I'm **NeuroChat**, your enterprise conversational AI. I'm running on GPT-4-turbo with context-aware memory via Redis, giving me a 128K token context window.\n\nHow can I assist you today?`,
  ],
  arch: [
    `Here's the **NeuroChat microservice architecture**:
🔹 **API Gateway** (Node.js) — Auth, rate limiting, routing
🔹 **AI Service** (Python/FastAPI) — NLP, embeddings, generation
🔹 **Chat Service** (Node.js) — WebSocket, message management
🔹 **Analytics Service** — Kafka-powered event tracking
🔹 **MongoDB** — Persistent storage with replica sets
🔹 **Redis** — Session memory, context cache, rate limits

All services are containerized with Docker and deploy behind an NGINX load balancer.`,
  ],
  python: [
    "Here's a FastAPI endpoint for the AI service:\n```python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nimport openai\n\napp = FastAPI()\n\nclass ChatRequest(BaseModel):\n    message: str\n    context: list[dict]\n    user_id: str\n\n@app.post('/generate')\nasync def generate(req: ChatRequest):\n    response = await openai.ChatCompletion.acreate(\n        model='gpt-4-turbo',\n        messages=req.context + [\n            {'role':'user','content':req.message}\n        ]\n    )\n    return {\n        'reply': response.choices[0].message.content,\n        'tokens': response.usage.total_tokens\n    }\n```\nThis separates AI concerns completely from your Node.js layer.",
  ],
  redis: [
    `**Redis in NeuroChat** serves three critical purposes:

1. **Session Memory** — \`session:{userId}\` stores last 10 messages for conversation context (TTL: 3600s)
2. **Rate Limiting** — \`ratelimit:{userId}\` tracks request counts per minute window
3. **Analytics Cache** — Summary stats cached to reduce MongoDB read load

This reduces database hits by ~70% and keeps response latency under 1.2 seconds average.`,
  ],
  scale: [
    `**Scaling strategy for production:**

🔹 **Horizontal scaling** — Each microservice scales independently
🔹 **AI Service isolation** — Heavy compute in separate container cluster
🔹 **MongoDB** — Replica set + read replicas with indexes on userId, conversationId, createdAt
🔹 **Rate limits** — Free: 60 req/min · Pro: Unlimited
🔹 **Caching** — Last 10 messages in Redis, analytics summary cached 5 mins
🔹 **CI/CD** — GitHub Actions → Docker → AWS ECR → Auto-deploy`,
  ],
  default: [
    `That's an insightful question. Based on your context and our conversation history (stored securely in Redis), I can provide a comprehensive answer.\n\nThe **NeuroChat** platform is designed for enterprise-grade reliability with 99.9% uptime SLA. Our NLP pipeline processes your input through tokenization, embedding generation, context injection, and response synthesis — all optimized for sub-1.5s latency.\n\nIs there a specific aspect you'd like me to elaborate on?`,
    `Great question! Our NLP preprocessing pipeline runs on the isolated Python/FastAPI service. This separation is intentional — keeping AI compute away from the API gateway ensures **fault isolation** and **independent scaling**.\n\nThe flow: User message → Gateway → Chat Service → AI Service → embedding lookup → context injection → GPT-4 response → sentiment analysis → stored to MongoDB + Redis.`,
  ],
};

function rand(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSentiment(text: string) {
  const pos = /love|great|excellent|amazing|good|helpful|brilliant|perfect/i.test(text);
  const neg = /bad|terrible|hate|awful|broken|error|wrong|fail/i.test(text);
  return pos ? "pos" : neg ? "neg" : "neu";
}

function getAIResponse(text: string) {
  const t = text.toLowerCase();
  if (/arch|microservice|service|docker|kubernetes/i.test(t)) return rand(NLP_RESPONSES.arch);
  if (/python|fastapi|flask|code|snippet/i.test(t)) return rand(NLP_RESPONSES.python);
  if (/redis|cache|session|memory/i.test(t)) return rand(NLP_RESPONSES.redis);
  if (/scal|horizontal|load|balance|replica/i.test(t)) return rand(NLP_RESPONSES.scale);
  if (/hello|hi|hey|greet/i.test(t)) return rand(NLP_RESPONSES.greet);
  return rand(NLP_RESPONSES.default);
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  sentiment: "pos" | "neg" | "neu";
  time: string;
  tokens: number;
};

type Conversation = {
  id: number;
  title: string;
  msgs: Message[];
};

export default function App() {
  // STATE
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("demo@neurochat.ai");
  const [loginPass, setLoginPass] = useState("••••••••");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  const [activeTab, setActiveTab] = useState<"chat" | "analytics" | "arch" | "api">("chat");

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: "General Assistant", msgs: [] },
    { id: 2, title: "Python Code Review", msgs: [] },
    { id: 3, title: "NLP Architecture Q&A", msgs: [] },
  ]);
  const [activeConvId, setActiveConvId] = useState<number>(1);
  const [msgInput, setMsgInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [msgCounter, setMsgCounter] = useState(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // EFFECTS
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversations, activeConvId, isTyping]);

  useEffect(() => {
    if (currentUser && conversations.find((c) => c.id === 1)?.msgs.length === 0) {
      const welcomeMsg: Message = {
        id: "w1",
        role: "ai",
        content: `Welcome back, **${currentUser.name}**! 👋\n\nI'm your enterprise AI assistant running on **GPT-4-turbo** with 128K context window. Your Redis session is active and I have full access to your conversation history.\n\nYou can ask me about:\n• **System Architecture** — microservices, scaling, Docker\n• **Python AI code** — FastAPI, embeddings, NLP\n• **Redis & caching** — session management, performance\n• **Deployment strategy** — CI/CD, monitoring, production\n\nWhat would you like to explore?`,
        sentiment: "pos",
        time: now(),
        tokens: 89,
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === 1 ? { ...c, msgs: [welcomeMsg] } : c))
      );
      setTotalTokens((prev) => prev + 89);
      setMsgCounter(1);
    }
  }, [currentUser]);

  // ACTIONS
  const handleAuth = (type: "login" | "register") => {
    let name = "User", email = "user@neurochat.ai";
    if (type === "login") {
      email = loginEmail || "demo@neurochat.ai";
      name = email.split("@")[0];
    } else {
      name = regName || "User";
      email = regEmail || "user@neurochat.ai";
    }
    setCurrentUser({ name, email });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createNewConv = () => {
    const id = Date.now();
    setConversations([{ id, title: "New Conversation", msgs: [] }, ...conversations]);
    setActiveConvId(id);
  };

  const handleSend = async () => {
    const text = msgInput.trim();
    if (!text || isTyping) return;

    setMsgInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      sentiment: getSentiment(text),
      time: now(),
      tokens: Math.ceil(text.length / 4),
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, msgs: [...c.msgs, userMsg] } : c))
    );
    setMsgCounter((prev) => prev + 1);
    setTotalTokens((prev) => prev + userMsg.tokens);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 900));

    const responseText = getAIResponse(text);
    const aiTokens = Math.ceil(responseText.length / 4) + 50;

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: responseText,
      sentiment: getSentiment(responseText),
      time: now(),
      tokens: aiTokens,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          // If title is "New Conversation", set it to the first few words of the user msg
          const title = c.title === "New Conversation" ? text.slice(0, 20) + "..." : c.title;
          return { ...c, title, msgs: [...c.msgs, aiMsg] };
        }
        return c;
      })
    );
    setMsgCounter((prev) => prev + 1);
    setTotalTokens((prev) => prev + aiTokens);
    setIsTyping(false);
  };

  const formatContent = (content: string) => {
    // Basic markdown parsing
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("\`\`\`") && part.endsWith("\`\`\`")) {
        const code = part.replace(/^\`\`\`(.*?)\n/, "").replace(/\n\`\`\`$/, "");
        return (
          <div key={i} className="code-block">
            {code}
          </div>
        );
      }
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>"),
          }}
        />
      );
    });
  };

  // RENDER HELPERS
  if (!currentUser) {
    return (
      <div id="auth">
        <div className="auth-box">
          <div className="auth-logo">⚡ <span className="grad">NeuroChat</span></div>
          <div className="auth-sub">Conversational Intelligence Platform — Enterprise Edition</div>
          <div className="auth-tabs">
            <div
              className={`auth-tab ${authTab === "login" ? "active" : ""}`}
              onClick={() => setAuthTab("login")}
            >Sign In</div>
            <div
              className={`auth-tab ${authTab === "register" ? "active" : ""}`}
              onClick={() => setAuthTab("register")}
            >Register</div>
          </div>

          {authTab === "login" ? (
            <div id="auth-login">
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <button className="btn-auth" onClick={() => handleAuth("login")}>Sign In →</button>
              <div className="auth-switch">No account? <span onClick={() => setAuthTab("register")}>Create one</span></div>
            </div>
          ) : (
            <div id="auth-register">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Min 8 characters"
                />
              </div>
              <button className="btn-auth" onClick={() => handleAuth("register")}>Create Account →</button>
              <div className="auth-switch">Already have an account? <span onClick={() => setAuthTab("login")}>Sign in</span></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div id="app" style={{ display: "flex" }}>
      {/* Top Nav */}
      <div className="topnav">
        <div className="nav-logo">⚡ <span className="grad">NeuroChat</span></div>
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>💬 Chat</button>
          <button className={`nav-tab ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>📊 Analytics</button>
          <button className={`nav-tab ${activeTab === "arch" ? "active" : ""}`} onClick={() => setActiveTab("arch")}>🏗 Architecture</button>
          <button className={`nav-tab ${activeTab === "api" ? "active" : ""}`} onClick={() => setActiveTab("api")}>📡 API Docs</button>
        </div>
        <div className="nav-right">
          <div className="status-dot"></div>
          <span style={{ fontSize: ".7rem", color: "var(--grn)", fontWeight: 600 }}>All Systems Operational</span>
          <div className="user-badge">
            <div className="avatar" id="userAv">{currentUser.name.slice(0, 2).toUpperCase()}</div>
            <span id="userName">{currentUser.name.split(" ")[0]}</span>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="main-wrap">

        {/* CHAT TAB */}
        <div id="tab-chat" className={`tab-panel ${activeTab === "chat" ? "active" : ""}`} style={{ flexDirection: "row" }}>

          <div className="sidebar">
            <div className="sidebar-head">
              <button className="btn-new" onClick={createNewConv}>+ New Conversation</button>
            </div>
            <div className="conv-list">
              {conversations.map((c) => (
                <div key={c.id} className={`conv-item ${c.id === activeConvId ? "active" : ""}`} onClick={() => setActiveConvId(c.id)}>
                  <div className="conv-title">{c.title}</div>
                  <div className="conv-meta">{c.msgs.length} messages</div>
                </div>
              ))}
            </div>
            <div className="sidebar-footer">
              <div className="plan-badge">✦ Pro Plan — Active</div>
              <div style={{ marginTop: 8, fontSize: ".65rem", color: "var(--mut)", textAlign: "center" }}>
                Redis Session: Active · {totalTokens.toLocaleString()} tokens used
              </div>
            </div>
          </div>

          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <div className="chat-title">{activeConv?.title}</div>
                <div style={{ fontSize: ".68rem", color: "var(--mut)" }}>Conversational Intelligence · Context-aware</div>
              </div>
              <div className="model-badge">GPT-4-turbo</div>
              <div className="token-usage">Tokens: <span>{totalTokens.toLocaleString()}</span> / 128,000</div>
            </div>

            <div className="messages" ref={chatScrollRef}>
              {activeConv?.msgs.map((m) => {
                const sentLabel = { pos: "Positive 😊", neg: "Negative 😟", neu: "Neutral 😐" }[m.sentiment];
                return (
                  <div key={m.id} className={`msg ${m.role}`}>
                    <div className="msg-av">
                      {m.role === "ai" ? "🤖" : currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="msg-body">
                      <div className="msg-bubble">{formatContent(m.content)}</div>
                      <div className="msg-footer">
                        <span className="msg-time">{m.time}</span>
                        {m.role === "ai" && (
                          <>
                            <span className={`sentiment sent-${m.sentiment}`}>{sentLabel}</span>
                            <span className="tok-info">~{m.tokens} tokens</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="msg ai">
                  <div className="msg-av">🤖</div>
                  <div className="typing-ind"><span></span><span></span><span></span></div>
                </div>
              )}
            </div>

            <div className="input-area">
              <div className="input-wrap">
                <textarea
                  className="msgIn"
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask anything... (Shift+Enter for new line)"
                  value={msgInput}
                  onChange={(e) => {
                    setMsgInput(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button className="send-btn" onClick={handleSend}>
                <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          <div className="right-panel">
            <div className="rp-section">
              <div className="rp-title">System Services</div>
              {SERVICES.map((s, i) => (
                <div key={i} className="service-item">
                  <span className="service-name">
                    <div className="svc-dot" style={{ background: s.ok ? "#43e97b" : "#f5576c" }}></div>
                    {s.name}
                  </span>
                  <span className="svc-status" style={{ color: s.ok ? "#43e97b" : "#f5576c" }}>{s.status}</span>
                </div>
              ))}
            </div>
            <div className="rp-section">
              <div className="rp-title">Session Metrics</div>
              <div className="stat-row"><span className="stat-label">Messages</span><span className="stat-val">{msgCounter}</span></div>
              <div className="stat-row"><span className="stat-label">Avg Response</span><span className="stat-val">1.2s</span></div>
              <div className="stat-row"><span className="stat-label">Tokens Used</span><span className="stat-val">{totalTokens.toLocaleString()}</span></div>
              <div className="stat-row"><span className="stat-label">Sentiment</span><span className="stat-val" style={{ color: "var(--grn)" }}>Positive</span></div>
            </div>
            <div className="rp-section">
              <div className="rp-title">Rate Limits (Pro)</div>
              <div className="stat-row"><span className="stat-label">Requests/min</span><span className="stat-val" style={{ color: "var(--cyan)" }}>∞</span></div>
              <div className="stat-row"><span className="stat-label">Used (today)</span><span className="stat-val">{msgCounter} / ∞</span></div>
              <div className="mini-bar"><div className="mini-bar-fill" style={{ width: "18%", background: "linear-gradient(90deg,var(--blue),var(--pur))" }}></div></div>
            </div>
            <div className="rp-section">
              <div className="rp-title">Active Context (Redis)</div>
              <div style={{ fontSize: ".7rem", color: "var(--mut)", lineHeight: 1.7, fontFamily: "var(--mono)" }}>
                session:usr_{currentUser.name.toLowerCase().replace(/\\s/g, '').slice(0, 5)}<br />
                ctx_window: 10 msgs<br />
                memory_ttl: 3600s<br />
                embedding_dim: 1536
              </div>
            </div>
          </div>
        </div>

        {/* ANALYTICS TAB */}
        <div className={`tab-panel ${activeTab === "analytics" ? "active" : ""}`}>
          <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Analytics <span className="grad">Dashboard</span></h2>
              <p style={{ fontSize: ".78rem", color: "var(--mut)" }}>Platform-wide metrics · Last 30 days</p>
            </div>
            <div className="ana-grid">
              <div className="ana-card"><div className="ana-icon">💬</div><div className="ana-val grad">48,291</div><div className="ana-lbl">Total Messages</div><div className="ana-change up">↑ 18.3% vs last month</div></div>
              <div className="ana-card"><div className="ana-icon">👥</div><div className="ana-val" style={{ color: "var(--cyan)" }}>1,247</div><div className="ana-lbl">Active Users</div><div className="ana-change up">↑ 9.1%</div></div>
              <div className="ana-card"><div className="ana-icon">⚡</div><div className="ana-val" style={{ color: "var(--grn)" }}>3.2M</div><div className="ana-lbl">Tokens Consumed</div><div className="ana-change up">↑ 22.7%</div></div>
              <div className="ana-card"><div className="ana-icon">😊</div><div className="ana-val" style={{ color: "var(--grn)" }}>78%</div><div className="ana-lbl">Positive Sentiment</div><div className="ana-change up">↑ 4.2%</div></div>
              <div className="ana-card"><div className="ana-icon">⚠️</div><div className="ana-val" style={{ color: "var(--red)" }}>0.03%</div><div className="ana-lbl">Error Rate</div><div className="ana-change up">↓ improved</div></div>
              <div className="ana-card"><div className="ana-icon">⏱</div><div className="ana-val" style={{ color: "var(--yel)" }}>1.18s</div><div className="ana-lbl">Avg Response Time</div><div className="ana-change down">↑ +0.1s</div></div>
            </div>
            <div className="chart-placeholder">
              <div style={{ fontSize: ".85rem", fontWeight: 700 }}>Messages per Day — Last 7 days</div>
              <div className="bar-chart-row">
                {[1200, 1850, 1600, 2300, 2100, 980, 760].map((v, i) => (
                  <div key={i} className="bar-col">
                    <div className="bar" style={{ height: `${(v / 2300) * 90}px` }}></div>
                    <div className="bar-lbl">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-placeholder">
              <div style={{ fontSize: ".85rem", fontWeight: 700, marginBottom: 12 }}>Sentiment Distribution</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ height: 12, background: "var(--grn)", borderRadius: 3, width: 78 }}></div>
                  <span style={{ fontSize: ".75rem", color: "var(--mut)" }}>Positive 78%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ height: 12, background: "var(--yel)", borderRadius: 3, width: 16 }}></div>
                  <span style={{ fontSize: ".75rem", color: "var(--mut)" }}>Neutral 16%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ height: 12, background: "var(--red)", borderRadius: 3, width: 6 }}></div>
                  <span style={{ fontSize: ".75rem", color: "var(--mut)" }}>Negative 6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARCHITECTURE TAB */}
        <div className={`tab-panel ${activeTab === "arch" ? "active" : ""}`}>
          <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>System <span className="grad">Architecture</span></h2>
            <p style={{ fontSize: ".78rem", color: "var(--mut)", marginBottom: 24 }}>Microservice production architecture — horizontal scaling ready</p>
            <div className="arch-diagram">
              <div className="arch-row">
                <div className="arch-box" style={{ borderColor: "var(--blue)", color: "var(--blue)", background: "rgba(79,172,254,.07)" }}>🌐 Client<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>React · WebSocket · Axios</span></div>
              </div>
              <div className="arch-connector"></div>
              <div className="arch-row">
                <div className="arch-box" style={{ borderColor: "var(--cyan)", color: "var(--cyan)", background: "rgba(0,242,254,.07)" }}>🔀 API Gateway<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Node.js · Express · Rate Limit</span></div>
              </div>
              <div className="arch-connector"></div>
              <div className="arch-row arch-split">
                <div className="arch-box" style={{ borderColor: "var(--grn)", color: "var(--grn)", background: "rgba(67,233,123,.07)" }}>🔐 Auth<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>JWT · bcrypt</span></div>
                <div className="arch-box" style={{ borderColor: "var(--blue)", color: "var(--blue)", background: "rgba(79,172,254,.07)" }}>💬 Chat<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Node.js · WS</span></div>
                <div className="arch-box" style={{ borderColor: "var(--pur)", color: "var(--pur)", background: "rgba(168,85,247,.07)" }}>🤖 AI Service<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Python · FastAPI</span></div>
                <div className="arch-box" style={{ borderColor: "var(--yel)", color: "var(--yel)", background: "rgba(251,191,36,.07)" }}>📊 Analytics<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Node.js · Kafka</span></div>
              </div>
              <div className="arch-connector"></div>
              <div className="arch-row arch-split">
                <div className="arch-box" style={{ borderColor: "#f093fb", color: "#f093fb", background: "rgba(240,147,251,.07)" }}>🍃 MongoDB<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Replica Set</span></div>
                <div className="arch-box" style={{ borderColor: "var(--red)", color: "var(--red)", background: "rgba(245,87,108,.07)" }}>⚡ Redis<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Session · Cache</span></div>
                <div className="arch-box" style={{ borderColor: "var(--grn)", color: "var(--grn)", background: "rgba(67,233,123,.07)" }}>🐳 Docker<br /><span style={{ fontSize: ".6rem", color: "var(--mut)" }}>Load Balancer</span></div>
              </div>
            </div>

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--blue)", marginBottom: 10 }}>📦 MongoDB Schema</div>
                <div style={{ fontSize: ".68rem", fontFamily: "var(--mono)", color: "var(--mut)", lineHeight: 1.9 }}>
                  Users: _id · email · role · plan<br />
                  Conversations: _id · userId · title<br />
                  Messages: _id · convId · sender<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· content · sentiment · tokens<br />
                  UsageLogs: userId · tokens · timestamp
                </div>
              </div>
              <div style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--red)", marginBottom: 10 }}>⚡ Redis Keys</div>
                <div style={{ fontSize: ".68rem", fontFamily: "var(--mono)", color: "var(--mut)", lineHeight: 1.9 }}>
                  session:{"{userId}"} → context<br />
                  ratelimit:{"{userId}"} → counter<br />
                  analytics:summary → cache<br />
                  embed:{"{msgId}"} → vector<br />
                  TTL: 3600s (sessions)
                </div>
              </div>
              <div style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--pur)", marginBottom: 10 }}>🔀 Scaling Strategy</div>
                <div style={{ fontSize: ".68rem", color: "var(--mut)", lineHeight: 1.9 }}>
                  • Docker containers per service<br />
                  • NGINX Load Balancer<br />
                  • AI Service isolated cluster<br />
                  • MongoDB replica set + read replicas<br />
                  • Redis cluster for session sharding
                </div>
              </div>
              <div style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--grn)", marginBottom: 10 }}>🚀 Deployment</div>
                <div style={{ fontSize: ".68rem", color: "var(--mut)", lineHeight: 1.9 }}>
                  Frontend → Vercel / Cloudflare<br />
                  Backend → AWS EC2<br />
                  DB → MongoDB Atlas<br />
                  Cache → Redis Cloud<br />
                  CI/CD → GitHub Actions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API DOCS TAB */}
        <div className={`tab-panel ${activeTab === "api" ? "active" : ""}`}>
          <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>API <span className="grad">Documentation</span></h2>
            <p style={{ fontSize: ".78rem", color: "var(--mut)", marginBottom: 24 }}>RESTful + WebSocket · Base URL: <code style={{ color: "var(--cyan)", fontFamily: "var(--mono)" }}>https://api.neurochat.ai/v1</code></p>

            <div className="api-group">
              <div className="api-group-title">🔐 Authentication</div>
              <div className="api-route"><span className="api-method method-post">POST</span><span className="api-path">/auth/register</span><div className="api-desc">Register new user · Returns JWT access + refresh tokens</div></div>
              <div className="api-route"><span className="api-method method-post">POST</span><span className="api-path">/auth/login</span><div className="api-desc">Authenticate user · Returns JWT pair · Sets Redis session</div></div>
              <div className="api-route"><span className="api-method method-post">POST</span><span className="api-path">/auth/refresh</span><div className="api-desc">Refresh access token · Validates refresh token from Redis</div></div>
            </div>

            <div className="api-group">
              <div className="api-group-title">💬 Chat</div>
              <div className="api-route"><span className="api-method method-post">POST</span><span className="api-path">/chat/message</span><div className="api-desc">Send message · AI processes via Python service · Returns response + sentiment + tokens</div></div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/chat/conversations</span><div className="api-desc">List all conversations for authenticated user</div></div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/chat/messages/:convId</span><div className="api-desc">Get messages for a conversation · Paginated · Sorted by createdAt</div></div>
              <div className="api-route"><span className="api-method method-delete">DEL</span><span className="api-path">/chat/:convId</span><div className="api-desc">Delete conversation + all messages · Clears Redis context</div></div>
              <div className="api-route"><span className="api-method ws-badge">WS</span><span className="api-path">ws://api/chat/stream</span><div className="api-desc">WebSocket streaming · Token-by-token response · Real-time delivery</div></div>
            </div>

            <div className="api-group">
              <div className="api-group-title">📊 Analytics</div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/analytics/user</span><div className="api-desc">User's personal usage stats · Token consumption · Message history</div></div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/analytics/admin</span><div className="api-desc">Platform-wide metrics · Admin only · Cached in Redis</div></div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/analytics/sentiment</span><div className="api-desc">Sentiment trend analysis · NLP derived · Last 30 days</div></div>
            </div>

            <div className="api-group">
              <div className="api-group-title">⚙️ Admin</div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/admin/users</span><div className="api-desc">List all users · Paginated · Filter by plan/role</div></div>
              <div className="api-route"><span className="api-method method-patch">PATCH</span><span className="api-path">/admin/subscription</span><div className="api-desc">Upgrade/downgrade user subscription plan</div></div>
              <div className="api-route"><span className="api-method method-get">GET</span><span className="api-path">/admin/system-metrics</span><div className="api-desc">CPU · Memory · Uptime · Error rates · Prometheus-compatible</div></div>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}
