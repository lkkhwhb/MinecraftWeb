import { Panorama } from "./ui/panorama.js";
import { updateGameVersionInfo } from "./utils/gameversioninfo.js";
import { RenderSplashText } from "./utils/chooseSplashtext.js";
import { toggleBgMusic } from "./utils/menuBackgroundMusic.js";
import { DebugScreen } from "./debug/screen.js";

const panorama = new Panorama();
const numMods = 0;

const loadingBar = document.getElementById("loadingBar");
const loadingScreen = document.getElementById("loadingScreen");

const loadingScreenBgMusic = new Audio("/custom_assets/loadingscreen.ogg");
loadingScreenBgMusic.loop = false;

async function startLoadingMusic() {
    try {
        loadingScreenBgMusic.muted = false;
        await loadingScreenBgMusic.play();
    } catch (err) {
        if (err.name === "NotAllowedError") {
            try {
                loadingScreenBgMusic.muted = true;
                await loadingScreenBgMusic.play();
            } catch (err2) {
                console.error(err2);
            }
        } else {
            console.error(err);
        }
    }
}

startLoadingMusic();

let progress = 0;

const interval = setInterval(() => {
    progress++;

    loadingBar.style.width = progress + "%";

    if (progress >= 100) {
        clearInterval(interval);

        loadingScreen.classList.add("fade");

        loadingScreenBgMusic.pause();
        loadingScreenBgMusic.currentTime = 0;

        setTimeout(() => {
            loadingScreen.remove();
        }, 400);
    }
}, 30);

toggleBgMusic();
document.getElementById("audioButton").addEventListener("click", toggleBgMusic);

panorama.start();
document.getElementById("quitGame").addEventListener("click", () => {
    window.location.reload();
});

// Singleplayer Screen Logic
const singleplayerButton = document.getElementById("singleplayerButton");
const singleplayerScreen = document.getElementById("singleplayerScreen");
const menu = document.getElementById("menu");
const backToMenuButton = document.getElementById("backToMenuButton");
const worldListContainer = document.getElementById("worldList");

const createWorldButton = document.getElementById("createWorldButton");
const deleteWorldButton = document.getElementById("deleteWorldButton");
const playWorldButton = document.getElementById("playWorldButton");
const editWorldButton = document.getElementById("editWorldButton");
const recreateWorldButton = document.getElementById("recreateWorldButton");

const createWorldScreen = document.getElementById("createWorldScreen");
const worldNameInput = document.getElementById("worldNameInput");
const confirmCreateWorldBtn = document.getElementById("confirmCreateWorldBtn");
const cancelCreateWorldBtn = document.getElementById("cancelCreateWorldBtn");

// Tab Panel references
const gameTab = document.getElementById("gameTab");
const worldTab = document.getElementById("worldTab");
const moreTab = document.getElementById("moreTab");

const gameTabPanel = document.getElementById("gameTabPanel");
const worldTabPanel = document.getElementById("worldTabPanel");
const moreTabPanel = document.getElementById("moreTabPanel");

// World Config Panel elements
const worldTypeBtn = document.getElementById("worldTypeBtn");
const worldSeedInput = document.getElementById("worldSeedInput");
const generateStructuresBtn = document.getElementById("generateStructuresBtn");
const bonusChestBtn = document.getElementById("bonusChestBtn");

const worldLoadingScreen = document.getElementById("worldLoadingScreen");
const worldLoadingBar = document.getElementById("worldLoadingBar");
const loadingTipText = document.getElementById("loadingTipText");

const tips = [
    "It's a good idea to build a place where you can safely spend the night.",
    "Don't dig straight down!",
    "Skeletons can shoot you from a distance.",
    "Wood is a very useful resource.",
    "Create torches to keep monsters from spawning.",
    "Use a pickaxe to mine coal and iron ore.",
    "Beds allow you to sleep through the night and set your spawn point.",
    "Always carry a bucket of water to save yourself from lava!",
    "Pigs turn into Zombie Piglins when struck by lightning."
];

let worlds = [];
let selectedWorldId = null;

