# System // User Interface (Quest Terminal)

## Overview

System // User Interface is a browser-based quest verification system inspired by spiritual evolution games and **Solo Leveling** themes. It simulates a terminal interface where players (Users) receive directives (quests) related to mystical awakening and personal growth, complete them in real life, and submit verification data. The system tracks **Level** and **XP**, emphasizes reflection, and incorporates cooldowns, delayed follow-ups, and a **random skill drop** mechanic upon quest completion.

The project runs entirely client-side using HTML, CSS, and vanilla JavaScript, storing all User progress locally within the browser's `localStorage`.

## Theme

The application adopts a "tech-mystic" or "cyberpunk shrine" aesthetic, featuring:
* A dark color palette (black, cyan, orange-red)
* Gradient accents and subtle glow effects
* A monospaced, terminal-like font (`Share Tech Mono`)
* UI elements styled to resemble a system interface or sacred OS

## Features

* **Quest Viewer:** Displays the currently available directive, including its title, description, objective, required proof type, and **XP reward**.
* **Quest Lifecycle:** Users accept directives, revealing the verification data submission interface.
* **Proof Submission:** Supports submitting different types of proof (currently implemented):
    * **Text:** For log entries, reflections, or reports.
    * **Image:** Includes a file input (selection is checked, content analysis is simulated).
    * **Audio/Video (Simulated):** Uses a text input for describing simulated A/V confirmation.
* **Simulated Verification:** Analyzes text submissions based on minimum length and keyword presence. Simulates verification for other proof types.
* **Leveling System:**
    * **Level:** Tracks the User's current level.
    * **Experience Points (XP):** Awarded upon successful directive verification and reflection completion.
    * **XP Bar:** Visually displays progress towards the next level based on defined thresholds.
    * **Level Up:** Automatic level increase when XP threshold is met, accompanied by a visual alert.
* **Skill Drop System:**
    * **RNG Skill Grant:** After successful directive verification, the User has a chance to receive a random, unique spiritual skill from a predefined list.
    * **Skill Modal:** A pop-up displays the details (Name, Type, Rarity, Description, Effect, Date Received) of a newly acquired skill with animation.
    * **Skill Vault:** A dedicated section displays all skills the User has unlocked so far.
    * **Rarity System:** Skills are categorized by rarity (Common, Rare, Epic, Mythic, Legendary), indicated visually in the UI.
* **Cooldown System:** Prevents spamming by enforcing a 24-hour cooldown period after a directive is successfully verified before it becomes available again.
* **Delayed Reflection:** Prompts the User with a "System Inquiry" via a modal popup 12 hours after a directive is verified, requiring text input (and granting bonus XP) to fully integrate the directive's outcome.
* **Witness Verification (Mocked):** Optional feature to enter a "Peer Identifier," simulating a request for confirmation.
* **Local Storage Persistence:** All quest progress, completion times, cooldowns, reflection status, user stats (Level, XP, Verified Quests), and **unlocked skills** are saved in the browser's `localStorage`.
* **System-Style UI:** Notifications and text elements are styled to resemble system alerts and logs.
* **Responsive Design:** Basic responsiveness for usability on different screen sizes.

## Technology Stack

* **HTML:** Structures the application content.
* **CSS:** Styles the application, implements the theme, animations, and layout. Uses CSS variables for easy theming.
* **JavaScript (Vanilla):** Handles all application logic, including:
    * Quest loading and management
    * DOM manipulation and UI updates
    * Event handling
    * Proof verification simulation
    * Cooldown and reflection timing
    * **XP and Level calculations**
    * **Skill drop RNG and display logic**
    * Interaction with `localStorage`
* **Google Fonts:** Uses the 'Share Tech Mono' font.

## Setup & Usage

1.  **Download:** Clone this repository or download the project files (`index.html`, `style.css`, `script.js`, `skill-drop.js`).
2.  **Place Files:** Ensure all four files are in the **same directory**.
3.  **Open:** Open the `index.html` file in a modern web browser (like Chrome, Firefox, Edge, Safari).

The application will initialize, load any saved progress from `localStorage`, display stats and unlocked skills, and show the first available directive or a cooldown message.

## How It Works

* **Quest/Directive Data:** Predefined arrays of quest objects (in `script.js`) and skill objects (in `skill-drop.js`) store their respective details, including XP rewards and skill rarities.
* **State Management:** The application manages its state (current quest, cooldowns, completed quests, stats, unlocked skills) using JavaScript variables and persists this state to `localStorage`.
* **Leveling:** The `gainXP` function in `script.js` adds XP and compares the total against predefined `XP_THRESHOLDS` to determine level ups.
* **Skill Drops:** The `grantRandomSkill` function in `skill-drop.js` (called automatically after quest verification in `script.js`) filters the master skill list against skills already saved in `localStorage` (`unlockedSkills` key), randomly selects an available skill, saves its name and acquisition date, and triggers the UI updates (modal and vault).
* **Modularity:** Core quest logic is in `script.js`, while skill-specific logic is separated into `skill-drop.js`. They communicate via globally accessible functions (`window.grantRandomSkill`, potentially `window.showMessage`, `window.get/setLocalStorage`).

## Project Files

* `index.html`: The main HTML structure.
* `style.css`: Contains all the CSS rules.
* `script.js`: Holds the main quest, XP, and leveling logic.
* `skill-drop.js`: Contains the skill data, RNG drop logic, and skill UI management.

## Future Ideas

* Implement weighted RNG for skill drops based on rarity.
* Add functional effects for skills (e.g., modifying XP gain, cooldowns, quest availability).
* Integrate actual image analysis or audio/video processing (requires server-side or complex libraries).
* Connect to a backend database for true persistence.
* Expand the quest and skill libraries.

## License

Consider adding a license file (e.g., MIT License) to define how others can use your code.
