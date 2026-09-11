/* =========================================
   THE LOST KINGDOM
   Main Game JavaScript
========================================= */


/* =========================================
   GAME STATE
========================================= */

let player = {
    hp: 100,
    maxHp: 100,
    gold: 0,
    inventory: []
};

let gameState = {

    location: "village",

    questStarted: false,
    questCompleted: false,

    caveQuestCompleted: false,

    healerUsed: false,
    blacksmithTalked: false,

    goblinDefeated: false,
    darkKnightDefeated: false,
    bossDefeated: false,

    castleUnlocked: false,

    battleActive: false,

    currentEnemy: null
};


/* =========================================
   ENEMIES
========================================= */

const enemies = {

    goblin: {
        name: "Goblin",
        hp: 60,
        maxHp: 60,
        attack: 15,
        image: "goblin.png"
    },

    darkKnight: {
        name: "Dark Knight",
        hp: 100,
        maxHp: 100,
        attack: 20,
        image: "dark-knight.png"
    },

    shadowKing: {
        name: "Shadow King",
        hp: 150,
        maxHp: 150,
        attack: 25,
        image: "shadow-king.png"
    }

};


/* =========================================
   SCREEN CONTROL
========================================= */

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");
}


function startNewGame() {

    player = {
        hp: 100,
        maxHp: 100,
        gold: 0,
        inventory: []
    };

    gameState = {

        location: "village",

        questStarted: false,
        questCompleted: false,

        caveQuestCompleted: false,

        healerUsed: false,
        blacksmithTalked: false,

        goblinDefeated: false,
        darkKnightDefeated: false,
        bossDefeated: false,

        castleUnlocked: false,

        battleActive: false,

        currentEnemy: null
    };

    updateUI();

    showScreen("storyScreen");

    playSound();
}


function enterKingdom() {

    showScreen("gameScreen");

    showVillage();

    updateUI();

    playSound();
}


function backToMenu() {

    showScreen("menuScreen");

    stopMusic();
}


function showHelp() {

    showScreen("helpScreen");
}


/* =========================================
   VILLAGE
========================================= */

function showVillage() {

    if (gameState.battleActive) {
        return;
    }

    gameState.location = "village";

    changeLocationImage(
        "Village.jpg",
        "🏘️ Village",
        "A peaceful village surrounded by mountains."
    );

    showCharacter(
        "elder.png",
        "Elder",
        "Welcome, brave traveler. Our kingdom needs your help."
    );

    setChoices([
        ["👴 Talk to Elder", talkToElder],
        ["🧭 Talk to Traveler", talkToTraveler],
        ["⚒️ Visit Blacksmith", talkToBlacksmith],
        ["❤️ Visit Healer", talkToHealer],
        ["🌲 Go to Forest", showForest],
        ["🕳️ Go to Cave", showCave]
    ]);

    updateQuest();

    updateUI();
}


/* =========================================
   ELDER
========================================= */

function talkToElder() {

    gameState.questStarted = true;

    showCharacter(
        "elder.png",
        "Elder",
        "Monsters have appeared in the forest. Defeat the Goblin and Dark Knight, then enter the ancient castle."
    );

    setChoices([
        ["⚔️ Go to Forest", showForest],
        ["🧭 Talk to Traveler", talkToTraveler],
        ["⚒️ Visit Blacksmith", talkToBlacksmith],
        ["❤️ Visit Healer", talkToHealer]
    ]);

    updateQuest();
}


/* =========================================
   TRAVELER
========================================= */

function talkToTraveler() {

    showCharacter(
        "traveler.png",
        "Traveler",
        "I heard a powerful Shadow King controls the castle. You will need courage to defeat him."
    );

    setChoices([
        ["🌲 Go to Forest", showForest],
        ["🕳️ Explore Cave", showCave],
        ["🏘️ Return to Village", showVillage]
    ]);
}


/* =========================================
   BLACKSMITH
========================================= */

