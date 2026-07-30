// ===============================
// ANA REFI - AI Chatbot Widget
// ===============================

// ⚠️ مهم جدًا قبل الرفع أونلاين أو العرض في المسابقة:
// المفتاح ده بيتحط هنا مؤقتًا للتجربة والعرض بس. لو المشروع هيتنشر فعليًا (Live)،
// لازم يبقى فيه Backend بسيط (Node.js مثلاً) يستقبل رسالة اليوزر ويبعتها هو للـ API،
// عشان محدش يقدر ياخد المفتاح من كود الموقع ويستخدمه. دلوقتي هو Frontend-only فعشان
// كده بنحطه هنا مباشرة للتجربة والديمو.
const ANTHROPIC_API_KEY = "PUT_YOUR_ANTHROPIC_API_KEY_HERE";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";

// ===============================
// معرفة الموقع (تتغذى للـ AI في كل رسالة عشان يجاوب من واقع بيانات المنصة الحقيقية)
// ===============================
function buildSiteKnowledge() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const productsSummary = products.slice(0, 15).map(p =>
    `- ${p.name} | ${p.location} | ${p.pCategory} | EGP ${p.price}/person`
  ).join("\n") || "لا توجد تجارب مضافة على المنصة حاليًا.";

  return `
أنت "Refi Assistant"، المساعد الذكي لمنصة ANA REFI — منصة سياحة ريفية مصرية بتوصل السياح بأصحاب البيوت والحرفيين في الريف المصري (سيوة، الفيوم، أسوان، أسيوط، سيناء، الدلتا، الأقصر) عشان يعيشوا يوم كامل كأهل البلد: أكل ريفي، زراعة، وحرف يدوية زي الفخار والتطريز.

قواعد مهمة:
- رد دايمًا بإيجاز ووضوح (3-4 جمل بحد أقصى في العادة)
- لو المستخدم كتب بالعربي، رد بالعربي. لو بالإنجليزي، رد بالإنجليزي
- لو سأل عن تجربة معينة أو حجز، وجهه لصفحة Explore (./explor.html)
- لو سأل عن مناطق مصر والحرف، استخدم معلوماتك عن سيوة (فخار وزيتون)، الفيوم (فخار)، أسوان والنوبة (نسيج وخرز)، أسيوط (تطريز التلي)، سيناء (نسيج بدوي)، الدلتا (زراعة عضوية)
- المستخدم ${isLoggedIn ? "مسجل دخول بالفعل" : "لسه مش مسجل دخول"}
- متقولش أي معلومة مش متأكد منها عن المنصة، ولو مش عارف وجهه للدعم

التجارب المتاحة فعليًا على المنصة دلوقتي:
${productsSummary}
`.trim();
}

// ===============================
// STATE
// ===============================
let chatHistory = [];
let isWaitingResponse = false;

const suggestions = [
  "What can I do here?",
  "Tell me about Siwa",
  "How do I become a host?",
  "Show me pottery experiences"
];

// ===============================
// UI SETUP
// ===============================
const toggleBtn = document.getElementById("chatbotToggle");
const windowEl = document.getElementById("chatbotWindow");
const messagesEl = document.getElementById("chatbotMessages");
const suggestionsEl = document.getElementById("chatbotSuggestions");
const inputEl = document.getElementById("chatbotInput");
const sendBtn = document.getElementById("chatbotSend");

function openChat() {
  windowEl.classList.add("active");
  toggleBtn.classList.add("open");
  if (messagesEl.children.length === 0) {
    addBotMessage("Hey! 👋 I'm Refi Assistant. Ask me about rural experiences, regions of Egypt, or how ANA REFI works.");
    renderSuggestions();
  }
}

function closeChat() {
  windowEl.classList.remove("active");
  toggleBtn.classList.remove("open");
}

toggleBtn?.addEventListener("click", () => {
  windowEl.classList.contains("active") ? closeChat() : openChat();
});

function renderSuggestions() {
  suggestionsEl.innerHTML = "";
  suggestions.forEach(s => {
    const btn = document.createElement("button");
    btn.innerText = s;
    btn.onclick = () => sendMessage(s);
    suggestionsEl.appendChild(btn);
  });
}

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerText = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addBotMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-msg bot";
  div.innerText = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "chat-msg bot typing";
  div.id = "typingIndicator";
  div.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  document.getElementById("typingIndicator")?.remove();
}

// ===============================
// SEND MESSAGE + API CALL
// ===============================
async function sendMessage(presetText) {
  const text = (presetText || inputEl.value).trim();
  if (!text || isWaitingResponse) return;

  addUserMessage(text);
  inputEl.value = "";
  suggestionsEl.innerHTML = "";

  chatHistory.push({ role: "user", content: text });
  isWaitingResponse = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 400,
        system: buildSiteKnowledge(),
        messages: chatHistory
      })
    });

    const data = await response.json();
    hideTyping();

    if (data?.content?.[0]?.text) {
      const reply = data.content[0].text;
      addBotMessage(reply);
      chatHistory.push({ role: "assistant", content: reply });
    } else {
      addBotMessage("Sorry, something went wrong on my end. Please try again in a moment.");
    }

  } catch (err) {
    hideTyping();
    addBotMessage("I'm having trouble connecting right now. Please check your internet connection or try again shortly.");
    console.error("Chatbot error:", err);
  }

  isWaitingResponse = false;
  sendBtn.disabled = false;
}

sendBtn?.addEventListener("click", () => sendMessage());
inputEl?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
