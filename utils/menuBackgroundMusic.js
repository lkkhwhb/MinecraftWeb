let bgMusic;
let musicEnabled = false;

export function toggleBgMusic() {
    const button = document.getElementById("audioButton");

    if (!bgMusic) {
        bgMusic = new Audio("./minecraft_assets/sounds/music/game/subwoofer_lullaby.ogg");
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
    }

    musicEnabled = !musicEnabled;

    button.classList.toggle("hovered", musicEnabled);

    if (musicEnabled) {
        bgMusic.play().catch(console.error);
        button.title = "Background Music: On";
    } else {
        bgMusic.pause();
        button.title = "Background Music: Off";
    }
}