/* =====================================================
   THE LOST KINGDOM
   STEP 12 - FINAL EDITION
   ===================================================== */


/* ================= PLAYER ================= */

let maxHealth = 100;
let health = 100;

let gold = 0;

let inventory = [];


/* ================= GAME STATE ================= */

let currentLocation = "Village";

let goblinDefeated = false;
let darkKnightDefeated = false;
let bossDefeated = false;

let castleUnlocked = false;


/* ================= QUESTS ================= */

let questStarted = false;
let questCompleted = false;

let caveQuestCompleted = false;

let healerUsed = false;
let blacksmithTalked = false;


/* ================= COMBAT ================= */

let inCombat = false;

let enemyName = "";
let enemyHealth = 0;
let enemyMaxHealth = 0;
let enemyAttackPower = 0;

let defending = false;


/* ================= SOUND ================= */

let audioContext = null;
let soundEnabled = true;

let musicTimer = null;
let musicStep = 0;

const musicNotes = [
    261.63,
    329.63,
    392.00,
    329.63,
    293.66,
    349.23,
    440.00,
    349.23
];


/* =====================================================
   SCREEN
   ===================================================== */

function showScreen(id) {

    document.querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });

    document.getElementById(id)
        .classList.add("active");
}


/* =====================================================
   NEW GAME
   ===================================================== */

function startNewGame() {

    health = 100;
    gold = 0;

    inventory = [];

    currentLocation = "Village";

    goblinDefeated = false;
    darkKnightDefeated = false;
    bossDefeated = false;

    castleUnlocked = false;

    questStarted = false;
    questCompleted = false;

    caveQuestCompleted = false;

    healerUsed = false;
    blacksmithTalked = false;

    inCombat = false;

    document.getElementById("endingSection")
        .classList.add("hidden");

    showScreen("storyScreen");

    initAudio();
    startMusic();
}


/* =====================================================
   ENTER KINGDOM
   ===================================================== */

function enterKingdom() {

    showScreen("gameScreen");

    updateAll();

    showVillage();

    playSound("start");
}


/* =====================================================
   CONTINUE
   ===================================================== */

function continueGame() {

    if (!localStorage.getItem("lostKingdomSave")) {

        alert("No saved game found.");

        return;
    }

    showScreen("gameScreen");

    if (loadGame()) {

        initAudio();
        startMusic();

        restoreLocation();
    }
}


/* =====================================================
   MENU
   ===================================================== */

function backToMenu() {

    stopMusic();

    showScreen("mainMenu");
}


function showHelp() {

    showScreen("helpScreen");
}


/* =====================================================
   LOCATION IMAGE
   ===================================================== */

function changeLocationImage(
    image,
    title,
    description
) {

    document.getElementById("locationImage")
        .src = image;

    document.getElementById("locationTitle")
        .textContent = title;

    document.getElementById("locationDescription")
        .textContent = description;

    document.getElementById("locationName")
        .textContent = title;
}


/* =====================================================
   CHARACTER
   ===================================================== */

function showCharacter(
    name,
    image,
    dialogue
) {

    const characterImage =
        document.getElementById("characterImage");

    characterImage.style.opacity = "0";

    setTimeout(() => {

        characterImage.src = image;

        characterImage.alt = name;

        characterImage.style.opacity = "1";

    }, 100);


    document.getElementById("characterName")
        .textContent = name;

    document.getElementById("dialogueText")
        .textContent = dialogue;
}


/* =====================================================
   VILLAGE
   ===================================================== */

function showVillage() {

    currentLocation = "Village";

    changeLocationImage(
        "assets/Village.jpg",
        "The Village",
        "A peaceful village surrounded by mountains. The people are waiting for a hero."
    );


    showCharacter(
        "Elder",
        "assets/elder.png",
        "Welcome, brave traveler. Our kingdom desperately needs your help."
    );


    setChoices([

        ["👴 Talk to Elder", talkToElder],

        ["🧭 Talk to Traveler", talkToTraveler],

        ["🔨 Talk to Blacksmith", talkToBlacksmith],

        ["🧪 Visit Healer", talkToHealer]

    ]);


    updateAll();
}


