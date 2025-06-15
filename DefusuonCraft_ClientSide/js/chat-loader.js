// Load chat.html into #chat-container
fetch("web components/chat.html")
  .then((response) => {
    if (!response.ok)
      throw new Error("Failed to load chat.html: " + response.status);
    return response.text();
  })
  .then((html) => {
    console.log("✅ chat.html loaded successfully");
    document.getElementById("chat-container").innerHTML = html;
    initChat();
  })
  .catch((err) => {
    console.error("❌ Error loading chat.html:", err);
  });

function initChat() {
  console.log("🔁 Initializing chat handlers");

  window.toggleChat = function () {
    const bubble = document.getElementById("gemini-bubble");
    const box = document.getElementById("chat-box");
    if (!bubble || !box) {
      console.error("❌ Missing chat UI elements");
      return;
    }

    if (box.classList.contains("active")) {
      box.classList.remove("active");
      setTimeout(() => {
        bubble.classList.remove("hidden");
        console.log("💬 Chat bubble shown");
      }, 300);
    } else {
      bubble.classList.add("hidden");
      box.classList.add("active");
    }
  };

  const log = document.getElementById("chat-messages");

  if (log) {
    const botReply = document.createElement("div");
    botReply.className = "bot-message";

    // יצירת בלוק טקסט ברור ומופרד עם פסקאות
    const welcomeText = document.createElement("div");
    welcomeText.innerHTML = `
    <p><strong>Welcome, dreamer!</strong> 🤖</p>
    <p>I am <em>The Wizard of DefusionCraft</em> 🧙‍♂️</p>
    <p>Share your magical idea,<br>and I’ll conjure it into a <strong>stunning image ✨</strong></p>
  `;
    welcomeText.style.color = "#00fff7";
    welcomeText.style.lineHeight = "1.5";
    welcomeText.style.flex = "1";

    // כפתור דיבור
    const speakBtn = document.createElement("button");
    speakBtn.innerHTML = "🔊";
    speakBtn.title = "Speak this";
    speakBtn.className = "speak-button";
    speakBtn.onclick = () => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(
        "Welcome, dreamer! I am the Wizard of DefusionCraft. Share your magical idea and I’ll conjure it into a stunning image."
      );
      const selectedVoiceName =
        document.getElementById("voice-selector")?.value;
      const selectedVoice = synth
        .getVoices()
        .find((v) => v.name === selectedVoiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }
      synth.cancel();
      synth.speak(utterance);
    };

    // מבנה גמיש
    botReply.style.display = "flex";
    botReply.style.alignItems = "center";
    botReply.style.justifyContent = "space-between";
    botReply.style.gap = "10px";

    botReply.appendChild(welcomeText);
    botReply.appendChild(speakBtn);
    log.appendChild(botReply);
  }

  window.handleKey = function (event) {
    if (event.key === "Enter") {
      const input = document.getElementById("chat-input");
      const log = document.getElementById("chat-messages");
      const message = input.value.trim();
      if (!message) return;

      const userMsg = document.createElement("div");
      userMsg.className = "user-message";
      userMsg.textContent = message;
      log.appendChild(userMsg);

      log.appendChild(userMsg);
      input.value = "";
      log.scrollTop = log.scrollHeight;

      const loadingMsg = document.createElement("div");
      loadingMsg.id = "loading-msg";
      loadingMsg.className = "loading-spinner";
      log.appendChild(loadingMsg);
      log.scrollTop = log.scrollHeight;

      const userSub = "test-user-123";
      const originalPrompt = window.chat_originalPrompt || "";
      const selectedStyle = window.chat_selectedStyle || "";

      const data = { message, userSub, originalPrompt, selectedStyle };

      fetch(
        "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/AIChat",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          document.getElementById("loading-msg")?.remove();

          const botReply = document.createElement("div");
          botReply.className = "bot-message";
          botReply.style.display = "flex";
          botReply.style.alignItems = "center";
          botReply.style.justifyContent = "space-between";
          botReply.style.gap = "10px";

          const replyText = document.createElement("span");
          replyText.textContent = "🤖 " + (data.reply || "No response");
          replyText.style.flex = "1";
          replyText.style.color = "#00fff7";

          const speakBtn = document.createElement("button");
          speakBtn.innerHTML = "🔊";
          speakBtn.title = "Speak this";
          speakBtn.className = "speak-button";
          speakBtn.onclick = () => {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(
              data.reply || "No response"
            );
            const selectedVoiceName =
              document.getElementById("voice-selector")?.value;
            const selectedVoice = synth
              .getVoices()
              .find((v) => v.name === selectedVoiceName);
            if (selectedVoice) {
              utterance.voice = selectedVoice;
              utterance.lang = selectedVoice.lang;
            }
            synth.cancel();
            synth.speak(utterance);
          };

          botReply.appendChild(replyText);
          botReply.appendChild(speakBtn);
          log.appendChild(botReply);
          log.scrollTop = log.scrollHeight;

          if (data.expectingConfirmation && data.originalPrompt) {
            window.chat_originalPrompt = data.originalPrompt;
            window.chat_selectedStyle = "";
          }

          if (data.expectingStyleSelection && data.promptCore) {
            window.chat_originalPrompt = data.originalPrompt;
            window.chat_selectedStyle = "";

            const styleOptions = [
              { label: "🎨 Realistic", value: "Realistic" },
              { label: "🌌 Fantasy", value: "Fantasy" },
              { label: "🖌️ Watercolor", value: "Watercolor" },
              { label: "🧩 Surrealism", value: "Surreal" },
              { label: "🪄 Digital", value: "Digital Art" },
            ];

            const buttonsDiv = document.createElement("div");
            buttonsDiv.style.marginTop = "10px";
            buttonsDiv.textContent = data.reply + " (choose style):";

            styleOptions.forEach((style) => {
              const btn = document.createElement("button");
              btn.textContent = style.label;
              btn.style.margin = "6px";
              btn.style.padding = "6px 12px";
              btn.style.borderRadius = "8px";
              btn.style.border = "1px solid #00fff7";
              btn.style.background = "#111";
              btn.style.color = "#00fff7";
              btn.style.cursor = "pointer";
              btn.onclick = () => {
                document.getElementById("chat-input").value = style.value;
                window.chat_selectedStyle = style.value;
                window.handleKey({ key: "Enter" });
              };
              buttonsDiv.appendChild(btn);
            });

            log.appendChild(buttonsDiv);
            log.scrollTop = log.scrollHeight;
          }
        })
        .catch((err) => {
          document.getElementById("loading-msg")?.remove();
          const errorMsg = document.createElement("div");
          errorMsg.textContent = "⚠️ Error contacting server";
          log.appendChild(errorMsg);
          console.error("❌ Chat API error:", err);
        });
    }
  };

  window.startVoiceInput = function () {
    const input = document.getElementById("chat-input");
    if (!("webkitSpeechRecognition" in window)) {
      alert("🎤 Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    console.log("🎤 Listening...");

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      console.log("✅ Voice recognized:", transcript);
      input.value = transcript;
      window.handleKey({ key: "Enter" });
    };

    recognition.onerror = function (event) {
      console.error("❌ Speech recognition error:", event.error);
      alert("Error during speech recognition: " + event.error);
    };

    recognition.onend = function () {
      console.log("🛑 Speech recognition ended");
    };
  };

  window.testSelectedVoice = function () {
    const selector = document.getElementById("voice-selector");
    const selectedVoiceName = selector?.value;
    const synth = window.speechSynthesis;

    if (!selectedVoiceName) {
      alert("Please select a voice first.");
      return;
    }

    const voices = synth.getVoices();
    const voice = voices.find((v) => v.name === selectedVoiceName);

    if (!voice) {
      alert("Selected voice not found.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "🎙️ Hello! This is a voice test. I am the wizard of DefusionCraft, at your service."
    );

    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.pitch = 1;
    utterance.rate = 1;

    console.log("🗣 Testing voice:", voice.name);
    synth.cancel();
    synth.speak(utterance);
  };

  function populateVoiceList() {
    const synth = window.speechSynthesis;
    const selector = document.getElementById("voice-selector");
    if (!selector) return;

    const voices = synth.getVoices();
    if (!voices.length) {
      console.log("🕐 Voices not loaded yet. Retrying...");
      setTimeout(populateVoiceList, 500);
      return;
    }

    selector.innerHTML = "";

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.textContent = `${voice.name} (${voice.lang})`;
      option.title = `${voice.name} (${voice.lang})`;
      option.value = voice.name;
      selector.appendChild(option);
    });

    console.log(
      "✅ All voices loaded:",
      voices.map((v) => `${v.name} (${v.lang})`)
    );
  }

  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList();
  }

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
