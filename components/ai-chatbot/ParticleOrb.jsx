'use client';

import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl';

// Canvas is bigger than the visible orb so particles can bleed outward during expansion.
const CANVAS_PX = 200;

// Three concentric particle layers:
// inner dense core → middle shell → sparse outer halo
const LAYERS = [
  {
    count: 10_000,
    radius: 0.72,
    sizeBase: 4.2,
    noiseScale: 1.8,
    flow: 1,
    colorA:      [0x3d / 255, 0x00 / 255, 0x6e / 255], // deep indigo-violet
    colorB:      [0x6b / 255, 0x00 / 255, 0x38 / 255], // deep magenta-crimson
    colorRibbon: [0xf4 / 255, 0x00 / 255, 0x76 / 255], // PMA hot pink
  },
  {
    count: 16_000,
    radius: 0.92,
    sizeBase: 4.8,
    noiseScale: 1.4,
    flow: -1,
    colorA:      [0x5a / 255, 0x00 / 255, 0x9e / 255], // mid violet
    colorB:      [0x8c / 255, 0x00 / 255, 0x4a / 255], // mid magenta
    colorRibbon: [0xff / 255, 0x40 / 255, 0xa0 / 255], // soft hot pink
  },
  {
    count: 7_000,
    radius: 1.08,
    sizeBase: 3.2,
    noiseScale: 1.1,
    flow: 1,
    colorA:      [0x22 / 255, 0x00 / 255, 0x55 / 255], // very deep violet (sparse halo)
    colorB:      [0x55 / 255, 0x00 / 255, 0x28 / 255], // deep rose
    colorRibbon: [0xff / 255, 0x80 / 255, 0xc0 / 255], // pale pink shimmer
  },
];

/* ─── GLSL Simplex noise ──────────────────────────────────────────── */
const SIMPLEX = /* glsl */ `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

/* ─── Vertex shader ───────────────────────────────────────────────── */
const VERT = /* glsl */ `
  precision highp float;
  uniform mat4  projectionMatrix;
  uniform mat4  modelViewMatrix;
  uniform float uTime;
  uniform float uAudio;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uNoiseScale;
  uniform float uFlow;
  attribute vec3  position;
  attribute float aScale;
  attribute float aSeed;
  varying float vRibbon;
  varying float vSeed;
  varying vec3  vDir;
  ${SIMPLEX}
  void main(){
    vec3 dir = normalize(position);
    float flow = uTime * 0.14 * uFlow;

    // Two octaves of noise for organic surface deformation
    float n1 = snoise(dir * uNoiseScale + vec3(0.0, 0.0, flow));
    float n2 = snoise(dir * uNoiseScale * 2.3 + vec3(flow * 1.5, 0.0, 0.0)) * 0.45;
    float surface = n1 + n2;

    // Diagonal ribbon band — gives the "streak of light" effect
    float a = uTime * 0.14 * uFlow;
    vec3 axis = normalize(vec3(sin(a) * 0.9, 0.38, cos(a) * 0.9));
    float planar = dot(dir, axis) + surface * 0.38;
    float ribbon = smoothstep(0.55, 0.02, abs(planar));

    float audio = uAudio;
    float displacement = surface * (0.02 + audio * 0.10) + ribbon * (0.16 + audio * 0.32) + audio * 0.04;
    vec3 displaced = position + dir * displacement;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = uSize * aScale * (1.0 + ribbon * 0.9 + audio * 0.7);
    gl_PointSize = size * uPixelRatio * (1.0 / -mvPosition.z);

    vRibbon = ribbon;
    vSeed   = aSeed;
    vDir    = dir;
  }
`;

/* ─── Fragment shader ─────────────────────────────────────────────── */
const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorRibbon;
  uniform float uAudio;
  varying float vRibbon;
  varying float vSeed;
  varying vec3  vDir;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    if(alpha <= 0.01) discard;

    // Blend between two base colors by vertical direction (creates hemisphere feel)
    float side = smoothstep(-0.25, 0.25, vDir.y);
    vec3 body = mix(uColorA, uColorB, side);

    // Ribbon overlay: bright PMA pink streak
    float ribbonCore = smoothstep(0.0, 0.8, vRibbon);
    vec3 color = mix(body, uColorRibbon, ribbonCore);

    // Subtle per-particle twinkle
    float twinkle = 0.82 + 0.18 * sin(vSeed * 6.2831 + 1.3);
    float intensity = mix(0.88, 1.55, ribbonCore) * twinkle + uAudio * 0.1;

    gl_FragColor = vec4(color * intensity, alpha);
  }
`;

