// script.js
// Testing handleClassChoice by using default stats directly

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // (Same as before)
    const classSelectionOverlay = document.getElementById('class-selection-overlay');
    const classOptionsGrid = document.getElementById('class-options-grid');
    const mainGameContainer = document.getElementById('main-game-container');
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
    const playerClassDisplay = document.getElementById('player-class');
    const userStatsVerified = document.getElementById('verified-quests-count');
    const messageArea = document.getElementById('message-area');
    const levelUpAlert = document.getElementById('level-up-alert');


    // --- Constants ---
    // (Same as before)
    const QUEST_COOLDOWN_DURATION = 24 * 60 * 60 * 1000;
    const REFLECTION_DELAY = 12 * 60 * 60 * 1000;
    const TEXT_PROOF_MIN_LENGTH = 150;
    const EMOTIONAL_KEYWORDS = ["afraid", "grateful", "angry", "free", "release", "breakthrough", "realization", "clarity", "fear", "joy", "peace", "connected", "struggle", "overcome", "insight", "let go", "understand", "integrate", "process"];
    const REFLECTION_XP_BONUS = 50;
    const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500];


    // --- Class Data ---
    // (Same as before)
    const CLASSES_DATA = [
         { name: "Oracle", concept: "Seeker of hidden truths...", boon: "Minor passive increase..." },
         { name: "Chronicler", concept: "Keeper of records...", boon: "Small XP bonus..." },
         { name: "Geomancer", concept: "Weaver of intention...", boon: "Starts with intro quest..." },
         { name: "Void Walker", concept: "Embracer of the shadow...", boon: "Slight reduction in failure impact..." },
         { name: "Empath", concept: "Conduit for connection...", boon: "Increased Witness effectiveness..." },
         { name: "Wanderer", concept: "Follower of intuition...", boon: "Occasional 'System Glitches'..." }
    ];


    // --- Game Data (Quests) ---
    // (Same as before)
    const ALL_QUESTS = [
        { id: "geomancer_start01", title: "Attune to the Leylines", description: "Find a place outdoors...", objective: "Describe the location...", proofType: "image", keywords: ["geomancy",...], xpReward: 50, startingClass: "Geomancer" },
        { id: "meditate01", title: "Still the Mind's Echo", description: "Find a quiet space...", objective: "Achieve 15 minutes...", proofType: "text", keywords: ["peace",...], xpReward: 75 },
        { id: "sigil01", title: "Manifest Intent", description: "Design and draw...", objective: "Create and photograph...", proofType: "image", keywords: ["intention",...], xpReward: 100 },
        { id: "fear01", title: "Confront the Shadow", description: "Identify one small fear...", objective: "Describe the fear...", proofType: "text", keywords: ["fear",...], xpReward: 120 },
        { id: "gratitude01", title: "Acknowledge Abundance", description: "Record three specific things...", objective: "Write a short gratitude entry.", proofType: "text", keywords: ["grateful",...], xpReward: 60 },
        { id: "nature01", title: "Connect to Gaia", description: "Spend 20 minutes outdoors...", objective: "Describe your sensory experience...", proofType: "text", keywords: ["nature",...], xpReward: 85 },
    ];


    // --- State Variables ---
    // (Same as before)
    let currentQuest = null;
    let activeQuestStartTime = null;
    let witnessRequested = false;
    let witnessVerified = false;
    let cooldownInterval = null;


    // --- Local Storage Functions (Global Scope) ---
    // (Same as before)
    window.getLocalStorage = (key, defaultValue) => { /* ... */ };
    window.setLocalStorage = (key, value) => { /* ... */ };


    // --- Initialization ---
    // (Same as before)
    const initializeGame = () => { /* ... */ };
    const initializeMainGame = () => { /* ... */ };


    // --- Class Selection Logic ---
    // (Same as before)
    const displayClassSelection = () => { /* ... */ };

    // --- MODIFIED: handleClassChoice - TEMPORARY TEST ---
    const handleClassChoice = (event) => {
        if (!event.target.classList.contains('choose-class-btn')) { return; }
        const chosenClassName = event.target.dataset.className;
        if (!chosenClassName) return;

        console.log(`[script.js] Class chosen: ${chosenClassName}`);

        // --- TEMPORARY TEST: Use default object instead of loading ---
        console.log("[script.js] DEBUG: Bypassing loadUserStats, creating default stats object for test.");
        const stats = { level: 1, xp: 0, verifiedQuests: 0, chosenClass: null }; // Create fresh default object
        // const stats = loadUserStats(); // Original line commented out for test
        // --- END TEMPORARY TEST ---

        console.log("[script.js] DEBUG: Value of stats before assignment:", stats); // Log the default object

        // Check if stats is unexpectedly undefined or null (shouldn't be now)
        if (!stats) {
             console.error("[script.js] ERROR: Stats object is still null/undefined even when created directly!");
             showMessage("Critical Error: Failed to process data. Cannot save class choice.", "error");
             return;
        }

        // Update the class property on the stats object
        console.log(`[script.js] DEBUG: Attempting assignment: stats.chosenClass = ${chosenClassName}`);
        try {
            stats.chosenClass = chosenClassName; // The line that previously failed
            console.log("[script.js] DEBUG: Assignment successful.");
        } catch (e) {
            console.error("[script.js] ERROR during assignment 'stats.chosenClass':", e);
            showMessage("Critical Error: Failed to assign class data.", "error");
            return; // Stop if assignment fails
        }


        // Save the entire updated stats object back to localStorage
        console.log("[script.js] DEBUG: Saving updated stats object:", stats);
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

    const applyStartingBoon = (className) => { /* ... (same placeholder as before) ... */ };


    // --- Event Listeners Setup ---
    const setupEventListeners = () => { /* ... (same as before) ... */ };

    // --- Quest Management ---
    const loadNextQuest = () => { /* ... (same as before) ... */ };
    const displayQuest = (quest) => { /* ... (same as before - reverted version) ... */ };
    const displayCooldownMessage = (cooldownEndTime) => { /* ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... (same as previous debug version) ... */ };
    const handleCancelQuest = () => { /* ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };

    // --- Proof Submission & Verification ---
    const showProofSubmission = (proofType) => { /* ... */ };
    const hideProofSubmission = () => { /* ... */ };
    const handleProofSubmit = (event) => { /* ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified
    const handleQuestVerified = (quest, successMessage) => { /* ... (same as previous version with DEBUG logs for skill drop) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
    const handleQuestFailed = (failMessage, reason) => { /* ... */ console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); };

    // --- Witness Verification ---
    const handleRequestWitness = () => { /* ... */ console.log(`[script.js] Requesting peer confirmation...`); };

    // --- Reflection System ---
    const checkForDueReflections = () => { /* ... */ };
    const showReflectionModal = (questId, questTitle) => { /* ... */ };
    window.closeReflectionModal = () => { /* ... */ };
    const handleReflectionSubmit = (event) => { /* ... */ console.log(`[script.js] Submitting analysis...`); };

    // --- User Stats & Leveling ---
    const loadUserStats = () => { /* ... (same as before) ... */ };
    const updateUserStatsDisplay = (stats) => { /* ... */ console.log(`[script.js] Stats Updated: ... Class=${stats.chosenClass} ...`); };
    const gainXP = (amount, isBonus = false) => { /* ... */ };
    const triggerLevelUpVisual = () => { /* ... */ };

    // --- UI Utilities ---
    window.showMessage = (message, type = 'info', container = messageArea) => { /* ... */ };
    const clearMessage = (container = messageArea) => { /* ... */ };
    const hideCooldownMessage = () => { /* ... */ };
    const hideNoQuestsMessage = () => { /* ... */ };

    // --- Start the Application ---
    initializeGame(); // Start the game initialization process

    // Periodically check for reflections
    setInterval(checkForDueReflections, 60 * 1000);

}); // End DOMContentLoaded
