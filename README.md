# 🚀 SaarthiClaw

SaarthiClaw is an AI-powered CLI coding assistant built with TypeScript, Bun, and AI SDK. It helps developers analyze codebases, generate execution plans, answer project-related questions, and safely perform code modifications through an approval workflow.

## ✨ Features

### 🧠 Ask Mode

Ask questions about your codebase and receive contextual answers.

Examples:

* Explain this project structure
* How does authentication work?
* Summarize this codebase

### 📋 Plan Mode

Generate step-by-step implementation plans for development goals.

Examples:

* Build a WhatsApp integration
* Add authentication to the project
* Refactor the approval system

### 🕵️ Agent Mode

Allows the AI agent to:

* Read files
* Analyze code
* Create files
* Modify files
* Execute approved actions

All modifications go through an approval flow before being applied.

### ✅ Approval Workflow

Before changes are applied, SaarthiClaw:

* Stages modifications
* Shows diffs
* Lets the user approve or reject actions
* Applies only approved changes

### 🤖 Telegram Integration

Control SaarthiClaw through Telegram.

Features:

* Owner authentication
* Command handling
* Remote interaction with the assistant

## 🏗️ Tech Stack

* TypeScript
* Bun
* AI SDK
* OpenRouter
* Telegraf
* Zod
* Chalk
* Commander
* Clack Prompts

## 📂 Project Structure

```text
ai/
modes/
 ├── agent/
 ├── ask/
 ├── plan/
 └── telegram/

tui/
index.ts
package.json
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/hritik0447/SaarthiClaw.git
cd SaarthiClaw
```

Install dependencies:

```bash
bun install
```

## 🔐 Environment Variables

Create a `.env` file:

```env
## Environment Variables

OPENROUTER_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_OWNER_ID=
```

## ▶️ Running the Project

Start the application:

```bash
saarthiclaw-build wakeup
```

You will be able to choose:

* Ask Mode
* Plan Mode
* Agent Mode
* Telegram Mode

## 📸 Example Workflow

1. Launch SaarthiClaw
2. Select Plan Mode
3. Enter a goal
4. Review generated steps
5. Execute selected steps through Agent Mode
6. Approve or reject changes

## 🛡️ Safety

SaarthiClaw never directly applies code modifications without approval. All changes pass through a review and approval process.

## 🎯 Future Roadmap

* WhatsApp Integration
* Web Search Tools
* Voice Mode
* Docker Support
* GitHub Actions Integration
* Multi-Agent Workflows

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

## 📄 License

MIT License
