// script.js
// Ensuring syntax is correct, includes previous debug logs.

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // (Ensure all these IDs exist in your HTML)
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
    const beginQuestBtn = document.getElementById('begin-quest-btn'); // <--- Key button
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
    const QUEST_COOLDOWN_DURATION = 24 * 60 * 60 * 1000;
    const REFLECTION_DELAY = 12 * 60 * 60 * 1000;
    const TEXT_PROOF_MIN_LENGTH = 150;
    const EMOTIONAL_KEYWORDS = ["afraid", "grateful", "angry", "free", "release", "breakthrough", "realization", "clarity", "fear", "joy", "peace", "connected", "struggle", "overcome", "insight", "let go", "understand", "integrate", "process"];
    const REFLECTION_XP_BONUS = 50;
    const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500];

    // --- Class Data ---
    // Verify correct quotes and commas
    const CLASSES_DATA = [
         { name: "Oracle", concept: "Seeker of hidden truths, attuned to subtle energies...", boon: "Minor passive increase in detecting keywords or chance of 'System Whispers'." },
         { name: "Chronicler", concept: "Keeper of records, believer in the power of the written word...", boon: "Small XP bonus for reflections or reduced cooldown on analyzed failures." },
         { name: "Geomancer", concept: "Weaver of intention and energy, using symbols and connection...", boon: "Starts with intro sigil quest or passively generates 'Resonant Fragments'." },
         { name: "Void Walker", concept: "Embracer of the shadow, understanding growth through darkness...", boon: "Slight reduction in failure impact or higher chance of post-failure events." },
         { name: "Empath", concept: "Conduit for connection, drawing strength from shared experience...", boon: "Increased Witness effectiveness or higher chance of 'Nexus Echoes'." },
         { name: "Wanderer", concept: "Follower of intuition and the untrodden path...", boon: "Occasional 'System Glitches'/hints or higher chance of 'Critical Success'." }
    ]; // Ensure semicolon is here and no stray characters

    // --- Game Data (Quests) ---
    // Verify correct quotes and commas
    const ALL_QUESTS = [
        { id: "geomancer_start01", title: "Attune to the Leylines", description: "Find a place outdoors that feels energetically significant. Draw a simple circle on the ground or paper representing your connection point.", objective: "Describe the location and feeling, upload image of circle.", proofType: "image", keywords: ["geomancy", "leyline", "connect", "earth", "energy", "draw", "circle"], xpReward: 50, startingClass: "Geomancer" },
        { id: "meditate01", title: "Still the Mind's Echo", description: "Find a quiet space. Focus solely on your breath for 15 uninterrupted minutes.", objective: "Achieve 15 minutes of focused meditation.", proofType: "text", keywords: ["peace", "calm", "focus", "breath", "quiet", "present", "mindful"], xpReward: 75 },
        { id: "sigil01", title: "Manifest Intent", description: "Design and draw a personal sigil representing a core intention for growth.", objective: "Create and photograph your sigil.", proofType: "image", keywords: ["intention", "desire", "symbol", "create", "focus", "manifest"], xpReward: 100 },
        { id: "fear01", title: "Confront the Shadow", description: "Identify one small fear. Take one concrete step today to face it.", objective: "Describe the fear and the action taken.", proofType: "text", keywords: ["fear", "afraid", "confront", "step", "action", "overcome", "challenge", "release", "brave"], xpReward: 120 },
        { id: "gratitude01", title: "Acknowledge Abundance", description: "Record three specific things you are genuinely grateful for today, explaining *why*.", objective: "Write a short gratitude journal entry.", proofType: "text", keywords: ["grateful", "thankful", "appreciate", "blessing", "joy", "abundance", "positive"], xpReward: 60 },
        { id: "nature01", title: "Connect to Gaia", description: "Spend 20 minutes outdoors, consciously observing the natural world.", objective: "Describe your sensory experience and any insights.", proofType: "text", keywords: ["nature", "observe", "connect", "earth", "listen", "feel", "grounded", "peace"], xpReward: 85 }
    ]; // Ensure semicolon is here

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

    const handleClassChoice = (event) => {
        // Use event delegation target check
        if (!event.target.classList.contains('choose-class-btn')) { return; }
        const chosenClassName = event.target.dataset.className;
        if (!chosenClassName) return;

        console.log(`[script.js] Class chosen: ${chosenClassName}`);

        // Load stats first
        const stats = loadUserStats();

        // Debug log before assignment attempt
        console.log("[script.js] DEBUG: Value of stats before assignment:", stats);
        if (!stats) {
             console.error("[script.js] ERROR: loadUserStats() returned invalid value! Cannot set chosenClass.");
             showMessage("Critical Error: Failed to load user data. Cannot save class choice.", "error");
             return; // Stop if stats is invalid
        }

        // Update the class property on the stats object
        try {
            stats.chosenClass = chosenClassName; // The line that previously failed
            console.log("[script.js] DEBUG: Assignment successful.");
        } catch (e) {
            console.error("[script.js] ERROR during assignment 'stats.chosenClass':", e);
            showMessage("Critical Error: Failed to assign class data.", "error");
            return; // Stop if assignment fails
        }

        // Save the entire updated stats object back to localStorage under 'userStats' key
        setLocalStorage('userStats', stats);
        // Also save class name directly under 'chosenClass' key for initial load check
        setLocalStorage('chosenClass', chosenClassName);

        applyStartingBoon(chosenClassName); // Apply placeholder boon logic

        // Hide class selection overlay and show main game container
        if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
        if(mainGameContainer) mainGameContainer.style.display = 'block';

        initializeMainGame(); // Initialize the main game UI and logic

        showMessage(`Path chosen: ${chosenClassName}. Your evolution begins.`, 'success');
    };

    const applyStartingBoon = (className) => {
        console.log(`[script.js] Applying starting boon for class: ${className}`);
        if (className === 'Geomancer') { console.log("[script.js] Geomancer chosen - Boon logic placeholder."); showMessage("Geomancer Boon: Attune to the Leylines quest should be prioritized (Implementation Pending).", "info"); }
        // Add other class boon placeholders here
    };

    // --- Event Listeners Setup ---
    const setupEventListeners = () => {
        console.log("[script.js] DEBUG: Attaching listener to beginQuestBtn:", beginQuestBtn); // Keep this debug log
        if (beginQuestBtn) { beginQuestBtn.addEventListener('click', handleBeginQuest); } else { console.warn("Element #begin-quest-btn not found for listener"); }
        if (proofForm) { proofForm.addEventListener('submit', handleProofSubmit); } else { console.warn("Element #proof-form not found for listener"); }
        if (cancelQuestBtn) { cancelQuestBtn.addEventListener('click', handleCancelQuest); } else { console.warn("Element #cancel-quest-btn not found for listener"); }
        if (requestWitnessBtn) { requestWitnessBtn.addEventListener('click', handleRequestWitness); } else { console.warn("Element #request-witness-btn not found for listener"); }
        if (reflectionForm) { reflectionForm.addEventListener('submit', handleReflectionSubmit); } else { console.warn("Element #reflection-form not found for listener"); }
        console.log("[script.js] Main event listeners attached.");
    };

    // --- Quest Management ---
    const loadNextQuest = () => {
        console.log("[script.js] Scanning for next available directive...");
        clearMessage(); hideProofSubmission(); hideCooldownMessage(); hideNoQuestsMessage();
        const completedQuests = getLocalStorage('completedQuests', {}); const questCooldowns = getLocalStorage('questCooldowns', {}); const now = Date.now();
        let availableQuests = ALL_QUESTS.filter(quest => {
            const stats = loadUserStats();
            if (quest.startingClass && quest.startingClass !== stats.chosenClass) { return false; }
            const isCompletedRecord = completedQuests[quest.id]; const cooldownEndTime = questCooldowns[quest.id]; const isOnCooldown = cooldownEndTime && now < cooldownEndTime; const fullyCompleted = isCompletedRecord && isCompletedRecord.reflectionCompleted;
            return !fullyCompleted && !isOnCooldown;
        });
        console.log(`[script.js] Found ${availableQuests.length} potential directives after filtering.`);
        if (availableQuests.length > 0) {
            const stats = loadUserStats(); const startingQuest = availableQuests.find(q => q.startingClass === stats.chosenClass && !completedQuests[q.id]);
            if (startingQuest) { currentQuest = startingQuest; console.log("[script.js] Prioritizing starting class quest."); }
            else { const standardQuests = availableQuests.filter(q => !q.startingClass); currentQuest = standardQuests.length > 0 ? standardQuests[0] : null; if(!currentQuest) console.log("[script.js] No standard quests available after filtering."); }
            if (currentQuest) { displayQuest(currentQuest); } else { displayNoQuestsMessage(); }
        } else {
            const activeCooldowns = Object.entries(questCooldowns).filter(([id, endTime]) => now < endTime);
            if (activeCooldowns.length > 0) { const soonestCooldown = activeCooldowns.reduce((soonest, [id, endTime]) => { return endTime < soonest.endTime ? { id, endTime } : soonest; }, { id: null, endTime: Infinity }); displayCooldownMessage(soonestCooldown.endTime); }
            else { displayNoQuestsMessage(); currentQuest = null; }
        }
    };

    // Display quest - reverted to version *without* extra debug logs inside, but kept safety checks
    const displayQuest = (quest) => {
        if (!quest || typeof quest !== 'object') { console.error("[script.js] displayQuest called with invalid quest data:", quest); if(questContent) questContent.style.display = 'none'; if(noQuestsMessage) { noQuestsMessage.style.display = 'block'; noQuestsMessage.textContent = "Error loading quest data."; } return; }
        // Update elements safely
        if (questTitle) { questTitle.textContent = quest.title || "N/A"; } else { console.error("#quest-title not found"); }
        if (questDescription) { questDescription.textContent = quest.description || "N/A"; } else { console.error("#quest-description not found"); }
        if (questObjective) { questObjective.textContent = quest.objective || "N/A"; } else { console.error("#quest-objective span not found"); }
        if (questProofType) { questProofType.textContent = quest.proofType ? (quest.proofType.charAt(0).toUpperCase() + quest.proofType.slice(1)) : "N/A"; } else { console.error("#quest-proof-type span not found"); }
        if (questRewardDisplay) { questRewardDisplay.textContent = quest.xpReward !== undefined ? quest.xpReward : "---"; } else { console.error("#quest-reward span not found"); }
        if (currentQuestIdInput) { currentQuestIdInput.value = quest.id || ""; } else { console.error("#current-quest-id not found"); }
        if (questContent) { questContent.style.display = 'block'; } else { console.error("#quest-content not found"); }
        if (beginQuestBtn) { beginQuestBtn.disabled = false; beginQuestBtn.textContent = 'Accept Directive'; } else { console.error("#begin-quest-btn not found"); }
        hideProofSubmission(); hideCooldownMessage(); hideNoQuestsMessage();
        console.log(`[script.js] Displaying Directive: ${quest.title}`);
    };
    const displayCooldownMessage = (cooldownEndTime) => { /* ... */ console.log(`[script.js] System on cooldown...`); };
    const displayNoQuestsMessage = () => { /* ... */ console.log("[script.js] No available directives."); };
    const handleBeginQuest = () => { /* ... (Includes debug log) ... */ };
    const handleCancelQuest = () => { /* ... */ console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); };

    // --- Proof Submission & Verification ---
    const showProofSubmission = (proofType) => { /* ... */ };
    const hideProofSubmission = () => { /* ... */ };
    const handleProofSubmit = (event) => { /* ... */ console.log("[script.js] Transmitting verification data..."); };
    const simulateVerification = (quest, proofData) => { /* ... */ console.log(`[script.js] Simulating verification...`); return { verified: true, message: "Simulated Pass", reason: null }; }; // Simplified
    const handleQuestVerified = (quest, successMessage) => { /* ... (Includes skill drop call and DEBUG logs) ... */ console.log(`[script.js] Directive Verified: ${quest.title}`); };
    const handleQuestFailed = (failMessage, reason) => { /* ... */ console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); };

    // --- Witness Verification ---
    const handleRequestWitness = () => { /* ... */ console.log(`[script.js] Requesting peer confirmation...`); };

    // --- Reflection System ---
    const checkForDueReflections = () => { /* ... */ };
    const showReflectionModal = (questId, questTitle) => { /* ... */ };
    window.closeReflectionModal = () => { /* ... */ };
    const handleReflectionSubmit = (event) => { /* ... */ console.log(`[script.js] Submitting analysis...`); };

    // --- User Stats & Leveling ---
    const loadUserStats = () => { /* ... */ };
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