function renderWorlds() {
    worldListContainer.innerHTML = "";
    worlds.forEach(world => {
        const item = document.createElement("div");
        item.className = "worldItem";
        if (world.id === selectedWorldId) {
            item.classList.add("selected");
        }

        item.innerHTML = `
            <img class="worldIcon" src="minecraft_assets/textures/gui/menu_background.png" alt="World">
            <div class="worldDetails">
                <div class="worldName">${world.name}</div>
                <div class="worldInfo">${world.name} (${world.date})<br>${world.mode} Mode, ${world.commands}, Version: 26.2</div>
            </div>
        `;

        item.addEventListener("click", () => {
            selectedWorldId = world.id;
            renderWorlds();
        });

        worldListContainer.appendChild(item);
    });
}

singleplayerButton.addEventListener("click", () => {
    menu.style.display = "none";
    singleplayerScreen.style.display = "flex";
    renderWorlds();
});

backToMenuButton.addEventListener("click", () => {
    singleplayerScreen.style.display = "none";
    menu.style.display = "flex";
});

const gameModeBtn = document.getElementById("gameModeBtn");
const difficultyBtn = document.getElementById("difficultyBtn");
const allowCommandsBtn = document.getElementById("allowCommandsBtn");

let gameModes = ["Survival", "Hardcore", "Creative"];
let difficulties = ["Normal", "Hard", "Peaceful", "Easy"];
let commandsAllowed = ["OFF", "ON"];
let worldTypes = ["Default", "Superflat", "Large Biomes", "Amplified"];

let currentGameModeIdx = 0;
let currentDifficultyIdx = 0;
let currentCommandsIdx = 0;
let currentWorldTypeIdx = 0;

let generateStructures = true;
let bonusChest = false;

// Tab Switching Action
function selectTab(selectedTab, selectedPanel) {
    [gameTab, worldTab, moreTab].forEach(tab => tab.classList.remove("selected"));
    [gameTabPanel, worldTabPanel, moreTabPanel].forEach(panel => panel.style.display = "none");
    
    selectedTab.classList.add("selected");
    selectedPanel.style.display = "flex";
}

gameTab.addEventListener("click", () => selectTab(gameTab, gameTabPanel));
worldTab.addEventListener("click", () => selectTab(worldTab, worldTabPanel));
moreTab.addEventListener("click", () => selectTab(moreTab, moreTabPanel));

// World Tab Config toggles
worldTypeBtn.addEventListener("click", () => {
    currentWorldTypeIdx = (currentWorldTypeIdx + 1) % worldTypes.length;
    worldTypeBtn.innerHTML = `World Type: <span class="text-white">${worldTypes[currentWorldTypeIdx]}</span>`;
});

generateStructuresBtn.addEventListener("click", () => {
    generateStructures = !generateStructures;
    generateStructuresBtn.innerHTML = generateStructures ? '<span class="text-green">ON</span>' : '<span class="text-red">OFF</span>';
});

bonusChestBtn.addEventListener("click", () => {
    bonusChest = !bonusChest;
    bonusChestBtn.innerHTML = bonusChest ? '<span class="text-green">ON</span>' : '<span class="text-red">OFF</span>';
});

function updateCreateWorldButtons() {
    gameModeBtn.innerHTML = `Game Mode: <span class="text-white">${gameModes[currentGameModeIdx]}</span>`;
    
    // Difficulty is not applicable for Hardcore
    if (gameModes[currentGameModeIdx] === "Hardcore") {
        difficultyBtn.innerHTML = `Difficulty: <span class="text-red">Hard</span>`;
        difficultyBtn.classList.add("button-disabled");
    } else {
        difficultyBtn.classList.remove("button-disabled");
        let diffColor = "text-yellow";
        if (difficulties[currentDifficultyIdx] === "Hard") diffColor = "text-red";
        if (difficulties[currentDifficultyIdx] === "Peaceful") diffColor = "text-green";
        if (difficulties[currentDifficultyIdx] === "Easy") diffColor = "text-aqua";
        difficultyBtn.innerHTML = `Difficulty: <span class="${diffColor}">${difficulties[currentDifficultyIdx]}</span>`;
    }

    let cmdColor = commandsAllowed[currentCommandsIdx] === "ON" ? "text-green" : "text-red";
    allowCommandsBtn.innerHTML = `Allow Commands: <span class="${cmdColor}">${commandsAllowed[currentCommandsIdx]}</span>`;
}

