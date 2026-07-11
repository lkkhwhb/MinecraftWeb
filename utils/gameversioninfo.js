
let numMods = 0;

export function updateGameVersionInfo(numMods){
    numMods = numMods;
    let finalText = getGameVersionInfo();
    const gameVersionInfobyID = document.getElementById("gameVersionInfo");
    gameVersionInfobyID.innerHTML= `${finalText}`;
    document.title = finalText;

    return finalText;
}

export function getGameVersionInfo(){
    const gameVersion = "Minecraft 26.2";
    let finalText, isModded;

    if (numMods != 0){
        isModded = true;
    } else {
        isModded = false;
    }

    if (isModded != false){
        finalText = gameVersion + " (Modded)";
    } else {
        finalText = gameVersion;
    }

    return finalText
}
