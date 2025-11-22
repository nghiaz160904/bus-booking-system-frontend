# Frontend Developer Guide: Code Quality Tools

This project is now equipped with **ESLint**, **Prettier**, and **Husky** to ensure our code remains clean, consistent, and bug-free.

## 🚀 Quick Start for Team Members

If you have just pulled the latest code, please follow these steps to sync your environment:

1.  **Install New Dependencies:**
    Run this command to install the new linting tools and activate the Git hooks.

    ```bash
    npm install
    ```

    _Note: This automatically triggers the `prepare` script which sets up Husky on your machine._

2.  **Install VS Code Extensions:**
    For the best experience (auto-fixing errors), please install these two extensions in VS Code:
    - **ESLint** (Microsoft)
    - **Prettier - Code formatter** (Prettier)

    _The project includes a `.vscode` folder that automatically configures your editor to format files when you save._

---

## 🛠 What are these tools?

### 1. ESLint (The "Code Inspector")

- **What it does:** Scans our code for logical errors, bugs, and unused variables.
- **Key Rules:** We are using standard React Hooks rules + TanStack Query rules (to catch caching bugs).
- **Command:** `npm run lint`

### 2. Prettier (The "Interior Designer")

- **What it does:** Automatically formats code (indentation, spacing, quotes) so everyone's code looks identical.
- **Integration:** It runs automatically when you save a file (if you installed the VS Code extension).
- **Command:** `npm run format`

### 3. Husky & Lint-Staged (The "Security Guard")

- **What it does:** This is a **Git Hook**. It intercepts your `git commit` command.
- **Workflow:**
  1.  You run `git commit`.
  2.  Husky runs ESLint and Prettier _only on the files you changed_.
  3.  **If there are errors:** The commit is BLOCKED. You must fix the errors first.
  4.  **If it passes:** The commit succeeds.

---

## 💻 Available Scripts

We have added new scripts to `package.json`:

| Command            | Description                                                              |
| :----------------- | :----------------------------------------------------------------------- |
| `npm run lint`     | Scans the project for errors/warnings.                                   |
| `npm run lint:fix` | **Use this first!** It attempts to automatically fix all linting errors. |
| `npm run format`   | Formats all files using Prettier.                                        |

---

## ❓ Troubleshooting

### "Git won't let me commit!"

If you see an error message like `✖ eslint --fix found some errors`, it means your code violates a rule.
**Solution:**

1.  Read the error message in the terminal.
2.  Run `npm run lint:fix` to auto-fix what can be fixed.
3.  Manually fix any remaining logical errors (e.g., unused variables).
4.  Add the changes (`git add .`) and commit again.

### "VS Code isn't formatting on save"

1.  Ensure you have the **Prettier** extension installed.
2.  Ensure your VS Code isn't set to "Auto Save: afterDelay". It works best with "Auto Save: onFocusChange" or "off".
3.  Check the bottom right of VS Code. If you see a "Prettier" icon with a red `x`, click it to see the error log.
