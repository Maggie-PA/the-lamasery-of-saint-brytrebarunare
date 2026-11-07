/* ======================================================
   THE LAMASERY OF SAINT BRYTREBARUNARE
   PATCH 3.0 — GOLDEN HOUR EDITION
====================================================== */

console.log(
    "Welcome to The Lamasery of Saint Brytrebarunare!"
);


/* ======================================================
   ELEMENTS
====================================================== */

const loadingScreen =
    document.getElementById("loading-screen");

const mainContent =
    document.getElementById("main-content");

const startButton =
    document.getElementById("start-button");

const settingsButton =
    document.getElementById("settings-button");

const creditsButton =
    document.getElementById("credits-button");

const exitButton =
    document.getElementById("exit-button");


/* ======================================================
   KEEP THE MAIN MENU VISIBLE
====================================================== */

/*
    IMPORTANT:

    The previous version automatically removed the
    menu after 5 seconds.

    Since this is the actual game menu, we keep it
    visible until the player chooses something.
*/

mainContent.style.display = "none";

document.body.style.overflow = "hidden";


/* ======================================================
   START GAME
====================================================== */

startButton.addEventListener("click", () => {

    console.log("Starting The Lamasery...");

    loadingScreen.style.transition =
        "opacity 1.5s ease";

    loadingScreen.style.opacity = "0";

    setTimeout(() => {

        loadingScreen.style.display = "none";

        mainContent.style.display = "block";

        document.body.style.overflow = "auto";

    }, 1500);

});


/* ======================================================
   SETTINGS
====================================================== */

settingsButton.addEventListener("click", () => {

    console.log("Settings selected.");

    alert(
        "Settings will be available soon."
    );

});


/* ======================================================
   CREDITS
====================================================== */

creditsButton.addEventListener("click", () => {

    console.log("Credits selected.");

    alert(
        "The Lamasery of Saint Brytrebarunare\n\n" +
        "Created with imagination, code and a little bit of divine intervention."
    );

});


/* ======================================================
   EXIT
====================================================== */

exitButton.addEventListener("click", () => {

    console.log("Exit selected.");

    /*
        Browsers normally prevent a webpage from
        closing itself.

        Instead, we give the player a harmless
        confirmation message.
    */

    const leaveGame =
        confirm(
            "Do you want to leave The Lamasery?"
        );

    if (leaveGame) {

        window.location.href =
            "about:blank";

    }

});