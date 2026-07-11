import * as THREE from "three";

export class Panorama {
    constructor() {
        this.canvas = document.getElementById("panorama");
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.loadPanorama();
        this.time = 0;

        window.addEventListener("resize", () => this.onResize());
    }

    loadPanorama() {
        const loader = new THREE.CubeTextureLoader();
        
        const cube = loader.load([
            "minecraft_assets/textures/gui/title/background/panorama_1.png", // +X Right
            "minecraft_assets/textures/gui/title/background/panorama_3.png", // -X Left
            "minecraft_assets/textures/gui/title/background/panorama_4.png", // +Y Top
            "minecraft_assets/textures/gui/title/background/panorama_5.png", // -Y Bottom
            "minecraft_assets/textures/gui/title/background/panorama_0.png", // +Z Front
            "minecraft_assets/textures/gui/title/background/panorama_2.png"  // -Z Back
        ]);

        this.scene.background = cube;
    }

    start() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.001;
        this.camera.rotation.y -= 0.0005; 
        this.camera.rotation.x = Math.sin(this.time) * 0.02;
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
