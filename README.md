# 🚀 SaarthiClaw

SaarthiClaw is an AI-powered developer assistant designed to help engineers understand, plan, and modify codebases directly from the command line.

Built with TypeScript, Bun, OpenRouter, AI SDK, and Telegram integration, SaarthiClaw combines AI reasoning with safe code execution workflows to create a practical coding assistant for real-world projects.

Unlike traditional chatbots, SaarthiClaw can analyze project structures, generate implementation plans, answer codebase-specific questions, and perform code modifications through a human approval workflow.

---

# ✨ Features

## 🧠 Ask Mode

Ask questions about your project and receive contextual answers.

Examples:

* Explain the architecture of this project
* How does authentication work?
* Find potential issues in the codebase
* Summarize this repository

---

## 📋 Plan Mode

Generate detailed step-by-step implementation plans before making changes.

Examples:

* Add WhatsApp integration
* Build a notification system
* Add authentication
* Refactor the approval workflow

The generated plans help developers understand the work before implementation begins.

---

## 🕵️ Agent Mode

Agent Mode allows AI to interact with the codebase using tools.

Capabilities:

* Read files
* Search files
* Analyze code
* Create files
* Modify files
* Create folders
* Execute approved actions

All modifications are staged before being applied.

---

## ✅ Approval Workflow

Safety is a core feature of SaarthiClaw.

Before any modification is applied:

1. Changes are staged
2. Diffs are generated
3. User reviews the changes
4. User approves or rejects actions
5. Only approved actions are executed

This prevents accidental modifications.

---

## 🤖 Telegram Integration

SaarthiClaw can be controlled through Telegram.

Features:

* Owner verification
* Remote interaction
* AI-powered assistance
* Project access through Telegram commands

This enables developers to interact with their assistant from anywhere.

---

# 🏗️ Tech Stack

### Core

* TypeScript
* Bun Runtime
* AI SDK
* OpenRouter

### CLI

* Commander
* Clack Prompts
* Chalk

### Validation

* Zod

### Telegram

* Telegraf

### Rendering

* Marked
* Marked Terminal

---

# 📂 Project Structure

```text
ai/
│
├── providers/
├── models/
└── configuration/

modes/
│
├── ask/
├── plan/
├── agent/
└── telegram/

tui/

index.ts
package.json
tsconfig.json
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/hritik0447/SaarthiClaw.git
cd SaarthiClaw
```

Install dependencies:

```bash
bun install
```

Link the CLI locally:

```bash
bun link
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key

TELEGRAM_BOT_TOKEN=your_bot_token

TELEGRAM_OWNER_ID=your_telegram_user_id
```

Never commit `.env` files to GitHub.

---

# ▶️ Running SaarthiClaw

Start the CLI:

```bash
saarthiclaw-build wakeup
```

Available Modes:

* Ask Mode
* Plan Mode
* Agent Mode
* Telegram Mode

---

# 🔄 Typical Workflow

### 1. Generate a Plan

```text
Goal:
Add WhatsApp integration
```

SaarthiClaw generates a structured implementation plan.

---

### 2. Execute with Agent Mode

Select the desired plan steps and allow the agent to work on them.

---

### 3. Review Changes

Inspect generated diffs and approve or reject modifications.

---

### 4. Apply Changes

Only approved changes are applied to the codebase.

---

# 🛡️ Security Philosophy

SaarthiClaw follows a human-in-the-loop approach.

The assistant can:

* Analyze
* Suggest
* Prepare modifications

But final control always remains with the developer.

---

# 🗺️ Roadmap

Upcoming features:

* WhatsApp Integration
* Web Search Tools
* Voice Mode
* Docker Support
* GitHub Actions Integration
* Multi-Agent Collaboration
* Persistent Memory
* Advanced Planning Engine

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

Example:

```bash
git checkout -b feature/whatsapp-mode
git commit -m "Add WhatsApp integration"
git push origin feature/whatsapp-mode
```

---

# 📄 License

MIT License

---

Built with ❤️ using TypeScript, Bun, and AI.