/* =====================================================
   ELDER
   ===================================================== */

function talkToElder() {

    if (!questStarted) {

        questStarted = true;

        showCharacter(
            "Elder",
            "assets/elder.png",
            "Monsters have appeared in the forest. Defeat the Goblin and return to me."
        );

        updateQuest();

        playSound("quest");

        return;
    }


    if (goblinDefeated && !questCompleted) {

        questCompleted = true;

        gold += 50;

        addItem("🏅 Hero Medal");

        showCharacter(
            "Elder",
            "assets/elder.png",
            "You defeated the Goblin! You have earned the trust of our village."
        );

        updateAll();

        return;
    }


    showCharacter(
        "Elder",
        "assets/elder.png",
        questCompleted
            ? "You have proven yourself a true hero. The castle awaits you."
            : "Please defeat the Goblin in the forest and return to me."
    );
}


/* =====================================================
   TRAVELER
   ===================================================== */

function talkToTraveler() {

    showCharacter(
        "Traveler",
        "assets/traveler.png",
        "I have traveled far across these lands. The Shadow King controls the castle. Be careful."
    );
}


/* =====================================================
   BLACKSMITH
   ===================================================== */

function talkToBlacksmith() {

    blacksmithTalked = true;

    showCharacter(
        "Blacksmith",
        "assets/blacksmith.png",
        "A strong weapon can save your life. Defeat the Dark Knight and claim his sword."
    );

    updateAll();
}


/* =====================================================
   HEALER
   ===================================================== */

function talkToHealer() {

    if (!healerUsed) {

        health = maxHealth;

        healerUsed = true;

        showCharacter(
            "Healer",
            "assets/healer.png",
            "Your wounds are healed. Go forth with courage."
        );

        updateAll();

    } else {

        showCharacter(
            "Healer",
            "assets/healer.png",
            "I have already healed you. Take care on your journey."
        );
    }
}


/* =====================================================
   FOREST
   ===================================================== */

function showForest() {

    currentLocation = "Forest";

    changeLocationImage(
        "assets/Forest.jpg",
        "The Enchanted Forest",
        "An ancient forest filled with strange sounds. Somewhere nearby, a Goblin is waiting."
    );


    if (!goblinDefeated) {

        showCharacter(
            "Goblin",
            "assets/goblin.png",
            "Grrr! You should not have entered my forest!"
        );

        setChoices([

            ["⚔️ Fight Goblin", startGoblinBattle],

            ["🏘️ Return to Village", showVillage]

        ]);

    } else {

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The forest is quiet now. The Goblin threat has been defeated."
        );

        setChoices([

            ["🏘️ Return to Village", showVillage],

            ["🕳️ Explore Cave", showCave],

            ["🏰 Go to Castle", showCastle]

        ]);
    }


    updateAll();
}


/* =====================================================
   CAVE
   ===================================================== */

function showCave() {

    currentLocation = "Cave";

    changeLocationImage(
        "assets/Cave.jpg",
        "The Forgotten Cave",
        "A dark cave hides ancient treasures and secrets."
    );


    if (!caveQuestCompleted) {

        addItem("🔥 Torch");

        addItem("🧪 Health Potion");

        gold += 20;

        caveQuestCompleted = true;

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "I found a torch, a health potion and some gold inside the cave."
        );

    } else {

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The cave is empty now. I have already collected everything useful."
        );
    }


    setChoices([

        ["🏘️ Return to Village", showVillage],

        ["🌲 Return to Forest", showForest],

        ["🏰 Go to Castle", showCastle]

    ]);


    updateAll();
}


/* =====================================================
   CASTLE
   ===================================================== */

