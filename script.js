// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const questViewer = document.getElementById('quest-viewer');
    const questContent = document.getElementById('quest-content');
    const questTitle = document.getElementById('quest-title');
    const questDescription = document.getElementById('quest-description');
    const questObjective = document.getElementById('quest-objective');
    const questProofType = document.getElementById('quest-proof-type');
    const questRewardDisplay = document.getElementById('quest-reward'); // Added
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

    // User Stats Elements (Updated)
    const playerLevelDisplay = document.getElementById('player-level');
    const playerXpDisplay = document.getElementById('player-xp');
    const xpToNextLevelDisplay = document.getElementById('xp-to-next-level');
    const xpBar = document.getElementById('xp-bar');
    const userStatsVerified = document.getElementById('verified-quests-count');
    // Removed fragments unlocked element reference

    const messageArea = document.getElementById('message-area');
    const levelUpAlert = document.getElementById('level-up-alert'); // Added

    // --- Constants ---
    const QUEST_COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const REFLECTION_DELAY = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    //const REFLECTION_DELAY = 30 * 1000; // 30 seconds for testing
    const TEXT_PROOF_MIN_LENGTH = 150;
    const EMOTIONAL_KEYWORDS = ["afraid", "grateful", "angry", "free", "release", "breakthrough", "realization", "clarity", "fear", "joy", "peace", "connected", "struggle", "overcome", "insight", "let go", "understand", "integrate", "process"]; // Added more keywords
    const REFLECTION_XP_BONUS = 50; // Bonus XP for completing reflection

    // XP Progression (Example: Needs more XP for higher levels)
    // Index corresponds to the level (e.g., XP_THRESHOLDS[1] is XP needed to reach level 2)
    // Represents the *total* XP needed to reach that level (starting from 0 XP at level 1)
    const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500]; // XP needed *to reach* this level index + 1

    // --- Game Data (Updated with XP Rewards) ---
    const ALL_QUESTS = [
        { id: "meditate01", title: "Still the Mind's Echo", description: "Find a quiet space. Focus solely on your breath for 15 uninterrupted minutes.", objective: "Achieve 15 minutes of focused meditation.", proofType: "text", keywords: ["peace", "calm", "focus", "breath", "quiet", "present", "mindful"], xpReward: 75 },
        { id: "sigil01", title: "Manifest Intent", description: "Design and draw a personal sigil representing a core intention for growth.", objective: "Create and photograph your sigil.", proofType: "image", keywords: ["intention", "desire", "symbol", "create", "focus", "manifest"], xpReward: 100 },
        { id: "fear01", title: "Confront the Shadow", description: "Identify one small fear. Take one concrete step today to face it.", objective: "Describe the fear and the action taken.", proofType: "text", keywords: ["fear", "afraid", "confront", "step", "action", "overcome", "challenge", "release", "brave"], xpReward: 120 },
        { id: "gratitude01", title: "Acknowledge Abundance", description: "Record three specific things you are genuinely grateful for today, explaining *why*.", objective: "Write a short gratitude journal entry.", proofType: "text", keywords: ["grateful", "thankful", "appreciate", "blessing", "joy", "abundance", "positive"], xpReward: 60 },
        { id: "nature01", title: "Connect to Gaia", description: "Spend 20 minutes outdoors, consciously observing the natural world.", objective: "Describe your sensory experience and any insights.", proofType: "text", keywords: ["nature", "observe", "connect", "earth", "listen", "feel", "grounded", "peace"], xpReward: 85 },
        // Add more quests with varying xpReward
    ];

    // --- State Variables ---
    let currentQuest = null; // Holds the data for the currently active quest
    let activeQuestStartTime = null; // Timestamp when 'Accept Directive' was clicked
    let witnessRequested = false; // Flag if witness request is pending
    let witnessVerified = false; // Flag if witness successfully verified
    let cooldownInterval = null; // Stores the interval ID for the cooldown timer display

    // --- Local Storage Functions ---
    // Make globally accessible for skill-drop.js to potentially use
    // Gets data from localStorage, parsing JSON, with a default value
    window.getLocalStorage = (key, defaultValue) => {
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return defaultValue; // Return default value if parsing fails
        }
    };

    // Saves data to localStorage after converting to JSON string
    window.setLocalStorage = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error setting localStorage key "${key}":`, e);
        }
    };

    // --- Initialization ---
    // Runs when the page content is fully loaded
    const initializeSystem = () => {
        console.log("Initializing System Interface...");
        loadUserStats(); // Load level, xp, etc.
        checkForDueReflections(); // Check if any reflections are pending
        loadNextQuest(); // Find and display the first available quest
        setupEventListeners(); // Attach listeners to buttons, forms, etc.
        console.log("System Online.");
    };

    // --- Event Listeners Setup ---
    // Attaches functions to UI element events
    const setupEventListeners = () => {
        if (beginQuestBtn) beginQuestBtn.addEventListener('click', handleBeginQuest);
        if (proofForm) proofForm.addEventListener('submit', handleProofSubmit);
        if (cancelQuestBtn) cancelQuestBtn.addEventListener('click', handleCancelQuest);
        if (requestWitnessBtn) requestWitnessBtn.addEventListener('click', handleRequestWitness);
        if (reflectionForm) reflectionForm.addEventListener('submit', handleReflectionSubmit);
        // Listener for reflection modal close button is inline HTML: onclick="closeReflectionModal()"
    };

    // --- Quest Management ---
    // Finds the next available quest that isn't completed or on cooldown
    const loadNextQuest = () => {
        console.log("Scanning for next available directive...");
        clearMessage(); // Clear any previous system messages
        hideProofSubmission(); // Hide the proof form
        hideCooldownMessage(); // Hide the cooldown timer display
        hideNoQuestsMessage(); // Hide the "no quests" message

        // Load saved data
        const completedQuests = getLocalStorage('completedQuests', {}); // { questId: { completionTime, reflectionDueTime, reflectionCompleted, title } }
        const questCooldowns = getLocalStorage('questCooldowns', {}); // { questId: cooldownEndTime }
        const now = Date.now(); // Current time

        // Filter the master quest list
        let availableQuests = ALL_QUESTS.filter(quest => {
            const isCompletedRecord = completedQuests[quest.id];
            const cooldownEndTime = questCooldowns[quest.id];
            const isOnCooldown = cooldownEndTime && now < cooldownEndTime;
            // A quest is fully completed only if its record exists AND reflectionCompleted is true
            const fullyCompleted = isCompletedRecord && isCompletedRecord.reflectionCompleted;

            // Quest is available if it's NOT fully completed AND NOT currently on cooldown
            return !fullyCompleted && !isOnCooldown;
        });

        console.log(`Found ${availableQuests.length} potential directives.`);

        if (availableQuests.length > 0) {
            // Simple selection: pick the first available one
            // TODO: Could add logic for difficulty or player level requirements here
            currentQuest = availableQuests[0];
            displayQuest(currentQuest); // Show the quest details
        } else {
            // No available quests, check if any are just on cooldown
            const activeCooldowns = Object.entries(questCooldowns).filter(([id, endTime]) => now < endTime);
            if (activeCooldowns.length > 0) {
                 // Find the soonest ending cooldown to display its timer
                const soonestCooldown = activeCooldowns.reduce((soonest, [id, endTime]) => {
                    return endTime < soonest.endTime ? { id, endTime } : soonest;
                }, { id: null, endTime: Infinity });
                displayCooldownMessage(soonestCooldown.endTime); // Show cooldown timer
            } else {
                 // No available quests and nothing on cooldown
                 displayNoQuestsMessage();
                 currentQuest = null;
            }
        }
    };

    // Updates the UI to show the details of the current quest
    const displayQuest = (quest) => {
        if (!quest) return; // Safety check
        questTitle.textContent = quest.title;
        questDescription.textContent = quest.description;
        questObjective.textContent = quest.objective;
        questProofType.textContent = quest.proofType.charAt(0).toUpperCase() + quest.proofType.slice(1);
        questRewardDisplay.textContent = quest.xpReward; // Display XP reward
        currentQuestIdInput.value = quest.id; // Set hidden input for form submission

        // Show/hide relevant UI parts
        questContent.style.display = 'block';
        beginQuestBtn.disabled = false;
        beginQuestBtn.textContent = 'Accept Directive';
        hideProofSubmission();
        hideCooldownMessage();
        hideNoQuestsMessage();
        console.log(`Displaying Directive: ${quest.title}`);
    };

    // Displays the cooldown message and starts the countdown timer
     const displayCooldownMessage = (cooldownEndTime) => {
        // Hide other sections
        questContent.style.display = 'none';
        proofSubmission.style.display = 'none';
        noQuestsMessage.style.display = 'none';
        cooldownMessage.style.display = 'block'; // Show the cooldown panel

        // Clear any previous timer interval
        if (cooldownInterval) {
            clearInterval(cooldownInterval);
        }

        // Function to update the timer display every second
        const updateTimer = () => {
            const now = Date.now();
            const timeLeft = cooldownEndTime - now; // Time remaining in milliseconds

            if (timeLeft <= 0) {
                // Cooldown finished
                cooldownTimerDisplay.textContent = "00:00:00";
                clearInterval(cooldownInterval); // Stop the timer
                cooldownInterval = null;
                console.log("Cooldown finished. Reloading directives.");
                loadNextQuest(); // Check for new quests immediately
            } else {
                // Calculate hours, minutes, seconds
                const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
                const seconds = Math.floor((timeLeft / 1000) % 60);
                // Format as HH:MM:SS
                cooldownTimerDisplay.textContent =
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        };
        updateTimer(); // Initial call to display immediately
        cooldownInterval = setInterval(updateTimer, 1000); // Set interval to update every second
        console.log(`System on cooldown. Next directive available after ${new Date(cooldownEndTime).toLocaleString()}`);
    };

    // Displays the message indicating no quests are available
     const displayNoQuestsMessage = () => {
        questContent.style.display = 'none';
        proofSubmission.style.display = 'none';
        cooldownMessage.style.display = 'none';
        noQuestsMessage.style.display = 'block';
        console.log("No available directives.");
    };

    // Handles the click on the "Accept Directive" button
    const handleBeginQuest = () => {
        if (!currentQuest) return; // Do nothing if no quest is loaded
        console.log(`Accepting Directive: ${currentQuest.title}`);
        activeQuestStartTime = Date.now(); // Record start time (optional use)
        beginQuestBtn.disabled = true; // Disable button while quest is active
        beginQuestBtn.textContent = 'Directive Active...';
        showProofSubmission(currentQuest.proofType); // Show the correct proof submission form
        clearMessage(); // Clear any previous messages
    };

    // Handles the click on the "Abort Directive" button
    const handleCancelQuest = () => {
        console.log(`Directive Aborted: ${currentQuest?.title}`);
        activeQuestStartTime = null;
        witnessRequested = false; // Reset witness state
        witnessVerified = false;
        hideProofSubmission(); // Hide the form
        // Re-enable the start button if a quest was active
        if(currentQuest) {
            beginQuestBtn.disabled = false;
            beginQuestBtn.textContent = 'Accept Directive';
        }
        showMessage('Directive sequence aborted by user.', 'info');
        // No penalty, just load the next available quest/cooldown state
        loadNextQuest();
    };

    // --- Proof Submission & Verification ---
    // Shows the relevant proof input fields based on quest type
    const showProofSubmission = (proofType) => {
        proofSubmission.style.display = 'block'; // Show the submission section
        // Hide all specific proof groups first
        textProofGroup.style.display = 'none';
        imageProofGroup.style.display = 'none';
        avProofGroup.style.display = 'none';
        // Reset witness section
        witnessVerificationSection.style.display = 'block';
        witnessStatus.style.display = 'none';
        witnessCodeInput.value = '';
        witnessRequested = false;
        witnessVerified = false;

        // Show the group matching the required proof type
        if (proofType === 'text') {
            textProofGroup.style.display = 'block';
            textProofInput.value = ''; // Clear previous input
        } else if (proofType === 'image') {
            imageProofGroup.style.display = 'block';
            imageProofInput.value = ''; // Clear file selection
        } else if (proofType === 'audio' || proofType === 'video') {
            avProofGroup.style.display = 'block';
            avProofInput.value = ''; // Clear previous input
        }
        // Scroll the submission section into view
        proofSubmission.scrollIntoView({ behavior: 'smooth' });
    };

    // Hides the entire proof submission section and clears inputs
    const hideProofSubmission = () => {
        proofSubmission.style.display = 'none';
        textProofInput.value = '';
        imageProofInput.value = '';
        avProofInput.value = '';
        witnessCodeInput.value = '';
        witnessStatus.style.display = 'none';
    };

    // Handles the submission of the proof form
    const handleProofSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (!currentQuest) return;
        console.log("Transmitting verification data...");
        submitProofBtn.disabled = true; // Disable button during verification
        submitProofBtn.textContent = 'Verifying...';

        // Gather proof data (handle file input appropriately)
        const proofData = {
            text: textProofInput.value,
            imageFile: imageProofInput.files.length > 0 ? imageProofInput.files[0] : null,
            avDescription: avProofInput.value
        };
        // Simulate the verification process
        const verificationResult = simulateVerification(currentQuest, proofData);

        // Simulate network/processing delay
        setTimeout(() => {
            if (verificationResult.verified) {
                // Quest passed verification
                handleQuestVerified(currentQuest, verificationResult.message);
            } else {
                // Quest failed verification
                handleQuestFailed(verificationResult.message, verificationResult.reason);
            }
             // Re-enable the submit button
             submitProofBtn.disabled = false;
             submitProofBtn.textContent = 'Transmit Data';
        }, 1500); // 1.5 second delay
    };

    // Simulates the AI/logic check for the submitted proof
    const simulateVerification = (quest, proofData) => {
        console.log(`Simulating verification for Directive ID: ${quest.id}, Type: ${quest.proofType}`);
        let verified = false;
        let message = "Verification data unclear. Analysis pending.";
        let reason = "Unknown discrepancy."; // Default failure reason

        // Apply bonus if witness verification was successful
        if (witnessVerified) {
             console.log("Peer confirmation received. Applying verification bonus.");
             verified = true;
             message = "Verification confirmed by peer node. Alignment achieved.";
             return { verified, message, reason: null }; // Pass immediately
        }

        // Verification logic based on proof type
        switch (quest.proofType) {
            case 'text':
                const text = proofData.text.trim();
                // Basic word count (can be improved)
                const wordCount = text.split(/\s+/).filter(Boolean).length;
                // Check if text includes any required emotional or quest-specific keywords (case-insensitive)
                const includesEmotionalKeyword = EMOTIONAL_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword));
                const includesQuestKeyword = quest.keywords.some(keyword => text.toLowerCase().includes(keyword));

                console.log(`Text Analysis: Length=${text.length}, Words=${wordCount}, EmotionalKeyword=${includesEmotionalKeyword}, QuestKeyword=${includesQuestKeyword}`);

                // Pass if long enough AND includes at least one relevant keyword
                if (text.length >= TEXT_PROOF_MIN_LENGTH && (includesEmotionalKeyword || includesQuestKeyword)) {
                    verified = true;
                    message = "Textual data confirmed. Required signatures detected. Verification complete.";
                } else if (text.length < TEXT_PROOF_MIN_LENGTH) {
                    reason = `Log entry insufficient (requires ${TEXT_PROOF_MIN_LENGTH} characters). Analysis requires more data.`;
                    message = "Insufficient data stream.";
                } else { // Long enough, but no keywords found
                     reason = "Required thematic/emotional signatures not detected in log entry. Refine input.";
                     message = "Data stream lacks required signatures.";
                }
                break;
            case 'image':
                // Simple check: Was a file selected? (Doesn't check content)
                if (proofData.imageFile) {
                    verified = true;
                    message = "Visual data pattern acknowledged. Verification complete.";
                } else {
                    reason = "No visual data stream detected. Upload required.";
                    message = "Visual input missing.";
                }
                break;
            case 'audio': // Fallthrough
            case 'video':
                 // Simulate based on description length
                 if (proofData.avDescription && proofData.avDescription.length > 20) { // Require a minimal description
                      verified = true;
                      message = "Auditory/Visual log acknowledged. Verification complete.";
                 } else {
                      reason = "Auditory/Visual log description insufficient or missing.";
                      message = "A/V stream description unclear.";
                 }
                break;
            default: // Should not happen if quest data is correct
                reason = "Unsupported data type encountered.";
                message = "System error: Unknown verification protocol.";
        }
        return { verified, message, reason }; // Return verification outcome
    };

    // Handles actions after a quest is successfully verified
    const handleQuestVerified = (quest, successMessage) => {
        console.log(`Directive Verified: ${quest.title}`);
        showMessage(successMessage, 'success'); // Show success message to user

        // --- Update Stats ---
        const stats = loadUserStats(); // Load current stats
        stats.verifiedQuests += 1; // Increment verified count
        // Note: XP gain and saving stats (including verifiedQuests) is handled by gainXP()

        // --- Record Completion & Schedule Reflection ---
        const completedQuests = getLocalStorage('completedQuests', {});
        const completionTime = Date.now();
        completedQuests[quest.id] = { // Store completion record
            completionTime: completionTime,
            reflectionDueTime: completionTime + REFLECTION_DELAY, // Set time for reflection prompt
            reflectionCompleted: false, // Mark reflection as not yet done
            title: quest.title // Store title for easy access later
        };
        setLocalStorage('completedQuests', completedQuests);

        // --- Set Cooldown ---
        const questCooldowns = getLocalStorage('questCooldowns', {});
        questCooldowns[quest.id] = Date.now() + QUEST_COOLDOWN_DURATION; // Set cooldown end time
        setLocalStorage('questCooldowns', questCooldowns);

        // --- Award XP & Level Up Check ---
        // This function handles adding XP, checking for level ups, saving stats, and updating the UI display
        gainXP(quest.xpReward);

        // --- Trigger Skill Drop ---
        // Check if the grantRandomSkill function from skill-drop.js exists
        if (typeof window.grantRandomSkill === 'function') {
            // Add a slight delay so the user sees the XP message first
            setTimeout(() => {
                window.grantRandomSkill(); // Call the function to potentially grant a skill
            }, 1000); // 1 second delay
        } else {
            // Log a warning if the function isn't found (e.g., skill-drop.js failed to load)
            console.warn("grantRandomSkill function not found. Ensure skill-drop.js is loaded correctly after script.js.");
        }

        // --- Reset State & Load Next ---
        currentQuest = null; // Clear the current quest
        activeQuestStartTime = null;
        witnessRequested = false;
        witnessVerified = false;
        hideProofSubmission(); // Hide the form
        // Load the next quest after a short delay to let user read messages/see skill drop
        setTimeout(loadNextQuest, 3000);
    };

    // Handles actions after a quest fails verification
    const handleQuestFailed = (failMessage, reason) => {
        console.warn(`Directive Failed: ${currentQuest?.title}. Reason: ${reason}`);
        // Provide more specific feedback based on the failure reason
        let supportiveMessage = "Discrepancy detected. Re-evaluate and resubmit data when ready.";
        if (reason.includes("insufficient") || reason.includes("brief")) {
            supportiveMessage = "Data packet too small. Elaborate further; provide comprehensive details.";
        } else if (reason.includes("signatures not detected")) {
            supportiveMessage = "Core signatures missing. Re-center intention and ensure alignment with directive objective.";
        } else if (reason.includes("missing")) {
             supportiveMessage = "Required data stream absent. Ensure correct format is provided.";
        }
        // Show combined failure message and hint
        showMessage(`${failMessage} ${supportiveMessage}`, 'error');
        // Re-enable the submit button to allow retry
        submitProofBtn.disabled = false;
        submitProofBtn.textContent = 'Transmit Data';
        // Keep the proof submission section open
    };

    // --- Witness Verification (Mocked) ---
    // Handles the click on the "Request Confirmation" button
    const handleRequestWitness = () => {
        const code = witnessCodeInput.value.trim(); // Get entered code
        // Prevent multiple requests or requests without a code
        if (!code || witnessRequested) {
            witnessStatus.textContent = witnessRequested ? "Confirmation request pending." : "Enter valid Peer Identifier.";
            witnessStatus.style.display = 'block';
            return;
        }
        console.log(`Requesting peer confirmation: ${code}`);
        witnessRequested = true; // Set flag
        requestWitnessBtn.disabled = true; // Disable button
        requestWitnessBtn.textContent = 'Requesting...';
        witnessStatus.textContent = `Pinging peer node [${code}]... Awaiting confirmation...`;
        witnessStatus.style.display = 'block'; // Show status

        // Simulate network delay and random response
        const delay = Math.random() * 5000 + 3000; // 3-8 seconds delay
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success chance (mocked)
            if (success) {
                console.log(`Peer [${code}] confirmed.`);
                witnessStatus.textContent = `Peer [${code}] Confirmed! Verification augmented.`;
                witnessVerified = true; // Set flag for successful verification
                showMessage('Peer confirmation received! Submit data with augmented verification.', 'info');
            } else {
                console.warn(`Peer [${code}] unresponsive or denied confirmation.`);
                witnessStatus.textContent = `Peer [${code}] unresponsive or unable to confirm. Proceeding standard verification.`;
                witnessVerified = false; // Ensure flag is false
            }
             // Re-enable button regardless of outcome
             requestWitnessBtn.disabled = false;
             requestWitnessBtn.textContent = 'Request Confirmation';
             witnessRequested = false; // Allow another request attempt
        }, delay);
    };

    // --- Reflection System ---
    // Periodically checks if any completed quests are due for reflection
    const checkForDueReflections = () => {
        // console.log("Checking for pending system inquiries..."); // Reduce console noise
        const completedQuests = getLocalStorage('completedQuests', {});
        const now = Date.now();
        let reflectionToShow = null;

        // Iterate through completed quests
        for (const questId in completedQuests) {
            const questData = completedQuests[questId];
            // Check if reflection isn't done AND the due time has passed
            if (!questData.reflectionCompleted && questData.reflectionDueTime && now >= questData.reflectionDueTime) {
                reflectionToShow = { id: questId, title: questData.title };
                break; // Only show one reflection prompt at a time
            }
        }
        // If a reflection is due, show the modal
        if (reflectionToShow) {
            console.log(`System inquiry pending for Directive: ${reflectionToShow.title}`);
            showReflectionModal(reflectionToShow.id, reflectionToShow.title);
        } else {
            // console.log("No pending inquiries."); // Reduce console noise
        }
    };

    // Displays the reflection modal with the correct quest title
    const showReflectionModal = (questId, questTitle) => {
        reflectionQuestIdInput.value = questId; // Set hidden input
        reflectionQuestTitle.textContent = `Regarding Directive: ${questTitle}`;
        reflectionTextInput.value = ''; // Clear textarea
        reflectionModal.style.display = 'block'; // Show modal
    };

    // Make globally accessible for button onclick in HTML
    window.closeReflectionModal = () => {
        reflectionModal.style.display = 'none';
        // Show info message if closed without submitting
        showMessage('Analysis postponed. System awaits input.', 'info');
    };

    // Handles the submission of the reflection form
    const handleReflectionSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        const questId = reflectionQuestIdInput.value;
        const reflectionText = reflectionTextInput.value.trim();

        // Basic validation
        if (!questId || reflectionText.length < 50) { // Require minimum length
            showMessage('Analysis incomplete. Provide at least 50 characters.', 'error', reflectionModal); // Show error inside modal
            return;
        }
        console.log(`Submitting analysis for Directive ID: ${questId}`);
        const completedQuests = getLocalStorage('completedQuests', {});
        // Update the quest record
        if (completedQuests[questId]) {
            completedQuests[questId].reflectionCompleted = true; // Mark as completed
            completedQuests[questId].reflectionText = reflectionText; // Store the reflection text
            setLocalStorage('completedQuests', completedQuests); // Save changes

            console.log(`Analysis for ${completedQuests[questId].title} finalized.`);
            showMessage('Analysis finalized. Core data integrated.', 'success');

            // Award bonus XP for reflection (also saves stats)
            gainXP(REFLECTION_XP_BONUS, true); // Pass true to indicate it's bonus XP

            closeReflectionModal(); // Close the modal
            checkForDueReflections(); // Check immediately if another is due
            loadNextQuest(); // Reload quests in case completion logic changes availability
        } else {
            // Should not happen if code is correct
            console.error(`Could not find completed directive data for ID: ${questId}.`);
            showMessage('Error recording analysis. Data mismatch.', 'error', reflectionModal);
        }
    };

    // --- User Stats & Leveling ---
    // Loads user stats (level, xp, verified count) from localStorage
    const loadUserStats = () => {
        const defaultStats = { level: 1, xp: 0, verifiedQuests: 0 };
        const stats = getLocalStorage('userStats', defaultStats);
        // Ensure all expected keys exist, applying defaults if missing
        stats.level = stats.level || defaultStats.level;
        stats.xp = stats.xp || defaultStats.xp;
        stats.verifiedQuests = stats.verifiedQuests || defaultStats.verifiedQuests;
        // Return the potentially modified stats object
        return stats;
    };

    // Updates the UI elements displaying user stats (Level, XP, XP Bar, Verified Quests)
    const updateUserStatsDisplay = (stats) => {
        if (!stats) {
            console.error("Attempted to update display with null stats.");
            stats = loadUserStats(); // Load fresh stats if null provided
        }
        // Update text content
        playerLevelDisplay.textContent = stats.level;
        playerXpDisplay.textContent = stats.xp;
        userStatsVerified.textContent = stats.verifiedQuests;

        // --- Calculate XP Bar ---
        const currentLevel = stats.level;
        // XP needed to reach the *start* of the current level (level 1 starts at 0)
        const currentLevelBaseXP = XP_THRESHOLDS[currentLevel - 1] !== undefined ? XP_THRESHOLDS[currentLevel - 1] : 0;
        // XP needed to reach the *start* of the next level
        const nextLevelThresholdXP = XP_THRESHOLDS[currentLevel] !== undefined ? XP_THRESHOLDS[currentLevel] : Infinity; // Use Infinity if max level

        let xpNeededForLevel = 0; // How much XP is needed to go from current base to next threshold
        let xpProgressInLevel = 0; // How much XP the player has earned *within* the current level range
        let xpPercentage = 0; // Percentage for the bar

        if (nextLevelThresholdXP === Infinity) { // Max level check
            xpToNextLevelDisplay.textContent = "MAX"; // Display MAX instead of a number
            xpPercentage = 100; // Fill the bar at max level
        } else {
            xpNeededForLevel = nextLevelThresholdXP - currentLevelBaseXP;
            xpProgressInLevel = stats.xp - currentLevelBaseXP;
            xpToNextLevelDisplay.textContent = nextLevelThresholdXP; // Show total XP needed for next level

            if (xpNeededForLevel > 0) {
                // Calculate percentage, ensuring it's between 0 and 100
                xpPercentage = Math.max(0, Math.min(100, (xpProgressInLevel / xpNeededForLevel) * 100));
            }
        }

        // Update the width of the XP bar fill element
        if(xpBar) xpBar.style.width = `${xpPercentage}%`;

        console.log(`Stats Updated: Level=${stats.level}, XP=${stats.xp}, Verified=${stats.verifiedQuests}, XP Bar=${xpPercentage.toFixed(1)}%`);
    };

    // Adds XP to the user's total and checks for level ups
    const gainXP = (amount, isBonus = false) => {
        if (amount <= 0) return; // Ignore zero or negative XP gain

        const stats = loadUserStats(); // Get current stats
        stats.xp += amount; // Add the earned XP
        console.log(`Gained ${amount} XP. Total XP: ${stats.xp}`);
        // Show appropriate message (bonus or regular)
        if (isBonus) {
             showMessage(`Bonus XP Acquired: +${amount} XP!`, 'success');
        } else {
             showMessage(`XP Acquired: +${amount} XP!`, 'info');
        }

        // --- Check for Level Up ---
        let leveledUp = false;
        // Keep leveling up as long as XP meets the threshold for the *next* level
        // XP_THRESHOLDS index corresponds to the level reached (index 1 = level 2 threshold)
        while (stats.level < XP_THRESHOLDS.length && stats.xp >= XP_THRESHOLDS[stats.level]) {
            stats.level += 1; // Increase level
            leveledUp = true;
            console.log(`Level Up! Reached Level ${stats.level}`);
            // Note: We keep cumulative XP, no reset per level in this model.
        }

        setLocalStorage('userStats', stats); // Save the updated stats (level and xp)
        updateUserStatsDisplay(stats); // Update the UI display

        // Trigger visual effect if a level up occurred
        if (leveledUp) {
            triggerLevelUpVisual();
        }
    };

    // Shows the "LEVEL UP!" visual alert
    const triggerLevelUpVisual = () => {
        if (!levelUpAlert) return; // Safety check
        levelUpAlert.style.display = 'block'; // Show the alert box
        console.log("LEVEL UP VISUAL TRIGGERED");
        // Hide the alert after a few seconds
        setTimeout(() => {
            levelUpAlert.style.display = 'none';
        }, 4000); // Display for 4 seconds
    };


    // --- UI Utilities ---
    // Make globally accessible for skill-drop.js to potentially use
    // Displays messages in the designated message area
    window.showMessage = (message, type = 'info', container = messageArea) => {
        if (!container) return; // Safety check if container doesn't exist

        // Hide level up alert if showing a normal message in the main area
        if (container === messageArea && levelUpAlert) {
            levelUpAlert.style.display = 'none';
        }

        // Set message text and apply style class
        // Prefix "[System Alert] " is handled by CSS ::before pseudo-element
        container.textContent = message;
        container.className = `message-box ${type}`; // Base class + type class
        container.style.display = 'block'; // Make visible

        // Auto-hide non-error messages in the main message area after a delay
        if (type !== 'error' && container === messageArea) {
            setTimeout(() => {
                 // Only hide if the message hasn't changed in the meantime
                 if (container.textContent === message) {
                    clearMessage(container);
                 }
            }, 6000); // Hide after 6 seconds
        }
         // Scroll the main message area into view
         if (container === messageArea) {
             container.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
    };

    // Clears the content and hides the specified message container
    const clearMessage = (container = messageArea) => {
        if (!container) return;
        container.textContent = '';
        container.style.display = 'none';
        container.className = 'message-box'; // Reset class
    };

    // Hides the cooldown message panel and clears the timer interval
     const hideCooldownMessage = () => {
        if(cooldownMessage) cooldownMessage.style.display = 'none';
        if (cooldownInterval) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
        }
    };

    // Hides the "no quests" message panel
     const hideNoQuestsMessage = () => {
        if(noQuestsMessage) noQuestsMessage.style.display = 'none';
    };

    // --- Start the Application ---
    initializeSystem(); // Set everything up
    // Ensure initial UI state reflects loaded stats
    updateUserStatsDisplay(loadUserStats());

    // Periodically check for reflections (every minute)
    // This is simple but less efficient than event-based checks
    setInterval(checkForDueReflections, 60 * 1000);

}); // End DOMContentLoaded