function talkToBlacksmith() {

    gameState.blacksmithTalked = true;

    showCharacter(
        "blacksmith.png",
        "Blacksmith",
        "Take care, hero. Strong enemies guard the path to the castle."
    );

    setChoices([
        ["🌲 Go to Forest", showForest],
        ["🏘️ Return to Village", showVillage]
    ]);

    updateQuest();
}


/* =========================================
   HEALER
========================================= */

function talkToHealer() {

    if (gameState.healerUsed) {

        showCharacter(
            "healer.png",
            "Healer",
            "I have already healed you. Stay safe, hero."
        );

    } else {

        player.hp = player.maxHp;

        gameState.healerUsed = true;

        showCharacter(
            "healer.png",
            "Healer",
            "Your health has been restored!"
        );

        updateUI();
    }

    setChoices([
        ["🏘️ Return to Village", showVillage],
        ["🌲 Go to Forest", showForest]
    ]);
}


/* =========================================
   FOREST
========================================= */

function showForest() {

    gameState.location = "forest";

    changeLocationImage(
        "Forest.jpg",
        "🌲 Dark Forest",
        "A dangerous forest filled with monsters."
    );

    showCharacter(
        "traveler.png",
        "Traveler",
        "Be careful! A Goblin is hiding somewhere in this forest."
    );

    let choices = [];

    if (!gameState.goblinDefeated) {

        choices.push([
            "👹 Fight Goblin",
            startGoblinBattle
        ]);

    } else {

        choices.push([
            "✅ Goblin Defeated",
            () => {
                showCharacter(
                    "traveler.png",
                    "Traveler",
                    "You already defeated the Goblin."
                );
            }
        ]);

    }

    if (gameState.goblinDefeated) {

        choices.push([
            "🛡️ Go Deeper",
            startDarkKnightBattle
        ]);

    }

    choices.push([
        "🏘️ Return to Village",
        showVillage
    ]);

    choices.push([
        "🕳️ Explore Cave",
        showCave
    ]);

    setChoices(choices);

    updateQuest();
    updateUI();
}


/* =========================================
   CAVE
========================================= */

function showCave() {

    gameState.location = "cave";

    changeLocationImage(
        "Cave.jpg",
        "🕳️ Ancient Cave",
        "A dark cave containing forgotten treasures."
    );

    showCharacter(
        "traveler.png",
        "Traveler",
        "There may be useful items hidden inside this cave."
    );

    if (!gameState.caveQuestCompleted) {

        player.inventory.push("Torch");
        player.inventory.push("Health Potion");
        player.gold += 20;

        gameState.caveQuestCompleted = true;

        showCharacter(
            "traveler.png",
            "Traveler",
            "You found a Torch, a Health Potion and 20 gold!"
        );
    }

    setChoices([
        ["🏘️ Return to Village", showVillage],
        ["🌲 Go to Forest", showForest]
    ]);

    updateUI();
}


/* =========================================
   CASTLE
========================================= */

function showCastle() {

    if (!gameState.goblinDefeated || !gameState.darkKnightDefeated) {

        showCharacter(
            "traveler.png",
            "Traveler",
            "The castle gates are locked. Defeat the enemies guarding the kingdom first."
        );

        setChoices([
            ["🌲 Return to Forest", showForest],
            ["🏘️ Return to Village", showVillage]
        ]);

        return;
    }

    gameState.location = "castle";
    gameState.castleUnlocked = true;

    changeLocationImage(
        "castle.jpg",
        "🏰 Ancient Castle",
        "The castle is surrounded by dark magic. The Shadow King waits inside."
    );

    showCharacter(
        "shadow-king.png",
        "Shadow King",
        "You have come far, hero. But your journey ends here!"
    );

    if (!gameState.bossDefeated) {

        setChoices([
            ["👑 Fight Shadow King", startBossBattle],
            ["🏃 Leave Castle", showForest]
        ]);

    } else {

        setChoices([
            ["💎 Restore the Kingdom", endingRestore],
            ["👑 Take the Crystal Power", endingPower],
            ["🔥 Destroy the Crystal", endingDestroy]
        ]);

    }

    updateQuest();
    updateUI();
}


