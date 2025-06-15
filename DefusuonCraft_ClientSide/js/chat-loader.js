// Load chat.html from the "web components" folder into #chat-container
fetch("web components/chat.html")
  .then((response) => {
    if (!response.ok)
      throw new Error("Failed to load chat.html: " + response.status);
    return response.text();
  })
  .then((html) => {
    console.log("✅ chat.html loaded successfully");
    document.getElementById("chat-container").innerHTML = html;
    initChat(); // Run chat logic after loading
  })
  .catch((err) => {
    console.error("❌ Error loading chat.html:", err);
  });

function initChat() {
  console.log("🔁 Initializing chat handlers");

  // Toggle chat bubble and window
  window.toggleChat = function () {
    const bubble = document.getElementById("gemini-bubble");
    const box = document.getElementById("chat-box");
    if (!bubble || !box) {
      console.error("❌ Missing chat UI elements");
      return;
    }
    bubble.classList.toggle("hidden");
    box.classList.toggle("hidden");
  };

  // Handle Enter key to send message to API
  window.handleKey = function (event) {
    if (event.key === "Enter") {
      const input = document.getElementById("chat-input");
      const log = document.getElementById("chat-messages");
      const message = input.value.trim();
      if (!message) return;

      // Display user's message
      const userMsg = document.createElement("div");
      userMsg.textContent = "🧠 " + message;
      log.appendChild(userMsg);
      input.value = "";
      log.scrollTop = log.scrollHeight;

      // Show loading message
      const loadingMsg = document.createElement("div");
      loadingMsg.textContent = "🤖 Thinking...";
      loadingMsg.id = "loading-msg";
      log.appendChild(loadingMsg);
      log.scrollTop = log.scrollHeight;

      // Send message to the AI API
      fetch(
        "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/AIChat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: message }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          document.getElementById("loading-msg").remove();
          const botReply = document.createElement("div");
          botReply.textContent = "🤖 " + (data.reply || "No response");
          log.appendChild(botReply);
          log.scrollTop = log.scrollHeight;
        })
        .catch((err) => {
          document.getElementById("loading-msg").remove();
          const errorMsg = document.createElement("div");
          errorMsg.textContent = "⚠️ Error contacting server";
          log.appendChild(errorMsg);
          console.error("❌ Chat API error:", err);
        });
    }
  };

  // Voice input placeholder
  window.startVoiceInput = function () {
    alert("🎤 Voice input not implemented yet");
  };

  // Voice output placeholder
  window.speakMessage = function () {
    alert("🔊 Voice output not implemented yet");
  };

  // Show chat bubble after DOM is ready
  setTimeout(() => {
    const bubble = document.getElementById("gemini-bubble");
    if (bubble) {
      bubble.classList.remove("hidden");
      console.log("💬 Chat bubble shown");
    } else {
      console.warn("⚠️ Chat bubble not found");
    }
  }, 50);
}
