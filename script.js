/* ======================================================
   MAIN MENU + START GAME CINEMATIC + BASIC MOVEMENT
====================================================== */

const loadingScreen = document.getElementById("loading-screen");
const mainContent = document.getElementById("main-content");
const startButton = document.getElementById("start-button");
const sceneVisual = document.getElementById("scene-visual");
const player = document.getElementById("player");
const settingsButton = document.getElementById("settings-button");
const creditsButton = document.getElementById("credits-button");
const exitButton = document.getElementById("exit-button");

const TIMING = Object.freeze({ fadeToBlack: 1700, titleIn: 850, hold: 2200, titleOut: 800, blackPause: 500, fadeToScene: 1600 });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let started = false;
let controlsReady = false;
let frame = 0;
const keys = new Set();
const position = { x: 0, y: 0 };
const movementKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"]);

function makeOverlay() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", inset: "0", zIndex: "2147483647", display: "grid",
        placeItems: "center", padding: "24px", background: "#000", opacity: "0",
        transition: `opacity ${TIMING.fadeToBlack}ms ease-in-out`, pointerEvents: "all"
    });
    const title = document.createElement("h1");
    title.textContent = "Planet Earth: 4.54 Billion Years Ago";
    Object.assign(title.style, {
        margin: "0", color: "#eee8dc", fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(28px, 5vw, 58px)", fontWeight: "400", lineHeight: "1.2",
        textAlign: "center", opacity: "0", transition: `opacity ${TIMING.titleIn}ms ease-in-out`
    });
    overlay.append(title);
    document.body.append(overlay);
    return { overlay, title };
}

function changeOpacity(element, value, duration) {
    element.style.transitionDuration = `${duration}ms`;
    void element.offsetWidth;
    element.style.opacity = String(value);
}

function positionPlayer() {
    const bounds = sceneVisual.getBoundingClientRect();
    position.x = Math.max(0, (bounds.width - player.offsetWidth) / 2);
    position.y = Math.max(0, bounds.height - player.offsetHeight - 24);
    drawPlayer();
}

function drawPlayer() {
    player.style.left = `${position.x}px`;
    player.style.top = `${position.y}px`;
}

function keepPlayerInScene() {
    const bounds = sceneVisual.getBoundingClientRect();
    position.x = Math.max(0, Math.min(position.x, bounds.width - player.offsetWidth));
    position.y = Math.max(0, Math.min(position.y, bounds.height - player.offsetHeight));
}

function movePlayer(now) {
    if (!controlsReady) return;
    movePlayer.lastTime ??= now;
    const step = 220 * Math.min((now - movePlayer.lastTime) / 1000, 0.05);
    movePlayer.lastTime = now;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) position.y -= step;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) position.y += step;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) position.x -= step;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) position.x += step;
    keepPlayerInScene();
    drawPlayer();
    frame = requestAnimationFrame(movePlayer);
}

async function startGame() {
    if (started) return;
    started = true;
    startButton.disabled = true;
    const { overlay, title } = makeOverlay();

    changeOpacity(overlay, 1, TIMING.fadeToBlack);
    loadingScreen.style.transition = `opacity ${TIMING.fadeToBlack}ms ease-in-out`;
    loadingScreen.style.opacity = "0";
    await sleep(TIMING.fadeToBlack);
    loadingScreen.style.display = "none";

    changeOpacity(title, 1, TIMING.titleIn);
    await sleep(TIMING.titleIn + TIMING.hold);
    changeOpacity(title, 0, TIMING.titleOut);
    await sleep(TIMING.titleOut + TIMING.blackPause);

    mainContent.hidden = false;
    positionPlayer();
    await sleep(80);
    changeOpacity(overlay, 0, TIMING.fadeToScene);
    await sleep(TIMING.fadeToScene);
    overlay.remove();

    controlsReady = true;
    movePlayer.lastTime = null;
    frame = requestAnimationFrame(movePlayer);
}

startButton.addEventListener("click", () => {
    startGame().catch((error) => console.error("Start sequence failed:", error));
}, { once: true });

document.addEventListener("keydown", (event) => {
    if (!controlsReady || !movementKeys.has(event.key)) return;
    event.preventDefault();
    keys.add(event.key);
});
document.addEventListener("keyup", (event) => keys.delete(event.key));
window.addEventListener("blur", () => keys.clear());
window.addEventListener("resize", () => {
    if (!controlsReady) return;
    keepPlayerInScene();
    drawPlayer();
});

// The planet image is in the project root, beside index.html.
const backgroundTest = new Image();
backgroundTest.onload = () => sceneVisual.classList.add("has-background-image");
backgroundTest.onerror = () => console.error("Could not load planet background at ./planet-earth-4-54-billion-years-ago.jpg");
backgroundTest.src = "planet-earth-4-54-billion-years-ago.jpg";

settingsButton.addEventListener("click", () => alert("Settings will be available soon."));
creditsButton.addEventListener("click", () => alert("The Lamasery of Saint Brytrebarunare\n\nCreated with imagination, code and a little bit of divine intervention."));
exitButton.addEventListener("click", () => {
    if (confirm("Do you want to leave The Lamasery?")) window.location.href = "about:blank";
});
