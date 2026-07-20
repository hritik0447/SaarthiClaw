# 🚀 SaarthiClaw

SaarthiClaw is an AI-powered developer assistant designed to help engineers understand, plan, and modify codebases directly from the command line.

Built with TypeScript, Bun, OpenRouter, AI SDK, and Telegram integration, SaarthiClaw combines AI reasoning with safe code execution workflows to create a practical coding assistant for real-world projects.

Unlike traditional chatbots, SaarthiClaw can analyze project structures, generate implementation plans, answer codebase-specific questions, and perform code modifications through a human approval workflow.

---

# 📋 Project Overview

SaarthiClaw empowers developers by providing intelligent coding assistance through a multifunctional command-line interface and Telegram integration. It leverages AI to understand complex codebases, generate detailed implementation plans, and safely apply changes with human approval, ensuring productivity without sacrificing control or security.

---

# ✨ Features

## 🧠 Ask Mode

Ask questions about your project and receive contextual, insightful answers.

Examples:

* Explain the architecture of this project
* How does authentication work?
* Find potential issues in the codebase
* Summarize this repository

---

## 📋 Plan Mode

Generate detailed, step-by-step implementation plans before making changes.

Examples:

* Add WhatsApp integration
* Build a notification system
* Add authentication
* Refactor the approval workflow

These plans help developers understand the scope and impact of changes prior to implementation.

---

## 🕵️ Agent Mode

Allows AI to interact directly with the codebase using powerful tools:

* Read & search files
* Analyze code quality
* Create, modify, and delete files
* Create folders
* Execute commands with prior user approval

All changes remain staged until reviewed and explicitly approved.

---

## ✅ Approval Workflow

Safety is paramount. All modifications follow this workflow:

1. Changes are staged
2. Diffs are generated
3. User reviews change proposals
4. User approves or rejects each change
5. Only approved changes are applied to the codebase

This ensures total control and prevents unintended modifications.

---

## 🤖 Telegram Integration

Control SaarthiClaw remotely through Telegram:

* Secure owner verification
* Perform AI-assisted coding tasks from anywhere
* Access project information and trigger CLI commands

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

Create a `.env` file in the project root with the following keys:

```env
OPENROUTER_API_KEY=your_api_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_OWNER_ID=your_telegram_user_id
```

Never commit `.env` files containing sensitive keys.

---

# ▶️ Usage

Run SaarthiClaw CLI to wake up the assistant:

```bash
saarthiclaw-build wakeup
```

### Available Modes:

* **Ask Mode:** Interactively ask questions about your codebase.
* **Plan Mode:** Generate detailed implementation plans.
* **Agent Mode:** Execute approved modifications safely.
* **Telegram Mode:** Use the assistant remotely via Telegram commands.

---

# ⚙️ CLI Modes Explained

- **Ask Mode:** Query your project for explanations, summaries, and insights.
- **Plan Mode:** Define goals and receive detailed stepwise plans.
- **Agent Mode:** Let the AI perform coding tasks, subject to user approval.
- **Telegram Mode:** Interact with SaarthiClaw remotely for flexibility.

---

# 🤖 Telegram Mode

SaarthiClaw’s Telegram integration lets you control the assistant remotely with security features like owner verification. You can ask questions, run plans, and approve changes all from your Telegram client, making it ideal for remote or on-the-go usage.

---

# 📂 Project Structure

```text
ai/
│
├── providers/       # AI providers and configurations
├── models/          # AI model configurations
└── configuration/   # Core app config files

modes/
│
├── ask/             # Implementation of Ask Mode
├── plan/            # Implementation of Plan Mode
├── agent/           # Implementation of Agent Mode
└── telegram/        # Telegram bot integration

tui/                # Terminal UI components

index.ts            # Entry point
package.json        # Project metadata and dependencies
tsconfig.json       # TypeScript configuration
```

---

# 🔄 Typical Workflow

1. **Generate a Plan:** Define a goal and get a structured implementation plan.
2. **Execute with Agent Mode:** Use AI to apply changes in steps.
3. **Review Changes:** Inspect diffs and approve or reject each change.
4. **Apply Changes:** Approved modifications are committed to the codebase.

---

# 🛡️ Security and Safety Philosophy

SaarthiClaw adheres to a human-in-the-loop model, ensuring the developer retains full control and oversight over AI-driven modifications. This mitigates risks and safeguards your codebase.

---

# 🗺️ Future Roadmap

- WhatsApp Integration
- Web Search Tools
- Voice Interaction Mode
- Docker Support
- GitHub Actions Integration
- Multi-Agent Collaboration
- Persistent Memory
- Advanced AI Planning Engine

---

# 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

# 📄 License

MIT License

---

Built with ❤️ using TypeScript, Bun, and AI.