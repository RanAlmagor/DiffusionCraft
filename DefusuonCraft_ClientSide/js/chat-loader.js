import { fetchUserStatus } from "./auth-api.js"; // ייבוא הפונקציה מהקובץ auth-api.js

// === Create the chat bubble button ===
const chatButton = document.createElement("button");
chatButton.id = "gemini-chat-button";
chatButton.innerText = "💬";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.width = "50px";
chatButton.style.height = "50px";
chatButton.style.borderRadius = "50%";
chatButton.style.backgroundColor = "#00fff7";
chatButton.style.color = "#000";
chatButton.style.fontSize = "26px";
chatButton.style.boxShadow = "0 0 25px #00fff7, 0 0 50px #00fff7";
chatButton.style.border = "none";
chatButton.style.cursor = "pointer";
chatButton.style.zIndex = "1000";
chatButton.style.display = "none"; // התחל עם מוסתר
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
chatWindow.style.display = "none"; // התחל עם מוסתר
chatWindow.style.flexDirection = "column";
chatWindow.style.zIndex = "1000";

chatWindow.innerHTML = `
  <div style="flex: 1; overflow-y: auto; color: white;" id="chat-messages"></div>
  <input id="chat-input" type="text" placeholder="Ask something..." 
    style="margin-top: 8px; padding: 8px; width: 100%; border-radius: 6px; border: none;" />
  <button id="voice-input-btn" onclick="startVoiceInput()">🎤</button> <!-- כפתור הקלטה -->
  <button id="voice-output-btn" onclick="speakMessage()">🔊</button> <!-- כפתור קריאת תשובות בקול -->
`;

document.body.appendChild(chatWindow);

// === Fetch user status and show chat if logged in ===
fetchUserStatus().then((user) => {
  if (user.type !== "guest") {
    chatButton.style.display = "block"; // הצגת כפתור צ'אט
    chatWindow.style.display = "flex"; // הצגת חלון הצ'אט

    // טעינת סקריפט הצ'אט דינמית אם המשתמש מחובר
    const chatScript = document.createElement("script");
    chatScript.src = "js/chat-handler.js"; // שמור את הקוד של הצ'אט בסקריפט נפרד
    chatScript.defer = true;
    document.body.appendChild(chatScript);
  } else {
    chatButton.style.display = "none"; // הסתרת כפתור הצ'אט
    chatWindow.style.display = "none"; // הסתרת חלון הצ'אט
  }
});

// === Toggle chat window ===
chatButton.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "none" ? "flex" : "none";
});
