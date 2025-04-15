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
        const chosenClass = getLocalStorage('chosenClass', null);
        if (!chosenClass) {
            console.log("[script.js] No class chosen. Displaying class selection.");
            displayClassSelection();
            if(mainGameContainer) mainGameContainer.style.display = 'none';
        } else {
            console.log(`[script.js] Class '${chosenClass}' found. Starting main game.`);
             if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
             if(mainGameContainer) mainGameContainer.style.display = 'block';
            initializeMainGame(); // Call the function to setup the main game
        }
    };

    const initializeMainGame = () => {
        // Load stats FIRST to ensure class is available for other functions
        const initialStats = loadUserStats();
        updateUserStatsDisplay(initialStats); // Update display immediately with loaded stats

        checkForDueReflections();
        loadNextQuest(); // Load quest AFTER stats are loaded
        setupEventListeners();
        console.log("[script.js] System Online.");
        // No need to update display again here, already done above
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
        setLocalStorage('chosenClass', chosenClassName); // Save the chosen class

        // Apply starting boon placeholder
        applyStartingBoon(chosenClassName);

        // Hide class selection and show main game
        if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
        if(mainGameContainer) mainGameContainer.style.display = 'block';

        // Initialize the main game systems now
        // **Crucially, loadUserStats() here will now include the class**
        initializeMainGame(); // This now loads stats, quests, listeners AND updates display

        showMessage(`Path chosen: ${chosenClassName}. Your evolution begins.`, 'success');
    };

    // Placeholder function - NOW includes comments on how to implement boon
    const applyStartingBoon = (className) => {
        console.log(`[script.js] Applying starting boon for class: ${className}`);
        // --- Placeholder for Boon Logic ---
        // Example: Triggering a specific starting quest for Geomancer
        if (className === 'Geomancer') {
            console.log("[script.js] Geomancer chosen - Boon logic would try to set specific starting quest here.");
            // Option 1: Directly set 'currentQuest' if loadNextQuest hasn't run yet
            // currentQuest = ALL_QUESTS.find(q => q.id === 'geomancer_start01');
            // Option 2: Set a flag that loadNextQuest checks
            // setLocalStorage('forceNextQuestId', 'geomancer_start01');
            // Option 3: Modify the ALL_QUESTS array temporarily (more complex)

            // For now, this function doesn't change game state. Add real logic here.
        }
        // Add similar 'if' blocks for other classes and their boons.
        // --- End Placeholder ---
    };


    // --- Event Listeners Setup ---
    const setupEventListeners = () => { /* ... (same as before, includes safety checks) ... */
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

        // --- Boon Logic Placeholder ---
        // Check if a specific quest needs to be forced (e.g., by class choice boon)
        // const forcedQuestId = getLocalStorage('forceNextQuestId', null);
        // if (forcedQuestId) {
        //     const forcedQuest = ALL_QUESTS.find(q => q.id === forcedQuestId);
        //     if (forcedQuest) {
        //         currentQuest = forcedQuest;
        //         setLocalStorage('forceNextQuestId', null); // Clear the flag
        //         displayQuest(currentQuest);
        //         console.log(`[script.js] Forced starting quest: ${currentQuest.title}`);
        //         return; // Skip normal quest finding
        //     } else {
        //         setLocalStorage('forceNextQuestId', null); // Clear flag if quest not found
        //         console.warn(`[script.js] Forced quest ID ${forcedQuestId} not found.`);
        //     }
        // }
        // --- End Boon Logic Placeholder ---

        const completedQuests = getLocalStorage('completedQuests', {}); const questCooldowns = getLocalStorage('questCooldowns', {}); const now = Date.now();
        let availableQuests = ALL_QUESTS.filter(quest => {
            // Exclude class-specific starting quests unless the class matches (or no class needed)
            const stats = loadUserStats(); // Need stats to check class
            if (quest.startingClass && quest.startingClass !== stats.chosenClass) {
                return false; // Skip quest if it's for a different starting class
            }
            // Standard availability checks
            const isCompletedRecord = completedQuests[quest.id]; const cooldownEndTime = questCooldowns[quest.id]; const isOnCooldown = cooldownEndTime && now < cooldownEndTime; const fullyCompleted = isCompletedRecord && isCompletedRecord.reflectionCompleted;
            return !fullyCompleted && !isOnCooldown;
        });

        console.log(`[script.js] Found ${availableQuests.length} potential directives.`);
        if (availableQuests.length > 0) {
            // Prioritize starting quests if available and not completed
            const startingQuest = availableQuests.find(q => q.startingClass && !completedQuests[q.id]);
            if (startingQuest) {
                 currentQuest = startingQuest;
                 console.log("[script.js] Prioritizing starting class quest.");
            } else {
                 // Otherwise, just pick the first available standard quest
                 // Exclude starting quests of *other* classes if they somehow passed the filter
                 const standardQuests = availableQuests.filter(q => !q.startingClass || q.startingClass === loadUserStats().chosenClass);
                 currentQuest = standardQuests.length > 0 ? standardQuests[0] : null;
            }

            if (currentQuest) {
                displayQuest(currentQuest);
            } else {
                 // If filtering removed all quests, show no quests message
                 displayNoQuestsMessage();
            }

        } else {
            // Standard cooldown / no quests logic
            const activeCooldowns = Object.entries(questCooldowns).filter(([id, endTime]) => now < endTime);
            if (activeCooldowns.length > 0) { const soonestCooldown = activeCooldowns.reduce((soonest, [id, endTime]) => { return endTime < soonest.endTime ? { id, endTime } : soonest; }, { id: null, endTime: Infinity }); displayCooldownMessage(soonestCooldown.endTime); }
            else { displayNoQuestsMessage(); currentQuest = null; }
        }
    };
    // Other quest functions (displayQuest, displayCooldownMessage, etc.) remain the same
    const displayQuest = (quest) => { /* ... (same as before) ... */ console.log(`[script.js] Displaying Directive: ${quest.title}`); };
    const displayCooldownMessage = (cooldownEndTime) => { /* ... (same as before) ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... (same as before) ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... (same as before) ... */ console.log(`[script.js] Accepting Directive: ${currentQuest.title}`); };
    const handleCancelQuest = () => { /* ... (same as before) ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };


    // --- Proof Submission & Verification --- (Functions remain the same)
    const showProofSubmission = (proofType) => { /* ... (same as before) ... */ };
    const hideProofSubmission = () => { /* ... (same as before) ... */ };
    const handleProofSubmit = (event) => { /* ... (same as before) ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... (same as before) ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified for brevity
    const handleQuestVerified = (quest, successMessage) => { /* ... (same as before, includes skill drop call) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
    const handleQuestFailed = (failMessage, reason) => { /* ... (same as before) ... */ console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); };

    // --- Witness Verification --- (Function remains the same)
    const handleRequestWitness = () => { /* ... (same as before) ... */ console.log(`[script.js] Requesting peer confirmation...`); };

    // --- Reflection System --- (Functions remain the same)
    const checkForDueReflections = () => { /* ... (same as before) ... */ };
    const showReflectionModal = (questId, questTitle) => { /* ... (same as before) ... */ };
    window.closeReflectionModal = () => { /* ... (same as before) ... */ };
    const handleReflectionSubmit = (event) => { /* ... (same as before) ... */ console.log(`[script.js] Submitting analysis...`); };

    // --- User Stats & Leveling ---
    // Loads stats object, ensuring all keys exist
    const loadUserStats = () => {
        const defaultStats = { level: 1, xp: 0, verifiedQuests: 0, chosenClass: null }; const stats = getLocalStorage('userStats', defaultStats);
        stats.level = stats.level || defaultStats.level; stats.xp = stats.xp || defaultStats.xp; stats.verifiedQuests = stats.verifiedQuests || defaultStats.verifiedQuests; stats.chosenClass = stats.chosenClass || defaultStats.chosenClass; // Load chosen class
        return stats;
    };
    // Updates all stat displays in the UI
    const updateUserStatsDisplay = (stats) => {
        if (!stats) { console.error("[script.js] Attempted to update display with null stats."); stats = loadUserStats(); } // Load if not provided
        // Update DOM elements safely
        if(playerLevelDisplay) playerLevelDisplay.textContent = stats.level;
        if(playerXpDisplay) playerXpDisplay.textContent = stats.xp;
        if(userStatsVerified) userStatsVerified.textContent = stats.verifiedQuests;
        if(playerClassDisplay) playerClassDisplay.textContent = stats.chosenClass || "None"; // Display chosen class or "None"

        // Calculate and update XP Bar
        const currentLevel = stats.level; const currentLevelBaseXP = XP_THRESHOLDS[currentLevel - 1] !== undefined ? XP_THRESHOLDS[currentLevel - 1] : 0; const nextLevelThresholdXP = XP_THRESHOLDS[currentLevel] !== undefined ? XP_THRESHOLDS[currentLevel] : Infinity; let xpNeededForLevel = 0; let xpProgressInLevel = 0; let xpPercentage = 0;
        if (nextLevelThresholdXP === Infinity) { if(xpToNextLevelDisplay) xpToNextLevelDisplay.textContent = "MAX"; xpPercentage = 100; } // Handle max level
        else { xpNeededForLevel = nextLevelThresholdXP - currentLevelBaseXP; xpProgressInLevel = stats.xp - currentLevelBaseXP; if(xpToNextLevelDisplay) xpToNextLevelDisplay.textContent = nextLevelThresholdXP; if (xpNeededForLevel > 0) { xpPercentage = Math.max(0, Math.min(100, (xpProgressInLevel / xpNeededForLevel) * 100)); } } // Calculate percentage
        if(xpBar) xpBar.style.width = `${xpPercentage}%`; // Set bar width

        console.log(`[script.js] Stats Updated: Level=${stats.level}, XP=${stats.xp}, Class=${stats.chosenClass}, Verified=${stats.verifiedQuests}, XP Bar=${xpPercentage.toFixed(1)}%`);
    };
    // Adds XP, checks for level up, saves stats, updates UI
     const gainXP = (amount, isBonus = false) => { /* ... (same as before) ... */ };
    // Triggers the level up visual effect
     const triggerLevelUpVisual = () => { /* ... (same as before) ... */ };

    // --- UI Utilities --- (Functions remain the same)
    window.showMessage = (message, type = 'info', container = messageArea) => { /* ... (same as before) ... */ };
    const clearMessage = (container = messageArea) => { /* ... (same as before) ... */ };
    const hideCooldownMessage = () => { /* ... (same as before) ... */ };
    const hideNoQuestsMessage = () => { /* ... (same as before) ... */ };

    // --- Start the Application ---
    initializeGame(); // Start the game initialization process

    // Periodically check for reflections
    setInterval(checkForDueReflections, 60 * 1000); // Check every minute

}); // End DOMContentLoaded