function showCastle() {

    currentLocation = "Castle";

    changeLocationImage(
        "assets/castle.jpg",
        "The Shadow Castle",
        "A dark fortress rises above the kingdom. Evil power surrounds it."
    );


    if (!goblinDefeated) {

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The castle gate is sealed. I need to prove myself first."
        );

        setChoices([
            ["🌲 Go to Forest", showForest]
        ]);

        updateAll();

        return;
    }


    if (!darkKnightDefeated) {

        showCharacter(
            "Dark Knight",
            "assets/dark-knight.png",
            "None shall pass through these halls!"
        );

        setChoices([

            ["⚔️ Fight Dark Knight", startDarkKnightBattle],

            ["🌲 Return to Forest", showForest]

        ]);

        updateAll();

        return;
    }


    if (!bossDefeated) {

        showCharacter(
            "Shadow King",
            "assets/shadow-king.png",
            "You have come far, hero. Now face your final challenge."
        );

        setChoices([

            ["👑 Enter Shadow Chamber", startBossBattle],

            ["🌲 Return to Forest", showForest]

        ]);

        updateAll();

        return;
    }


    showCharacter(
        "Hero",
        "assets/Hero.png",
        "The Shadow King has fallen. The Ancient Crystal remains."
    );

    showEnding();

    updateAll();
}


/* =====================================================
   CHOICES
   ===================================================== */

function setChoices(choices) {

    const choicesDiv =
        document.getElementById("choices");

    choicesDiv.innerHTML = "";

    choices.forEach(choice => {

        const button =
            document.createElement("button");

        button.textContent = choice[0];

        button.onclick = choice[1];

        choicesDiv.appendChild(button);
    });
}


/* =====================================================
   BATTLES
   ===================================================== */

function startGoblinBattle() {

    startBattle(
        "Goblin",
        60,
        15,
        "assets/goblin.png"
    );
}


function startDarkKnightBattle() {

    startBattle(
        "Dark Knight",
        100,
        20,
        "assets/dark-knight.png"
    );
}


function startBossBattle() {

    startBattle(
        "Shadow King",
        150,
        25,
        "assets/shadow-king.png"
    );
}


/* =====================================================
   START BATTLE
   ===================================================== */

function startBattle(
    name,
    maxHP,
    attackPower,
    image
) {

    inCombat = true;

    enemyName = name;

    enemyMaxHealth = maxHP;

    enemyHealth = maxHP;

    enemyAttackPower = attackPower;

    defending = false;


    document.getElementById("enemyName")
        .textContent = enemyName;

    document.getElementById("enemyBattleImage")
        .src = image;


    document.getElementById("combatSection")
        .classList.remove("hidden");


    document.getElementById("combatLog")
        .textContent =
        `${enemyName} stands before you. Choose your move.`;


    updateCombat();

    document.getElementById("combatSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =====================================================
   ATTACK
   ===================================================== */

function playerAttack() {

    if (!inCombat) return;

    const damage = 20;

    enemyHealth -= damage;

    if (enemyHealth < 0) {
        enemyHealth = 0;
    }


    document.getElementById("combatLog")
        .textContent =
        `You dealt ${damage} damage to the ${enemyName}.`;


    playSound("attack");


    if (enemyHealth <= 0) {

        winBattle();

        return;
    }


    enemyTurn();
}


/* =====================================================
   DEFEND
   ===================================================== */

function playerDefend() {

    if (!inCombat) return;

    defending = true;

    document.getElementById("combatLog")
        .textContent =
        "You raise your shield and prepare to defend.";

    playSound("defend");

    enemyTurn();
}


/* =====================================================
   ENEMY TURN
   ===================================================== */

function enemyTurn() {

    let damage = enemyAttackPower;


    if (defending) {

        damage = Math.floor(damage / 2);

        defending = false;
    }


    health -= damage;


    if (health < 0) {
        health = 0;
    }


    document.getElementById("combatLog")
        .textContent +=
        ` The ${enemyName} dealt ${damage} damage.`;


    updateAll();


    if (health <= 0) {

        gameOver();

        return;
    }


    updateCombat();
}


/* =====================================================
   POTION
   ===================================================== */

function usePotion() {

    if (!inCombat) return;


    const potionIndex =
        inventory.indexOf("🧪 Health Potion");


    if (potionIndex === -1) {

        document.getElementById("combatLog")
            .textContent =
            "You don't have a Health Potion.";

        return;
    }


    if (health >= maxHealth) {

        document.getElementById("combatLog")
            .textContent =
            "Your health is already full.";

        return;
    }


    inventory.splice(potionIndex, 1);

    health += 30;


    if (health > maxHealth) {
        health = maxHealth;
    }


    document.getElementById("combatLog")
        .textContent =
        "You used a Health Potion and restored 30 HP.";


    playSound("heal");

    updateAll();

    enemyTurn();
}


/* =====================================================
   RUN
   ===================================================== */

function runFromBattle() {

    if (!inCombat) return;

    inCombat = false;

    document.getElementById("combatSection")
        .classList.add("hidden");


    if (enemyName === "Goblin") {

        showForest();

    } else {

        showCastle();
    }
}


/* =====================================================
   WIN
   ===================================================== */

function winBattle() {

    inCombat = false;

    document.getElementById("combatSection")
        .classList.add("hidden");


    if (enemyName === "Goblin") {

        goblinDefeated = true;

        castleUnlocked = true;

        addItem("🗝️ Ancient Key");

        gold += 10;

        unlockAchievement("🗡️ Goblin Hunter");

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The Goblin has been defeated! I found an Ancient Key."
        );


        setChoices([

            ["🏘️ Return to Village", showVillage],

            ["🕳️ Explore Cave", showCave],

            ["🏰 Go to Castle", showCastle]

        ]);
    }


    else if (enemyName === "Dark Knight") {

        darkKnightDefeated = true;

        addItem("⚔️ Dark Sword");

        gold += 25;

        unlockAchievement("⚔️ Dark Knight Slayer");

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The Dark Knight has fallen. I have obtained the Dark Sword."
        );


        setChoices([

            ["👑 Continue", showCastle],

            ["🌲 Return to Forest", showForest]

        ]);
    }


    else if (enemyName === "Shadow King") {

        bossDefeated = true;

        addItem("💎 Ancient Crystal");

        gold += 100;

        unlockAchievement("👑 Shadow King");

        showCharacter(
            "Hero",
            "assets/Hero.png",
            "The Shadow King has fallen. The Ancient Crystal is now yours."
        );

        showEnding();
    }


    updateAll();
}


