// skill-drop.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const receiveSkillBtn = document.getElementById('receive-skill-btn');
    const skillVaultContainer = document.getElementById('skill-vault');
    const noSkillsMessage = document.getElementById('no-skills-message');
    const skillDropModal = document.getElementById('skill-drop-modal');
    const newSkillDisplay = document.getElementById('new-skill-display');
    const skillNameEl = document.getElementById('skill-name');
    const skillTypeEl = document.getElementById('skill-type');
    const skillRarityEl = document.getElementById('skill-rarity');
    const skillDescriptionEl = document.getElementById('skill-description');
    const skillEffectEl = document.getElementById('skill-effect');
    const skillDateEl = document.getElementById('skill-date');
    const closeSkillModalBtn = document.getElementById('close-skill-modal-btn');

    // --- Skill Data ---
    // Includes Name, Type, Description, Effect, Rarity
    const ALL_SKILLS = [
        { name: "Loopbreaker's Insight", type: "Passive", description: "Subtle awareness of recurring life patterns and karmic loops.", effect: "Grants +5% XP bonus on quests involving overcoming habits or cycles. Occasionally reveals hidden meanings in repetitive events.", rarity: "Rare" },
        { name: "Veilstep", type: "Active", description: "Temporarily shift perception to glimpse the energetic layer of reality.", effect: "For 5 minutes, signs, synchronicities, and energetic residues may become visible. Requires conscious focus.", cooldown: "24 hours", rarity: "Rare" },
        { name: "Sigilweaver", type: "Crafting", description: "Ability to imbue simple objects or drawings with focused intention.", effect: "Allows creation of temporary 'charged' items for focus or minor probability shifts. Requires materials and concentration.", rarity: "Epic" },
        { name: "Ego-Sever: Phase I", type: "Shadow Skill", description: "Painful but necessary process of identifying and weakening a core ego attachment.", effect: "Triggers intense self-reflection, potentially leading to emotional release or temporary stat debuff. Necessary for higher growth.", rarity: "Epic" },
        { name: "Phantom Memory Pulse", type: "Revelation", description: "Receive a fleeting, fragmented memory echo from a past life or alternate timeline.", effect: "Provides cryptic insight or a sense of déjà vu related to a current challenge. Disorienting.", rarity: "Mythic" },
        { name: "Anima Resonance", type: "Empathic", description: "Heightened sensitivity to the emotional states of living beings nearby.", effect: "Allows understanding unspoken feelings but risks emotional bleed-over. Can soothe or distress others.", rarity: "Rare" },
        { name: "Mantra Forge", type: "Creation", description: "Ability to vocalize resonant sounds that subtly influence the immediate environment.", effect: "Chanting specific tones can create temporary zones of calm, focus, or unease. Requires vocal practice.", rarity: "Epic" },
        { name: "Dreamcaster", type: "Sleep Ritual", description: "Increased likelihood of lucid dreaming and receiving guidance during sleep.", effect: "Perform a pre-sleep ritual to improve dream recall and potential for insightful dreams. Passive boost.", rarity: "Common" },
        { name: "Threshold Echo", type: "Resurrection Buff", description: "Upon failing a difficult task or facing a setback, gain a temporary surge of resilience.", effect: "Activates automatically once per week after failure, granting bonus XP on the *next* attempt or reducing cooldowns.", rarity: "Mythic" },
        { name: "Chrono-Sync: Pulsewave", type: "Legendary", description: "Experience a momentary, perfect alignment with the flow of time, perceiving immediate future probabilities.", effect: "Grants a single, high-probability insight into the outcome of a current action. Extremely rare activation.", rarity: "Legendary" }
    ];

    const STORAGE_KEY = 'unlockedSkills'; // Key for storing unlocked skills in localStorage

    // --- Local Storage Functions ---
    // Helper function to get data from localStorage
    const getLocalStorage = (key, defaultValue) => {
        const data = localStorage.getItem(key);
        try {
            // Parse the data if it exists, otherwise return the default value
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            // Return default value if parsing fails to prevent errors
            return defaultValue;
        }
    };

    // Helper function to save data to localStorage
    const setLocalStorage = (key, value) => {
        try {
            // Stringify the value before saving
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error setting localStorage key "${key}":`, e);
        }
    };

    // Retrieves the list of unlocked skill objects {name, dateReceived}
    const getUnlockedSkills = () => {
        return getLocalStorage(STORAGE_KEY, []);
    };

    // Saves the updated list of unlocked skill objects
    const saveUnlockedSkills = (skills) => {
        setLocalStorage(STORAGE_KEY, skills);
    };

    // --- Core Skill Logic ---
    // Make this function globally accessible so script.js can call it
    window.grantRandomSkill = () => {
        console.log("Attempting to grant a random skill...");
        const unlockedSkills = getUnlockedSkills();
        // Create a list of names of already unlocked skills for easy checking
        const unlockedSkillNames = unlockedSkills.map(s => s.name);

        // Filter the master list to find skills that haven't been unlocked yet
        const availableSkills = ALL_SKILLS.filter(skill => !unlockedSkillNames.includes(skill.name));

        // Check if there are any skills left to grant
        if (availableSkills.length === 0) {
            console.log("All skills have been unlocked!");
            // Notify the user via the main message area if the function exists
            if (typeof window.showMessage === 'function') {
                 window.showMessage("System Database Exhausted: All known skills acquired.", "info");
            }
            return null; // Indicate no skill was granted
        }

        // --- Random Selection ---
        // Simple RNG - selects a random index from the available skills
        // TODO: Could implement weighted RNG based on rarity later
        const randomIndex = Math.floor(Math.random() * availableSkills.length);
        const newSkillData = availableSkills[randomIndex]; // The full data object of the chosen skill

        // --- Record Keeping ---
        // Get the current date formatted nicely
        const dateReceived = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        // Create the entry to store in localStorage (only store name and date to save space)
        const newSkillEntry = {
            name: newSkillData.name,
            dateReceived: dateReceived
        };

        // Add the new skill entry to the user's list and save it
        unlockedSkills.push(newSkillEntry);
        saveUnlockedSkills(unlockedSkills);

        console.log(`Skill Granted: ${newSkillData.name}`);

        // --- Update UI ---
        // Display the modal showing the newly acquired skill
        displayNewSkillModal(newSkillData, dateReceived);

        // Update the Skill Vault section to include the new skill
        displaySkillVault();

        return newSkillData; // Return the granted skill data in case other functions need it
    };

    // --- UI Functions ---
    // Populates and displays the skill drop modal
    const displayNewSkillModal = (skillData, dateReceived) => {
        // Fill in the details in the modal elements
        skillNameEl.textContent = skillData.name;
        skillTypeEl.textContent = skillData.type;
        skillRarityEl.textContent = skillData.rarity;
        skillRarityEl.className = `rarity-label rarity-${skillData.rarity}`; // Apply rarity class for color
        skillDescriptionEl.textContent = skillData.description;
        skillEffectEl.textContent = skillData.effect || "N/A"; // Handle cases where effect might be missing
        skillDateEl.textContent = dateReceived;

        // Apply rarity styling to the modal card itself using data-attribute
        newSkillDisplay.className = 'skill-card'; // Reset classes first
        newSkillDisplay.dataset.rarity = skillData.rarity; // Set data-attribute for CSS styling

        // Show the modal
        skillDropModal.style.display = 'block';
        console.log(`Displaying skill modal for ${skillData.name}`);
    };

    // Hides the skill drop modal
    const closeSkillModal = () => {
        skillDropModal.style.display = 'none';
        console.log("Skill modal closed.");
    };

    // Renders all unlocked skills into the Skill Vault section
    const displaySkillVault = () => {
        console.log("Updating Skill Vault display...");
        const unlockedSkills = getUnlockedSkills(); // Get the list {name, dateReceived}
        skillVaultContainer.innerHTML = ''; // Clear previous vault entries

        if (unlockedSkills.length === 0) {
            // Show the "No skills" message if the vault is empty
            if(noSkillsMessage) noSkillsMessage.style.display = 'block';
        } else {
             if(noSkillsMessage) noSkillsMessage.style.display = 'none';
            // Iterate through each unlocked skill entry
            unlockedSkills.forEach(unlockedSkill => {
                // Find the full skill details from the master ALL_SKILLS list using the name
                const skillData = ALL_SKILLS.find(s => s.name === unlockedSkill.name);
                if (!skillData) {
                    // Skip if somehow the full data is missing (shouldn't happen ideally)
                    console.warn(`Could not find full data for unlocked skill: ${unlockedSkill.name}`);
                    return;
                }

                // Create a new div element for the skill card
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card'; // Assign base class
                skillCard.dataset.rarity = skillData.rarity; // Set data attribute for CSS styling based on rarity

                // Populate the card's HTML with skill details
                skillCard.innerHTML = `
                    <h3>${skillData.name}</h3>
                    <p><strong>Type:</strong> ${skillData.type}</p>
                    <p><strong>Rarity:</strong> <span class="rarity-label rarity-${skillData.rarity}">${skillData.rarity}</span></p>
                    <p><strong>Description:</strong> ${skillData.description}</p>
                    <p><strong>Effect:</strong> ${skillData.effect || 'N/A'}</p>
                    <small>Received on: ${unlockedSkill.dateReceived}</small>
                `;
                // Add the newly created card to the vault container
                skillVaultContainer.appendChild(skillCard);
            });
        }
         console.log(`Skill Vault updated. Displaying ${unlockedSkills.length} skills.`);
    };

    // --- Event Listeners ---
    // Listener for the manual trigger button
    if (receiveSkillBtn) {
        receiveSkillBtn.addEventListener('click', grantRandomSkill);
    } else {
        console.warn("Manual skill trigger button (#receive-skill-btn) not found.");
    }

    // Listener for the close button on the skill modal
    if (closeSkillModalBtn) {
        closeSkillModalBtn.addEventListener('click', closeSkillModal);
    } else {
         console.warn("Skill modal close button (#close-skill-modal-btn) not found.");
    }

    // Add listener to close the modal if the user clicks outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === skillDropModal) { // Check if the click target is the modal background itself
            closeSkillModal();
        }
    });


    // --- Initial Load ---
    // Display any previously unlocked skills when the page loads
    displaySkillVault();

}); // End DOMContentLoaded
