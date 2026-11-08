/* ======================================================
   THE LAMASERY OF SAINT BRYTREBARUNARE
   MAIN MENU + SIMPLE CSS-TRANSITION ARRIVAL SEQUENCE
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

// A straightforward transition + timer approach avoids Web Animations API timing.
const TIMING = Object.freeze({
    fadeToBlack: 1800,
    titleIn: 900,
    titleHold: 2200,
    titleOut: 850,
    blackPause: 650,
    sceneIn: 1800
});
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let started = false;
let canMove = false;
let frameId = 0;
const pressed = new Set();
const position = { x: 0, y: 0 };
const directions = new Set([
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "w", "a", "s", "d", "W", "A", "S", "D"
]);

function makeOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "cinematic-overlay";
    overlay.style.cssText = [
        "position:fixed", "inset:0", "z-index:2147483647",
        "display:flex", "align-items:center", "justify-content:center",
        "padding:24px", "background:#000000", "opacity:0",
        "transition:opacity 1800ms ease-in-out", "pointer-events:all"
    ].join(";");

    const title = document.createElement("h1");
    title.textContent = "Planet Earth: 4.54 Billion Years Ago";
    title.style.cssText = [
        "margin:0", "max-width:100%", "color:#eee8dc",
        'font:400 clamp(28px,5vw,58px)/1.2 Georgia,"Times New Roman",serif',
        "letter-spacing:.045em", "text-align:center",
        "text-shadow:0 0 22px rgba(232,220,196,.14)",
        "opacity:0", "transition:opacity 900ms ease-in-out"
    ].join(";");
    overlay.append(title);
    document.body.append(overlay);
    return { overlay, title };
}

function setOpacity(element, value, duration) {
    element.style.transitionDuration = `${duration}ms`;
    // Force the initial opacity to be laid out before changing it.
    void element.offsetWidth;
    element.style.opacity = String(value);
}

function placePlayer() {
    position.x = Math.max(0, (innerWidth - player.offsetWidth) / 2);
    position.y = Math.max(0, innerHeight - player.offsetHeight - 72);
    drawPlayer();
}

function drawPlayer() {
    player.style.left = `${position.x}px`;
    player.style.top = `${position.y}px`;
}

function runMovement(now) {
    if (!canMove) return;
    runMovement.previous ??= now;
    const dt = Math.min((now - runMovement.previous) / 1000, 0.05);
    runMovement.previous = now;
    const step = 220 * dt;

    if (pressed.has("ArrowUp") || pressed.has("w") || pressed.has("W")) position.y -= step;
    if (pressed.has("ArrowDown") || pressed.has("s") || pressed.has("S")) position.y += step;
    if (pressed.has("ArrowLeft") || pressed.has("a") || pressed.has("A")) position.x -= step;
    if (pressed.has("ArrowRight") || pressed.has("d") || pressed.has("D")) position.x += step;

    position.x = Math.max(0, Math.min(position.x, innerWidth - player.offsetWidth));
    position.y = Math.max(0, Math.min(position.y, innerHeight - player.offsetHeight));
    drawPlayer();
    frameId = requestAnimationFrame(runMovement);
}

async function startGame() {
    if (started) return;
    started = true;
    startButton.disabled = true;
    const { overlay, title } = makeOverlay();

    // Cover the complete old menu with an independent, pitch-black layer.
    setOpacity(overlay, 1, TIMING.fadeToBlack);
    loadingScreen.style.transition = `opacity ${TIMING.fadeToBlack}ms ease-in-out`;
    loadingScreen.style.opacity = "0";
    await pause(TIMING.fadeToBlack);
    loadingScreen.style.display = "none";

    setOpacity(title, 1, TIMING.titleIn);
    await pause(TIMING.titleIn + TIMING.titleHold);
    setOpacity(title, 0, TIMING.titleOut);
    await pause(TIMING.titleOut + TIMING.blackPause);

    // Prepare the scene while the overlay is still fully black.
    mainContent.style.display = "block";
    scene.style.opacity = "1";
    placePlayer();
    await pause(80);

    setOpacity(overlay, 0, TIMING.sceneIn);
    await pause(TIMING.sceneIn);
    overlay.remove();

    // Input becomes active only after the scene has completely appeared.
    canMove = true;
    runMovement.previous = null;
    frameId = requestAnimationFrame(runMovement);
}

startButton.addEventListener("click", startGame, { once: true });
document.addEventListener("keydown", (event) => {
    if (!canMove || !directions.has(event.key)) return;
    event.preventDefault();
    pressed.add(event.key);
});
document.addEventListener("keyup", (event) => pressed.delete(event.key));
window.addEventListener("blur", () => pressed.clear());
window.addEventListener("resize", () => {
    if (!canMove) return;
    position.x = Math.max(0, Math.min(position.x, innerWidth - player.offsetWidth));
    position.y = Math.max(0, Math.min(position.y, innerHeight - player.offsetHeight));
    drawPlayer();
});

settingsButton.addEventListener("click", () => alert("Settings will be available soon."));
creditsButton.addEventListener("click", () => alert(
    "The Lamasery of Saint Brytrebarunare\n\n" +
    "Created with imagination, code and a little bit of divine intervention."
));
exitButton.addEventListener("click", () => {
    if (confirm("Do you want to leave The Lamasery?")) window.location.href = "about:blank";
});
