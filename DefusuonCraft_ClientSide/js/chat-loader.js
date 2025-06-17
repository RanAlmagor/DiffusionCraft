// chat-loader.js
window.addEventListener("load", () => {
  const chatContainer = document.getElementById("chat-container");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    console.log("🛑 User not logged in. Hiding chat.");
    if (chatContainer) chatContainer.classList.add("hidden");
    return;
  }

  console.log("✅ User is logged in. Showing chat.");
  if (chatContainer) chatContainer.classList.remove("hidden");

  // Load chat content
  fetch("web components/chat.html")
    .then((response) => {
      if (!response.ok)
        throw new Error("Failed to load chat.html: " + response.status);
      return response.text();
    })
    .then((html) => {
      console.log("✅ chat.html loaded successfully");
      chatContainer.innerHTML = html;
      initChat();
    })
    .catch((err) => {
      console.error("❌ Error loading chat.html:", err);
    });
});

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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userSub = userInfo?.name;
      const originalPrompt = window.chat_originalPrompt || "";
      const selectedStyle = window.chat_selectedStyle || "";

      const data = { message, userSub, originalPrompt, selectedStyle };

      // ... previous code up to fetch()

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
          replyText.textContent = "🧐 " + (data.reply || "No response");
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

          // If an imageId is returned, start polling
          if (data.imageId) {
            const userInfo = JSON.parse(
              localStorage.getItem("userInfo") || "{}"
            );
            const userSub = userInfo?.name;

            const loadingBlock = document.createElement("div");
            loadingBlock.id = "image-loading";
            loadingBlock.className = "bot-message";
            loadingBlock.innerHTML = `<p>🧙‍♂️ Generating your magical image... Please wait.</p>`;
            log.appendChild(loadingBlock);
            log.scrollTop = log.scrollHeight;

            const poll = setInterval(() => {
              fetch(
                "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/status_Image",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ imageId: data.imageId, userSub }),
                }
              )
                .then((res) => res.json())
                .then((rawData) => {
                  const statusData =
                    typeof rawData.body === "string"
                      ? JSON.parse(rawData.body)
                      : rawData;

                  if (statusData.status === "completed" && statusData.s3url) {
                    clearInterval(poll);
                    loadingBlock.remove();

                    // 🖼️ Create message block
                    const imgBlock = document.createElement("div");
                    imgBlock.className = "bot-message";
                    imgBlock.style.display = "flex";
                    imgBlock.style.flexDirection = "column";

                    // 📝 Caption
                    const caption = document.createElement("p");
                    caption.innerHTML = `<strong>${
                      statusData.prompt || "✨ Your image is ready:"
                    }</strong>`;
                    caption.style.marginBottom = "8px";
                    caption.style.color = "#00fff7";

                    // 🖼️ Image
                    const img = document.createElement("img");
                    img.src = statusData.s3url;
                    img.style.maxWidth = "100%";
                    img.style.borderRadius = "12px";
                    img.style.marginTop = "4px";

                    imgBlock.appendChild(caption);
                    imgBlock.appendChild(img);
                    log.appendChild(imgBlock);
                    log.scrollTop = log.scrollHeight;

                    // 🖼️ Add to gallery
                    const gallery = document.getElementById("gallery");
                    if (gallery) {
                      const card = document.createElement("div");
                      card.className = "image-card";
                      card.innerHTML = `
            <img src="${statusData.s3url}" alt="${statusData.prompt || ""}" />
            <p class="caption">${statusData.prompt || ""}</p>
          `;
                      gallery.prepend(card);
                    }

                    // 🔄 Reset chat input
                    const chatInput = document.getElementById("chat-input");
                    const voiceControls = document.getElementById(
                      "voice-buttons-container"
                    );
                    if (chatInput) {
                      chatInput.value = "";
                      chatInput.style.display = "";
                    }
                    if (voiceControls) {
                      voiceControls.style.display = "";
                    }

                    window.chat_originalPrompt = "";
                    window.chat_selectedStyle = "";
                  }
                })
                .catch((err) => {
                  console.error("Polling error:", err);
                });
            }, 3000);
          }

          if (data.expectingConfirmation && data.originalPrompt) {
            window.chat_originalPrompt = data.originalPrompt;
            window.chat_selectedStyle = "";
          }

          if (data.expectingStyleSelection && data.promptCore) {
            window.chat_originalPrompt = data.originalPrompt;
            window.chat_selectedStyle = "";

            document.getElementById("chat-input").style.display = "none";
            document.getElementById("voice-buttons-container").style.display =
              "none";

            const styleOptions = [
              { label: " Realistic 🎨", value: "Realistic" },
              { label: " Fantasy 🌌", value: "Fantasy" },
              { label: " Watercolor 🖌️", value: "Watercolor" },
              { label: " Surrealism 🧩", value: "Surreal" },
              { label: " Digital Art 🪄", value: "Digital Art" },
              { label: " Pixel Art 🕹️", value: "Pixel Art" },
              { label: " Photorealistic 📸", value: "Photorealistic" },
              { label: " Sci-Fi 🧬", value: "Sci-Fi" },
              { label: " Anime 🌸", value: "Anime" },
              { label: " Cartoon 👶", value: "Cartoon" },
              { label: " Cyberpunk 🎭", value: "Cyberpunk" },
              { label: " Magical 🧙‍♀️", value: "Magical" },
            ];

            const stylePromptDiv = document.createElement("div");
            stylePromptDiv.className = "bot-message";
            stylePromptDiv.style.flexDirection = "column";
            stylePromptDiv.innerHTML = `
      🤖 <strong>${data.reply || "Choose a style:"}</strong><br>
      <em>Click one below or type your own style:</em>
    `;

            const buttonsWrap = document.createElement("div");
            buttonsWrap.style.display = "flex";
            buttonsWrap.style.flexWrap = "wrap";
            buttonsWrap.style.marginTop = "8px";
            buttonsWrap.style.gap = "6px";

            styleOptions.forEach((style) => {
              const btn = document.createElement("button");
              btn.textContent = style.label;
              btn.style.padding = "6px 12px";
              btn.style.borderRadius = "8px";
              btn.style.border = "1px solid #00fff7";
              btn.style.background = "#111";
              btn.style.color = "#00fff7";
              btn.style.cursor = "pointer";
              btn.onclick = () => {
                document.getElementById("chat-input").value = style.value;
                window.chat_selectedStyle = style.value;
                document.getElementById("chat-input").style.display = "";
                document.getElementById(
                  "voice-buttons-container"
                ).style.display = "";
                window.handleKey({ key: "Enter" });
              };
              buttonsWrap.appendChild(btn);
            });

            const freeInput = document.createElement("input");
            freeInput.type = "text";
            freeInput.placeholder = "Or type a custom style...";
            freeInput.style.marginTop = "10px";
            freeInput.style.padding = "6px 8px";
            freeInput.style.borderRadius = "8px";
            freeInput.style.border = "1px solid #00fff7";
            freeInput.style.background = "#111";
            freeInput.style.color = "#00fff7";
            freeInput.style.fontFamily = "Orbitron, sans-serif";
            freeInput.style.boxShadow = "0 0 6px #00fff733 inset";

            freeInput.onkeydown = (e) => {
              if (e.key === "Enter") {
                const customStyle = freeInput.value.trim();
                if (customStyle) {
                  document.getElementById("chat-input").value = customStyle;
                  window.chat_selectedStyle = customStyle;
                  document.getElementById("chat-input").style.display = "";
                  document.getElementById(
                    "voice-buttons-container"
                  ).style.display = "";
                  window.handleKey({ key: "Enter" });
                }
              }
            };

            stylePromptDiv.appendChild(buttonsWrap);
            stylePromptDiv.appendChild(freeInput);
            log.appendChild(stylePromptDiv);
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
