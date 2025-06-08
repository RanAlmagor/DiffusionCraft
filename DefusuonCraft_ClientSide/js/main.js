// File: js/main.js

// Toggle chat visibility
function toggleChat() {
  document.getElementById("chat-box").classList.toggle("hidden");
}

// Handle enter key in chat input
function handleKey(e) {
  if (e.key === "Enter") {
    const input = document.getElementById("chat-input");
    const log = document.getElementById("chat-log");
    const msg = input.value.trim();
    if (msg) {
      log.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
      log.innerHTML += `<div><strong>Gemini:</strong> (answer will appear here)</div>`;
      input.value = "";
      log.scrollTop = log.scrollHeight;
    }
  }
}