/* =========================================
   LOCATION IMAGE
========================================= */

function changeLocationImage(image, title, description) {

    document.getElementById("locationImage").src = image;

    document.getElementById("locationTitle").textContent = title;

    document.getElementById("locationText").textContent = description;

    document.getElementById("locationName").textContent = title;
}


/* =========================================
   CHARACTER
========================================= */

function showCharacter(image, name, dialogue) {

    document.getElementById("characterImage").src = image;

    document.getElementById("characterName").textContent = name;

    document.getElementById("dialogue").textContent = dialogue;
}


/* =========================================
   CHOICES
========================================= */

function setChoices(choices) {

    const container = document.getElementById("choices");

    container.innerHTML = "";

    choices.forEach(choice => {

        const button = document.createElement("button");

        button.textContent = choice[0];

        button.onclick = choice[1];

        container.appendChild(button);

    });
}


/* =========================================
   COMBAT
========================================= */

function startGoblinBattle() {

    startBattle("goblin");
}


function startDarkKnightBattle() {

    startBattle("darkKnight");
}


function startBossBattle() {

    startBattle("shadowKing");
}


function startBattle(enemyType) {

    const original = enemies[enemyType];

    gameState.currentEnemy = {

        type: enemyType,

        name: original.name,

        hp: original.maxHp,

        maxHp: original.maxHp,

        attack: original.attack,

        image: original.image
    };

    gameState.battleActive = true;

    document.getElementById("combatPanel").classList.remove("hidden");

    document.getElementById("choices").innerHTML = "";

    document.getElementById("enemyName").textContent =
        gameState.currentEnemy.name;

    document.getElementById("enemyCombatImage").src =
        gameState.currentEnemy.image;

    document.getElementById("combatLog").textContent =
        "The battle begins!";

    updateCombatUI();

    window.scrollTo({
        top: document.getElementById("combatPanel").offsetTop,
        behavior: "smooth"
    });

    playSound();
}


/* =========================================
   PLAYER ATTACK
========================================= */

function playerAttack() {

    if (!gameState.battleActive) return;

    const damage = 20;

    gameState.currentEnemy.hp -= damage;

    if (gameState.currentEnemy.hp < 0) {
        gameState.currentEnemy.hp = 0;
    }

    document.getElementById("combatLog").textContent =
        `⚔️ You attacked for ${damage} damage!`;

    updateCombatUI();

    if (gameState.currentEnemy.hp <= 0) {

        winBattle();

        return;
    }

    setTimeout(enemyTurn, 500);
}


/* =========================================
   DEFEND
========================================= */

let defending = false;

function playerDefend() {

    if (!gameState.battleActive) return;

    defending = true;

    document.getElementById("combatLog").textContent =
        "🛡️ You are defending. The next attack will deal less damage.";

    setTimeout(enemyTurn, 500);
}


/* =========================================
   ENEMY TURN
========================================= */

function enemyTurn() {

    if (!gameState.battleActive) return;

    let damage = gameState.currentEnemy.attack;

    if (defending) {

        damage = Math.floor(damage / 2);

        defending = false;
    }

    player.hp -= damage;

    if (player.hp < 0) {
        player.hp = 0;
    }

    document.getElementById("combatLog").textContent =
        `👹 ${gameState.currentEnemy.name} attacked you for ${damage} damage!`;

    updateCombatUI();
    updateUI();

    if (player.hp <= 0) {

        gameOver();

    }
}


/* =========================================
   POTION
========================================= */

function usePotion() {

    if (!gameState.battleActive) return;

    const potionIndex =
        player.inventory.indexOf("Health Potion");

    if (potionIndex === -1) {

        document.getElementById("combatLog").textContent =
            "❌ You don't have a Health Potion.";

        return;
    }

    player.inventory.splice(potionIndex, 1);

    player.hp += 30;

    if (player.hp > player.maxHp) {
        player.hp = player.maxHp;
    }

    document.getElementById("combatLog").textContent =
        "🧪 You used a Health Potion and restored 30 HP.";

    updateCombatUI();
    updateUI();
}