gameModeBtn.addEventListener("click", () => {
    currentGameModeIdx = (currentGameModeIdx + 1) % gameModes.length;
    updateCreateWorldButtons();
});

difficultyBtn.addEventListener("click", () => {
    if (gameModes[currentGameModeIdx] === "Hardcore") return; // Locked on Hard
    currentDifficultyIdx = (currentDifficultyIdx + 1) % difficulties.length;
    updateCreateWorldButtons();
});

allowCommandsBtn.addEventListener("click", () => {
    currentCommandsIdx = (currentCommandsIdx + 1) % commandsAllowed.length;
    updateCreateWorldButtons();
});

createWorldButton.addEventListener("click", () => {
    singleplayerScreen.style.display = "none";
    createWorldScreen.style.display = "flex";
    
    // Reset tabs
    selectTab(gameTab, gameTabPanel);
    
    // Reset Game Options
    worldNameInput.value = "New World";
    currentGameModeIdx = 0; // Default Survival
    currentDifficultyIdx = 0; // Default Normal
    currentCommandsIdx = 0; // Default OFF
    updateCreateWorldButtons();

    // Reset World Options
    worldSeedInput.value = "";
    currentWorldTypeIdx = 0;
    generateStructures = true;
    bonusChest = false;
    worldTypeBtn.innerHTML = `World Type: <span class="text-white">Default</span>`;
    generateStructuresBtn.innerHTML = `<span class="text-green">ON</span>`;
    bonusChestBtn.innerHTML = `<span class="text-red">OFF</span>`;

    worldNameInput.focus();
});

cancelCreateWorldBtn.addEventListener("click", () => {
    createWorldScreen.style.display = "none";
    singleplayerScreen.style.display = "flex";
});

confirmCreateWorldBtn.addEventListener("click", () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ", " + now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}).toLowerCase();
    
    let wName = worldNameInput.value.trim();
    if (!wName) {
        wName = "New World";
    }

    let mode = gameModes[currentGameModeIdx];
    let diff = mode === "Hardcore" ? "Hard" : difficulties[currentDifficultyIdx];
    let cmds = commandsAllowed[currentCommandsIdx] === "ON" ? "Commands" : "No Cheats";
    let seedValue = worldSeedInput.value.trim() || "Random Seed";

    const newWorld = {
        id: Date.now(),
        name: wName,
        date: dateStr,
        mode: mode,
        difficulty: diff,
        commands: cmds,
        worldType: worldTypes[currentWorldTypeIdx],
        seed: seedValue,
        generateStructures: generateStructures,
        bonusChest: bonusChest
    };

    // Hide create world screen
    createWorldScreen.style.display = "none";
    
    // Set a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    loadingTipText.innerText = randomTip;
    
    // Reset and show loading screen
    worldLoadingBar.style.width = "0%";
    worldLoadingScreen.style.display = "flex";

    let activeSegments = 0;
    const totalSegments = 26; // Exactly 26 segments (blocks)
    
    const loadingInterval = setInterval(() => {
        // Increment by exactly 1 block at a time to load slower
        activeSegments += 1;
        if (activeSegments > totalSegments) {
            activeSegments = totalSegments;
        }
        
        let loadingProgress = (activeSegments / totalSegments) * 100;
        worldLoadingBar.style.width = loadingProgress + "%";
        
        if (activeSegments >= totalSegments) {
            clearInterval(loadingInterval);
            
            // Wait briefly before closing loading screen
            setTimeout(() => {
                // Add the new world to the list
                worlds.unshift(newWorld);
                selectedWorldId = newWorld.id;
                renderWorlds();
                
                // Hide loading screen, show singleplayer list
                worldLoadingScreen.style.display = "none";
                singleplayerScreen.style.display = "flex";
            }, 500);
        }
    }, 200); // 200ms delay per block
});

