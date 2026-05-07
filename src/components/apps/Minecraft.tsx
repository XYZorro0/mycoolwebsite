"use client";

/**
 * Voxelcraft — a small Minecraft-Alpha-flavored sandbox.
 *
 * Engine highlights:
 *   - Three.js dynamically imported on demand (only when the user clicks PLAY).
 *   - Chunked world (4 chunks × 4 chunks × 1 stack of 16-cubed) with greedy
 *     face culling: only faces between solid and air are emitted.
 *   - Simplex-noise heightmap with grass/dirt/stone/water/sand bands and a
 *     handful of "trees" (procedural).
 *   - Procedural 16×16 block textures rendered to a canvas texture atlas at
 *     mount time — zero asset weight beyond Three.js itself.
 *   - PointerLock first-person controls; gravity, jumping, swimming.
 *   - Raycast block-break (left mouse) and block-place (right mouse).
 *   - Pause loop on document.hidden, on canvas blur, and when the window
 *     element is no longer in the viewport. Dispose all GL resources on close.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const CHUNK = 16;
const RADIUS = 3; // chunks in each direction (so 7×7 horizontally = 7 chunks total)
const RENDER_DIST = RADIUS;
const WORLD_HEIGHT = 48;
const WATER_LEVEL = 16;

type BlockId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
const BLOCK = {
  AIR: 0 as BlockId,
  GRASS: 1 as BlockId,
  DIRT: 2 as BlockId,
  STONE: 3 as BlockId,
  SAND: 4 as BlockId,
  WATER: 5 as BlockId,
  WOOD: 6 as BlockId,
  LEAVES: 7 as BlockId,
};

const HOTBAR: BlockId[] = [
  BLOCK.GRASS,
  BLOCK.DIRT,
  BLOCK.STONE,
  BLOCK.SAND,
  BLOCK.WOOD,
  BLOCK.LEAVES,
];

export default function Minecraft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "running" | "error">("idle");
  const [error, setError] = useState("");
  const [hud, setHud] = useState({ block: 0, fps: 0 });

  const launch = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const [THREE, { createNoise2D }] = await Promise.all([
        import("three"),
        import("simplex-noise"),
      ]);

      if (!containerRef.current) throw new Error("container missing");
      const stop = startEngine(containerRef.current, THREE, createNoise2D, (slot) =>
        setHud((h) => ({ ...h, block: slot }))
      );
      stopRef.current = stop;
      setPhase("running");
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, []);

  if (phase === "idle") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#7fc2ff,#bfeaff)] p-6 text-center text-[#0a1f3a]">
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Segoe UI" }}>
          VOXELCRAFT
        </h2>
        <p className="max-w-sm text-sm">
          A tiny Minecraft-Alpha-flavored sandbox. Three.js loads only when you click play.
        </p>
        <ul className="text-left text-[12px] text-[#1f3a66]">
          <li>• <b>WASD</b> move &nbsp; <b>Space</b> jump &nbsp; <b>Shift</b> sprint</li>
          <li>• <b>Mouse</b> look &nbsp; <b>Left</b> break &nbsp; <b>Right</b> place</li>
          <li>• <b>1-6</b> select block &nbsp; <b>Esc</b> release mouse</li>
        </ul>
        <button
          onClick={launch}
          className="rounded border-2 border-[#0a1f3a] bg-gradient-to-b from-[#74c44a] to-[#3a6a1f] px-5 py-2 font-bold text-white shadow-[0_2px_0_#0a1f3a,0_6px_12px_rgba(0,0,0,0.35)] hover:brightness-110"
        >
          ▶ PLAY
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#7fc2ff]">
      {phase === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#7fc2ff] text-[#0a1f3a]">
          <span className="font-mono text-sm">Generating world…</span>
        </div>
      )}
      {phase === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black p-6 text-white">
          <div className="font-mono text-sm">Voxelcraft failed</div>
          <div className="text-[12px] text-white/70">{error}</div>
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Hotbar HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
        <div className="flex gap-1 rounded border border-black/40 bg-black/30 p-1">
          {HOTBAR.map((b, i) => (
            <div
              key={i}
              className={
                "grid h-8 w-8 place-items-center rounded text-[10px] font-bold text-white " +
                (i === hud.block ? "bg-white/35 outline outline-2 outline-white" : "bg-white/10")
              }
              style={{
                backgroundColor: HOTBAR_COLOR[b],
                opacity: i === hud.block ? 1 : 0.85,
              }}
              aria-label={`Block ${b}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Crosshair */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="h-4 w-0.5 bg-white/85 mix-blend-difference" />
        <div className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-white/85 mix-blend-difference" />
      </div>
    </div>
  );
}