/* =========================================
   RUN
========================================= */

function runFromBattle() {

    if (!gameState.battleActive) return;

    gameState.battleActive = false;
    gameState.currentEnemy = null;

    document.getElementById("combatPanel").classList.add("hidden");

    document.getElementById("combatLog").textContent =
        "You escaped.";

    if (gameState.location === "castle") {

        showCastle();

    } else {

        showForest();

    }
}


/* =========================================
   WIN BATTLE
========================================= */

function winBattle() {

    const enemy = gameState.currentEnemy;

    gameState.battleActive = false;

    if (enemy.type === "goblin") {

        gameState.goblinDefeated = true;

        player.gold += 10;

        player.inventory.push("Ancient Key");

        unlockAchievement(1);

        showCharacter(
            "traveler.png",
            "Traveler",
            "Amazing! You defeated the Goblin and found an Ancient Key!"
        );

    }


    else if (enemy.type === "darkKnight") {

        gameState.darkKnightDefeated = true;

        player.gold += 25;

        player.inventory.push("Dark Sword");

        unlockAchievement(2);

        showCharacter(
            "blacksmith.png",
            "Blacksmith",
            "Excellent! You defeated the Dark Knight and obtained the Dark Sword."
        );

    }


    else if (enemy.type === "shadowKing") {

        gameState.bossDefeated = true;

        player.gold += 100;

        player.inventory.push("Ancient Crystal");

        unlockAchievement(3);

        showCharacter(
            "shadow-king.png",
            "Shadow King",
            "You have defeated me... The fate of the kingdom is now in your hands."
        );

    }

    document.getElementById("combatPanel").classList.add("hidden");

    gameState.currentEnemy = null;

    updateUI();

    if (gameState.location === "forest") {

        showForest();

    } else if (gameState.location === "castle") {

        showCastle();

    }
}


/* =========================================
   COMBAT UI
========================================= */

function updateCombatUI() {

    if (!gameState.currentEnemy) return;

    const enemy = gameState.currentEnemy;

    document.getElementById("playerHPBar").style.width =
        `${(player.hp / player.maxHp) * 100}%`;

    document.getElementById("playerHPText").textContent =
        `${player.hp}/${player.maxHp}`;

    document.getElementById("enemyHPBar").style.width =
        `${(enemy.hp / enemy.maxHp) * 100}%`;

    document.getElementById("enemyHPText").textContent =
        `${enemy.hp}/${enemy.maxHp}`;

    document.getElementById("enemyName").textContent =
        enemy.name;

    document.getElementById("enemyCombatImage").src =
        enemy.image;
}


/* =========================================
   GAME OVER
========================================= */

function gameOver() {

    gameState.battleActive = false;

    document.getElementById("combatPanel").classList.add("hidden");

    document.getElementById("endingPanel").classList.remove("hidden");

    document.getElementById("endingTitle").textContent =
        "💀 Game Over";

    document.getElementById("endingText").textContent =
        "Your adventure has ended. The kingdom still waits for its hero.";

    document.getElementById("choices").innerHTML = "";
}


/* =========================================
   ENDINGS
========================================= */

function endingRestore() {

    showEnding(
        "🏆 Hero of the Kingdom",
        "You restored the Ancient Crystal and brought peace back to the Lost Kingdom. The people celebrate you as their hero."
    );

    unlockAchievement(4);
}


function endingPower() {

    showEnding(
        "👑 The New Ruler",
        "You chose to keep the Crystal's power. You became the most powerful person in the kingdom."
    );
}


function endingDestroy() {

    showEnding(
        "🔥 The Kingdom Reborn",
        "You destroyed the Ancient Crystal and ended its dangerous power forever. A new era begins for the kingdom."
    );
}


