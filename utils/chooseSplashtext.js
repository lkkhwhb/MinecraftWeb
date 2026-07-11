export function RenderSplashText() {
    const all_splash_text = [
        "Open Source!",
        "In Browser?",
        "Notch was GOAT!!",
        "Just Build",
        "It's not about the game",
        "Alone?",
        "Night Flies",
        "Have you grown up?",
        "You are love!!!"
    ];

    let random_text =  all_splash_text[Math.floor(Math.random() * all_splash_text.length)];

    const splashTextbyID = document.getElementById("splashText");

    splashTextbyID.innerText = random_text;
}