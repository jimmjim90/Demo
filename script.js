// script.js
// Restored console.logs and safety checks inside displayQuest

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
    // (Same as before)
    const QUEST_COOLDOWN_DURATION = 24 * 60 * 60 * 1000;
    const REFLECTION_DELAY = 12 * 60 * 60 * 1000;
    const TEXT_PROOF_MIN_LENGTH = 150;
    const EMOTIONAL_KEYWORDS = ["afraid", "grateful", "angry", "free", "release", "breakthrough", "realization", "clarity", "fear", "joy", "peace", "connected", "struggle", "overcome", "insight", "let go", "understand", "integrate", "process"];
    const REFLECTION_XP_BONUS = 50;
    const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500];

    // --- Class Data ---
    // (Same as before)
    const CLASSES_DATA = [ /* ... */ ];

    // --- Game Data (Quests) ---
    // (Same as before)
    const ALL_QUESTS = [ /* ... */ ];

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
    // (Same as before, includes fix for saving class)
    const displayClassSelection = () => { /* ... */ };
    const handleClassChoice = (event) => { /* ... */ };
    const applyStartingBoon = (className) => { /* ... */ };

    // --- Event Listeners Setup ---
    // (Same as before)
    const setupEventListeners = () => { /* ... */ };

    // --- Quest Management ---
    // (Same as before)
    const loadNextQuest = () => { /* ... */ };

    // --- RESTORED: displayQuest with Debugging ---
    const displayQuest = (quest) => {
        // Safety check quest data
        if (!quest || typeof quest !== 'object') {
            console.error("[script.js] displayQuest called with invalid quest data:", quest);
            // Display error state? Hide quest viewer?
             if(questContent) questContent.style.display = 'none';
             if(noQuestsMessage) { noQuestsMessage.style.display = 'block'; noQuestsMessage.textContent = "Error loading quest data."; }
            return;
        }
        console.log(`[script.js] DEBUG: Attempting to display quest:`, JSON.stringify(quest)); // Log quest data

        // Log the element references to see if they are found
        console.log("[script.js] DEBUG: Checking element references:");
        console.log("  questTitle:", questTitle);
        console.log("  questDescription:", questDescription);
        console.log("  questObjective:", questObjective);
        console.log("  questProofType:", questProofType);
        console.log("  questRewardDisplay:", questRewardDisplay);
        console.log("  currentQuestIdInput:", currentQuestIdInput);
        console.log("  beginQuestBtn:", beginQuestBtn);

        // Update elements with safety checks
        if (questTitle) { questTitle.textContent = quest.title || "Error: Title Missing"; } else { console.error("Element #quest-title not found!"); }
        if (questDescription) { questDescription.textContent = quest.description || "Error: Description Missing"; } else { console.error("Element #quest-description not found!"); }
        if (questObjective) { questObjective.textContent = quest.objective || "Error: Objective Missing"; } else { console.error("Element #quest-objective span not found!"); }
        if (questProofType) { questProofType.textContent = quest.proofType ? (quest.proofType.charAt(0).toUpperCase() + quest.proofType.slice(1)) : "Error: Type Missing"; } else { console.error("Element #quest-proof-type span not found!"); }
        if (questRewardDisplay) { questRewardDisplay.textContent = quest.xpReward !== undefined ? quest.xpReward : "---"; } else { console.error("Element #quest-reward span not found!"); }
        if (currentQuestIdInput) { currentQuestIdInput.value = quest.id || ""; } else { console.error("Element #current-quest-id not found!"); }

        // Show/hide UI parts
        if (questContent) questContent.style.display = 'block'; else { console.error("Element #quest-content not found!"); }
        if (beginQuestBtn) { beginQuestBtn.disabled = false; beginQuestBtn.textContent = 'Accept Directive'; } else { console.error("Element #begin-quest-btn not found!"); }

        // Hide other sections (assuming these functions have internal checks)
        hideProofSubmission();
        hideCooldownMessage();
        hideNoQuestsMessage();

        console.log(`[script.js] Displaying Directive: ${quest.title}`);
    };
    // Other quest functions remain the same
    const displayCooldownMessage = (cooldownEndTime) => { /* ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... (includes debug log from previous step) ... */ };
    const handleCancelQuest = () => { /* ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };


    // --- Proof Submission & Verification --- (Functions remain the same)
    const showProofSubmission = (proofType) => { /* ... */ };
    const hideProofSubmission = () => { /* ... */ };
    const handleProofSubmit = (event) => { /* ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified
    const handleQuestVerified = (quest, successMessage) => { /* ... (includes skill drop call and DEBUG logs) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
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
