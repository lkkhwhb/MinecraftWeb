import JSZip from "jszip";

export class ModLoader {
    constructor(game) {
        this.game = game;
        this.mods = [];
    }

    async install(zipFile) {
        const zip = await JSZip.loadAsync(zipFile);
        const metadataFile = zip.file("metadata.json");
        if (!metadataFile)
            throw new Error("metadata.json missing");

        const metadata = JSON.parse(await metadataFile.async("text"));

        const required = [
            "id",
            "name",
            "version",
            "author",
            "description",
            "logo",
            "script"
        ];

        for (const key of required) {
            if (!metadata[key])
                throw new Error(`Missing "${key}"`);
        }

        const logoFile = zip.file(metadata.logo);
        if (!logoFile)
            throw new Error("Logo not found");

        const scriptFile = zip.file(metadata.script);
        if (!scriptFile)
            throw new Error("Script not found");

        const mod = {
            metadata,
            logo: await logoFile.async("blob"),
            code: await scriptFile.async("text"),
            zip
        };

        this.mods.push(mod);
        return mod;
    }

    async initialize(mod) {

        const blob = new Blob(
            [mod.code],
            { type: "text/javascript" }
        );

        const url = URL.createObjectURL(blob);
        const module = await import(url);

        if (module.initialize)
            await module.initialize(this.game);

        URL.revokeObjectURL(url);
    }

    getInstalledMods() {
        return this.mods;
    }
}