/* ─── Fibonacci sphere geometry ───────────────────────────────────── */
function buildGeometry(gl, count, radius) {
  const positions = new Float32Array(count * 3);
  const scales    = new Float32Array(count);
  const seeds     = new Float32Array(count);
  const golden    = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y     = 1 - (i / (count - 1)) * 2;
    const r     = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    let nx = Math.cos(theta) * r + (Math.random() - 0.5) * 0.04;
    let ny = y                   + (Math.random() - 0.5) * 0.04;
    let nz = Math.sin(theta) * r + (Math.random() - 0.5) * 0.04;
    const inv = radius / Math.max(1e-4, Math.hypot(nx, ny, nz));
    positions[i * 3]     = nx * inv;
    positions[i * 3 + 1] = ny * inv;
    positions[i * 3 + 2] = nz * inv;
    scales[i] = 0.55 + Math.random() * 0.95;
    seeds[i]  = Math.random();
  }

  return new Geometry(gl, {
    position: { size: 3, data: positions },
    aScale:   { size: 1, data: scales },
    aSeed:    { size: 1, data: seeds },
  });
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function ParticleOrb({ stream, active, agentLevelRef: agentRef }) {
  const mountRef      = useRef(null);
  const audioLevelRef = useRef(0);
  const agentLevelRef = agentRef ?? useRef(0);

  /* OGL renderer lifecycle */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        width: CANVAS_PX,
        height: CANVAS_PX,
      });
    } catch (_) {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Center the canvas; lets particles bleed outside the mount div bounds
    const canvas = gl.canvas;
    canvas.style.position  = 'absolute';
    canvas.style.left      = '50%';
    canvas.style.top       = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    mount.appendChild(canvas);

    const camera = new Camera(gl, { fov: 58, near: 0.1, far: 100 });
    camera.position.set(0, 0, 4.2);
    camera.lookAt([0, 0, 0]);
    camera.perspective({ aspect: 1 });

    const scene = new Transform();

    const layers = LAYERS.map((cfg) => {
      const geometry = buildGeometry(gl, cfg.count, cfg.radius);
      const program  = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        uniforms: {
          uTime:        { value: 0 },
          uAudio:       { value: 0 },
          uSize:        { value: cfg.sizeBase },
          uPixelRatio:  { value: renderer.dpr },
          uNoiseScale:  { value: cfg.noiseScale },
          uFlow:        { value: cfg.flow },
          uColorA:      { value: cfg.colorA },
          uColorB:      { value: cfg.colorB },
          uColorRibbon: { value: cfg.colorRibbon },
        },
      });
      const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
      mesh.setParent(scene);
      return { mesh, program, flow: cfg.flow };
    });

    let last = performance.now();
    let t    = 0;
    const rotY = [0, 0, 0];
    let raf;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt  = Math.min(0.05, (now - last) / 1000);
      last = now;
      t   += dt * (reduced ? 0.2 : 1);

      const spin   = reduced ? 0.03 : 0.08;
      const target = Math.max(audioLevelRef.current, agentLevelRef.current);

      layers.forEach(({ mesh, program, flow }, i) => {
        const prev  = program.uniforms.uAudio.value;
        const eased = prev + (target - prev) * Math.min(1, dt * 7);
        program.uniforms.uTime.value  = t;
        program.uniforms.uAudio.value = eased;
        rotY[i] += dt * (spin + eased * 0.25) * flow;
        // Slight counter-tilt between layers for depth
        mesh.rotation.set(Math.sin(t * 0.12 + i) * 0.08, rotY[i], Math.cos(t * 0.18 + i) * 0.12 * flow);
      });

      renderer.render({ scene, camera, sort: false });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      try {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (_) {}
      if (gl.canvas.parentNode === mount) mount.removeChild(gl.canvas);
    };
  }, []);

  /* Mic audio reactivity */
  useEffect(() => {
    audioLevelRef.current = 0;
    if (!stream || !active) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx      = new Ctx();
    const source   = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf;
    const sample = () => {
      raf = requestAnimationFrame(sample);
      analyser.getByteFrequencyData(data);
      let sum = 0;
      const lo = 4, hi = Math.min(data.length, 48);
      for (let i = lo; i < hi; i++) sum += data[i];
      audioLevelRef.current = Math.min(1, sum / (hi - lo) / 100);
    };
    sample();
    return () => {
      cancelAnimationFrame(raf);
      source.disconnect();
      analyser.disconnect();
      ctx.close().catch(() => {});
    };
  }, [stream, active]);

  return <div className="pma-particle-orb" ref={mountRef} aria-hidden="true" />;
}
