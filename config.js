export const DebugConfig = {
    engine: {
        name: "Aurora Engine",
        version: "dev",
        build: "local",
    },

    renderer: {
        name: "Apex Renderer",
        backend: "WebGL2",
        version: "dev",

        vendor: "Unknown Vendor",
        device: "Unknown GPU",
    },

    graphics: {
        clouds: "Default",
        filtering: "Linear",

        renderDistance: 8,
        simulationDistance: 8,

        vsync: true,
        fullscreen: false,
    },

    world: {
        name: "Unknown World",

        chunksLoaded: 0,
        entitiesLoaded: 0,

        atlasWidth: 2048,
        atlasHeight: 2048,
        atlasMaps: 0,
    },

    player: {
        x: 0,
        y: 64,
        z: 0,

        yaw: 0,
        pitch: 0,
    },

    performance: {
        fps: 0,
        frameTime: 0,

        allocationRate: "0 MiB/s",
        offHeap: "0 MiB",
    }
};

export function getEngineInfo() {
    return DebugConfig.engine;
}

export function getRendererInfo() {
    return DebugConfig.renderer;
}

export function getGraphicsInfo() {
    return DebugConfig.graphics;
}

export function getWorldInfo() {
    return DebugConfig.world;
}

export function getPlayerInfo() {
    return DebugConfig.player;
}

export function getPerformanceInfo() {
    return DebugConfig.performance;
}

export function getSystemInfo() {
    const mem = performance.memory;

    return {
        browser:
            navigator.userAgentData?.brands
                ?.map(b => b.brand)
                .join(", ") ?? "Browser",

        platform: navigator.platform,

        cpuThreads: navigator.hardwareConcurrency ?? "Unknown",

        display: {
            width: window.innerWidth,
            height: window.innerHeight,
        },

        memory: mem
            ? {
                  supported: true,
                  used: (mem.usedJSHeapSize / 1048576).toFixed(0),
                  total: (mem.totalJSHeapSize / 1048576).toFixed(0),
                  limit: (mem.jsHeapSizeLimit / 1048576).toFixed(0),
                  percent: Math.round(
                      (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100
                  ),
              }
            : {
                  supported: false,
                  used: "N/A",
                  total: "N/A",
                  limit: "N/A",
                  percent: 0,
              },
    };
}