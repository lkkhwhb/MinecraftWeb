import { getGameVersionInfo } from "../utils/gameversioninfo.js";
import {
    getRendererInfo,
    getGraphicsInfo,
    getWorldInfo,
    getPerformanceInfo,
    getSystemInfo
} from "../config.js";

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

            const fpsColor =
    perf.fps >= 120 ? "text-green" :
    perf.fps >= 60 ? "text-orange" :
    "text-red";

const memColor =
    system.memory.percent >= 90 ? "text-red" :
    system.memory.percent >= 70 ? "text-orange" :
    "text-green";

this.left.innerHTML = `
<div class="debug-line">
<span class="${fpsColor}">${perf.fps} FPS (${perf.frameTime.toFixed(2)} ms)</span>
</div>

<br>

<div class="debug-line">
Clouds: <span class="text-orange">${graphics.clouds}</span>
</div>

<div class="debug-line">
Filtering: <span class="text-orange">${graphics.filtering}</span>
</div>

<div class="debug-line">
Render Distance: <span class="text-green">${graphics.renderDistance}</span>
</div>

<div class="debug-line">
Simulation Distance: <span class="text-green">${graphics.simulationDistance}</span>
</div>

<br>

<div class="debug-line">
<span class="text-green">${renderer.name}</span>
<span class="text-orange">(${renderer.version})</span>
</div>

<div class="debug-line">
Backend: <span class="text-orange">${renderer.backend}</span>
</div>

<br>

<div class="debug-line">
Atlas:
<span class="text-green">${world.atlasWidth}×${world.atlasHeight}</span>
<span class="text-orange">(${world.atlasMaps} maps)</span>
</div>

<div class="debug-line">
Chunks Loaded:
<span class="text-green">${world.chunksLoaded}</span>
</div>

<div class="debug-line">
Entities Loaded:
<span class="text-green">${world.entitiesLoaded}</span>
</div>
`;

this.right.innerHTML = `
<div class="debug-line">
<span class="text-green">${version}</span>
</div>

<br>

<div class="debug-line">
FPS:
<span class="${fpsColor}">${perf.fps}</span>
</div>

<br>

<div class="debug-line">
Mem:
<span class="${memColor}">${system.memory.percent}%</span>
<span class="${memColor}">
${system.memory.used}/${system.memory.limit} MiB
</span>
</div>

<div class="debug-line">
Allocated:
<span class="text-orange">${system.memory.total} MiB</span>
</div>

<div class="debug-line">
Allocation Rate:
<span class="text-orange">${perf.allocationRate}</span>
</div>

<div class="debug-line">
Off-Heap:
<span class="text-orange">${perf.offHeap}</span>
</div>

<br>

<div class="debug-line">
Browser:
<span class="text-orange">${system.browser}</span>
</div>

<div class="debug-line">
CPU:
<span class="text-green">${system.cpuThreads}</span> Threads
</div>

<div class="debug-line">
Display:
<span class="text-green">${system.display.width}×${system.display.height}</span>
<span class="text-orange">(${system.platform})</span>
</div>

<div class="debug-line">
Vendor:
<span class="text-orange">${renderer.vendor}</span>
</div>

<div class="debug-line">
GPU:
<span class="text-green">${renderer.device}</span>
</div>

<div class="debug-line">
Backend:
<span class="text-orange">${renderer.backend}</span>
</div>
`;
        }

        requestAnimationFrame(this.update.bind(this));
    }
}