/* =====================================================
   ENDINGS
   ===================================================== */

function showEnding() {

    document.getElementById("endingSection")
        .classList.remove("hidden");


    document.getElementById("endingSection")
        .scrollIntoView({
            behavior: "smooth"
        });


    document.getElementById("endingTitle")
        .textContent =
        "🏆 The Shadow King Has Fallen";


    document.getElementById("endingText")
        .textContent =
        "The final battle is over. The Ancient Crystal now rests in your hands. What will you do with its power?";
}


function restoreKingdom() {

    unlockAchievement("🌟 Kingdom Savior");

    document.querySelector(".ending-icon")
        .textContent = "🌟";

    document.getElementById("endingTitle")
        .textContent =
        "🌟 The Kingdom Is Restored";


    document.getElementById("endingText")
        .textContent =
        "You destroy the darkness within the Ancient Crystal and restore the kingdom. Peace returns to the land, and the people remember you as their greatest hero.";
}


function takeCrystalPower() {

    document.querySelector(".ending-icon")
        .textContent = "👑";

    document.getElementById("endingTitle")
        .textContent =
        "👑 The New Shadow King";


    document.getElementById("endingText")
        .textContent =
        "You accept the power of the Ancient Crystal. The kingdom survives, but you become its new ruler.";
}


function destroyCrystal() {

    document.querySelector(".ending-icon")
        .textContent = "💥";

    document.getElementById("endingTitle")
        .textContent =
        "💥 The Crystal Is Destroyed";


    document.getElementById("endingText")
        .textContent =
        "You destroy the Ancient Crystal. Its dark power disappears forever, and the kingdom is finally free.";
}


/* =====================================================
   GAME OVER
   ===================================================== */

function gameOver() {

    inCombat = false;

    document.getElementById("combatSection")
        .classList.add("hidden");


    document.getElementById("endingSection")
        .classList.remove("hidden");


    document.querySelector(".ending-icon")
        .textContent = "💀";


    document.getElementById("endingTitle")
        .textContent =
        "💀 Game Over";


    document.getElementById("endingText")
        .textContent =
        "Your journey has come to an end. The darkness remains. Begin a new adventure and try again.";


    document.querySelector(".ending-buttons")
        .innerHTML = `

            <button onclick="startNewGame()">
                🔄 Try Again
            </button>

            <button onclick="backToMenu()">
                🏠 Main Menu
            </button>
        `;
}