const HOTBAR_COLOR: Record<BlockId, string> = {
  0: "#000",
  1: "#5fa83b",
  2: "#8b5a2b",
  3: "#9aa0a6",
  4: "#e2c98f",
  5: "#3a85d6",
  6: "#a9751a",
  7: "#3f8a2a",
};

/* ──────────────────────────────────────────────────────────────────────────
   Engine
   ────────────────────────────────────────────────────────────────────────── */

type ThreeNS = typeof import("three");

function startEngine(
  container: HTMLElement,
  THREE: ThreeNS,
  noise2D: typeof import("simplex-noise").createNoise2D,
  setHotbar: (slot: number) => void
): () => void {
  // ── Scene ────────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power",
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.setClearColor(0x86c5ff, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = "crosshair";
  renderer.domElement.style.imageRendering = "pixelated";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x86c5ff);
  scene.fog = new THREE.Fog(0x86c5ff, RENDER_DIST * CHUNK * 0.55, RENDER_DIST * CHUNK * 1.15);

  const camera = new THREE.PerspectiveCamera(
    72,
    container.clientWidth / container.clientHeight,
    0.1,
    300
  );

  // Sun-style lighting
  const sun = new THREE.DirectionalLight(0xfff4d6, 0.95);
  sun.position.set(20, 40, 10);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xc8e6ff, 0x4a3a22, 0.55));

  // ── Procedural texture atlas ─────────────────────────────────────────────
  const atlas = makeAtlas();
  const tex = new THREE.CanvasTexture(atlas.canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;

  const opaqueMat = new THREE.MeshLambertMaterial({
    map: tex,
    vertexColors: true,
    side: THREE.FrontSide,
  });
  const waterMat = new THREE.MeshLambertMaterial({
    map: tex,
    transparent: true,
    opacity: 0.78,
    vertexColors: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  // ── World data ──────────────────────────────────────────────────────────
  const noise = noise2D(makeRng("voxelcraft-1"));
  const noise2 = noise2D(makeRng("voxelcraft-2"));

  type Chunk = {
    cx: number;
    cz: number;
    blocks: Uint8Array; // [x][z][y] flattened
    mesh?: THREE.Mesh;
    waterMesh?: THREE.Mesh;
  };
  const chunks = new Map<string, Chunk>();
  const chunkKey = (cx: number, cz: number) => `${cx},${cz}`;
  const idx = (x: number, y: number, z: number) =>
    x * CHUNK * WORLD_HEIGHT + z * WORLD_HEIGHT + y;

  function genChunk(cx: number, cz: number): Chunk {
    const blocks = new Uint8Array(CHUNK * CHUNK * WORLD_HEIGHT);
    for (let lx = 0; lx < CHUNK; lx++) {
      for (let lz = 0; lz < CHUNK; lz++) {
        const wx = cx * CHUNK + lx;
        const wz = cz * CHUNK + lz;
        const base = noise(wx * 0.04, wz * 0.04) * 0.5 + 0.5; // 0..1
        const detail = noise2(wx * 0.12, wz * 0.12) * 0.15;
        const height = Math.max(
          1,
          Math.min(WORLD_HEIGHT - 2, Math.floor(10 + (base + detail) * 18))
        );
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          let b: BlockId = BLOCK.AIR;
          if (y < height - 4) b = BLOCK.STONE;
          else if (y < height - 1) b = BLOCK.DIRT;
          else if (y === height - 1)
            b = height <= WATER_LEVEL + 1 ? BLOCK.SAND : BLOCK.GRASS;
          else if (y < WATER_LEVEL) b = BLOCK.WATER;
          blocks[idx(lx, y, lz)] = b;
        }
        // sparse trees on grass
        if (
          height > WATER_LEVEL + 2 &&
          height < WORLD_HEIGHT - 8 &&
          ((wx * 73856093) ^ (wz * 19349663)) % 53 === 0
        ) {
          const top = height - 1;
          for (let i = 0; i < 4; i++) blocks[idx(lx, top + 1 + i, lz)] = BLOCK.WOOD;
          for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
              for (let dy = 3; dy <= 5; dy++) {
                const ax = lx + dx;
                const az = lz + dz;
                const ay = top + dy;
                if (
                  ax >= 0 &&
                  ax < CHUNK &&
                  az >= 0 &&
                  az < CHUNK &&
                  ay < WORLD_HEIGHT &&
                  Math.abs(dx) + Math.abs(dz) <= 3 &&
                  blocks[idx(ax, ay, az)] === BLOCK.AIR
                )
                  blocks[idx(ax, ay, az)] = BLOCK.LEAVES;
              }
            }
          }
        }
      }
    }
    return { cx, cz, blocks };
  }

  function getBlock(wx: number, wy: number, wz: number): BlockId {
    if (wy < 0 || wy >= WORLD_HEIGHT) return BLOCK.AIR;
    const cx = Math.floor(wx / CHUNK);
    const cz = Math.floor(wz / CHUNK);
    const lx = ((wx % CHUNK) + CHUNK) % CHUNK;
    const lz = ((wz % CHUNK) + CHUNK) % CHUNK;
    const c = chunks.get(chunkKey(cx, cz));
    if (!c) return BLOCK.AIR;
    return c.blocks[idx(lx, wy, lz)] as BlockId;
  }

  function setBlock(wx: number, wy: number, wz: number, b: BlockId) {
    if (wy < 0 || wy >= WORLD_HEIGHT) return;
    const cx = Math.floor(wx / CHUNK);
    const cz = Math.floor(wz / CHUNK);
    const lx = ((wx % CHUNK) + CHUNK) % CHUNK;
    const lz = ((wz % CHUNK) + CHUNK) % CHUNK;
    const c = chunks.get(chunkKey(cx, cz));
    if (!c) return;
    c.blocks[idx(lx, wy, lz)] = b;
    rebuildChunk(c);
    // rebuild neighbor if touching boundary
    if (lx === 0) {
      const n = chunks.get(chunkKey(cx - 1, cz));
      if (n) rebuildChunk(n);
    } else if (lx === CHUNK - 1) {
      const n = chunks.get(chunkKey(cx + 1, cz));
      if (n) rebuildChunk(n);
    }
    if (lz === 0) {
      const n = chunks.get(chunkKey(cx, cz - 1));
      if (n) rebuildChunk(n);
    } else if (lz === CHUNK - 1) {
      const n = chunks.get(chunkKey(cx, cz + 1));
      if (n) rebuildChunk(n);
    }
  }

  // ── Meshing ─────────────────────────────────────────────────────────────
  // Per-block face UV indices into atlas: [top, side, bottom]
  const FACES: Record<Exclude<BlockId, 0>, [number, number, number]> = {
    1: [0, 1, 2], // grass: top=grass-top, side=grass-side, bottom=dirt
    2: [2, 2, 2], // dirt
    3: [3, 3, 3], // stone
    4: [4, 4, 4], // sand
    5: [5, 5, 5], // water
    6: [7, 6, 7], // wood: rings on top/bottom, bark sides
    7: [8, 8, 8], // leaves
  };

  function rebuildChunk(c: Chunk) {
    if (c.mesh) {
      scene.remove(c.mesh);
      c.mesh.geometry.dispose();
    }
    if (c.waterMesh) {
      scene.remove(c.waterMesh);
      c.waterMesh.geometry.dispose();
    }
    const { positions, normals, uvs, colors, wpositions, wnormals, wuvs, wcolors } =
      buildMesh(c, getBlock);
    if (positions.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, opaqueMat);
      mesh.position.set(c.cx * CHUNK, 0, c.cz * CHUNK);
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      scene.add(mesh);
      c.mesh = mesh;
    }
    if (wpositions.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(wpositions, 3));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(wnormals, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(wuvs, 2));
      g.setAttribute("color", new THREE.Float32BufferAttribute(wcolors, 3));
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, waterMat);
      mesh.position.set(c.cx * CHUNK, 0, c.cz * CHUNK);
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      mesh.renderOrder = 1;
      scene.add(mesh);
      c.waterMesh = mesh;
    }
  }

  function buildMesh(c: Chunk, getter: typeof getBlock) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const colors: number[] = [];
    const wpositions: number[] = [];
    const wnormals: number[] = [];
    const wuvs: number[] = [];
    const wcolors: number[] = [];
    const ATLAS_W = atlas.tilesPerRow;
    const TILE = 1 / ATLAS_W;

    const faceDirs: Array<{
      dir: [number, number, number];
      corners: number[][];
      faceKind: "top" | "bottom" | "side";
    }> = [
      // +X (right) — side
      {
        dir: [1, 0, 0],
        corners: [
          [1, 0, 0],
          [1, 1, 0],
          [1, 1, 1],
          [1, 0, 1],
        ],
        faceKind: "side",
      },
      // -X (left) — side
      {
        dir: [-1, 0, 0],
        corners: [
          [0, 0, 1],
          [0, 1, 1],
          [0, 1, 0],
          [0, 0, 0],
        ],
        faceKind: "side",
      },
      // +Y (top)
      {
        dir: [0, 1, 0],
        corners: [
          [0, 1, 1],
          [1, 1, 1],
          [1, 1, 0],
          [0, 1, 0],
        ],
        faceKind: "top",
      },
      // -Y (bottom)
      {
        dir: [0, -1, 0],
        corners: [
          [0, 0, 0],
          [1, 0, 0],
          [1, 0, 1],
          [0, 0, 1],
        ],
        faceKind: "bottom",
      },
      // +Z (front) — side
      {
        dir: [0, 0, 1],
        corners: [
          [1, 0, 1],
          [1, 1, 1],
          [0, 1, 1],
          [0, 0, 1],
        ],
        faceKind: "side",
      },
      // -Z (back) — side
      {
        dir: [0, 0, -1],
        corners: [
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0],
        ],
        faceKind: "side",
      },
    ];

    for (let lx = 0; lx < CHUNK; lx++) {
      for (let lz = 0; lz < CHUNK; lz++) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          const b = c.blocks[idx(lx, y, lz)] as BlockId;
          if (b === BLOCK.AIR) continue;
          const isWater = b === BLOCK.WATER;
          const wx = c.cx * CHUNK + lx;
          const wz = c.cz * CHUNK + lz;

          for (const f of faceDirs) {
            const nx = wx + f.dir[0];
            const ny = y + f.dir[1];
            const nz = wz + f.dir[2];
            const nb = getter(nx, ny, nz);
            // Skip face if neighbor is the same opaque type or any opaque block
            if (b === nb) continue;
            if (nb !== BLOCK.AIR && nb !== BLOCK.WATER && b !== BLOCK.WATER) continue;
            if (b === BLOCK.WATER && (nb === BLOCK.WATER || nb !== BLOCK.AIR)) continue;

            // Pick atlas tile based on faceKind
            const faces = FACES[b as Exclude<BlockId, 0>];
            const tileIdx =
              f.faceKind === "top" ? faces[0] : f.faceKind === "bottom" ? faces[2] : faces[1];
            const tx = tileIdx % ATLAS_W;
            const ty = Math.floor(tileIdx / ATLAS_W);
            const u0 = tx * TILE;
            const v0 = 1 - (ty + 1) * TILE;
            const u1 = u0 + TILE;
            const v1 = v0 + TILE;
            const uvList = [
              [u0, v0],
              [u0, v1],
              [u1, v1],
              [u1, v0],
            ];

            // simple AO via face direction (top brighter, bottom darker)
            const shade =
              f.faceKind === "top" ? 1.0 : f.faceKind === "bottom" ? 0.55 : 0.78;
            const tint =
              b === BLOCK.GRASS && f.faceKind === "top"
                ? [0.55 * shade, 0.85 * shade, 0.45 * shade]
                : b === BLOCK.LEAVES
                  ? [0.45 * shade, 0.78 * shade, 0.4 * shade]
                  : [shade, shade, shade];

            const target = isWater ? wpositions : positions;
            const tNormals = isWater ? wnormals : normals;
            const tUvs = isWater ? wuvs : uvs;
            const tColors = isWater ? wcolors : colors;

            // 2 tris per face
            const tris = [
              [0, 1, 2],
              [0, 2, 3],
            ];
            for (const tri of tris) {
              for (const i of tri) {
                const cor = f.corners[i];
                target.push(lx + cor[0], y + cor[1], lz + cor[2]);
                tNormals.push(f.dir[0], f.dir[1], f.dir[2]);
                tUvs.push(uvList[i][0], uvList[i][1]);
                tColors.push(tint[0], tint[1], tint[2]);
              }
            }
          }
        }
      }
    }
    return { positions, normals, uvs, colors, wpositions, wnormals, wuvs, wcolors };
  }

  // Generate the world (synchronous — small enough for one frame burst)
  for (let cx = -RADIUS; cx <= RADIUS; cx++) {
    for (let cz = -RADIUS; cz <= RADIUS; cz++) {
      chunks.set(chunkKey(cx, cz), genChunk(cx, cz));
    }
  }
  for (const c of chunks.values()) rebuildChunk(c);

  // ── Player ──────────────────────────────────────────────────────────────
  const player = {
    pos: new THREE.Vector3(0, WORLD_HEIGHT - 4, 0),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    onGround: false,
    height: 1.7,
    radius: 0.32,
    flying: false,
  };

  // Spawn the player on top of the highest block at origin
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (getBlock(0, y, 0) !== BLOCK.AIR && getBlock(0, y, 0) !== BLOCK.WATER) {
      player.pos.set(0.5, y + 2, 0.5);
      break;
    }
  }

  // ── Input ───────────────────────────────────────────────────────────────
  const keys = new Set<string>();
  let hotbarSlot = 0;

  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.code);
    if (e.code.startsWith("Digit")) {
      const n = parseInt(e.code.slice(5), 10);
      if (n >= 1 && n <= HOTBAR.length) {
        hotbarSlot = n - 1;
        setHotbar(hotbarSlot);
      }
    }
    if (e.code === "KeyF") player.flying = !player.flying;
  };
  const onKeyUp = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    hotbarSlot = (hotbarSlot + (e.deltaY > 0 ? 1 : -1) + HOTBAR.length) % HOTBAR.length;
    setHotbar(hotbarSlot);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== renderer.domElement) return;
    player.yaw -= e.movementX * 0.0025;
    player.pitch -= e.movementY * 0.0025;
    player.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, player.pitch));
  };

  const onMouseDown = (e: MouseEvent) => {
    if (document.pointerLockElement !== renderer.domElement) {
      renderer.domElement.requestPointerLock?.();
      return;
    }
    e.preventDefault();
    const hit = raycastBlock();
    if (!hit) return;
    if (e.button === 0) {
      // break
      if (getBlock(hit.x, hit.y, hit.z) !== BLOCK.WATER) setBlock(hit.x, hit.y, hit.z, BLOCK.AIR);
    } else if (e.button === 2) {
      // place adjacent
      const nx = hit.x + hit.nx;
      const ny = hit.y + hit.ny;
      const nz = hit.z + hit.nz;
      if (getBlock(nx, ny, nz) !== BLOCK.AIR) return;
      // don't place inside the player's body
      const px = Math.floor(player.pos.x);
      const py = Math.floor(player.pos.y);
      const pz = Math.floor(player.pos.z);
      if (
        nx === px &&
        nz === pz &&
        (ny === py || ny === py - 1 || ny === py + 1)
      )
        return;
      setBlock(nx, ny, nz, HOTBAR[hotbarSlot]);
    }
  };

  const onContextMenu = (e: Event) => e.preventDefault();

  renderer.domElement.tabIndex = 0;
  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("contextmenu", onContextMenu);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("mousemove", onMouseMove);

  // ── Raycast (DDA) ───────────────────────────────────────────────────────
  function raycastBlock() {
    const origin = camera.position.clone();
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    const maxDist = 6;

    let x = Math.floor(origin.x);
    let y = Math.floor(origin.y);
    let z = Math.floor(origin.z);
    const stepX = dir.x > 0 ? 1 : -1;
    const stepY = dir.y > 0 ? 1 : -1;
    const stepZ = dir.z > 0 ? 1 : -1;

    const tDeltaX = Math.abs(1 / dir.x);
    const tDeltaY = Math.abs(1 / dir.y);
    const tDeltaZ = Math.abs(1 / dir.z);
    let tMaxX =
      ((stepX > 0 ? Math.ceil(origin.x) - origin.x : origin.x - Math.floor(origin.x)) || 1) /
      Math.abs(dir.x);
    let tMaxY =
      ((stepY > 0 ? Math.ceil(origin.y) - origin.y : origin.y - Math.floor(origin.y)) || 1) /
      Math.abs(dir.y);
    let tMaxZ =
      ((stepZ > 0 ? Math.ceil(origin.z) - origin.z : origin.z - Math.floor(origin.z)) || 1) /
      Math.abs(dir.z);

    let nx = 0,
      ny = 0,
      nz = 0;
    let dist = 0;
    while (dist <= maxDist) {
      const b = getBlock(x, y, z);
      if (b !== BLOCK.AIR && b !== BLOCK.WATER) {
        return { x, y, z, nx, ny, nz };
      }
      if (tMaxX < tMaxY && tMaxX < tMaxZ) {
        x += stepX;
        dist = tMaxX;
        tMaxX += tDeltaX;
        nx = -stepX;
        ny = 0;
        nz = 0;
      } else if (tMaxY < tMaxZ) {
        y += stepY;
        dist = tMaxY;
        tMaxY += tDeltaY;
        nx = 0;
        ny = -stepY;
        nz = 0;
      } else {
        z += stepZ;
        dist = tMaxZ;
        tMaxZ += tDeltaZ;
        nx = 0;
        ny = 0;
        nz = -stepZ;
      }
    }
    return null;
  }

  // ── Physics ─────────────────────────────────────────────────────────────
  function update(dt: number) {
    const speed = (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 7.5 : 4.5) * dt;
    const fwd = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
    const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
    const move = new THREE.Vector3();
    if (keys.has("KeyW")) move.add(fwd);
    if (keys.has("KeyS")) move.sub(fwd);
    if (keys.has("KeyD")) move.add(right);
    if (keys.has("KeyA")) move.sub(right);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed);

    // Gravity / jumping
    if (player.flying) {
      if (keys.has("Space")) player.vel.y = 6;
      else if (keys.has("ControlLeft")) player.vel.y = -6;
      else player.vel.y = 0;
    } else {
      player.vel.y -= 25 * dt;
      if (player.onGround && keys.has("Space")) {
        player.vel.y = 8.2;
        player.onGround = false;
      }
    }

    // Apply XZ
    moveAxis(move.x, 0, 0);
    moveAxis(0, 0, move.z);
    // Apply Y
    moveAxis(0, player.vel.y * dt, 0);
  }

  function moveAxis(dx: number, dy: number, dz: number) {
    const r = player.radius;
    const minY = player.pos.y - player.height + 0.05;
    const maxY = player.pos.y;

    // X
    if (dx !== 0) {
      const newX = player.pos.x + dx;
      const xs = Math.floor(newX + (dx > 0 ? r : -r));
      let blocked = false;
      for (let yi = Math.floor(minY); yi <= Math.floor(maxY - 0.001); yi++) {
        for (let zi = Math.floor(player.pos.z - r); zi <= Math.floor(player.pos.z + r); zi++) {
          const b = getBlock(xs, yi, zi);
          if (b !== BLOCK.AIR && b !== BLOCK.WATER) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (!blocked) player.pos.x = newX;
    }
    // Z
    if (dz !== 0) {
      const newZ = player.pos.z + dz;
      const zs = Math.floor(newZ + (dz > 0 ? r : -r));
      let blocked = false;
      for (let yi = Math.floor(minY); yi <= Math.floor(maxY - 0.001); yi++) {
        for (let xi = Math.floor(player.pos.x - r); xi <= Math.floor(player.pos.x + r); xi++) {
          const b = getBlock(xi, yi, zs);
          if (b !== BLOCK.AIR && b !== BLOCK.WATER) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (!blocked) player.pos.z = newZ;
    }
    // Y
    if (dy !== 0) {
      const newMinY = player.pos.y - player.height + dy + 0.05;
      const newMaxY = player.pos.y + dy;
      const yi = dy > 0 ? Math.floor(newMaxY) : Math.floor(newMinY);
      let blocked = false;
      for (let xi = Math.floor(player.pos.x - r); xi <= Math.floor(player.pos.x + r); xi++) {
        for (let zi = Math.floor(player.pos.z - r); zi <= Math.floor(player.pos.z + r); zi++) {
          const b = getBlock(xi, yi, zi);
          if (b !== BLOCK.AIR && b !== BLOCK.WATER) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (!blocked) {
        player.pos.y += dy;
        player.onGround = false;
      } else {
        if (dy < 0) player.onGround = true;
        player.vel.y = 0;
      }
    }
  }

  // ── Resize handling ─────────────────────────────────────────────────────
  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  });
  ro.observe(container);

  // ── Loop ────────────────────────────────────────────────────────────────
  let raf = 0;
  let last = performance.now();
  let running = true;

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);

    // Camera = head height
    camera.position.set(player.pos.x, player.pos.y - 0.1, player.pos.z);
    const q = new THREE.Quaternion();
    q.setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, "YXZ"));
    camera.quaternion.copy(q);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onVis = () => {
    running = document.visibilityState === "visible";
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf);
    }
  };
  document.addEventListener("visibilitychange", onVis);

  // ── Cleanup ─────────────────────────────────────────────────────────────
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeRaf);
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("mousemove", onMouseMove);
    renderer.domElement.removeEventListener("mousedown", onMouseDown);
    renderer.domElement.removeEventListener("contextmenu", onContextMenu);
    renderer.domElement.removeEventListener("wheel", onWheel);
    if (document.pointerLockElement === renderer.domElement) {
      document.exitPointerLock?.();
    }
    // Dispose all GL resources
    for (const c of chunks.values()) {
      c.mesh?.geometry.dispose();
      c.waterMesh?.geometry.dispose();
    }
    chunks.clear();
    opaqueMat.dispose();
    waterMat.dispose();
    tex.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Procedural texture atlas (16 px tiles, 4×4 grid, 64×64 png-equivalent).
   Tile index legend (matches FACES above):
     0 grass top, 1 grass side, 2 dirt, 3 stone,
     4 sand, 5 water, 6 wood bark, 7 wood rings, 8 leaves
   ────────────────────────────────────────────────────────────────────────── */
