Perfect. Since your AI IDE will be handling the code generation based on this file, I have refined the `implementation-plan.md` to be extremely descriptive. It includes the logic, security protocols, and specific component requirements to ensure the IDE builds exactly what you need.

---

# implementation-plan.md

## 1. Project Overview

A privacy-focused, corporate task management application built with Preact, Tailwind CSS, and DaisyUI.

* **Goal:** Track daily tasks and durations with zero-knowledge encryption.
* **Structure:** 300vh vertical scroll (Clock -> Workspace -> History).
* **Security:** "Kill Switch" that locks the app on DevTools detection or window resize.

## 2. Technical Stack

* **Framework:** Preact + Vite
* **Styling:** Tailwind CSS + DaisyUI
* **State Management:** Zustand with `persist` middleware.
* **Security:** Web Crypto API (AES-GCM) for state encryption.

## 3. Data Schema

```typescript
interface SubTask {
  id: string; // crypto.randomUUID()
  title: string;
}

interface Duration {
  hours: number;
  minutes: number;
}

interface Task {
  id: string;
  title: string;
  startTime: number | null; // Timestamp
  endTime: number | null;   // Timestamp
  duration: Duration | null; // NULL = Active, OBJECT = Completed
  subTasks: SubTask[];
  date: string; // YYYY-MM-DD
}

```

## 4. Layout Architecture (300vh)

### Section 1: Digital Clock (0-100vh)

* Existing digital clock component.

### Section 2: Workspace (100-200vh)

* **Task Input:** Sticky header with text input and "Start Work" button.
* **Active Tasks:** List of tasks where `duration === null` and `date === today`.
* Features: Start time display, Subtask Accordion (DaisyUI Collapse), Delete button, Complete button.


* **Completed Today:** List of tasks where `duration !== null` and `date === today`.
* Features: Duration display (e.g., 1h 20m), Edit button (opens modal), Delete button.



### Section 3: History (200-300vh)

* **Grouping:** All tasks where `date !== today`, grouped by date.
* **Header Format:** `12 Jan, Monday`.
* **Functionality:** Read-only view. Clicking "Edit" opens a Modal to modify Title, Subtasks, or Duration.

## 5. Security & Encryption Logic

### Custom Storage Engine

* **Encryption:** AES-GCM using a user-provided password.
* **Persistence:** Encrypted state is stored in `localStorage` under the key `v2-vault-storage`.
* **Session:** The decryption key exists only in memory/session.

### The "Kill Switch"

* **Window Resize:** Listener on `window.onresize` triggers `lockVault()`.
* **DevTools Detection:** A non-blocking `debugger` or performance-loop to detect debugger pauses.
* **Action:** Clear session storage, set `isLocked: true`, and show the Lock Screen.
* **UI:** The Password Input must have a CSS shake animation (e.g., `@keyframes shake`) on incorrect attempts.

## 6. Component Guidelines

* **Filenames:** All UI components in `src/components/ui/` must be lowercase (e.g., `button.tsx`, `modal.tsx`).
* **Duration Input:** A specialized component in the Modal containing two numeric inputs (Hours, Minutes).

## 7. Export Feature

**Modal with two templates:**

1. **Excel Table:** Renders an HTML `<table>`.
* Columns: [Task Name, Date, Start Time, End Time, Duration].
* Logic: Subtasks must be rendered as **new rows** directly below the parent task.


2. **Unordered List:** Renders a nested `<ul>` and `<li>` structure for easy copying into text editors/Slack.

## 8. Development Phases for AI IDE

1. **Phase 1:** Setup `lib/utils.ts` (cn utility) and `lib/crypto.ts` (AES-GCM logic).
2. **Phase 2:** Implement `useTaskStore.ts` with the custom encryption storage engine.
3. **Phase 3:** Create the 300vh layout wrapper and the Lock Screen (with shake animation).
4. **Phase 4:** Build the Workspace section with "Active" vs "Completed" filtering.
5. **Phase 5:** Implement History grouping and the Duration Edit Modal.
6. **Phase 6:** Build the Export Modal with Table and List templates.
7. **Phase 7:** Global Auto-Correction: Add an `useEffect` on app unlock to find any historical tasks without duration and default them to `1h 0m`.

---

**Next Step:** You can now provide this file to your AI IDE to begin generating the code for **Phase 1 and 2**. Would you like me to help you draft the prompt for the IDE to start the coding process?