/* =====================================================
   INVENTORY
   ===================================================== */

function addItem(item) {

    if (!inventory.includes(item)) {

        inventory.push(item);
    }

    updateInventory();
}


function updateInventory() {

    const inventoryDiv =
        document.getElementById("inventory");

    inventoryDiv.innerHTML = "";


    if (inventory.length === 0) {

        inventoryDiv.innerHTML =
            `<p>Your inventory is empty.</p>`;

        return;
    }


    inventory.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "inventory-item";

        div.textContent = item;

        inventoryDiv.appendChild(div);
    });
}


/* =====================================================
   STATUS
   ===================================================== */

function updateStatus() {

    document.getElementById("healthText")
        .textContent =
        `${health} / ${maxHealth}`;


    const percentage =
        (health / maxHealth) * 100;


    document.getElementById("healthFill")
        .style.width =
        `${percentage}%`;


    document.getElementById("goldText")
        .textContent = gold;
}


/* =====================================================
   QUEST
   ===================================================== */

function updateQuest() {

    const questText =
        document.getElementById("questText");


    if (!questStarted) {

        questText.textContent =
            "Talk to the Elder in the village.";

        return;
    }


    if (!goblinDefeated) {

        questText.textContent =
            "⚔️ Defeat the Goblin in the Forest.";

        return;
    }


    if (!questCompleted) {

        questText.textContent =
            "🏘️ Return to the Elder for your reward.";

        return;
    }


    if (!bossDefeated) {

        questText.textContent =
            "🏰 Enter the Shadow Castle and defeat the evil within.";

        return;
    }


    questText.textContent =
        "🏆 Choose the fate of the Ancient Crystal.";
}


/* =====================================================
   ACHIEVEMENTS
   ===================================================== */

function unlockAchievement(name) {

    document.querySelectorAll(".achievement")
        .forEach(item => {

            if (item.textContent.includes(name)) {

                item.classList.remove("locked");

                item.classList.add("unlocked");
            }
        });
}


function updateAchievements() {

    const achievements =
        document.querySelectorAll(".achievement");


    if (goblinDefeated) {

        achievements[0]
            .classList.add("unlocked");

        achievements[0]
            .classList.remove("locked");
    }


    if (darkKnightDefeated) {

        achievements[1]
            .classList.add("unlocked");

        achievements[1]
            .classList.remove("locked");
    }


    if (bossDefeated) {

        achievements[2]
            .classList.add("unlocked");

        achievements[2]
            .classList.remove("locked");
    }
}


/* =====================================================
   COMBAT UI
   ===================================================== */

function updateCombat() {

    if (!inCombat) return;


    const playerPercent =
        (health / maxHealth) * 100;


    const enemyPercent =
        (enemyHealth / enemyMaxHealth) * 100;


    document.getElementById("playerBattleHealth")
        .style.width =
        `${playerPercent}%`;


    document.getElementById("enemyBattleHealth")
        .style.width =
        `${enemyPercent}%`;


    document.getElementById("playerBattleText")
        .textContent =
        `${health} / ${maxHealth}`;


    document.getElementById("enemyBattleText")
        .textContent =
        `${enemyHealth} / ${enemyMaxHealth}`;
}


/* =====================================================
   UPDATE ALL
   ===================================================== */

function updateAll() {

    updateStatus();

    updateInventory();

    updateQuest();

    updateAchievements();

    updateCombat();
}


/* =====================================================
   SAVE
   ===================================================== */

function saveGame() {

    const saveData = {

        health,
        gold,
        inventory,

        currentLocation,

        goblinDefeated,
        darkKnightDefeated,
        bossDefeated,

        castleUnlocked,

        questStarted,
        questCompleted,

        caveQuestCompleted,

        healerUsed,
        blacksmithTalked
    };


    localStorage.setItem(
        "lostKingdomSave",
        JSON.stringify(saveData)
    );


    showSaveMessage(
        "💾 Game saved successfully!"
    );
}


/* =====================================================
   LOAD
   ===================================================== */

