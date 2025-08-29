# 🎁 Gift Parser Bot

![JavaScript](https://img.shields.io/badge/JavaScript-Node.js-yellow.svg)
![Telegram](https://img.shields.io/badge/Telegram-Bot-blue.svg)
![TON](https://img.shields.io/badge/TON-Blockchain-lightblue.svg)

Telegram bot that parses TON gift data and sends notifications when new gifts become available.

## 📋 Features

- 🔍 **Auto-monitoring** - Continuously checks for new TON gifts
- 📢 **Instant notifications** - Get notified immediately when gifts appear
- ⚡ **Fast parsing** - Quick detection and processing
- 🎯 **Smart filtering** - Avoids duplicate notifications
- 📱 **Telegram integration** - Direct messages to your Telegram chat
- 🔄 **Continuous operation** - Runs 24/7 in the background

## 🚀 Setup

### 1. Installation
Clone this repository and install the required Node.js packages using npm.

### 2. Get your Telegram Bot Token 🤖
- Open Telegram and find @BotFather
- Create a new bot with /newbot command
- Choose a name and username for your bot
- Copy the provided token

### 3. Get your user_auth token 🔑
To get your user_auth token:
- Open Tonnel_Network_bot in your browser 
- Open Developer Tools (F12) and go to Network tab
- Filter by XHR requests
- Perform any action in Telegram (like opening a chat)
- Look for requests 
- Find the Authorization header in the request

### 4. Configure the bot ⚙️
Edit the config.js file and update these values:
- **bot_token** - Your bot token from BotFather
- **user_auth** - Your user_auth token from the browser
- **chat_id** - Your personal chat ID (get it by messaging your bot first)
- **check_interval** - How often to check for new gifts (in seconds)

**Getting your Chat ID:**
Send any message to your bot, then visit: `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates` and look for the chat ID number.

### 5. Run the bot 🏃‍♂️
Execute the main JavaScript file to start the bot.

## ⚠️ Important Notes

- 🔒 **Keep your tokens secure** - Never share them publicly
- 🔄 **user_auth expires** - You may need to update it periodically
- 📱 **Stay logged in** - Keep Telegram Web session active for user_auth to work
- 🚫 **Rate limits** - Don't set check_interval too low to avoid being blocked

## 🛠️ Requirements

- Node.js 14+
- npm or yarn
- Active internet connection
- Telegram account
- Valid bot token and user_auth

## 📝 How it works

The bot uses your user_auth token to access Telegram's internal API and monitors TON gift channels. When new gifts are detected, it immediately sends a notification message to your specified Telegram chat with all the gift details. The bot runs continuously and checks for updates based on your configured interval.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

---

⭐ **Star this repo if it helped you!**
