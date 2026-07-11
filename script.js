import { Panorama } from "./ui/panorama.js";
import { updateGameVersionInfo } from "./utils/gameversioninfo.js";
import { RenderSplashText } from "./utils/chooseSplashtext.js";
import { toggleBgMusic } from "./utils/menuBackgroundMusic.js";
import { DebugScreen } from "./debug/screen.js";

const panorama = new Panorama();
const numMods = 0;

const loadingBar = document.getElementById("loadingBar");
const loadingScreen = document.getElementById("loadingScreen");

const loadingScreenBgMusic = new Audio("/custom_assets/loadingscreen.weba");
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
    window.location.replace("/");
});
new DebugScreen();

updateGameVersionInfo(numMods);

RenderSplashText();
setInterval(RenderSplashText, 10000);