function loadGame() {

    const saved =
        localStorage.getItem("lostKingdomSave");


    if (!saved) {

        alert("No saved game found.");

        return false;
    }


    const data =
        JSON.parse(saved);


    health =
        data.health ?? 100;

    gold =
        data.gold ?? 0;

    inventory =
        data.inventory ?? [];


    currentLocation =
        data.currentLocation ?? "Village";


    goblinDefeated =
        data.goblinDefeated ?? false;

    darkKnightDefeated =
        data.darkKnightDefeated ?? false;

    bossDefeated =
        data.bossDefeated ?? false;


    castleUnlocked =
        data.castleUnlocked ?? false;


    questStarted =
        data.questStarted ?? false;

    questCompleted =
        data.questCompleted ?? false;


    caveQuestCompleted =
        data.caveQuestCompleted ?? false;


    healerUsed =
        data.healerUsed ?? false;

    blacksmithTalked =
        data.blacksmithTalked ?? false;


    updateAll();

    showSaveMessage("📂 Game loaded!");

    return true;
}


/* =====================================================
   RESTORE LOCATION
   ===================================================== */

function restoreLocation() {

    switch (currentLocation) {

        case "Village":
            showVillage();
            break;

        case "Forest":
            showForest();
            break;

        case "Cave":
            showCave();
            break;

        case "Castle":
            showCastle();
            break;

        default:
            showVillage();
    }
}


/* =====================================================
   SAVE MESSAGE
   ===================================================== */

function showSaveMessage(message) {

    const element =
        document.getElementById("saveMessage");

    element.textContent = message;


    setTimeout(() => {

        element.textContent = "";

    }, 2500);
}


/* =====================================================
   SOUND
   ===================================================== */

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }


    if (audioContext.state === "suspended") {

        audioContext.resume();
    }
}


function playTone(
    frequency,
    duration = .15,
    type = "sine",
    volume = .04
) {

    if (!soundEnabled) return;

    initAudio();


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = type;

    oscillator.frequency.value =
        frequency;

    gain.gain.value =
        volume;


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();


    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioContext.currentTime + duration
    );


    oscillator.stop(
        audioContext.currentTime + duration
    );
}


function playSound(type) {

    if (!soundEnabled) return;


    if (type === "attack") {

        playTone(
            140,
            .12,
            "sawtooth",
            .06
        );

        setTimeout(() => {

            playTone(
                90,
                .1,
                "square",
                .04
            );

        }, 70);
    }


    else if (type === "defend") {

        playTone(
            220,
            .15,
            "triangle",
            .04
        );
    }


    else if (type === "heal") {

        playTone(
            440,
            .2,
            "sine",
            .04
        );

        setTimeout(() => {

            playTone(
                660,
                .2,
                "sine",
                .04
            );

        }, 150);
    }


    else if (type === "quest") {

        playTone(
            330,
            .15,
            "triangle",
            .04
        );

        setTimeout(() => {

            playTone(
                440,
                .2,
                "triangle",
                .04
            );

        }, 120);
    }


    else if (type === "start") {

        playTone(
            261.63,
            .2,
            "sine",
            .04
        );

        setTimeout(() => {

            playTone(
                392,
                .3,
                "sine",
                .04
            );

        }, 200);
    }
}


/* =====================================================
   MUSIC
   ===================================================== */

function startMusic() {

    if (!soundEnabled) return;

    if (musicTimer) return;

    initAudio();


    musicTimer =
        setInterval(() => {

            if (!soundEnabled) return;


            playTone(
                musicNotes[musicStep],
                .35,
                "sine",
                .012
            );


            musicStep =
                (musicStep + 1)
                % musicNotes.length;

        }, 700);
}


function stopMusic() {

    if (musicTimer) {

        clearInterval(musicTimer);

        musicTimer = null;
    }
}


function toggleSound() {

    soundEnabled =
        !soundEnabled;


    const button =
        document.getElementById("soundButton");


    if (soundEnabled) {

        button.textContent =
            "🔊 Sound";

        initAudio();

        startMusic();

    } else {

        button.textContent =
            "🔇 Muted";

        stopMusic();
    }
}


/* =====================================================
   INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAll();

        showScreen("mainMenu");

    }
);