deleteWorldButton.addEventListener("click", () => {
    if (selectedWorldId !== null) {
        worlds = worlds.filter(w => w.id !== selectedWorldId);
        selectedWorldId = worlds.length > 0 ? worlds[0].id : null;
        renderWorlds();
    }
});

playWorldButton.addEventListener("click", () => {
    if (selectedWorldId !== null) {
        alert("Loading world...");
    }
});

editWorldButton.addEventListener("click", () => {
    if (selectedWorldId !== null) {
        alert("Edit world feature coming soon!");
    }
});

recreateWorldButton.addEventListener("click", () => {
    if (selectedWorldId !== null) {
        alert("Re-create world feature coming soon!");
    }
});

// Global States for Game Rules, Experiments, Data Packs
let gameRulesGlobal = {
    allowCheats: false,
    keepInventory: false,
    daylightCycle: true,
    mobSpawning: true,
    spawnRadius: 10,
    tickSpeed: 3
};

let experimentsGlobal = {
    update121: false,
    tradeRebalance: false,
    minecart: false
};

let dataPacksGlobal = {
    defaultPack: false,
    vanillaPack: true
};

// Temp states for overlays
let gameRulesState = { ...gameRulesGlobal };
let experimentsState = { ...experimentsGlobal };
let dataPacksState = { ...dataPacksGlobal };

// Screen references
const gameRulesScreen = document.getElementById("gameRulesScreen");
const experimentsScreen = document.getElementById("experimentsScreen");
const dataPacksScreen = document.getElementById("dataPacksScreen");

// More Tab Buttons
const gameRulesBtn = document.getElementById("gameRulesBtn");
const experimentsBtn = document.getElementById("experimentsBtn");
const dataPacksBtn = document.getElementById("dataPacksBtn");

// Sub-screen elements
const ruleAllowCheatsBtn = document.getElementById("ruleAllowCheatsBtn");
const ruleKeepInventoryBtn = document.getElementById("ruleKeepInventoryBtn");
const ruleDaylightCycleBtn = document.getElementById("ruleDaylightCycleBtn");
const ruleMobSpawningBtn = document.getElementById("ruleMobSpawningBtn");
const ruleSpawnRadiusInput = document.getElementById("ruleSpawnRadiusInput");
const ruleTickSpeedInput = document.getElementById("ruleTickSpeedInput");

const expUpdate121Btn = document.getElementById("expUpdate121Btn");
const expTradeRebalanceBtn = document.getElementById("expTradeRebalanceBtn");
const expMinecartBtn = document.getElementById("expMinecartBtn");

const packDefault = document.getElementById("packDefault");
const packVanilla = document.getElementById("packVanilla");

// Done/Cancel buttons
const gameRulesDoneBtn = document.getElementById("gameRulesDoneBtn");
const gameRulesCancelBtn = document.getElementById("gameRulesCancelBtn");
const experimentsDoneBtn = document.getElementById("experimentsDoneBtn");
const experimentsCancelBtn = document.getElementById("experimentsCancelBtn");
const dataPacksDoneBtn = document.getElementById("dataPacksDoneBtn");
const dataPacksCancelBtn = document.getElementById("dataPacksCancelBtn");

// Helper to set ON/OFF text
function setButtonToggleText(btn, state) {
    btn.innerHTML = state ? '<span class="text-green">ON</span>' : '<span class="text-red">OFF</span>';
}

// Game Rules Listeners
gameRulesBtn.addEventListener("click", () => {
    gameRulesState = { ...gameRulesGlobal };
    setButtonToggleText(ruleAllowCheatsBtn, gameRulesState.allowCheats);
    setButtonToggleText(ruleKeepInventoryBtn, gameRulesState.keepInventory);
    setButtonToggleText(ruleDaylightCycleBtn, gameRulesState.daylightCycle);
    setButtonToggleText(ruleMobSpawningBtn, gameRulesState.mobSpawning);
    ruleSpawnRadiusInput.value = gameRulesState.spawnRadius;
    ruleTickSpeedInput.value = gameRulesState.tickSpeed;
    
    gameRulesScreen.style.display = "flex";
});