function showEnding(title, text) {

    document.getElementById("endingPanel").classList.remove("hidden");

    document.getElementById("endingTitle").textContent = title;

    document.getElementById("endingText").textContent = text;

    document.getElementById("choices").innerHTML = "";

    gameState.location = "ending";

    updateUI();
}


/* =========================================
   INVENTORY
========================================= */

function updateInventory() {

    const container = document.getElementById("inventory");

    container.innerHTML = "";

    if (player.inventory.length === 0) {

        container.innerHTML =
            "<p>Inventory is empty.</p>";

        return;
    }

    player.inventory.forEach(item => {

        const div = document.createElement("div");

        div.className = "inventory-item";

        div.textContent = "🎒 " + item;

        container.appendChild(div);

    });
}


/* =========================================
   QUEST
========================================= */

function updateQuest() {

    const quest = document.getElementById("questText");

    if (!gameState.questStarted) {

        quest.textContent =
            "Talk to the Elder to begin your adventure.";

        return;
    }

    if (!gameState.goblinDefeated) {

        quest.textContent =
            "⚔️ Quest: Defeat the Goblin in the forest.";

        return;
    }

    if (!gameState.darkKnightDefeated) {

        quest.textContent =
            "🛡️ Quest: Defeat the Dark Knight deeper in the forest.";

        return;
    }

    if (!gameState.bossDefeated) {

        quest.textContent =
            "🏰 Quest: Enter the castle and defeat the Shadow King.";

        return;
    }

    quest.textContent =
        "💎 Quest Complete: Decide the fate of the Ancient Crystal.";
}


/* =========================================
   ACHIEVEMENTS
========================================= */

function unlockAchievement(number) {

    const list =
        document.getElementById("achievementList").children;

    if (list[number]) {

        list[number].classList.add("unlocked");

        list[number].textContent =
            list[number].textContent.replace("🔒", "🏆");
    }
}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

    document.getElementById("health").textContent =
        `${player.hp}/${player.maxHp}`;

    document.getElementById("gold").textContent =
        player.gold;

    document.getElementById("itemCount").textContent =
        player.inventory.length;

    updateInventory();

    updateQuest();

    if (gameState.battleActive) {
        updateCombatUI();
    }
}


/* =========================================
   SAVE GAME
========================================= */

function saveGame() {

    const saveData = {

        player: player,

        gameState: gameState

    };

    localStorage.setItem(
        "lostKingdomSave",
        JSON.stringify(saveData)
    );

    alert("💾 Game saved successfully!");
}


/* =========================================
   CONTINUE GAME
========================================= */

function continueGame() {

    const savedGame =
        localStorage.getItem("lostKingdomSave");

    if (!savedGame) {

        alert("❌ No saved game found.");

        return;
    }

    const data =
        JSON.parse(savedGame);

    player = data.player;

    gameState = data.gameState;

    gameState.battleActive = false;
    gameState.currentEnemy = null;

    document.getElementById("combatPanel")
        .classList.add("hidden");

    document.getElementById("endingPanel")
        .classList.add("hidden");

    showScreen("gameScreen");

    restoreLocation();

    updateUI();
}


/* =========================================
   RESTORE LOCATION
========================================= */

function restoreLocation() {

    switch (gameState.location) {

        case "forest":
            showForest();
            break;

        case "cave":
            showCave();
            break;

        case "castle":
            showCastle();
            break;

        case "village":
        default:
            showVillage();
            break;
    }
}


/* =========================================
   SOUND
========================================= */

let audioContext = null;

function playSound() {

    try {

        if (!audioContext) {

            audioContext =
                new (window.AudioContext ||
                    window.webkitAudioContext)();
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.frequency.value = 440;

        oscillator.type = "sine";

        gain.gain.setValueAtTime(
            0.05,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.5
        );

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.5
        );

    } catch (error) {

        console.log("Audio unavailable.");

    }
}


function stopMusic() {
    // Reserved for future background music.
}


/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateUI();

});
