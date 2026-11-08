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
const scene = document.getElementById("neocity-scene");
const player = document.getElementById("player");

mainContent.style.display = "none";
document.body.style.overflow = "hidden";

// Transition timings are centralized so future scene-title sequences can reuse them.
const SCENE_TRANSITION = Object.freeze({
    fadeToBlack: 1800,
    titleFadeIn: 900,
    titleHold: 2200,
    titleFadeOut: 850,
    blackPause: 650,
    sceneFadeIn: 1800
});

const wait = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

let transitionStarted = false;
let gameplayReady = false;
let animationFrame = 0;
const heldKeys = new Set();
const playerPosition = { x: 0, y: 0 };
const movementKeys = new Set([
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "w", "a", "s", "d", "W", "A", "S", "D"
]);

async function playSceneTitleTransition({ title, nextScene }) {
    if (transitionStarted) return;
    transitionStarted = true;
    startButton.disabled = true;

    transition.querySelector(".scene-title").textContent = title;
    transition.style.display = "flex";
    // Force the hidden starting state to be committed before beginning the fade.
    transition.getBoundingClientRect();
    requestAnimationFrame(() => transition.classList.add("is-opaque"));
    await wait(SCENE_TRANSITION.fadeToBlack);

    transition.classList.add("show-title");
    await wait(SCENE_TRANSITION.titleFadeIn + SCENE_TRANSITION.titleHold);
    transition.classList.remove("show-title");
    await wait(SCENE_TRANSITION.titleFadeOut);
    await wait(SCENE_TRANSITION.blackPause);

    // Bring up the destination underneath the fully opaque black overlay.
    loadingScreen.style.display = "none";
    mainContent.style.display = "block";
    nextScene.classList.add("is-active");
    placePlayerAtStart();

    transition.classList.remove("is-opaque");
    await wait(SCENE_TRANSITION.sceneFadeIn);
    transition.style.display = "none";

    // Movement input is deliberately enabled only after the reveal has completed.
    gameplayReady = true;
    startMovementLoop();
}

startButton.addEventListener("click", () => {
    void playSceneTitleTransition({
        title: "Lamasery - The Arrival",
        nextScene: scene
    });
});

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
