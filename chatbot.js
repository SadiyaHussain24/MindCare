// Grab the HTML elements we need to work with
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const quickReplies = document.getElementById("quickReplies");

/* ---------- 1. RESPONSE LIBRARY ---------- */
// Each key is a list of keywords to look for in the user's message.
// If any keyword is found, one of the matching responses is chosen
// at random so the conversation doesn't feel repetitive.
const responseLibrary = [
  {
    keywords: ["stress", "stressed", "pressure", "overwhelmed"],
    replies: [
      "I'm here to listen. Stress can feel heavy — try taking a slow, deep breath with me. In for 4 seconds, hold, and out for 4 seconds.",
      "That sounds tough. Would you like to play a relaxing game to take your mind off things for a few minutes?",
      "You are stronger than you think. One small step at a time is enough."
    ]
  },
  {
    keywords: ["anxious", "anxiety", "worried", "nervous", "panic"],
    replies: [
      "Anxiety can feel overwhelming, but you're not alone in this moment. Try to notice 3 things you can see around you right now.",
      "Take a deep breath. You are safe right now, in this moment.",
      "It's okay to feel anxious sometimes. Would you like a few simple self-care tips? Check the Resources page for ideas."
    ]
  },
  {
    keywords: ["sad", "depressed", "depression", "down", "unhappy", "cry", "crying"],
    replies: [
      "I'm really sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes.",
      "You are stronger than you think, even on the hard days. I'm here to listen if you want to share more.",
      "Talking to someone you trust can really help. Is there a friend or family member you could reach out to today?"
    ]
  },
  {
    keywords: ["lonely", "alone", "isolated"],
    replies: [
      "You are not alone — I'm right here with you. Many people care about you, even when it doesn't feel that way.",
      "Feeling lonely is hard. Would you like to try our relaxing game together, or talk about what's on your mind?"
    ]
  },
  {
    keywords: ["motivation", "tired", "give up", "hopeless", "hope"],
    replies: [
      "You are stronger than you think. Every small step forward still counts as progress.",
      "It's okay to rest, but please don't give up. Tomorrow can look different from today.",
      "I believe in you. Would you like a few motivational self-care tips from our Resources page?"
    ]
  },
  {
    keywords: ["thank", "thanks", "thank you"],
    replies: [
      "You're always welcome here. Take care of yourself today. 💙",
      "I'm glad I could help, even a little. I'm here anytime you need to talk."
    ]
  },
  {
    keywords: ["hello", "hi", "hey"],
    replies: [
      "Hello! I'm really glad you're here. How are you feeling today?",
      "Hi there! This is a safe space — feel free to share whatever is on your mind."
    ]
  }
];

// Default replies used when no keyword matches, so the bot always
// responds in a caring way instead of leaving the user without a reply.
const defaultReplies = [
  "I'm here to listen. Can you tell me a little more about how you're feeling?",
  "Thank you for sharing that with me. Take a deep breath — you're doing okay.",
  "You are stronger than you think. Would you like to play a relaxing game to unwind for a bit?"
];

/* ---------- 2. ADD A MESSAGE BUBBLE TO THE CHAT WINDOW ---------- */
function addMessage(text, sender) {
  // sender is either "bot" or "user" — this controls the CSS styling
  const bubble = document.createElement("div");
  bubble.classList.add("message", sender);
  bubble.textContent = text;
  chatWindow.appendChild(bubble);

  // Automatically scroll down so the newest message is always visible
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* ---------- 3. SHOW A "TYPING..." ANIMATION ---------- */
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("typing-indicator");
  typing.id = "typingIndicator";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) {
    typing.remove();
  }
}

/* ---------- 4. DECIDE WHAT THE BOT SHOULD SAY ---------- */
// This is the function you would replace with a real AI API call later.
// Right now it just checks the user's text against our keyword library.
function getBotResponse(userText) {
  const lowerText = userText.toLowerCase();

  // Look through each keyword group to find a match
  for (let i = 0; i < responseLibrary.length; i++) {
    const group = responseLibrary[i];
    const found = group.keywords.some(function (keyword) {
      return lowerText.includes(keyword);
    });

    if (found) {
      // Pick a random reply from the matching group
      const randomIndex = Math.floor(Math.random() * group.replies.length);
      return group.replies[randomIndex];
    }
  }

  // No keyword matched — use a friendly default reply
  const randomIndex = Math.floor(Math.random() * defaultReplies.length);
  return defaultReplies[randomIndex];
}

/* ---------- 5. HANDLE SENDING A MESSAGE ---------- */
function sendUserMessage(text) {
  const trimmedText = text.trim();
  if (trimmedText === "") return; // ignore empty messages

  // Show the user's own message on the right side of the chat
  addMessage(trimmedText, "user");
  chatInput.value = "";

  // Show a short "typing..." delay before the bot replies,
  // which feels more natural than an instant response.
  showTypingIndicator();

  setTimeout(function () {
    removeTypingIndicator();
    const botReply = getBotResponse(trimmedText);
    addMessage(botReply, "bot");
  }, 900); // 0.9 second delay
}

/* ---------- 6. EVENT LISTENERS ---------- */

// When the chat form (text input + send button) is submitted
if (chatForm) {
  chatForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from refreshing
    sendUserMessage(chatInput.value);
  });
}

// When one of the "quick reply" suggestion buttons is clicked
if (quickReplies) {
  const buttons = quickReplies.querySelectorAll(".quick-reply-btn");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      sendUserMessage(button.getAttribute("data-text"));
    });
  });
}

/* ---------- 7. INITIAL GREETING MESSAGE ---------- */
// Runs once when the chat page first loads.
window.addEventListener("DOMContentLoaded", function () {
  addMessage(
    "Hi, I'm your MindCare companion 💙 I'm here to listen. How are you feeling today?",
    "bot"
  );
});