ruleAllowCheatsBtn.addEventListener("click", () => {
    gameRulesState.allowCheats = !gameRulesState.allowCheats;
    setButtonToggleText(ruleAllowCheatsBtn, gameRulesState.allowCheats);
});

ruleKeepInventoryBtn.addEventListener("click", () => {
    gameRulesState.keepInventory = !gameRulesState.keepInventory;
    setButtonToggleText(ruleKeepInventoryBtn, gameRulesState.keepInventory);
});

ruleDaylightCycleBtn.addEventListener("click", () => {
    gameRulesState.daylightCycle = !gameRulesState.daylightCycle;
    setButtonToggleText(ruleDaylightCycleBtn, gameRulesState.daylightCycle);
});

ruleMobSpawningBtn.addEventListener("click", () => {
    gameRulesState.mobSpawning = !gameRulesState.mobSpawning;
    setButtonToggleText(ruleMobSpawningBtn, gameRulesState.mobSpawning);
});

gameRulesDoneBtn.addEventListener("click", () => {
    gameRulesGlobal = {
        allowCheats: gameRulesState.allowCheats,
        keepInventory: gameRulesState.keepInventory,
        daylightCycle: gameRulesState.daylightCycle,
        mobSpawning: gameRulesState.mobSpawning,
        spawnRadius: parseInt(ruleSpawnRadiusInput.value) || 10,
        tickSpeed: parseInt(ruleTickSpeedInput.value) || 3
    };
    gameRulesScreen.style.display = "none";
});

gameRulesCancelBtn.addEventListener("click", () => {
    gameRulesScreen.style.display = "none";
});

// Experiments Listeners
experimentsBtn.addEventListener("click", () => {
    experimentsState = { ...experimentsGlobal };
    setButtonToggleText(expUpdate121Btn, experimentsState.update121);
    setButtonToggleText(expTradeRebalanceBtn, experimentsState.tradeRebalance);
    setButtonToggleText(expMinecartBtn, experimentsState.minecart);
    
    experimentsScreen.style.display = "flex";
});

expUpdate121Btn.addEventListener("click", () => {
    experimentsState.update121 = !experimentsState.update121;
    setButtonToggleText(expUpdate121Btn, experimentsState.update121);
});

expTradeRebalanceBtn.addEventListener("click", () => {
    experimentsState.tradeRebalance = !experimentsState.tradeRebalance;
    setButtonToggleText(expTradeRebalanceBtn, experimentsState.tradeRebalance);
});

expMinecartBtn.addEventListener("click", () => {
    experimentsState.minecart = !experimentsState.minecart;
    setButtonToggleText(expMinecartBtn, experimentsState.minecart);
});

experimentsDoneBtn.addEventListener("click", () => {
    experimentsGlobal = { ...experimentsState };
    experimentsScreen.style.display = "none";
});

experimentsCancelBtn.addEventListener("click", () => {
    experimentsScreen.style.display = "none";
});

// Data Packs Listeners
dataPacksBtn.addEventListener("click", () => {
    dataPacksState = { ...dataPacksGlobal };
    packDefault.classList.toggle("activePack", dataPacksState.defaultPack);
    packVanilla.classList.toggle("activePack", dataPacksState.vanillaPack);
    
    dataPacksScreen.style.display = "flex";
});

packDefault.addEventListener("click", () => {
    dataPacksState.defaultPack = !dataPacksState.defaultPack;
    packDefault.classList.toggle("activePack", dataPacksState.defaultPack);
});

packVanilla.addEventListener("click", () => {
    dataPacksState.vanillaPack = !dataPacksState.vanillaPack;
    packVanilla.classList.toggle("activePack", dataPacksState.vanillaPack);
});

dataPacksDoneBtn.addEventListener("click", () => {
    dataPacksGlobal = { ...dataPacksState };
    dataPacksScreen.style.display = "none";
});

dataPacksCancelBtn.addEventListener("click", () => {
    dataPacksScreen.style.display = "none";
});

new DebugScreen();

updateGameVersionInfo(numMods);

RenderSplashText();
setInterval(RenderSplashText, 10000);