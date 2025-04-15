// script.js

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
    window.getLocalStorage = (key, defaultValue) => { /* ... (same as before) ... */
        const data = localStorage.getItem(key);
        try { return data ? JSON.parse(data) : defaultValue; }
        catch (e) { console.error(`[script.js] Error parsing localStorage key "${key}":`, e); return defaultValue; }
    };
    window.setLocalStorage = (key, value) => { /* ... (same as before) ... */
        try { localStorage.setItem(key, JSON.stringify(value)); }
        catch (e) { console.error(`[script.js] Error setting localStorage key "${key}":`, e); }
    };

    // --- Initialization ---
    const initializeGame = () => { /* ... (same as before) ... */
        console.log("[script.js] Initializing System Interface...");
        // Check the 'chosenClass' key first to decide UI flow
        const chosenClassSaved = getLocalStorage('chosenClass', null); // Read direct key

        if (!chosenClassSaved) {
            // No class chosen - show selection screen
            console.log("[script.js] No class chosen. Displaying class selection.");
            displayClassSelection();
            if(mainGameContainer) mainGameContainer.style.display = 'none';
        } else {
            // Class has been chosen previously - load main game
            console.log(`[script.js] Class '${chosenClassSaved}' found. Starting main game.`);
             if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
             if(mainGameContainer) mainGameContainer.style.display = 'block';
            initializeMainGame(); // Setup the main game UI and logic
        }
    };

    const initializeMainGame = () => {
        // Load stats FIRST to ensure class is available for other functions
        const initialStats = loadUserStats(); // This reads from 'userStats' key
        updateUserStatsDisplay(initialStats); // Update display immediately with loaded stats

        checkForDueReflections();
        loadNextQuest(); // Load quest AFTER stats are loaded
        setupEventListeners();
        console.log("[script.js] System Online.");
    };


    // --- Class Selection Logic ---
    const displayClassSelection = () => { /* ... (same as before) ... */
        if (!classSelectionOverlay || !classOptionsGrid) { console.error("Class selection elements not found!"); return; }
        classOptionsGrid.innerHTML = '';
        CLASSES_DATA.forEach(cls => { const card = document.createElement('div'); card.className = 'class-card'; card.innerHTML = `<h3>${cls.name}</h3><p><strong>Core Concept:</strong> ${cls.concept}</p><p><strong>Starting Boon:</strong> ${cls.boon}</p><button class="choose-class-btn" data-class-name="${cls.name}">Choose ${cls.name}</button>`; classOptionsGrid.appendChild(card); });
        classOptionsGrid.addEventListener('click', handleClassChoice);
        classSelectionOverlay.style.display = 'flex';
    };

    const handleClassChoice = (event) => {
        if (!event.target.classList.contains('choose-class-btn')) { return; }
        const chosenClassName = event.target.dataset.className;
        if (!chosenClassName) return;

        console.log(`[script.js] Class chosen: ${chosenClassName}`);

        // --- FIX START: Save class name INSIDE the userStats object ---
        const stats = loadUserStats(); // Get current stats (or defaults)
        stats.chosenClass = chosenClassName; // Update the class property
        setLocalStorage('userStats', stats); // Save the entire updated stats object
        // --- FIX END ---

        // Also save directly to chosenClass key for initial load check consistency (optional but safe)
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

    // Placeholder function - NOW includes comments on how to implement boon
    const applyStartingBoon = (className) => {
        console.log(`[script.js] Applying starting boon for class: ${className}`);
        // --- Placeholder for Boon Logic ---
        // Example: Triggering a specific starting quest for Geomancer
        if (className === 'Geomancer') {
            console.log("[script.js] Geomancer chosen - Boon logic would try to set specific starting quest here.");
            // Option: Set a flag in localStorage that loadNextQuest() checks
            // setLocalStorage('forceNextQuestId', 'geomancer_start01');
            // loadNextQuest() would need to be modified to look for this flag
            // and load the quest if found, then clear the flag.
            // (See commented out example in loadNextQuest)
            showMessage("Geomancer Boon: Attune to the Leylines quest should be prioritized (Implementation Pending).", "info");
        }
        // Add similar 'if' blocks for other classes.
        // --- End Placeholder ---
    };


    // --- Event Listeners Setup ---
    const setupEventListeners = () => { /* ... (same as before) ... */
        if (beginQuestBtn) beginQuestBtn.addEventListener('click', handleBeginQuest); else console.warn("Element #begin-quest-btn not found for listener");
        if (proofForm) proofForm.addEventListener('submit', handleProofSubmit); else console.warn("Element #proof-form not found for listener");
        if (cancelQuestBtn) cancelQuestBtn.addEventListener('click', handleCancelQuest); else console.warn("Element #cancel-quest-btn not found for listener");
        if (requestWitnessBtn) requestWitnessBtn.addEventListener('click', handleRequestWitness); else console.warn("Element #request-witness-btn not found for listener");
        if (reflectionForm) reflectionForm.addEventListener('submit', handleReflectionSubmit); else console.warn("Element #reflection-form not found for listener");
        console.log("[script.js] Main event listeners attached.");
    };

    // --- Quest Management ---
    const loadNextQuest = () => {
        console.log("[script.js] Scanning for next available directive...");
        clearMessage(); hideProofSubmission(); hideCooldownMessage(); hideNoQuestsMessage();

        // --- Boon Logic Example Implementation (Commented Out) ---
        // // Check if a specific quest needs to be forced by a boon
        // const forcedQuestId = getLocalStorage('forceNextQuestId', null);
        // if (forcedQuestId) {
        //     const forcedQuest = ALL_QUESTS.find(q => q.id === forcedQuestId);
        //     // Check if this forced quest has already been completed (including reflection)
        //     const completedQuestsCheck = getLocalStorage('completedQuests', {});
        //     const isForcedQuestDone = completedQuestsCheck[forcedQuestId] && completedQuestsCheck[forcedQuestId].reflectionCompleted;

        //     if (forcedQuest && !isForcedQuestDone) {
        //         currentQuest = forcedQuest;
        //         setLocalStorage('forceNextQuestId', null); // Clear the flag *only* if quest is loaded
        //         displayQuest(currentQuest);
        //         console.log(`[script.js] Forced starting quest loaded: ${currentQuest.title}`);
        //         return; // Skip normal quest finding
        //     } else {
        //         // Clear flag if quest not found or already done
        //         setLocalStorage('forceNextQuestId', null);
        //         if (!forcedQuest) console.warn(`[script.js] Forced quest ID ${forcedQuestId} not found.`);
        //         if (isForcedQuestDone) console.log(`[script.js] Forced quest ${forcedQuestId} already completed.`);
        //     }
        // }
        // --- End Boon Logic Example ---

        const completedQuests = getLocalStorage('completedQuests', {}); const questCooldowns = getLocalStorage('questCooldowns', {}); const now = Date.now();
        let availableQuests = ALL_QUESTS.filter(quest => {
            const stats = loadUserStats(); // Need stats to check class
            // Skip quest if it's designated for a *different* starting class
            if (quest.startingClass && quest.startingClass !== stats.chosenClass) {
                return false;
            }
            // Standard availability checks
            const isCompletedRecord = completedQuests[quest.id]; const cooldownEndTime = questCooldowns[quest.id]; const isOnCooldown = cooldownEndTime && now < cooldownEndTime; const fullyCompleted = isCompletedRecord && isCompletedRecord.reflectionCompleted;
            return !fullyCompleted && !isOnCooldown;
        });

        console.log(`[script.js] Found ${availableQuests.length} potential directives after filtering.`); // Updated log

        if (availableQuests.length > 0) {
            // Prioritize the player's starting class quest if it's available and not done
            const stats = loadUserStats();
            const startingQuest = availableQuests.find(q => q.startingClass === stats.chosenClass && !completedQuests[q.id]); // Check completion here too

            if (startingQuest) {
                 currentQuest = startingQuest;
                 console.log("[script.js] Prioritizing starting class quest.");
            } else {
                 // Filter out starting quests belonging to *any* class if no specific starting quest is pending
                 const standardQuests = availableQuests.filter(q => !q.startingClass);
                 currentQuest = standardQuests.length > 0 ? standardQuests[0] : null; // Pick first standard quest
                 if(!currentQuest) console.log("[script.js] No standard quests available after filtering.");
            }

            if (currentQuest) {
                displayQuest(currentQuest);
            } else {
                 // If filtering removed all quests (e.g., only other classes' starting quests were left)
                 displayNoQuestsMessage();
            }

        } else {
            // Standard cooldown / no quests logic if initial filter found nothing
            const activeCooldowns = Object.entries(questCooldowns).filter(([id, endTime]) => now < endTime);
            if (activeCooldowns.length > 0) { const soonestCooldown = activeCooldowns.reduce((soonest, [id, endTime]) => { return endTime < soonest.endTime ? { id, endTime } : soonest; }, { id: null, endTime: Infinity }); displayCooldownMessage(soonestCooldown.endTime); }
            else { displayNoQuestsMessage(); currentQuest = null; }
        }
    };
    // Other quest functions remain the same
    const displayQuest = (quest) => { /* ... */ console.log(`[script.js] Displaying Directive: ${quest.title}`); };
    const displayCooldownMessage = (cooldownEndTime) => { /* ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... */ console.log(`[script.js] Accepting Directive: ${currentQuest.title}`); };
    const handleCancelQuest = () => { /* ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };


    // --- Proof Submission & Verification --- (Functions remain the same)
    const showProofSubmission = (proofType) => { /* ... */ };
    const hideProofSubmission = () => { /* ... */ };
    const handleProofSubmit = (event) => { /* ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified
    const handleQuestVerified = (quest, successMessage) => { /* ... (same as previous version with DEBUG logs) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
    const handleQuestFailed = (failMessage, reason) => { /* ... */ console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); };

    // --- Witness Verification --- (Function remains the same)
    const handleRequestWitness = () => { /* ... */ console.log(`[script.js] Requesting peer confirmation...`); };

    // --- Reflection System --- (Functions remain the same)
    const checkForDueReflections = () => { /* ... */ };
    const showReflectionModal = (questId, questTitle) => { /* ... */ };
    window.closeReflectionModal = () => { /* ... */ };
    const handleReflectionSubmit = (event) => { /* ... */ console.log(`[script.js] Submitting analysis...`); };

    // --- User Stats & Leveling ---
    const loadUserStats = () => {
        const defaultStats = { level: 1, xp: 0, verifiedQuests: 0, chosenClass: null }; const stats = getLocalStorage('userStats', defaultStats);
        stats.level = stats.level || defaultStats.level; stats.xp = stats.xp || defaultStats.xp; stats.verifiedQuests = stats.verifiedQuests || defaultStats.verifiedQuests;
        // Ensure chosenClass is loaded correctly from the userStats object
        stats.chosenClass = stats.chosenClass || getLocalStorage('chosenClass', null) || defaultStats.chosenClass; // Check both places just in case, prioritize userStats
        return stats;
    };
    const updateUserStatsDisplay = (stats) => {
        if (!stats) { console.error("[script.js] Attempted to update display with null stats."); stats = loadUserStats(); }
        if(playerLevelDisplay) playerLevelDisplay.textContent = stats.level; if(playerXpDisplay) playerXpDisplay.textContent = stats.xp; if(userStatsVerified) userStatsVerified.textContent = stats.verifiedQuests;
        // Display the class name loaded from the stats object
        if(playerClassDisplay) playerClassDisplay.textContent = stats.chosenClass || "None";

        // XP Bar Calculation (same as before)
        const currentLevel = stats.level; const currentLevelBaseXP = XP_THRESHOLDS[currentLevel - 1] !== undefined ? XP_THRESHOLDS[currentLevel - 1] : 0; const nextLevelThresholdXP = XP_THRESHOLDS[currentLevel] !== undefined ? XP_THRESHOLDS[currentLevel] : Infinity; let xpNeededForLevel = 0; let xpProgressInLevel = 0; let xpPercentage = 0;
        if (nextLevelThresholdXP === Infinity) { if(xpToNextLevelDisplay) xpToNextLevelDisplay.textContent = "MAX"; xpPercentage = 100; } else { xpNeededForLevel = nextLevelThresholdXP - currentLevelBaseXP; xpProgressInLevel = stats.xp - currentLevelBaseXP; if(xpToNextLevelDisplay) xpToNextLevelDisplay.textContent = nextLevelThresholdXP; if (xpNeededForLevel > 0) { xpPercentage = Math.max(0, Math.min(100, (xpProgressInLevel / xpNeededForLevel) * 100)); } }
        if(xpBar) xpBar.style.width = `${xpPercentage}%`;

        console.log(`[script.js] Stats Updated: Level=${stats.level}, XP=${stats.xp}, Class=${stats.chosenClass}, Verified=${stats.verifiedQuests}, XP Bar=${xpPercentage.toFixed(1)}%`);
    };
    const gainXP = (amount, isBonus = false) => { /* ... (same as before) ... */ };
    const triggerLevelUpVisual = () => { /* ... (same as before) ... */ };

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
