/**
 * three-bg.js — Balanced Olive-Emerald WebGL Background
 * ShopNav — Smart Shopping Platform
 *
 * Softer, warmer than the original: muted olive/emerald particles,
 * fewer count, subtler grid, and restrained glow intensity.
 * Requires window.THREE (Three.js UMD) loaded before this script.
 */
(function () {
  'use strict';

  if (!window.THREE) return;
  const THREE = window.THREE;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  /* ── Performance ──────────────────────────────────────────────────────── */
  const isMobile       = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 320 : 900;   // much softer — fewer particles

  /* ── Scene ────────────────────────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x0a1a0e, 0.018); // deeper olive fog

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 280
  );
  camera.position.set(0, 3, 36);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha:           true,
    antialias:       false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const clock   = new THREE.Clock();
  const uTime   = { value: 0 };
  const uScroll = { value: 0 };

  /* ══════════════════════════════════════════════════════════════════════
     1. PARTICLE SYSTEM — Soft Emerald Firefly Particles
     ══════════════════════════════════════════════════════════════════════ */

  const VERT_PARTICLE = /* glsl */`
    attribute float aSize;
    attribute float aSpeed;
    attribute float aPhase;
    attribute float aGlow;

    uniform float uTime;
    uniform float uScroll;

    varying float vAlpha;
    varying float vGlow;

    void main() {
      vec3 p = position;

      /* Gentle upward drift */
      float t = mod(uTime * aSpeed * 0.4 + aPhase, 65.0);
      p.y = p.y + t - 32.5;

      /* Soft horizontal wander */
      p.x += sin(uTime * 0.18 + aPhase * 1.6) * 1.5;
      p.z += cos(uTime * 0.14 + aPhase * 2.2) * 0.8;

      /* Scroll parallax */
      p.y += uScroll * 0.0018;

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;

      gl_PointSize = clamp(aSize * (220.0 / max(-mv.z, 1.0)), 0.5, 10.0);

      /* Vertical fade */
      float yFade = 1.0 - smoothstep(18.0, 32.0, abs(p.y));
      vAlpha = yFade * aGlow * 0.75;   /* overall softer opacity */
      vGlow  = aGlow;
    }
  `;

  const FRAG_PARTICLE = /* glsl */`
    precision mediump float;
    varying float vAlpha;
    varying float vGlow;

    void main() {
      vec2  uv   = gl_PointCoord - 0.5;
      float r    = length(uv) * 2.0;

      /* Soft disc */
      float disc = 1.0 - smoothstep(0.0, 0.88, r);
      float halo = exp(-r * 3.2) * 0.35;
      float lum  = disc + halo;

      if (lum < 0.015) discard;

      /* Warm olive-to-emerald color — no harsh electric green */
      vec3 colA = vec3(0.08, 0.55, 0.32);   /* deep emerald */
      vec3 colB = vec3(0.20, 0.82, 0.52);   /* lighter mint */
      vec3 col  = mix(colA, colB, vGlow);

      gl_FragColor = vec4(col, lum * vAlpha * 0.78);
    }
  `;

  /* Build attribute buffers */
  const aPosArr    = new Float32Array(PARTICLE_COUNT * 3);
  const aSizeArr   = new Float32Array(PARTICLE_COUNT);
  const aSpeedArr  = new Float32Array(PARTICLE_COUNT);
  const aPhaseArr  = new Float32Array(PARTICLE_COUNT);
  const aGlowArr   = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    aPosArr[i*3]     = (Math.random() - 0.5) * 90;
    aPosArr[i*3 + 1] = (Math.random() - 0.5) * 65;
    aPosArr[i*3 + 2] = (Math.random() - 0.5) * 50;
    aSizeArr[i]      = Math.random() * 3.0 + 0.6;
    aSpeedArr[i]     = Math.random() * 0.55 + 0.2;
    aPhaseArr[i]     = Math.random() * Math.PI * 2;
    aGlowArr[i]      = Math.random() * 0.55 + 0.45;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(aPosArr,   3));
  pGeo.setAttribute('aSize',    new THREE.BufferAttribute(aSizeArr,  1));
  pGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(aSpeedArr, 1));
  pGeo.setAttribute('aPhase',   new THREE.BufferAttribute(aPhaseArr, 1));
  pGeo.setAttribute('aGlow',    new THREE.BufferAttribute(aGlowArr,  1));

  const pMat = new THREE.ShaderMaterial({
    vertexShader:   VERT_PARTICLE,
    fragmentShader: FRAG_PARTICLE,
    uniforms:       { uTime, uScroll },
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
  });

  scene.add(new THREE.Points(pGeo, pMat));

  /* ══════════════════════════════════════════════════════════════════════
     2. SUBTLE GRID FLOOR
     ══════════════════════════════════════════════════════════════════════ */

  const VERT_GRID = /* glsl */`
    varying vec2  vUv;
    varying float vDepth;
    uniform float uTime;

    void main() {
      vUv = vec2(uv.x, uv.y + uTime * 0.028);  /* slower scroll */
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vDepth  = clamp(1.0 - (-mv.z - 2.0) / 65.0, 0.0, 1.0);
      gl_Position = projectionMatrix * mv;
    }
  `;

  const FRAG_GRID = /* glsl */`
    precision mediump float;
    varying vec2  vUv;
    varying float vDepth;
    uniform float uTime;

    float gridLine(vec2 uv, float freq, float thick) {
      vec2 g = abs(fract(uv * freq - 0.5) - 0.5);
      return 1.0 - smoothstep(0.0, thick, min(g.x, g.y));
    }

    void main() {
      float major = gridLine(vUv, 3.5, 0.045);
      float minor = gridLine(vUv, 17.0, 0.042) * 0.18;
      float lines = max(major, minor);

      /* Distance fade */
      float a = lines * vDepth * vDepth * 0.38;   /* softer overall */

      /* Gentle pulse */
      float pulse = 0.85 + sin(vUv.y * 14.0 - uTime * 2.0) * 0.15;
      a *= pulse;

      if (a < 0.008) discard;

      /* Warm olive-emerald grid color */
      gl_FragColor = vec4(0.08, 0.72, 0.38, a);
    }
  `;

  const gridGeo = new THREE.PlaneGeometry(110, 90, 1, 1);
  const gridMat = new THREE.ShaderMaterial({
    vertexShader:   VERT_GRID,
    fragmentShader: FRAG_GRID,
    uniforms:       { uTime, uScroll },
    transparent:    true,
    depthWrite:     false,
    side:           THREE.DoubleSide,
  });

  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.rotation.x = -Math.PI * 0.44;
  gridMesh.position.set(0, -16, -8);
  scene.add(gridMesh);

  /* ══════════════════════════════════════════════════════════════════════
     3. AMBIENT GLOW ORBS — Warm olive tones, not harsh neon
     ══════════════════════════════════════════════════════════════════════ */

  const VERT_ORB = /* glsl */`
    varying vec3 vNorm;
    void main() {
      vNorm       = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const FRAG_ORB = /* glsl */`
    precision mediump float;
    varying vec3  vNorm;
    uniform float uTime;
    uniform vec3  uColor;
    uniform float uOpacity;

    void main() {
      float rim   = 1.0 - abs(dot(vNorm, vec3(0.0, 0.0, 1.0)));
      rim         = pow(rim, 2.8);
      float pulse = 0.85 + sin(uTime * 0.42) * 0.15;
      gl_FragColor = vec4(uColor, rim * uOpacity * pulse);
    }
  `;

  function addOrb(x, y, z, r, hex, opacity) {
    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERT_ORB,
      fragmentShader: FRAG_ORB,
      uniforms: {
        uTime:    uTime,
        uColor:   { value: new THREE.Color(hex) },
        uOpacity: { value: opacity },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  /* Warm, muted olive orbs — not electric */
  const orb1 = addOrb(-28,  6, -22, 24, '#0d4a22', 0.38);
  const orb2 = addOrb( 32, -4, -28, 20, '#0a3318', 0.32);
  const orb3 = addOrb(  0, 16, -18, 18, '#0f5a2a', 0.25);

  /* ══════════════════════════════════════════════════════════════════════
     4. MOUSE + SCROLL
     ══════════════════════════════════════════════════════════════════════ */

  let mx = 0, my = 0, tmx = 0, tmy = 0, sy = 0;

  window.addEventListener('mousemove', e => {
    tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });

  /* ══════════════════════════════════════════════════════════════════════
     5. ANIMATION LOOP
     ══════════════════════════════════════════════════════════════════════ */

  function tick() {
    requestAnimationFrame(tick);

    const t     = clock.getElapsedTime();
    uTime.value = t;
    uScroll.value = sy;

    /* Smooth mouse lerp */
    mx += (tmx - mx) * 0.035;
    my += (tmy - my) * 0.035;

    /* Camera parallax — more restrained */
    camera.position.x = mx * 2.8;
    camera.position.y = 3 - my * 1.6;

    /* Scroll: ease camera forward */
    const targetZ = 36 - sy * 0.005;
    camera.position.z += (Math.max(targetZ, 14) - camera.position.z) * 0.05;

    camera.lookAt(mx * 0.9, -my * 0.4, 0);

    /* Orbs drift */
    orb1.position.x = -28 + Math.sin(t * 0.16) * 2.5;
    orb2.position.x =  32 + Math.cos(t * 0.12) * 2.5;
    orb3.position.y =  16 + Math.sin(t * 0.19) * 1.8;

    renderer.render(scene, camera);
  }

  tick();

  /* ══════════════════════════════════════════════════════════════════════
     6. RESIZE
     ══════════════════════════════════════════════════════════════════════ */

  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

})();
