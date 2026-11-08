/* ======================================================
   THE LAMASERY OF SAINT BRYTREBARUNARE
   MENU, SCENE TRANSITIONS, AND GAMEPLAY
====================================================== */

console.log("Welcome to The Lamasery of Saint Brytrebarunare!");

const loadingScreen = document.getElementById("loading-screen");
const mainContent = document.getElementById("main-content");
const startButton = document.getElementById("start-button");
const settingsButton = document.getElementById("settings-button");
const creditsButton = document.getElementById("credits-button");
const exitButton = document.getElementById("exit-button");
const transition = document.getElementById("scene-transition");
const sceneTitle = document.getElementById("scene-title");
const scene = document.getElementById("neocity-scene");
const player = document.getElementById("player");

mainContent.style.display = "none";
document.body.style.overflow = "hidden";

const SCENE_TRANSITION = Object.freeze({
    fadeToBlack: 1800,
    titleFadeIn: 900,
    titleHold: 2200,
    titleFadeOut: 850,
    blackPause: 650,
    sceneFadeIn: 1800
});

let transitionStarted = false;
let gameplayReady = false;
let animationFrame = 0;
const heldKeys = new Set();
const playerPosition = { x: 0, y: 0 };
const movementKeys = new Set([
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "w", "a", "s", "d", "W", "A", "S", "D"
]);

function placePlayerAtStart() {
    playerPosition.x = Math.max(0, (window.innerWidth - player.offsetWidth) / 2);
    playerPosition.y = Math.max(0, window.innerHeight - player.offsetHeight - 72);
    renderPlayerPosition();
}

function renderPlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

function startMovementLoop() {
    let previousFrame = performance.now();

    function update(now) {
        if (!gameplayReady) return;
        const deltaSeconds = Math.min((now - previousFrame) / 1000, 0.05);
        previousFrame = now;
        const distance = 220 * deltaSeconds;

        if (heldKeys.has("ArrowUp") || heldKeys.has("w") || heldKeys.has("W")) playerPosition.y -= distance;
        if (heldKeys.has("ArrowDown") || heldKeys.has("s") || heldKeys.has("S")) playerPosition.y += distance;
        if (heldKeys.has("ArrowLeft") || heldKeys.has("a") || heldKeys.has("A")) playerPosition.x -= distance;
        if (heldKeys.has("ArrowRight") || heldKeys.has("d") || heldKeys.has("D")) playerPosition.x += distance;

        playerPosition.x = Math.max(0, Math.min(playerPosition.x, window.innerWidth - player.offsetWidth));
        playerPosition.y = Math.max(0, Math.min(playerPosition.y, window.innerHeight - player.offsetHeight));
        renderPlayerPosition();
        animationFrame = requestAnimationFrame(update);
    }

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(update);
}

function beginStartGameSequence() {
    if (transitionStarted) return;
    transitionStarted = true;
    startButton.disabled = true;

    loadingScreen.style.transition = `opacity ${SCENE_TRANSITION.fadeToBlack}ms ease`;
    loadingScreen.style.opacity = "0";

    sceneTitle.textContent = "Planet Earth: 4.54 Billion Years Ago";
    transition.style.display = "flex";
    transition.classList.remove("title-visible");
    transition.classList.add("visible");

    requestAnimationFrame(() => {
        transition.classList.add("title-visible");
    });

    setTimeout(() => {
        transition.classList.remove("title-visible");
    }, SCENE_TRANSITION.titleFadeIn + SCENE_TRANSITION.titleHold + SCENE_TRANSITION.titleFadeOut);

    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        scene.classList.add("is-active");
        placePlayerAtStart();

        transition.classList.remove("visible");
        transition.style.display = "none";

        setTimeout(() => {
            gameplayReady = true;
            startMovementLoop();
        }, SCENE_TRANSITION.blackPause);
    }, SCENE_TRANSITION.fadeToBlack + SCENE_TRANSITION.titleFadeIn + SCENE_TRANSITION.titleHold + SCENE_TRANSITION.titleFadeOut + SCENE_TRANSITION.blackPause);
}

startButton.addEventListener("click", beginStartGameSequence);

document.addEventListener("keydown", (event) => {
    if (!gameplayReady || !movementKeys.has(event.key)) return;
    event.preventDefault();
    heldKeys.add(event.key);
});

document.addEventListener("keyup", (event) => {
    heldKeys.delete(event.key);
});

window.addEventListener("blur", () => heldKeys.clear());
window.addEventListener("resize", () => {
    if (!gameplayReady) return;
    playerPosition.x = Math.min(playerPosition.x, window.innerWidth - player.offsetWidth);
    playerPosition.y = Math.min(playerPosition.y, window.innerHeight - player.offsetHeight);
    renderPlayerPosition();
});

settingsButton.addEventListener("click", () => {
    console.log("Settings selected.");
    alert("Settings will be available soon.");
});

creditsButton.addEventListener("click", () => {
    console.log("Credits selected.");
    alert(
        "The Lamasery of Saint Brytrebarunare\n\n" +
        "Created with imagination, code and a little bit of divine intervention."
    );
});

exitButton.addEventListener("click", () => {
    console.log("Exit selected.");
    if (confirm("Do you want to leave The Lamasery?")) {
        window.location.href = "about:blank";
    }
});
