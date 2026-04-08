// Get DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Show a welcome message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Store the conversation as an array of messages
let messages = [
  {
    role: "system",
    content: "You are a helpful assistant for beauty and skincare products.",
  },
];

// Function to add a message to the chat window
function addMessage(role, content) {
  const msgDiv = document.createElement("div");
  msgDiv.className = role === "user" ? "msg user" : "msg bot";
  msgDiv.textContent = content;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Clear chat window and show welcome message
chatWindow.innerHTML = "";
addMessage("bot", "👋 Hello! How can I help you today?");

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  // Add user message to chat
  addMessage("user", userMsg);
  messages.push({ role: "user", content: userMsg });
  userInput.value = "";

  // Show loading message
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "msg bot";
  loadingDiv.textContent = "Thinking...";
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Call your Cloudflare Worker or backend endpoint here
    // Replace 'YOUR_API_URL' with your actual endpoint
    const response = await fetch("YOUR_API_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if needed
      },
      body: JSON.stringify({
        messages: messages,
        model: "gpt-4o", // or "gpt-3.5-turbo"
      }),
    });
    const data = await response.json();
    // Get the assistant's reply
    const botMsg =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't get a response.";
    messages.push({ role: "assistant", content: botMsg });

    // Remove loading and show bot reply
    chatWindow.removeChild(loadingDiv);
    addMessage("bot", botMsg);
  } catch (err) {
    chatWindow.removeChild(loadingDiv);
    addMessage("bot", "Error: Could not connect to the API.");
  }
});
