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
const scene = document.getElementById("neocity-scene");
const player = document.getElementById("player");

mainContent.style.display = "none";
document.body.style.overflow = "hidden";

// Keep all scene-title timings together so later transitions can reuse them.
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

function fade(element, from, to, duration) {
    const animation = element.animate(
        [{ opacity: from }, { opacity: to }],
        { duration, easing: "ease-in-out", fill: "forwards" }
    );

    return animation.finished.then(() => {
        element.style.opacity = String(to);
        animation.cancel();
    });
}

// Build the overlay at runtime and style it inline so this sequence does not
// depend on a separately cached stylesheet or a class-name match.
function createTransitionOverlay(titleText) {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483647",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#000000",
        opacity: "0",
        pointerEvents: "all"
    });

    const title = document.createElement("h1");
    title.textContent = titleText;
    Object.assign(title.style, {
        maxWidth: "100%",
        margin: "0",
        color: "#eee8dc",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(28px, 5vw, 58px)",
        fontWeight: "400",
        lineHeight: "1.2",
        letterSpacing: "0.045em",
        textAlign: "center",
        textShadow: "0 0 22px rgba(232, 220, 196, 0.14)",
        opacity: "0"
    });

    overlay.append(title);
    document.body.append(overlay);
    return { overlay, title };
}

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

async function beginStartGameSequence() {
    if (transitionStarted) return;
    transitionStarted = true;
    startButton.disabled = true;

    const { overlay, title } = createTransitionOverlay(
        "Planet Earth: 4.54 Billion Years Ago"
    );

    // Fade the menu away at the same time that the full-screen black overlay rises.
    loadingScreen.style.transition = `opacity ${SCENE_TRANSITION.fadeToBlack}ms ease-in-out`;
    loadingScreen.style.opacity = "0";
    await fade(overlay, 0, 1, SCENE_TRANSITION.fadeToBlack);
    loadingScreen.style.display = "none";

    // Only begin showing the title after the overlay has reached full black.
    await fade(title, 0, 1, SCENE_TRANSITION.titleFadeIn);
    await wait(SCENE_TRANSITION.titleHold);
    await fade(title, 1, 0, SCENE_TRANSITION.titleFadeOut);
    await wait(SCENE_TRANSITION.blackPause);

    // Prepare the destination under black, then reveal it by fading the overlay out.
    mainContent.style.display = "block";
    scene.style.transition = "none";
    scene.style.opacity = "1";
    scene.classList.add("is-active");
    placePlayerAtStart();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await fade(overlay, 1, 0, SCENE_TRANSITION.sceneFadeIn);
    overlay.remove();

    // Keyboard movement stays locked until the reveal animation has completed.
    gameplayReady = true;
    startMovementLoop();
}

startButton.addEventListener("click", () => {
    void beginStartGameSequence().catch((error) => {
        console.error("Could not complete the scene transition:", error);
    });
});

document.addEventListener("keydown", (event) => {
    if (!gameplayReady || !movementKeys.has(event.key)) return;
    event.preventDefault();
    heldKeys.add(event.key);
});

document.addEventListener("keyup", (event) => heldKeys.delete(event.key));
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
