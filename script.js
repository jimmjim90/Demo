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
         { name: "Oracle", concept: "Seeker of hidden truths, attuned to subtle energies and underlying patterns. Relies on intuition and perception over direct action.", boon: "Minor passive increase in detecting keywords or chance of 'System Whispers'." },
         { name: "Chronicler", concept: "Keeper of records, believer in the power of the written word and disciplined reflection to understand and shape reality.", boon: "Small XP bonus for reflections or reduced cooldown on analyzed failures." },
         { name: "Geomancer", concept: "Weaver of intention and energy, using symbols and connection to the environment to manifest change. A blend of mystic artist and architect.", boon: "Starts with intro sigil quest or passively generates 'Resonant Fragments'." },
         { name: "Void Walker", concept: "Embracer of the shadow, understanding that growth often requires confronting and integrating darkness, pain, and failure. High risk, high reward.", boon: "Slight reduction in failure impact or higher chance of post-failure events." },
         { name: "Empath", concept: "Conduit for connection, drawing strength from shared experience. Sensitive to emotional currents.", boon: "Increased Witness effectiveness or higher chance of 'Nexus Echoes'." }, // Simplified boon description
         { name: "Wanderer", concept: "Follower of intuition and the untrodden path. Values agency and emergent experience.", boon: "Occasional 'System Glitches'/hints or higher chance of 'Critical Success'." } // Simplified boon description
    ];

    // --- Game Data (Quests) ---
    const ALL_QUESTS = [
        // (Quest data remains the same as previous version)
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
    // Makes these functions accessible to other scripts like skill-drop.js
    window.getLocalStorage = (key, defaultValue) => {
        const data = localStorage.getItem(key);
        try {
            // Parse JSON data if it exists, otherwise return the default
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            // Log error and return default if parsing fails
            console.error(`[script.js] Error parsing localStorage key "${key}":`, e);
            return defaultValue;
        }
    };
    window.setLocalStorage = (key, value) => {
        try {
            // Convert value to JSON string before saving
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Log error if saving fails
            console.error(`[script.js] Error setting localStorage key "${key}":`, e);
        }
    };

    // --- Initialization ---
    // Checks if a class needs to be selected, then starts the appropriate UI
    const initializeGame = () => {
        console.log("[script.js] Initializing System Interface...");
        // Check if a class has already been chosen and saved in localStorage
        const chosenClass = getLocalStorage('chosenClass', null);

        if (!chosenClass) {
            // No class saved - likely first time loading
            console.log("[script.js] No class chosen. Displaying class selection.");
            displayClassSelection(); // Show the class selection screen
            // Hide the main game container until a class is chosen
            if(mainGameContainer) mainGameContainer.style.display = 'none';
        } else {
            // Class already chosen - load the main game directly
            console.log(`[script.js] Class '${chosenClass}' found. Starting main game.`);
            // Ensure class selection screen is hidden
             if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
             // Ensure main game container is visible
             if(mainGameContainer) mainGameContainer.style.display = 'block';
            // Initialize the main game components
            initializeMainGame();
        }
    };

    // Sets up the main game state after class selection (or on subsequent loads)
    const initializeMainGame = () => {
        loadUserStats(); // Load level, xp, class, etc. from localStorage
        checkForDueReflections(); // Check if any reflection prompts are due
        loadNextQuest(); // Load the first available quest/directive
        setupEventListeners(); // Attach event listeners to buttons and forms
        console.log("[script.js] System Online.");
        // Update the stats display panel with the loaded data
        updateUserStatsDisplay(loadUserStats());
    };


    // --- Class Selection Logic ---
    // Populates the class selection screen with options from CLASSES_DATA
    const displayClassSelection = () => {
        // Safety check: ensure the required HTML elements exist
        if (!classSelectionOverlay || !classOptionsGrid) {
             console.error("Class selection elements (#class-selection-overlay, #class-options-grid) not found!");
             return;
        }
        classOptionsGrid.innerHTML = ''; // Clear any existing options first

        // Create a display card for each class
        CLASSES_DATA.forEach(cls => {
            const card = document.createElement('div');
            card.className = 'class-card'; // Apply CSS styling
            // Set the inner HTML of the card with class details and a button
            card.innerHTML = `
                <h3>${cls.name}</h3>
                <p><strong>Core Concept:</strong> ${cls.concept}</p>
                <p><strong>Starting Boon:</strong> ${cls.boon}</p>
                <button class="choose-class-btn" data-class-name="${cls.name}">Choose ${cls.name}</button>
            `;
            classOptionsGrid.appendChild(card); // Add the card to the grid container
        });

        // Add a single event listener to the grid container (event delegation)
        // This is more efficient than adding a listener to each button
        classOptionsGrid.addEventListener('click', handleClassChoice);

        classSelectionOverlay.style.display = 'flex'; // Show the class selection overlay
    };

    // Handles the click event on a "Choose Class" button
    const handleClassChoice = (event) => {
        // Check if the clicked element is actually a button with the correct class
        if (!event.target.classList.contains('choose-class-btn')) {
            return; // Ignore clicks on the card background, text, etc.
        }

        // Get the chosen class name from the button's data attribute
        const chosenClassName = event.target.dataset.className;
        if (!chosenClassName) return; // Exit if the data attribute is missing

        console.log(`[script.js] Class chosen: ${chosenClassName}`);
        setLocalStorage('chosenClass', chosenClassName); // Save the choice to localStorage

        // Apply the starting boon associated with the class (currently a placeholder)
        applyStartingBoon(chosenClassName);

        // Hide the class selection overlay
        if(classSelectionOverlay) classSelectionOverlay.style.display = 'none';
        // Show the main game container
        if(mainGameContainer) mainGameContainer.style.display = 'block';

        // Initialize the main game systems now that the class is selected
        initializeMainGame();

        // Display a confirmation message to the user
        showMessage(`Path chosen: ${chosenClassName}. Your evolution begins.`, 'success');
    };

    // Placeholder function where specific class boon logic would be implemented
    const applyStartingBoon = (className) => {
        console.log(`[script.js] Applying starting boon for class: ${className}`);
        // --- Placeholder for Boon Logic ---
        // This function would contain the specific code to grant the starting benefit.
        // Examples:
        // - Setting a flag in localStorage: `setLocalStorage('hasOracleBoon', true);`
        // - Modifying a game variable: `let reflectionBonus = (className === 'Chronicler') ? 75 : REFLECTION_XP_BONUS;`
        // - Triggering a unique starting quest.
        // The actual implementation depends on how each boon should affect gameplay.
        // Other functions (like gainXP, simulateVerification) would then check these flags/values.
        // --- End Placeholder ---
    };


    // --- Event Listeners Setup ---
    // Attaches event listeners to main game elements AFTER the class is chosen
    const setupEventListeners = () => {
        // Safety check elements before adding listeners to prevent errors
        if (beginQuestBtn) beginQuestBtn.addEventListener('click', handleBeginQuest); else console.warn("Element #begin-quest-btn not found for listener");
        if (proofForm) proofForm.addEventListener('submit', handleProofSubmit); else console.warn("Element #proof-form not found for listener");
        if (cancelQuestBtn) cancelQuestBtn.addEventListener('click', handleCancelQuest); else console.warn("Element #cancel-quest-btn not found for listener");
        if (requestWitnessBtn) requestWitnessBtn.addEventListener('click', handleRequestWitness); else console.warn("Element #request-witness-btn not found for listener");
        if (reflectionForm) reflectionForm.addEventListener('submit', handleReflectionSubmit); else console.warn("Element #reflection-form not found for listener");
        // Manual skill trigger button listener is attached in skill-drop.js
        // Reflection modal close button listener is inline HTML: onclick="closeReflectionModal()"
        console.log("[script.js] Main event listeners attached.");
    };

    // --- Quest Management ---
    // Finds and loads the next available quest
    const loadNextQuest = () => {
        console.log("[script.js] Scanning for next available directive...");
        clearMessage(); hideProofSubmission(); hideCooldownMessage(); hideNoQuestsMessage();
        const completedQuests = getLocalStorage('completedQuests', {}); const questCooldowns = getLocalStorage('questCooldowns', {}); const now = Date.now();
        // Filter quests: not fully completed (including reflection) AND not on cooldown
        let availableQuests = ALL_QUESTS.filter(quest => { const isCompletedRecord = completedQuests[quest.id]; const cooldownEndTime = questCooldowns[quest.id]; const isOnCooldown = cooldownEndTime && now < cooldownEndTime; const fullyCompleted = isCompletedRecord && isCompletedRecord.reflectionCompleted; return !fullyCompleted && !isOnCooldown; });
        console.log(`[script.js] Found ${availableQuests.length} potential directives.`);
        if (availableQuests.length > 0) { currentQuest = availableQuests[0]; displayQuest(currentQuest); } // Display first available
        else { const activeCooldowns = Object.entries(questCooldowns).filter(([id, endTime]) => now < endTime); if (activeCooldowns.length > 0) { const soonestCooldown = activeCooldowns.reduce((soonest, [id, endTime]) => { return endTime < soonest.endTime ? { id, endTime } : soonest; }, { id: null, endTime: Infinity }); displayCooldownMessage(soonestCooldown.endTime); } else { displayNoQuestsMessage(); currentQuest = null; } } // Show cooldown or no quests message
    };
    // Displays the details of the current quest
    const displayQuest = (quest) => {
        // Safety check elements
        if (!quest || !questTitle || !questDescription || !questObjective || !questProofType || !questRewardDisplay || !currentQuestIdInput || !questContent || !beginQuestBtn) { console.error("Missing elements for displayQuest"); return; }
        questTitle.textContent = quest.title; questDescription.textContent = quest.description; questObjective.textContent = quest.objective; questProofType.textContent = quest.proofType.charAt(0).toUpperCase() + quest.proofType.slice(1); questRewardDisplay.textContent = quest.xpReward; currentQuestIdInput.value = quest.id;
        questContent.style.display = 'block'; beginQuestBtn.disabled = false; beginQuestBtn.textContent = 'Accept Directive';
        hideProofSubmission(); hideCooldownMessage(); hideNoQuestsMessage();
        console.log(`[script.js] Displaying Directive: ${quest.title}`);
    };
    // Displays the cooldown timer
     const displayCooldownMessage = (cooldownEndTime) => {
        if (!questContent || !proofSubmission || !noQuestsMessage || !cooldownMessage || !cooldownTimerDisplay) { console.error("Missing elements for displayCooldownMessage"); return; }
        questContent.style.display = 'none'; proofSubmission.style.display = 'none'; noQuestsMessage.style.display = 'none'; cooldownMessage.style.display = 'block';
        if (cooldownInterval) { clearInterval(cooldownInterval); } // Clear previous timer
        const updateTimer = () => { const now = Date.now(); const timeLeft = cooldownEndTime - now; if (timeLeft <= 0) { cooldownTimerDisplay.textContent = "00:00:00"; clearInterval(cooldownInterval); cooldownInterval = null; console.log("[script.js] Cooldown finished. Reloading directives."); loadNextQuest(); } else { const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24); const minutes = Math.floor((timeLeft / (1000 * 60)) % 60); const seconds = Math.floor((timeLeft / 1000) % 60); cooldownTimerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; } };
        updateTimer(); cooldownInterval = setInterval(updateTimer, 1000);
        console.log(`[script.js] System on cooldown. Next directive available after ${new Date(cooldownEndTime).toLocaleString()}`);
    };
    // Displays the "no quests available" message
     const displayNoQuestsMessage = () => {
         if (!questContent || !proofSubmission || !cooldownMessage || !noQuestsMessage) { console.error("Missing elements for displayNoQuestsMessage"); return; }
        questContent.style.display = 'none'; proofSubmission.style.display = 'none'; cooldownMessage.style.display = 'none'; noQuestsMessage.style.display = 'block';
        console.log("[script.js] No available directives.");
    };
    // Handles clicking the "Accept Directive" button
    const handleBeginQuest = () => {
        if (!currentQuest || !beginQuestBtn) return;
        console.log(`[script.js] Accepting Directive: ${currentQuest.title}`); activeQuestStartTime = Date.now();
        beginQuestBtn.disabled = true; beginQuestBtn.textContent = 'Directive Active...';
        showProofSubmission(currentQuest.proofType); clearMessage();
    };
    // Handles clicking the "Abort Directive" button
    const handleCancelQuest = () => {
        if (!currentQuest) return; // Check if a quest is actually active
        console.log(`[script.js] Directive Aborted: ${currentQuest?.title}`); activeQuestStartTime = null; witnessRequested = false; witnessVerified = false;
        hideProofSubmission();
        if(beginQuestBtn) { beginQuestBtn.disabled = false; beginQuestBtn.textContent = 'Accept Directive'; } // Re-enable button
        showMessage('Directive sequence aborted by user.', 'info'); loadNextQuest();
    };

    // --- Proof Submission & Verification ---
    // Shows the correct proof input fields
     const showProofSubmission = (proofType) => {
        // Safety check elements
        if (!proofSubmission || !textProofGroup || !imageProofGroup || !avProofGroup || !witnessVerificationSection || !witnessStatus || !witnessCodeInput || !textProofInput || !imageProofInput || !avProofInput) { console.error("Missing elements for showProofSubmission"); return; }
        proofSubmission.style.display = 'block'; textProofGroup.style.display = 'none'; imageProofGroup.style.display = 'none'; avProofGroup.style.display = 'none';
        witnessVerificationSection.style.display = 'block'; witnessStatus.style.display = 'none'; witnessCodeInput.value = ''; witnessRequested = false; witnessVerified = false;
        // Show relevant group
        if (proofType === 'text') { textProofGroup.style.display = 'block'; textProofInput.value = ''; }
        else if (proofType === 'image') { imageProofGroup.style.display = 'block'; imageProofInput.value = ''; }
        else if (proofType === 'audio' || proofType === 'video') { avProofGroup.style.display = 'block'; avProofInput.value = ''; }
        proofSubmission.scrollIntoView({ behavior: 'smooth' }); // Scroll to the form
    };
    // Hides the proof submission section
    const hideProofSubmission = () => {
        if (!proofSubmission || !textProofInput || !imageProofInput || !avProofInput || !witnessCodeInput || !witnessStatus) return;
        proofSubmission.style.display = 'none'; textProofInput.value = ''; imageProofInput.value = ''; avProofInput.value = ''; witnessCodeInput.value = ''; witnessStatus.style.display = 'none';
    };
    // Handles the form submission event
    const handleProofSubmit = (event) => {
        event.preventDefault(); if (!currentQuest || !submitProofBtn) return;
        console.log("[script.js] Transmitting verification data..."); submitProofBtn.disabled = true; submitProofBtn.textContent = 'Verifying...';
        const proofData = { text: textProofInput.value, imageFile: imageProofInput.files.length > 0 ? imageProofInput.files[0] : null, avDescription: avProofInput.value };
        const verificationResult = simulateVerification(currentQuest, proofData); // Simulate check
        setTimeout(() => { // Simulate delay
            if (verificationResult.verified) { handleQuestVerified(currentQuest, verificationResult.message); }
            else { handleQuestFailed(verificationResult.message, verificationResult.reason); }
             submitProofBtn.disabled = false; submitProofBtn.textContent = 'Transmit Data'; // Re-enable button
        }, 1500);
    };
    // Simulates checking the proof (replace with real logic or AI call if needed)
     const simulateVerification = (quest, proofData) => {
        console.log(`[script.js] Simulating verification for Directive ID: ${quest.id}, Type: ${quest.proofType}`); let verified = false; let message = "Verification data unclear."; let reason = "Unknown discrepancy.";
        if (witnessVerified) { console.log("[script.js] Peer confirmation received..."); verified = true; message = "Verification confirmed by peer node."; return { verified, message, reason: null }; }
        switch (quest.proofType) { // Logic based on proof type
            case 'text':
                const text = proofData.text.trim(); const wordCount = text.split(/\s+/).filter(Boolean).length; const includesEmotionalKeyword = EMOTIONAL_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword)); const includesQuestKeyword = quest.keywords.some(keyword => text.toLowerCase().includes(keyword));
                console.log(`[script.js] Text Analysis: Length=${text.length}, Words=${wordCount}, EmotionalKeyword=${includesEmotionalKeyword}, QuestKeyword=${includesQuestKeyword}`);
                if (text.length >= TEXT_PROOF_MIN_LENGTH && (includesEmotionalKeyword || includesQuestKeyword)) { verified = true; message = "Textual data confirmed."; }
                else if (text.length < TEXT_PROOF_MIN_LENGTH) { reason = `Log entry insufficient (requires ${TEXT_PROOF_MIN_LENGTH} chars).`; message = "Insufficient data stream."; }
                else { reason = "Required signatures not detected."; message = "Data stream lacks required signatures."; }
                break;
            case 'image': if (proofData.imageFile) { verified = true; message = "Visual data pattern acknowledged."; } else { reason = "No visual data stream detected."; message = "Visual input missing."; } break;
            case 'audio': case 'video': if (proofData.avDescription && proofData.avDescription.length > 20) { verified = true; message = "Auditory/Visual log acknowledged."; } else { reason = "A/V log description insufficient."; message = "A/V stream description unclear."; } break;
            default: reason = "Unsupported data type."; message = "System error.";
        } return { verified, message, reason };
    };
    // Runs when verification is successful
    const handleQuestVerified = (quest, successMessage) => {
        console.log(`[script.js] Directive Verified: ${quest.title}`); showMessage(successMessage, 'success');
        const stats = loadUserStats(); stats.verifiedQuests += 1; // Increment count
        const completedQuests = getLocalStorage('completedQuests', {}); const completionTime = Date.now(); completedQuests[quest.id] = { completionTime: completionTime, reflectionDueTime: completionTime + REFLECTION_DELAY, reflectionCompleted: false, title: quest.title }; setLocalStorage('completedQuests', completedQuests); // Save completion
        const questCooldowns = getLocalStorage('questCooldowns', {}); questCooldowns[quest.id] = Date.now() + QUEST_COOLDOWN_DURATION; setLocalStorage('questCooldowns', questCooldowns); // Set cooldown
        gainXP(quest.xpReward); // Award XP (this saves stats too)
        // --- Trigger Skill Drop --- (Includes DEBUG logs)
        console.log("[script.js] DEBUG: Checking if grantRandomSkill function exists...");
        if (typeof window.grantRandomSkill === 'function') {
            console.log("[script.js] DEBUG: grantRandomSkill function found. Setting timeout...");
            setTimeout(() => {
                console.log("[script.js] DEBUG: Executing grantRandomSkill via setTimeout...");
                window.grantRandomSkill(); // Call the skill drop function
            }, 1000); // 1s delay
        } else { console.warn("[script.js] grantRandomSkill function not found. Ensure skill-drop.js is loaded correctly."); } // Log warning if function missing
        // Reset state and load next quest
        currentQuest = null; activeQuestStartTime = null; witnessRequested = false; witnessVerified = false; hideProofSubmission(); setTimeout(loadNextQuest, 3000);
    };
    // Runs when verification fails
     const handleQuestFailed = (failMessage, reason) => {
        console.warn(`[script.js] Directive Failed: ${currentQuest?.title}. Reason: ${reason}`); let supportiveMessage = "Discrepancy detected. Re-evaluate and resubmit data.";
        // Provide more specific feedback
        if (reason.includes("insufficient") || reason.includes("brief")) { supportiveMessage = "Data packet too small. Elaborate further."; }
        else if (reason.includes("signatures not detected")) { supportiveMessage = "Core signatures missing. Re-center intention."; }
        else if (reason.includes("missing")) { supportiveMessage = "Required data stream absent. Provide correct format."; }
        showMessage(`${failMessage} ${supportiveMessage}`, 'error');
        if (submitProofBtn) { submitProofBtn.disabled = false; submitProofBtn.textContent = 'Transmit Data'; } // Re-enable button
    };

    // --- Witness Verification ---
    const handleRequestWitness = () => {
        if (!witnessCodeInput || !requestWitnessBtn || !witnessStatus) { console.error("Missing elements for handleRequestWitness"); return; }
        const code = witnessCodeInput.value.trim(); if (!code || witnessRequested) { witnessStatus.textContent = witnessRequested ? "Confirmation pending." : "Enter valid Peer ID."; witnessStatus.style.display = 'block'; return; }
        console.log(`[script.js] Requesting peer confirmation: ${code}`); witnessRequested = true; requestWitnessBtn.disabled = true; requestWitnessBtn.textContent = 'Requesting...'; witnessStatus.textContent = `Pinging peer node [${code}]...`; witnessStatus.style.display = 'block';
        const delay = Math.random() * 5000 + 3000; setTimeout(() => { const success = Math.random() > 0.3; // Mock response
            if (success) { console.log(`[script.js] Peer [${code}] confirmed.`); witnessStatus.textContent = `Peer [${code}] Confirmed!`; witnessVerified = true; showMessage('Peer confirmation received!', 'info'); }
            else { console.warn(`[script.js] Peer [${code}] unresponsive.`); witnessStatus.textContent = `Peer [${code}] unresponsive.`; witnessVerified = false; }
             requestWitnessBtn.disabled = false; requestWitnessBtn.textContent = 'Request Confirmation'; witnessRequested = false; // Allow retry
        }, delay);
    };

    // --- Reflection System ---
    // Checks localStorage for reflections that are past their due time
    const checkForDueReflections = () => {
        const completedQuests = getLocalStorage('completedQuests', {}); const now = Date.now(); let reflectionToShow = null;
        for (const questId in completedQuests) { const questData = completedQuests[questId]; if (!questData.reflectionCompleted && questData.reflectionDueTime && now >= questData.reflectionDueTime) { reflectionToShow = { id: questId, title: questData.title }; break; } } // Find the first due reflection
        if (reflectionToShow) { console.log(`[script.js] System inquiry pending for Directive: ${reflectionToShow.title}`); showReflectionModal(reflectionToShow.id, reflectionToShow.title); } // Show modal if found
    };
    // Displays the reflection modal
    const showReflectionModal = (questId, questTitle) => { if (!reflectionQuestIdInput || !reflectionQuestTitle || !reflectionTextInput || !reflectionModal) return; reflectionQuestIdInput.value = questId; reflectionQuestTitle.textContent = `Regarding Directive: ${questTitle}`; reflectionTextInput.value = ''; reflectionModal.style.display = 'block'; };
    // Close button function (global for HTML onclick)
    window.closeReflectionModal = () => { if (!reflectionModal) return; reflectionModal.style.display = 'none'; showMessage('Analysis postponed.', 'info'); };
    // Handles submitting the reflection text
    const handleReflectionSubmit = (event) => {
        event.preventDefault(); if (!reflectionQuestIdInput || !reflectionTextInput || !reflectionModal) return;
        const questId = reflectionQuestIdInput.value; const reflectionText = reflectionTextInput.value.trim();
        if (!questId || reflectionText.length < 50) { showMessage('Analysis incomplete. Provide at least 50 characters.', 'error', reflectionModal); return; } // Validation
        console.log(`[script.js] Submitting analysis for Directive ID: ${questId}`); const completedQuests = getLocalStorage('completedQuests', {});
        if (completedQuests[questId]) { completedQuests[questId].reflectionCompleted = true; completedQuests[questId].reflectionText = reflectionText; setLocalStorage('completedQuests', completedQuests); // Save completion
            console.log(`[script.js] Analysis for ${completedQuests[questId].title} finalized.`); showMessage('Analysis finalized. Core data integrated.', 'success');
            gainXP(REFLECTION_XP_BONUS, true); // Grant bonus XP
            closeReflectionModal(); checkForDueReflections(); loadNextQuest(); // Close modal and continue game flow
        } else { console.error(`[script.js] Could not find completed directive data for ID: ${questId}.`); showMessage('Error recording analysis.', 'error', reflectionModal); }
    };

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
     const gainXP = (amount, isBonus = false) => {
        if (amount <= 0) return; const stats = loadUserStats(); stats.xp += amount; console.log(`[script.js] Gained ${amount} XP. Total XP: ${stats.xp}`);
        if (isBonus) { showMessage(`Bonus XP Acquired: +${amount} XP!`, 'success'); } else { showMessage(`XP Acquired: +${amount} XP!`, 'info'); }
        let leveledUp = false; // Check for level ups based on thresholds
        while (stats.level < XP_THRESHOLDS.length && stats.xp >= XP_THRESHOLDS[stats.level]) { stats.level += 1; leveledUp = true; console.log(`[script.js] Level Up! Reached Level ${stats.level}`); }
        // --- Potential Boon Check Example ---
        // You could add class-specific XP modifications here, e.g.:
        // if (stats.chosenClass === 'Chronicler' && isBonus) { /* Add extra bonus XP */ }
        setLocalStorage('userStats', stats); // Save updated stats
        updateUserStatsDisplay(stats); // Refresh UI display
        if (leveledUp) { triggerLevelUpVisual(); } // Show level up animation if needed
    };
    // Triggers the level up visual effect
     const triggerLevelUpVisual = () => { if (!levelUpAlert) return; levelUpAlert.style.display = 'block'; console.log("[script.js] LEVEL UP VISUAL TRIGGERED"); setTimeout(() => { levelUpAlert.style.display = 'none'; }, 4000); }; // Hide after 4s

    // --- UI Utilities ---
    // Displays messages to the user (global for skill-drop.js)
    window.showMessage = (message, type = 'info', container = messageArea) => {
        if (!container) return; // Safety check
        // Hide level up alert if showing a normal message in the main area
        if (container === messageArea && levelUpAlert) { levelUpAlert.style.display = 'none'; }
        container.textContent = message; container.className = `message-box ${type}`; container.style.display = 'block';
        // Auto-hide non-error messages in the main area
        if (type !== 'error' && container === messageArea) { setTimeout(() => { if (container.textContent === message) { clearMessage(container); } }, 6000); }
        // Scroll message into view if it's in the main area
        if (container === messageArea) { container.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    };
    // Clears the message area
    const clearMessage = (container = messageArea) => { if (!container) return; container.textContent = ''; container.style.display = 'none'; container.className = 'message-box'; };
    // Hides the cooldown message
    const hideCooldownMessage = () => { if(cooldownMessage) cooldownMessage.style.display = 'none'; if (cooldownInterval) { clearInterval(cooldownInterval); cooldownInterval = null; } };
    // Hides the "no quests" message
    const hideNoQuestsMessage = () => { if(noQuestsMessage) noQuestsMessage.style.display = 'none'; };

    // --- Start the Application ---
    initializeGame(); // Start the game initialization process

    // Periodically check for reflections (every minute)
    setInterval(checkForDueReflections, 60 * 1000);

}); // End DOMContentLoaded
