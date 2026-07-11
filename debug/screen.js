import { getGameVersionInfo } from "../utils/gameversioninfo.js";
import {
    getRendererInfo,
    getGraphicsInfo,
    getWorldInfo,
    getPerformanceInfo,
    getSystemInfo,
    getPlayerInfo
} from "../config.js";

function getFacingDirection(yaw) {
    let normYaw = yaw % 360;
    if (normYaw < 0) normYaw += 360;
    
    if (normYaw >= 45 && normYaw < 135) {
        return "west (Towards positive X)";
    } else if (normYaw >= 135 && normYaw < 225) {
        return "north (Towards negative Z)";
    } else if (normYaw >= 225 && normYaw < 315) {
        return "east (Towards negative X)";
    } else {
        return "south (Towards positive Z)";
    }
}

export class DebugScreen {
    constructor() {
        this.visible = false;

        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();

        this.left = document.createElement("div");
        this.right = document.createElement("div");

        this.left.id = "debug-left";
        this.right.id = "debug-right";

        document.body.appendChild(this.left);
        document.body.appendChild(this.right);

        this.left.style.display = "none";
        this.right.style.display = "none";

        this.createContext();

        document.addEventListener("keydown", (e) => {
            if (e.code === "F3") {
                e.preventDefault();
                this.toggle();
            }
        });

        requestAnimationFrame(this.update.bind(this));
    }

    createContext() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

        if (!gl) return;

        const renderer = getRendererInfo();

        renderer.version = gl.getParameter(gl.VERSION);

        const ext = gl.getExtension("WEBGL_debug_renderer_info");

        if (ext) {
            renderer.vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
            renderer.device = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        }
    }

    toggle() {
        this.visible = !this.visible;

        this.left.style.display = this.visible ? "block" : "none";
        this.right.style.display = this.visible ? "block" : "none";
    }

    update(now) {
        this.frames++;

        if (now - this.lastTime >= 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastTime = now;

            const perf = getPerformanceInfo();
            perf.fps = this.fps;
            perf.frameTime = 1000 / Math.max(this.fps, 1);
        }

        if (this.visible) {
            const version = getGameVersionInfo();
            const renderer = getRendererInfo();
            const graphics = getGraphicsInfo();
            const world = getWorldInfo();
            const perf = getPerformanceInfo();
            const system = getSystemInfo();
            const player = getPlayerInfo();

            const blockX = Math.floor(player.x);
            const blockY = Math.floor(player.y);
            const blockZ = Math.floor(player.z);

            const chunkX = Math.floor(player.x / 16);
            const chunkY = Math.floor(player.y / 16);
            const chunkZ = Math.floor(player.z / 16);

            const modX = ((blockX % 16) + 16) % 16;
            const modY = ((blockY % 16) + 16) % 16;
            const modZ = ((blockZ % 16) + 16) % 16;

            const regionX = Math.floor(chunkX / 32);
            const regionZ = Math.floor(chunkZ / 32);

            this.left.innerHTML = `
                <div class="debug-line">Minecraft ${version} (${version}/vanilla)</div>
                <div class="debug-line">${perf.fps} fps T: 120 ${graphics.vsync ? "vsync" : ""} fancy-clouds B: 2 GPU: 14%</div>
                <div class="debug-line">Integrated server @ ${perf.frameTime.toFixed(1)} ms, 1 tx, 0 rx</div>
                <div class="debug-line">C: ${world.chunksLoaded}/40344 (s) D: ${graphics.renderDistance}, pC: 000, pU: 00, aB: 06</div>
                <div class="debug-line">E: ${world.entitiesLoaded}/123, B: 0, SD: ${graphics.simulationDistance}</div>
                <div class="debug-line">P: 110. T: 123</div>
                <br>
                <div class="debug-line">XYZ: ${player.x.toFixed(3)} / ${player.y.toFixed(5)} / ${player.z.toFixed(3)}</div>
                <div class="debug-line">Block: ${blockX} ${blockY} ${blockZ} [${modX} ${modY} ${modZ}]</div>
                <div class="debug-line">Chunk: ${chunkX} ${chunkY} ${chunkZ} [${modX} ${modZ} in r.${regionX}.${regionZ}.mca]</div>
                <div class="debug-line">Facing: ${getFacingDirection(player.yaw)} (${player.yaw.toFixed(1)} / ${player.pitch.toFixed(1)})</div>
                <div class="debug-line">Client Light: 15 (15 sky, 0 block)</div>
                <div class="debug-line">CH S: 71 M: 71</div>
                <div class="debug-line">SH S: 71 O: 71 M: 71 ML: 71</div>
                <div class="debug-line">Biome: minecraft:sunflower_plains</div>
                <div class="debug-line">Local Difficulty: 2.25 // 0.13 (Day 0)</div>
                <div class="debug-line">NoiseRouter T: -0.089 V: -0.497 C: 0.134 E: -0.142 D: -0.036 W: 0.252 PV: -0.243 AS: -0.921 N: -0.00</div>
                <div class="debug-line">Biome builder PV: Low C: Mid inland E: 3 T: 2 H: 0</div>
                <div class="debug-line">SC: 289, M: 70, C: 302, A: 16, A: 0, U: 7, W: 6, W: 0, M: 0</div>
                <div class="debug-line">Sounds: 1/247 + 0/8 (Mood 0%)</div>
                <br>
                <div class="debug-line">Debug charts: [F3+1] Profiler hidden; [F3+2] FPS + TPS hidden; [F3+3] Ping hidden</div>
                <div class="debug-line">For help: press F3 + Q</div>
            `;

            this.right.innerHTML = `
                <div class="debug-line">Java: 17.0.8 64bit</div>
                <div class="debug-line">Mem: ${system.memory.percent}% ${system.memory.used}/${system.memory.limit}MB</div>
                <div class="debug-line">Allocation rate: ${perf.allocationRate}</div>
                <div class="debug-line">Allocated: 100% ${system.memory.total}MB</div>
                <br>
                <div class="debug-line">CPU: ${system.cpuThreads}x Web Threads (${system.platform})</div>
                <br>
                <div class="debug-line">Display: ${system.display.width}x${system.display.height} (${renderer.vendor})</div>
                <div class="debug-line">${renderer.device}</div>
                <div class="debug-line">${renderer.version}</div>
            `;
        }

        requestAnimationFrame(this.update.bind(this));
    }
}