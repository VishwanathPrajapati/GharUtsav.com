// ========================================
// SULABH AI - FRONTEND
// ========================================

// Backend तैयार होने के बाद यहाँ उसका URL डालेंगे
const API_URL = "https://YOUR-BACKEND-URL/api/chat";


// HTML Elements
const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");


// Conversation Memory
let conversation = [];


// ========================================
// MESSAGE SHOW
// ========================================

function addMessage(text, type) {

  const message = document.createElement("div");

  message.className = "message " + type;

  message.textContent = text;

  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}


// ========================================
// SEND MESSAGE
// ========================================

chatForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  const message = promptInput.value.trim();

  if (!message) {
    return;
  }


  // User का message दिखाएँ
  addMessage(message, "user");


  // Conversation में save करें
  conversation.push({
    role: "user",
    text: message
  });


  // Input खाली करें
  promptInput.value = "";


  // Loading शुरू
  loading.classList.remove("hidden");

  sendBtn.disabled = true;


  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        message: message,

        history: conversation

      })

    });


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.error || "Server error"
      );

    }


    // AI का जवाब
    const reply = data.reply;

    addMessage(reply, "ai");


    // AI reply को memory में save करें
    conversation.push({
      role: "assistant",
      text: reply
    });


  } catch (error) {

    console.error(error);

    addMessage(
      "❌ अभी AI server connect नहीं है। Backend तैयार होने के बाद AI जवाब देगा।",
      "ai"
    );

  }


  // Loading बंद
  loading.classList.add("hidden");

  sendBtn.disabled = false;

  promptInput.focus();

});


// ========================================
// CLEAR CHAT
// ========================================

clearBtn.addEventListener("click", function() {

  conversation = [];

  chatBox.innerHTML = "";

  addMessage(
    "नई chat शुरू हो गई। 😊",
    "ai"
  );

});