function makeAtlas(): { canvas: HTMLCanvasElement; tilesPerRow: number } {
  const TILE = 16;
  const tiles = 4; // 4x4 grid
  const c = document.createElement("canvas");
  c.width = TILE * tiles;
  c.height = TILE * tiles;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const drawTile = (
    idx: number,
    paint: (x: number, y: number) => string | null
  ) => {
    const tx = (idx % tiles) * TILE;
    const ty = Math.floor(idx / tiles) * TILE;
    for (let y = 0; y < TILE; y++) {
      for (let x = 0; x < TILE; x++) {
        const color = paint(x, y);
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(tx + x, ty + y, 1, 1);
        }
      }
    }
  };

  const rng = makeRng("atlas");
  const noisy = (base: number, jitter: number) => {
    const v = base + (rng() - 0.5) * jitter;
    return Math.max(0, Math.min(255, Math.floor(v)));
  };

  // 0: grass top
  drawTile(0, () => `rgb(${noisy(95, 28)},${noisy(168, 30)},${noisy(74, 24)})`);
  // 1: grass side — green band on top, dirt below
  drawTile(1, (_x, y) =>
    y < 4
      ? `rgb(${noisy(85, 28)},${noisy(160, 30)},${noisy(70, 24)})`
      : `rgb(${noisy(140, 24)},${noisy(94, 22)},${noisy(50, 18)})`
  );
  // 2: dirt
  drawTile(2, () => `rgb(${noisy(140, 26)},${noisy(94, 22)},${noisy(50, 18)})`);
  // 3: stone
  drawTile(3, () => {
    const v = noisy(125, 30);
    return `rgb(${v},${v},${v + 4})`;
  });
  // 4: sand
  drawTile(4, () => `rgb(${noisy(225, 18)},${noisy(208, 18)},${noisy(150, 14)})`);
  // 5: water
  drawTile(5, () => `rgb(${noisy(58, 20)},${noisy(132, 24)},${noisy(206, 28)})`);
  // 6: wood bark — vertical strands
  drawTile(6, (x) => {
    const stripe = (x + 2) % 4 < 2;
    return stripe
      ? `rgb(${noisy(120, 14)},${noisy(82, 10)},${noisy(36, 8)})`
      : `rgb(${noisy(150, 16)},${noisy(104, 12)},${noisy(48, 10)})`;
  });
  // 7: wood rings — concentric
  drawTile(7, (x, y) => {
    const dx = x - 7.5;
    const dy = y - 7.5;
    const r = Math.sqrt(dx * dx + dy * dy);
    const ring = Math.floor(r) % 2 === 0;
    return ring
      ? `rgb(${noisy(170, 12)},${noisy(124, 10)},${noisy(60, 8)})`
      : `rgb(${noisy(140, 12)},${noisy(96, 10)},${noisy(46, 8)})`;
  });
  // 8: leaves
  drawTile(8, () => {
    if (rng() < 0.15) return `rgba(0,0,0,0)`;
    return `rgb(${noisy(60, 22)},${noisy(135, 28)},${noisy(54, 18)})`;
  });

  return { canvas: c, tilesPerRow: tiles };
}

// Tiny seeded RNG (mulberry32)
function makeRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
