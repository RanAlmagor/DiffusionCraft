// chat-loader.js

// === Create the chat bubble button ===
const chatButton = document.createElement("button");
chatButton.id = "gemini-chat-button";
chatButton.innerText = "💬";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.width = "60px";
chatButton.style.height = "60px";
chatButton.style.borderRadius = "50%";
chatButton.style.backgroundColor = "#0ff";
chatButton.style.color = "#000";
chatButton.style.fontSize = "28px";
chatButton.style.boxShadow = "0 0 20px #0ff";
chatButton.style.border = "none";
chatButton.style.cursor = "pointer";
chatButton.style.zIndex = "1000";
document.body.appendChild(chatButton);

// === Create the chat window (hidden by default) ===
const chatWindow = document.createElement("div");
chatWindow.id = "gemini-chat-window";
chatWindow.style.position = "fixed";
chatWindow.style.bottom = "90px";
chatWindow.style.right = "20px";
chatWindow.style.width = "300px";
chatWindow.style.height = "400px";
chatWindow.style.background = "rgba(30, 30, 30, 0.95)";
chatWindow.style.borderRadius = "12px";
chatWindow.style.boxShadow = "0 0 25px rgba(0,255,255,0.5)";
chatWindow.style.padding = "10px";
chatWindow.style.display = "none";
chatWindow.style.flexDirection = "column";
chatWindow.style.zIndex = "1000";

chatWindow.innerHTML = `
  <div style="flex: 1; overflow-y: auto; color: white;" id="chat-messages"></div>
  <input id="chat-input" type="text" placeholder="Ask Gemini..." 
    style="margin-top: 8px; padding: 8px; width: 100%; border-radius: 6px; border: none;" />
`;

document.body.appendChild(chatWindow);

// === Toggle chat window ===
chatButton.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "none" ? "flex" : "none";
});

// === Fake Gemini reply (simulate AI) ===
document
  .getElementById("chat-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const input = this.value.trim();
      if (input === "") return;

      const messagesDiv = document.getElementById("chat-messages");
      const userMsg = document.createElement("div");
      userMsg.textContent = "👤 " + input;
      userMsg.style.marginBottom = "8px";
      messagesDiv.appendChild(userMsg);

      this.value = "";

      const botMsg = document.createElement("div");
      botMsg.textContent =
        "🤖 DefusuinCraftAi: This feature is under development...";
      botMsg.style.color = "#0ff";
      messagesDiv.appendChild(botMsg);

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  });
