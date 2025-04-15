// script.js
// Added console.log to check the value of 'stats' in handleClassChoice

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Class Selection Elements
    const classSelectionOverlay = document.getElementById('class-selection-overlay');
    const classOptionsGrid = document.getElementById('class-options-grid');
    const mainGameContainer = document.getElementById('main-game-container');

    // Main Game Elements (Ensure all IDs match your HTML)
    const questViewer = document.getElementById('quest-viewer');
    const questContent = document.getElementById('quest-content');
    const questTitle = document.getElementById('quest-title');
    const questDescription = document.getElementById('quest-description');
    const questObjective = document.getElementById('quest-objective');
    const questProofType = document.getElementById('quest-proof-type');
    const questRewardDisplay = document.getElementById('quest-reward');
    const beginQuestBtn = document.getElementById('begin-quest-btn');
    const cooldownMessage = document.getElementById('cooldown-message');
    const cooldownTimerDisplay = document.getElementById('cooldown-timer');
    const noQuestsMessage = document.getElementById('no-quests-message');
    const proofSubmission = document.getElementById('proof-submission');
    const proofForm = document.getElementById('proof-form');
    const currentQuestIdInput = document.getElementById('current-quest-id');
    const textProofGroup = document.getElementById('text-proof-group');
    const textProofInput = document.getElementById('text-proof');
    const imageProofGroup = document.getElementById('image-proof-group');
    const imageProofInput = document.getElementById('image-proof');
    const avProofGroup = document.getElementById('audio-video-proof-group');
    const avProofInput = document.getElementById('av-proof');
    const submitProofBtn = document.getElementById('submit-proof-btn');
    const cancelQuestBtn = document.getElementById('cancel-quest-btn');
    const witnessVerificationSection = document.getElementById('witness-verification');
    const witnessCodeInput = document.getElementById('witness-code');
    const requestWitnessBtn = document.getElementById('request-witness-btn');
    const witnessStatus = document.getElementById('witness-status');
    const reflectionModal = document.getElementById('reflection-modal');
    const reflectionForm = document.getElementById('reflection-form');
    const reflectionQuestTitle = document.getElementById('reflection-quest-title');
    const reflectionQuestIdInput = document.getElementById('reflection-quest-id');
    const reflectionTextInput = document.getElementById('reflection-text');
    const playerLevelDisplay = document.getElementById('player-level');
    const playerXpDisplay = document.getElementById('player-xp');
    const xpToNextLevelDisplay = document.getElementById('xp-to-next-level');
    const xpBar = document.getElementById('xp-bar');
    const playerClassDisplay = document.getElementById('player-class'); // Added
    const userStatsVerified = document.getElementById('verified-quests-count');
    const messageArea = document.getElementById('message-area');
    const levelUpAlert = document.getElementById('level-up-alert');

    // --- Constants ---
    const QUEST_COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const REFLECTION_DELAY = 12 * 60 * 60 * 1000; // 12 hours
    const TEXT_PROOF_MIN_LENGTH = 150; // Min characters for text proof
    const EMOTIONAL_KEYWORDS = ["afraid", "grateful", "angry", "free", "release", "breakthrough", "realization", "clarity", "fear", "joy", "peace", "connected", "struggle", "overcome", "insight", "let go", "understand", "integrate", "process"];
    const REFLECTION_XP_BONUS = 50; // XP for completing reflection
    // XP thresholds: Total XP needed to reach level (index + 1)
    const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500];

    // --- Class Data (for display and selection logic) ---
    const CLASSES_DATA = [
         { name: "Oracle", concept: "Seeker of hidden truths, attuned to subtle energies...", boon: "Minor passive increase in detecting keywords or chance of 'System Whispers'." },
         { name: "Chronicler", concept: "Keeper of records, believer in the power of the written word...", boon: "Small XP bonus for reflections or reduced cooldown on analyzed failures." },
         { name: "Geomancer", concept: "Weaver of intention and energy, using symbols and connection...", boon: "Starts with intro sigil quest or passively generates 'Resonant Fragments'." },
         { name: "Void Walker", concept: "Embracer of the shadow, understanding growth through darkness...", boon: "Slight reduction in failure impact or higher chance of post-failure events." },
         { name: "Empath", concept: "Conduit for connection, drawing strength from shared experience...", boon: "Increased Witness effectiveness or higher chance of 'Nexus Echoes'." },
         { name: "Wanderer", concept: "Follower of intuition and the untrodden path...", boon: "Occasional 'System Glitches'/hints or higher chance of 'Critical Success'." }
    ];

    // --- Game Data (Quests) ---
    const ALL_QUESTS = [
        // Add a specific starting quest for Geomancer (example)
        { id: "geomancer_start01", title: "Attune to the Leylines", description: "Find a place outdoors that feels energetically significant. Draw a simple circle on the ground or paper representing your connection point.", objective: "Describe the location and feeling, upload image of circle.", proofType: "image", keywords: ["geomancy", "leyline", "connect", "earth", "energy", "draw", "circle"], xpReward: 50, startingClass: "Geomancer" }, // Added startingClass property
        // Standard Quests
        { id: "meditate01", title: "Still the Mind's Echo", description: "Find a quiet space. Focus solely on your breath for 15 uninterrupted minutes.", objective: "Achieve 15 minutes of focused meditation.", proofType: "text", keywords: ["peace", "calm", "focus", "breath", "quiet", "present", "mindful"], xpReward: 75 },
        { id: "sigil01", title: "Manifest Intent", description: "Design and draw a personal sigil representing a core intention for growth.", objective: "Create and photograph your sigil.", proofType: "image", keywords: ["intention", "desire", "symbol", "create", "focus", "manifest"], xpReward: 100 },
        { id: "fear01", title: "Confront the Shadow", description: "Identify one small fear. Take one concrete step today to face it.", objective: "Describe the fear and the action taken.", proofType: "text", keywords: ["fear", "afraid", "confront", "step", "action", "overcome", "challenge", "release", "brave"], xpReward: 120 },
        { id: "gratitude01", title: "Acknowledge Abundance", description: "Record three specific things you are genuinely grateful for today, explaining *why*.", objective: "Write a short gratitude journal entry.", proofType: "text", keywords: ["grateful", "thankful", "appreciate", "blessing", "joy", "abundance", "positive"], xpReward: 60 },
        { id: "nature01", title: "Connect to Gaia", description: "Spend 20 minutes outdoors, consciously observing the natural world.", objective: "Describe your sensory experience and any insights.", proofType: "text", keywords: ["nature", "observe", "connect", "earth", "listen", "feel", "grounded", "peace"], xpReward: 85 },
    ];

    // --- State Variables ---
    let currentQuest = null;
    let activeQuestStartTime = null;
    let witnessRequested = false;
    let witnessVerified = false;
    let cooldownInterval = null;

    // --- Local Storage Functions (Global Scope) ---
    window.getLocalStorage = (key, defaultValue) => {
        const data = localStorage.getItem(key);
        try { return data ? JSON.parse(data) : defaultValue; }
        catch (e) { console.error(`[script.js] Error parsing localStorage key "${key}":`, e); return defaultValue; }
    };
    window.setLocalStorage = (key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); }
        catch (e) { console.error(`[script.js] Error setting localStorage key "${key}":`, e); }
    };

    // --- Initialization ---
    const initializeGame = () => {
        console.log("[script.js] Initializing System Interface...");
        const chosenClassSaved = getLocalStorage('chosenClass', null);
        if (!chosenClassSaved) { console.log("[script.js] No class chosen. Displaying class selection."); displayClassSelection(); if(mainGameContainer) mainGameContainer.style.display = 'none'; }
        else { console.log(`[script.js] Class '${chosenClassSaved}' found. Starting main game.`); if(classSelectionOverlay) classSelectionOverlay.style.display = 'none'; if(mainGameContainer) mainGameContainer.style.display = 'block'; initializeMainGame(); }
    };

    const initializeMainGame = () => {
        const initialStats = loadUserStats(); updateUserStatsDisplay(initialStats); checkForDueReflections(); loadNextQuest(); setupEventListeners(); console.log("[script.js] System Online.");
    };

    // --- Class Selection Logic ---
    const displayClassSelection = () => {
        if (!classSelectionOverlay || !classOptionsGrid) { console.error("Class selection elements not found!"); return; }
        classOptionsGrid.innerHTML = '';
        CLASSES_DATA.forEach(cls => { const card = document.createElement('div'); card.className = 'class-card'; card.innerHTML = `<h3>${cls.name}</h3><p><strong>Core Concept:</strong> ${cls.concept}</p><p><strong>Starting Boon:</strong> ${cls.boon}</p><button class="choose-class-btn" data-class-name="${cls.name}">Choose ${cls.name}</button>`; classOptionsGrid.appendChild(card); });
        classOptionsGrid.addEventListener('click', handleClassChoice);
        classSelectionOverlay.style.display = 'flex';
    };

    // --- MODIFIED: handleClassChoice with Debugging ---
    const handleClassChoice = (event) => {
        if (!event.target.classList.contains('choose-class-btn')) { return; }
        const chosenClassName = event.target.dataset.className;
        if (!chosenClassName) return;

        console.log(`[script.js] Class chosen: ${chosenClassName}`);

        // Load stats first
        const stats = loadUserStats();

        // --- ADDED DEBUG LOG ---
        console.log("[script.js] DEBUG: Value of stats before assignment:", stats);
        // Check if stats is unexpectedly undefined or null
        if (!stats) {
             console.error("[script.js] ERROR: loadUserStats() returned undefined or null! Cannot set chosenClass.");
             // Optionally display an error message to the user
             showMessage("Critical Error: Failed to load user data. Cannot save class choice.", "error");
             return; // Stop execution if stats object is invalid
        }
        // --- END ADDED DEBUG LOG ---

        // Update the class property on the stats object
        stats.chosenClass = chosenClassName;
        // Save the entire updated stats object back to localStorage
        setLocalStorage('userStats', stats);

        // Also save directly to chosenClass key for initial load check consistency
        setLocalStorage('chosenClass', chosenClassName);

        // Apply starting boon placeholder
        applyStartingBoon(chosenClassName);

        // Hide class selection and show main game
        if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
        if(mainGameContainer) mainGameContainer.style.display = 'block';

        // Initialize the main game systems now
        initializeMainGame(); // This will now load stats including the class

        showMessage(`Path chosen: ${chosenClassName}. Your evolution begins.`, 'success');
    };

    const applyStartingBoon = (className) => {
        console.log(`[script.js] Applying starting boon for class: ${className}`);
        if (className === 'Geomancer') { console.log("[script.js] Geomancer chosen - Boon logic would try to set specific starting quest here."); showMessage("Geomancer Boon: Attune to the Leylines quest should be prioritized (Implementation Pending).", "info"); }
        // Add similar 'if' blocks for other classes.
    };

    // --- Event Listeners Setup ---
    const setupEventListeners = () => { /* ... (same as before) ... */ };

    // --- Quest Management ---
    const loadNextQuest = () => { /* ... (same as before) ... */ };
    const displayQuest = (quest) => { /* ... (same as before - reverted version) ... */ };
    const displayCooldownMessage = (cooldownEndTime) => { /* ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... (same as previous debug version) ... */ };
    const handleCancelQuest = () => { /* ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };

    // --- Proof Submission & Verification --- (Functions remain the same)
    const showProofSubmission = (proofType) => { /* ... */ };
    const hideProofSubmission = () => { /* ... */ };
    const handleProofSubmit = (event) => { /* ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified
    const handleQuestVerified = (quest, successMessage) => { /* ... (same as previous version with DEBUG logs for skill drop) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
    const handleQuestFailed = (failMessage, reason) => { /* ... */ console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); };

    // --- Witness Verification --- (Function remains the same)
    const handleRequestWitness = () => { /* ... */ console.log(`[script.js] Requesting peer confirmation...`); };

    // --- Reflection System --- (Functions remain the same)
    const checkForDueReflections = () => { /* ... */ };
    const showReflectionModal = (questId, questTitle) => { /* ... */ };
    window.closeReflectionModal = () => { /* ... */ };
    const handleReflectionSubmit = (event) => { /* ... */ console.log(`[script.js] Submitting analysis...`); };

    // --- User Stats & Leveling --- (Functions remain the same)
    const loadUserStats = () => { /* ... */ };
    const updateUserStatsDisplay = (stats) => { /* ... */ console.log(`[script.js] Stats Updated: ... Class=${stats.chosenClass} ...`); };
    const gainXP = (amount, isBonus = false) => { /* ... */ };
    const triggerLevelUpVisual = () => { /* ... */ };

    // --- UI Utilities --- (Functions remain the same)
    window.showMessage = (message, type = 'info', container = messageArea) => { /* ... */ };
    const clearMessage = (container = messageArea) => { /* ... */ };
    const hideCooldownMessage = () => { /* ... */ };
    const hideNoQuestsMessage = () => { /* ... */ };

    // --- Start the Application ---
    initializeGame(); // Start the game initialization process

    // Periodically check for reflections
    setInterval(checkForDueReflections, 60 * 1000);

}); // End DOMContentLoaded
