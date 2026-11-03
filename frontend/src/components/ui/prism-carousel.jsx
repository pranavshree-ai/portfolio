import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useSyncExternalStore
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const TAU = 2 * Math.PI;

const DEFAULT_ITEMS = [
  {
    src: "/demo-media/abstract-rose-balance.webp",
    alt: "Rose balance",
    title: "Rose balance",
    subtitle: "A bright point of balance"
  },
  {
    src: "/demo-media/abstract-pink-eclipse.webp",
    alt: "Pink eclipse",
    title: "Pink eclipse",
    subtitle: "A disc across the diagonal"
  },
  {
    src: "/demo-media/abstract-amber-loop.webp",
    alt: "Amber loop",
    title: "Amber loop",
    subtitle: "Warmth around an open center"
  },
  {
    src: "/demo-media/abstract-coral-fold.webp",
    alt: "Coral fold",
    title: "Coral fold",
    subtitle: "A bold change of direction"
  },
  {
    src: "/demo-media/abstract-fuchsia-wave.webp",
    alt: "Fuchsia wave",
    title: "Fuchsia wave",
    subtitle: "One continuous curve"
  },
  {
    src: "/demo-media/abstract-orchid-orbit.webp",
    alt: "Orchid orbit",
    title: "Orchid orbit",
    subtitle: "Color in orbit"
  },
  {
    src: "/demo-media/abstract-plum-ribbon.webp",
    alt: "Plum ribbon",
    title: "Plum ribbon",
    subtitle: "Two ribbons, one crossing"
  },
  {
    src: "/demo-media/abstract-violet-steps.webp",
    alt: "Violet steps",
    title: "Violet steps",
    subtitle: "Three planes in rhythm"
  }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(e) {
  const t = clamp(e, 0, 1);
  return t * t * (3 - 2 * t);
}

function shapeKernel(e) {
  return e >= 1 ? 0.5 : e <= -1 ? -0.5 : e - (e * Math.abs(e)) / 2;
}

function filterWeight(e) {
  return (shapeKernel(e + 0.35) - shapeKernel(e - 0.35)) / 0.7;
}

function subscribeReducedMotion(cb) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function springStep(current, velocity, target, dt, response, damping = 1) {
  const omega = TAU / Math.max(response, 0.02);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const subDt = dt / steps;
  let c = current;
  let v = velocity;
  for (let i = 0; i < steps; i++) {
    v += (omega * omega * (target - c) - 2 * damping * omega * v) * subDt;
    c += v * subDt;
  }
  return [c, v];
}

const SR_STYLES = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};

const WRAPPER_STYLES = {
  position: "absolute",
  inset: 0,
  touchAction: "pan-y",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none"
};

const BTN_BG_REST = "color-mix(in oklch, currentColor 10%, transparent)";
const BTN_BG_HOVER = "color-mix(in oklch, currentColor 17%, transparent)";

const BTN_STYLES = {
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  padding: 0,
  borderRadius: 999,
  border: 0,
  background: BTN_BG_REST,
  color: "inherit",
  cursor: "pointer",
  transition: "background-color 160ms ease"
};

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform vec2 uSize;
uniform float uRadius;
uniform float uLoaded;
uniform float uBase;
uniform float uReveal;
uniform float uDirection;
uniform float uBand;
uniform float uSweep;
uniform float uSpreadPx;
uniform float uBright;
uniform float uAlpha;
varying vec2 vUv;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 spectrum(float t) {
  return clamp(0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67))), 0.0, 1.0);
}

vec3 sampleImage(vec2 uv) {
  float spread = uSpreadPx / max(uSize.x, uSize.y * uImageAspect);
  if (abs(spread) < 0.0004) return texture2D(uImage, uv).rgb;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec3 total = vec3(0.0);
  vec3 weights = vec3(0.0);
  for (int k = 0; k < 9; k++) {
    float t = (float(k) + jitter) / 9.0;
    vec3 w = spectrum(t * 0.82);
    total += texture2D(uImage, uv + vec2((t - 0.5) * spread, 0.0)).rgb * w;
    weights += w;
  }
  return total / weights;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = roundBox(p, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float aa = max(fwidth(d), 1e-3) * 0.75;
  float mask = 1.0 - smoothstep(-aa, aa, d);
  if (mask * uAlpha < 0.002) discard;

  float cardAspect = uSize.x / max(uSize.y, 1.0);
  vec2 uv = vUv - 0.5;
  if (cardAspect > uImageAspect) {
    uv.y *= uImageAspect / cardAspect;
  } else {
    uv.x *= cardAspect / uImageAspect;
  }
  uv += 0.5;

  vec3 full = sampleImage(uv);
  float luma = dot(full, vec3(0.2126, 0.7152, 0.0722));
  vec3 gray = vec3(luma);

  float along = uDirection > 0.0 ? vUv.x : 1.0 - vUv.x;
  float front = uReveal;
  float behind = uReveal < -0.5 ? 0.0 : 1.0 - smoothstep(front - uBand, front, along);
  float amount = max(uBase, behind);
  vec3 color = mix(gray, full, amount);
  if (uReveal > -0.5) {
    float mid = front - uBand * 0.5;
    float bandShape = exp(-pow((along - mid) / (uBand * 0.42), 2.0));
    vec3 light = spectrum(clamp((along - front + uBand) / uBand, 0.0, 1.0) * 0.82);
    color += light * bandShape * uSweep * 0.28 * (1.0 - uBase);
  }
  color *= uBright;

  vec3 placeholder = vec3(0.5);
  float loaded = clamp(uLoaded, 0.0, 1.0);
  vec3 rgb = mix(placeholder, color, loaded);
  float alpha = mask * uAlpha * mix(0.12, 1.0, loaded);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export const PrismCarousel = forwardRef(function PrismCarousel(
  {
    items = DEFAULT_ITEMS,
    startIndex = 0,
    aspect = 1.5,
    size = 0.62,
    neighborScale = 0.66,
    gap = 14,
    radius = 18,
    saturation = 0,
    dim = 0.2,
    sweep = 1,
    sweepDuration = 1.1,
    dispersion = 1,
    autoplay = true,
    interval = 4.5,
    loop = true,
    captions = true,
    controls = true,
    draggable = true,
    wheel = false,
    pauseOnHover = true,
    backgroundColor = "transparent",
    paused = false,
    dpr = 2,
    ariaLabel = "Prism carousel. Scroll, drag or use the arrow keys to move between images.",
    onIndexChange,
    onSelect,
    className,
    style
  },
  ref
) {
  const containerRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const captionRef = useRef(null);
  const controllerRef = useRef(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const itemsList = items.length ? items : DEFAULT_ITEMS;
  const itemsRef = useRef(itemsList);

  const [initialIndex] = useState(() =>
    clamp(Math.round(startIndex), 0, Math.max(itemsList.length - 1, 0))
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [webglFailed, setWebglFailed] = useState(false);

  const options = {
    items: itemsList,
    aspect,
    size,
    neighborScale,
    gap,
    radius,
    saturation,
    dim,
    sweep,
    sweepDuration,
    dispersion,
    autoplay,
    interval,
    loop,
    captions,
    controls,
    draggable,
    wheel,
    pauseOnHover,
    backgroundColor,
    paused,
    dpr,
    reduced: reducedMotion
  };

  const optionsRef = useRef(options);
  const callbacksRef = useRef({ onIndexChange, onSelect });

  useEffect(() => {
    optionsRef.current = options;
    itemsRef.current = itemsList;
    callbacksRef.current = { onIndexChange, onSelect };
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvasWrap = canvasWrapRef.current;
    if (!container || !canvasWrap) return;

    const setup = (
      containerEl,
      wrapEl,
      optsRef,
      currentItemsRef,
      initialIdx,
      cbs
    ) => {
      let renderer;
      const canvas = containerEl.ownerDocument.createElement("canvas");
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block";

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          premultipliedAlpha: true,
          powerPreference: "high-performance"
        });
      } catch {
        return null;
      }

      wrapEl.appendChild(canvas);
      renderer.setClearColor(0, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
      const geometry = new THREE.PlaneGeometry(1, 1);
      const placeholderTex = new THREE.DataTexture(
        new Uint8Array([128, 128, 128, 255]),
        1,
        1
      );
      placeholderTex.needsUpdate = true;

      const cardMeshes = Array.from({ length: 11 }, () => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uImage: { value: placeholderTex },
            uImageAspect: { value: 1.5 },
            uSize: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: 16 },
            uLoaded: { value: 0 },
            uBase: { value: 0 },
            uReveal: { value: -1 },
            uDirection: { value: 1 },
            uBand: { value: 0.24 },
            uSweep: { value: 1 },
            uSpreadPx: { value: 0 },
            uBright: { value: 1 },
            uAlpha: { value: 1 }
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          premultipliedAlpha: true,
          depthTest: false,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.frustumCulled = false;
        mesh.visible = false;
        scene.add(mesh);
        return {
          mesh,
          index: 0,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          visible: false
        };
      });

      let loadedImages = [];
      let lastSrcKey = "";
      let canvasW = 1;
      let canvasH = 1;
      let appliedDpr = 1;

      let position = initialIdx;
      let velocity = 0;
      let targetPosition = initialIdx;
      let isDragging = false;
      let isWheelActive = false;
      let lastWheelTime = 0;
      let activeInteger = Math.round(initialIdx);
      let lastNotifiedIndex = NaN;
      let previousActiveInteger = activeInteger;
      let lastActiveChangeTime = -10;
      let sweepDirection = 1;
      let hoveredIndex = null;
      let isPointerHovering = false;
      let elapsedTime = 0;
      let autoplayAccumulator = 0;
      let rafId = 0;
      let autoplayTimeout = 0;
      let lastFrameTime = 0;
      let isVisibleOnScreen = false;
      let isDestroyed = false;
      let isContextLost = false;
      let hasJustDragged = false;

      const saturationMap = new Map();
      const cumulativeCenters = new Float64Array(12);
      const relaxedWidths = new Float64Array(12);
      let stepSpacing = 1;
      let cachedActiveH = 1;
      let cachedNeighborH = 1;
      let lastConfigKey = "";
      let lastPointerTime = 0;
      let pointerTracker = null;

      const getItemCount = () => Math.max(currentItemsRef.current.length, 1);
      const wrapIndex = (i) =>
        ((i % getItemCount()) + getItemCount()) % getItemCount();

      const syncTextures = () => {
        const curItems = currentItemsRef.current;
        const srcKey = curItems.map((item) => item.src).join("\0");
        if (srcKey === lastSrcKey) return;
        lastSrcKey = srcKey;

        loadedImages.forEach((entry) => {
          entry.image.onload = null;
          entry.texture.dispose();
        });

        loadedImages = curItems.map((item) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.decoding = "async";
          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const entry = {
            image: img,
            texture: tex,
            aspect: 1.5,
            ready: false,
            fade: 0
          };

          const checkReady = () => {
            if (isDestroyed) return;
            entry.aspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
            entry.ready = true;
            entry.fade = 1;
            tex.needsUpdate = true;
            requestFrame();
          };

          img.onload = checkReady;
          img.src = item.src;
          if (img.complete && img.naturalWidth > 0) {
            checkReady();
          }
          return entry;
        });
      };

      const resizeRenderer = () => {
        const curOpts = optsRef.current;
        const rect = containerEl.getBoundingClientRect();
        const targetDpr = Math.min(
          window.devicePixelRatio || 1,
          Math.max(curOpts.dpr, 0.5)
        );
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));

        if (w !== canvasW || h !== canvasH || targetDpr !== appliedDpr) {
          canvasW = w;
          canvasH = h;
          appliedDpr = targetDpr;
          renderer.setPixelRatio(appliedDpr);
          renderer.setSize(canvasW, canvasH, false);
          camera.left = -canvasW / 2;
          camera.right = canvasW / 2;
          camera.top = canvasH / 2;
          camera.bottom = -canvasH / 2;
          camera.updateProjectionMatrix();
          return true;
        }
        return false;
      };

      const computeCardMetrics = () => {
        const curOpts = optsRef.current;
        const asp = clamp(curOpts.aspect, 0.5, 3);
        const extraH =
          46 * (curOpts.captions ? 1 : 0) + 46 * (curOpts.controls ? 1 : 0);
        const stageH = Math.max(canvasH - extraH, 0.5 * canvasH);
        // Mobile phone view: slightly increased size for touch targets & readability, desktop preserved 100%
        const isMobilePhone = canvasW <= 640;
        const sizeCurve = isMobilePhone
          ? 0.94
          : 0.62 + 0.22 * smoothstep((900 - canvasW) / 500);
        const activeH = Math.min(
          stageH * clamp(curOpts.size, 0.2, 0.98),
          (canvasW * sizeCurve) / asp
        );
        const neighborH = activeH * clamp(curOpts.neighborScale, 0.3, 1);
        const lift = (canvasH - stageH) / 2;
        containerEl.style.setProperty(
          "--prism-caption-y",
          `${canvasH / 2 - lift + activeH / 2 + 14}px`
        );
        return {
          activeH,
          neighborH,
          widths: [activeH * asp, 0.72 * neighborH, 0.24 * neighborH, 0.08 * neighborH, 0],
          gap: Math.max(curOpts.gap, 0),
          lift
        };
      };

      const relaxLayout = () => {
        const { activeH, neighborH, widths, gap } = computeCardMetrics();
        cachedActiveH = activeH;
        cachedNeighborH = neighborH;
        const cfgKey = `${activeH}|${neighborH}|${widths.join(",")}|${gap}`;
        if (cfgKey !== lastConfigKey) {
          lastConfigKey = cfgKey;
          for (let i = 0; i <= 11; i++) {
            relaxedWidths[i] = widths[i] ?? 0;
          }
          for (let iter = 0; iter < 60; iter++) {
            for (let i = 0; i <= 10; i++) {
              const target = widths[i] ?? 0;
              const prev = i === 0 ? relaxedWidths[1] : relaxedWidths[i - 1];
              relaxedWidths[i] = Math.max(
                0,
                (target - 0.0875 * (prev + relaxedWidths[i + 1])) / 0.825
              );
            }
          }
          relaxedWidths[11] = 0;
          cumulativeCenters[0] = 0;
          for (let i = 1; i <= 11; i++) {
            cumulativeCenters[i] =
              cumulativeCenters[i - 1] +
              (relaxedWidths[i - 1] + relaxedWidths[i]) / 2 +
              gap;
          }
          stepSpacing = cumulativeCenters[1];
        }
      };

      const convolve = (arr, offset, isSigned) => {
        let sum = 0;
        const minK = Math.ceil(offset - 1 - 0.35);
        const maxK = Math.floor(offset + 1 + 0.35);
        for (let k = minK; k <= maxK; k++) {
          const w = filterWeight(offset - k);
          if (w <= 0) continue;
          const val = arr[Math.min(Math.abs(k), 11)];
          sum += w * (isSigned && k < 0 ? -val : val);
        }
        return sum;
      };

      const evaluateCoverflow = (offset) => {
        const t = smoothstep(Math.abs(offset));
        return {
          x: convolve(cumulativeCenters, offset, true),
          w: Math.max(convolve(relaxedWidths, offset, false), 0),
          h: cachedActiveH + (cachedNeighborH - cachedActiveH) * t
        };
      };

      const getStepDistance = () => {
        relaxLayout();
        return stepSpacing;
      };

      const constrainIndex = (idx) =>
        optsRef.current.loop ? idx : clamp(idx, 0, getItemCount() - 1);

      const step = (delta) => {
        targetPosition = constrainIndex(Math.round(targetPosition) + delta);
        autoplayAccumulator = 0;
        requestFrame();
      };

      const requestFrame = () => {
        if (isDestroyed || isContextLost || !isVisibleOnScreen || rafId) return;
        if (autoplayTimeout) {
          window.clearTimeout(autoplayTimeout);
          autoplayTimeout = 0;
        }
        rafId = requestAnimationFrame(render);
      };

      const getSaturationState = (idx) => {
        let st = saturationMap.get(idx);
        if (!st) {
          st = { value: optsRef.current.saturation, velocity: 0 };
          saturationMap.set(idx, st);
        }
        return st;
      };

      function render(time) {
        rafId = 0;
        if (isDestroyed || isContextLost) return;

        const curOpts = optsRef.current;
        const dt = lastFrameTime
          ? Math.min(Math.max((time - lastFrameTime) / 1000, 0), 0.05)
          : 1 / 60;
        lastFrameTime = time;
        elapsedTime += dt;

        const isReduced = curOpts.reduced;
        let needsNextFrame = false;
        const isHoverPaused = curOpts.pauseOnHover && isPointerHovering;

        if (
          curOpts.autoplay &&
          !curOpts.paused &&
          !isReduced &&
          !isHoverPaused &&
          !pointerTracker &&
          getItemCount() > 1
        ) {
          autoplayAccumulator += dt;
          if (autoplayAccumulator >= Math.max(curOpts.interval, 1)) {
            autoplayAccumulator = 0;
            targetPosition =
              !curOpts.loop && Math.round(targetPosition) >= getItemCount() - 1
                ? 0
                : constrainIndex(Math.round(targetPosition) + 1);
          }
        }

        if (isWheelActive && !pointerTracker && time - lastWheelTime > 140) {
          isWheelActive = false;
          targetPosition = constrainIndex(Math.round(targetPosition));
        }

        if (isDragging) {
          velocity *= Math.exp(-6 * dt);
          needsNextFrame = true;
        } else {
          [position, velocity] = springStep(
            position,
            velocity,
            targetPosition,
            dt,
            isReduced ? 0.05 : 0.62,
            0.92
          );
          if (
            Math.abs(position - targetPosition) < 1e-4 &&
            Math.abs(velocity) < 1e-4
          ) {
            position = targetPosition;
            velocity = 0;
          } else {
            needsNextFrame = true;
          }
        }

        const roundedPos = Math.round(position);
        if (roundedPos !== activeInteger) {
          sweepDirection = roundedPos > activeInteger ? 1 : -1;
          const st = getSaturationState(activeInteger);
          const elapsedSweep = clamp(
            (elapsedTime - lastActiveChangeTime) /
              Math.max(curOpts.sweepDuration, 0.1),
            0,
            1
          );
          st.value = Math.max(st.value, elapsedSweep);
          previousActiveInteger = activeInteger = roundedPos;
          lastActiveChangeTime = elapsedTime;
        }

        const normalizedIdx = wrapIndex(activeInteger);
        if (normalizedIdx !== lastNotifiedIndex) {
          lastNotifiedIndex = normalizedIdx;
          cbs.onActive(normalizedIdx);
        }

        const { activeH, lift } = computeCardMetrics();
        relaxLayout();

        const baseIdx = Math.round(position);
        const sweepDuration = Math.max(curOpts.sweepDuration, 0.1);
        const sweepProgress = isReduced
          ? 2
          : (elapsedTime - lastActiveChangeTime) / sweepDuration;

        if (sweepProgress < 1.4) {
          needsNextFrame = true;
        }

        const stepDist = getStepDistance();
        const currentSpeed = Math.abs(velocity) * stepDist;
        const spreadPx = isReduced
          ? 0
          : clamp(
              0.006 * currentSpeed * Math.max(curOpts.dispersion, 0),
              0,
              22
            ) * Math.sign(velocity);

        for (let i = 0; i < 11; i++) {
          const card = cardMeshes[i];
          const cardIdx = baseIdx - 5 + i;
          const offset = cardIdx - position;
          const layout = evaluateCoverflow(offset);
          const w = layout.w;
          const h = layout.h;
          const inRange =
            curOpts.loop || (cardIdx >= 0 && cardIdx < getItemCount());
          const fadeAlpha = smoothstep((3.6 - Math.abs(offset)) / 0.8);

          card.visible =
            inRange && w > 0.5 && fadeAlpha > 0.002 && loadedImages.length > 0;
          card.mesh.visible = card.visible;
          card.index = cardIdx;

          if (!card.visible) continue;

          const posX = layout.x;
          card.x = posX;
          card.y = lift;
          card.w = w;
          card.h = h;
          card.mesh.position.set(posX, lift, 0);
          card.mesh.scale.set(w, h, 1);

          const imgData = loadedImages[wrapIndex(cardIdx)];
          const uniforms = card.mesh.material.uniforms;

          if (imgData) {
            uniforms.uImage.value = imgData.texture;
            uniforms.uImageAspect.value = imgData.aspect;
            if (imgData.ready && imgData.fade < 1) {
              imgData.fade = isReduced
                ? 1
                : Math.min(1, imgData.fade + dt / 0.45);
              needsNextFrame = true;
            }
            uniforms.uLoaded.value = imgData.ready ? imgData.fade : 0;
          }

          uniforms.uSize.value.set(w, h);
          uniforms.uRadius.value =
            clamp(curOpts.radius, 0, 200) * (h / activeH);
          uniforms.uAlpha.value = fadeAlpha;
          uniforms.uBright.value =
            1 - clamp(curOpts.dim, 0, 1) * smoothstep(Math.abs(offset));
          uniforms.uSpreadPx.value =
            spreadPx * (1 - smoothstep((Math.abs(offset) - 0.5) / 1.5));
          uniforms.uSweep.value = clamp(curOpts.sweep, 0, 3);
          uniforms.uBand.value = 0.26;
          uniforms.uDirection.value = sweepDirection;

          const satState = getSaturationState(cardIdx);
          const hoverBonus =
            0.6 * (hoveredIndex === cardIdx && cardIdx !== activeInteger);
          const baseSat = clamp(curOpts.saturation, 0, 1);

          if (
            cardIdx === previousActiveInteger &&
            cardIdx === activeInteger
          ) {
            uniforms.uBase.value = Math.max(
              Math.min(satState.value, 1),
              baseSat
            );
            if (sweepProgress >= 1.26 || curOpts.sweep <= 0) {
              satState.value = 1;
              satState.velocity = 0;
              uniforms.uReveal.value = -1;
              uniforms.uBase.value = 1;
            } else {
              uniforms.uReveal.value = 1.26 * sweepProgress;
            }
          } else {
            [satState.value, satState.velocity] = springStep(
              satState.value,
              satState.velocity,
              Math.max(baseSat, hoverBonus),
              dt,
              isReduced ? 0.05 : hoverBonus > 0 ? 0.45 : 0.7
            );
            if (Math.abs(satState.value - Math.max(baseSat, hoverBonus)) > 0.001) {
              needsNextFrame = true;
            }
            uniforms.uBase.value = clamp(satState.value, 0, 1);
            uniforms.uReveal.value = -1;
          }
        }

        for (const key of Array.from(saturationMap.keys())) {
          if (Math.abs(key - position) > 8) {
            saturationMap.delete(key);
          }
        }

        containerEl.style.setProperty(
          "--prism-caption-y",
          `${canvasH / 2 - lift + activeH / 2 + 16}px`
        );

        renderer.render(scene, camera);

        if (needsNextFrame || isDragging || pointerTracker || isPointerHovering) {
          requestFrame();
        } else if (curOpts.autoplay && !curOpts.paused && !isReduced && getItemCount() > 1) {
          const delay = Math.max(curOpts.interval - autoplayAccumulator, 0);
          autoplayTimeout = window.setTimeout(() => {
            autoplayTimeout = 0;
            lastFrameTime = 0;
            autoplayAccumulator = curOpts.interval;
            requestFrame();
          }, 1000 * delay);
        }
      }

      const hitTestCard = (clientX, clientY) => {
        const rect = containerEl.getBoundingClientRect();
        const localX = clientX - rect.left - canvasW / 2;
        const localY = -(clientY - rect.top - canvasH / 2);
        let bestIdx = null;
        let minDist = Infinity;

        for (const card of cardMeshes) {
          if (
            card.visible &&
            card.w >= 6 &&
            Math.abs(localX - card.x) <= card.w / 2 &&
            Math.abs(localY - card.y) <= card.h / 2
          ) {
            const dist = Math.abs(card.index - position);
            if (dist < minDist) {
              minDist = dist;
              bestIdx = card.index;
            }
          }
        }
        return bestIdx;
      };

      const handlePointerMove = (e) => {
        if (e.pointerType !== "touch") {
          isPointerHovering = true;
          const hit = hitTestCard(e.clientX, e.clientY);
          if (hit !== hoveredIndex) {
            hoveredIndex = hit;
            containerEl.style.cursor =
              hit !== null ? "pointer" : optsRef.current.draggable ? "grab" : "";
          }
        }

        if (pointerTracker && pointerTracker.id === e.pointerId) {
          const deltaX = e.clientX - pointerTracker.lastX;
          if (!pointerTracker.moved && Math.abs(e.clientX - pointerTracker.x) > 6) {
            pointerTracker.moved = true;
            isDragging = true;
            hoveredIndex = null;
            containerEl.style.cursor = "grabbing";
            try {
              wrapEl.setPointerCapture(e.pointerId);
            } catch {}
          }

          if (pointerTracker.moved) {
            const dist = getStepDistance();
            const posDelta = -deltaX / dist;
            let nextPos = position + posDelta;

            if (!optsRef.current.loop) {
              const count = getItemCount();
              const over =
                nextPos < 0 ? nextPos : nextPos > count - 1 ? nextPos - (count - 1) : 0;
              if (over !== 0) {
                nextPos = position + 0.35 * posDelta;
              }
            }

            const now = performance.now();
            const dtSec = Math.max((now - lastPointerTime) / 1000, 1 / 240);
            lastPointerTime = now;
            velocity += ((nextPos - position) / dtSec - velocity) * 0.5;

            pointerTracker.samples.push({ t: now, d: nextPos - position });
            while (
              pointerTracker.samples.length &&
              now - pointerTracker.samples[0].t > 100
            ) {
              pointerTracker.samples.shift();
            }

            position = nextPos;
          }
          pointerTracker.lastX = e.clientX;
        }

        requestFrame();
      };

      const handlePointerDown = (e) => {
        if (!optsRef.current.draggable || !e.isPrimary || e.button > 0) return;
        pointerTracker = {
          id: e.pointerId,
          x: e.clientX,
          lastX: e.clientX,
          moved: false,
          samples: []
        };
        lastPointerTime = performance.now();
        hasJustDragged = false;
        velocity = 0;
        requestFrame();
      };

      const handlePointerUp = (e) => {
        if (!pointerTracker || pointerTracker.id !== e.pointerId) return;
        const tracker = pointerTracker;
        pointerTracker = null;

        try {
          if (wrapEl.hasPointerCapture(e.pointerId)) {
            wrapEl.releasePointerCapture(e.pointerId);
          }
        } catch {}

        if (tracker.moved) {
          hasJustDragged = true;
          isDragging = false;
          const now = performance.now();
          const recent = tracker.samples.filter((s) => now - s.t < 100);
          let flickSpeed = 0;
          if (recent.length > 1) {
            const span = Math.max(
              (recent[recent.length - 1].t - recent[0].t) / 1000,
              1 / 60
            );
            flickSpeed = recent.reduce((sum, s) => sum + s.d, 0) / span;
          }

          velocity = clamp(flickSpeed, -12, 12);
          targetPosition = constrainIndex(
            Math.round(position + 0.18 * clamp(flickSpeed, -12, 12))
          );
          autoplayAccumulator = 0;
          containerEl.style.cursor = "";
        }

        requestFrame();
      };

      const handleClick = (e) => {
        if (hasJustDragged) {
          hasJustDragged = false;
          return;
        }
        const hit = hitTestCard(e.clientX, e.clientY);
        if (hit !== null) {
          if (hit === Math.round(targetPosition)) {
            cbs.onSelect(wrapIndex(hit));
          } else {
            targetPosition = constrainIndex(hit);
            autoplayAccumulator = 0;
            requestFrame();
          }
        }
      };

      const handlePointerLeave = (e) => {
        if (!pointerTracker || pointerTracker.id !== e.pointerId) {
          isPointerHovering = false;
          hoveredIndex = null;
          containerEl.style.cursor = "";
          requestFrame();
        }
      };

      const handleWheel = (e) => {
        if (!optsRef.current.wheel) return;
        e.preventDefault();
        const mode =
          e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? canvasH : 1;
        const delta = clamp((e.deltaY + e.deltaX) * mode, -240, 240);
        targetPosition = constrainIndex(
          (isWheelActive ? targetPosition : Math.round(targetPosition)) +
            delta / 100
        );
        isWheelActive = true;
        lastWheelTime = performance.now();
        autoplayAccumulator = 0;
        requestFrame();
      };

      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        } else if (e.key === "Enter" && e.target === containerEl) {
          e.preventDefault();
          cbs.onSelect(wrapIndex(Math.round(targetPosition)));
        }
      };

      wrapEl.addEventListener("pointerdown", handlePointerDown);
      wrapEl.addEventListener("pointermove", handlePointerMove);
      wrapEl.addEventListener("pointerup", handlePointerUp);
      wrapEl.addEventListener("pointercancel", handlePointerUp);
      wrapEl.addEventListener("pointerleave", handlePointerLeave);
      wrapEl.addEventListener("click", handleClick);
      wrapEl.addEventListener("wheel", handleWheel, { passive: false });
      containerEl.addEventListener("keydown", handleKeyDown);

      const resizeObserver = new ResizeObserver(() => {
        if (resizeRenderer()) {
          requestFrame();
        }
      });
      resizeObserver.observe(containerEl);

      const intersectionObserver =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                isVisibleOnScreen = entry.isIntersecting;
                if (isVisibleOnScreen) {
                  lastFrameTime = 0;
                  requestFrame();
                } else {
                  if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = 0;
                  }
                  if (autoplayTimeout) {
                    window.clearTimeout(autoplayTimeout);
                    autoplayTimeout = 0;
                  }
                }
              },
              { rootMargin: "80px" }
            );

      if (intersectionObserver) {
        intersectionObserver.observe(containerEl);
      } else {
        isVisibleOnScreen = true;
      }

      const onContextLost = (e) => {
        e.preventDefault();
        isContextLost = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      const onContextRestored = () => {
        isContextLost = false;
        lastSrcKey = "";
        syncTextures();
        requestFrame();
      };

      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);

      resizeRenderer();
      syncTextures();
      lastActiveChangeTime = -10;
      requestFrame();

      return {
        sync: () => {
          resizeRenderer();
          syncTextures();
          if (!optsRef.current.loop) {
            targetPosition = constrainIndex(targetPosition);
          }
          lastFrameTime = 0;
          requestFrame();
        },
        step,
        goTo: (targetIdx) => {
          if (optsRef.current.loop) {
            const count = getItemCount();
            const curRound = Math.round(targetPosition);
            const delta =
              ((((targetIdx - wrapIndex(curRound)) % count) +
                count +
                Math.floor(count / 2)) %
                count) -
              Math.floor(count / 2);
            targetPosition = curRound + delta;
          } else {
            targetPosition = clamp(targetIdx, 0, getItemCount() - 1);
          }
          autoplayAccumulator = 0;
          requestFrame();
        },
        destroy: () => {
          isDestroyed = true;
          if (rafId) cancelAnimationFrame(rafId);
          if (autoplayTimeout) window.clearTimeout(autoplayTimeout);
          intersectionObserver?.disconnect();
          resizeObserver.disconnect();

          wrapEl.removeEventListener("pointerdown", handlePointerDown);
          wrapEl.removeEventListener("pointermove", handlePointerMove);
          wrapEl.removeEventListener("pointerup", handlePointerUp);
          wrapEl.removeEventListener("pointercancel", handlePointerUp);
          wrapEl.removeEventListener("pointerleave", handlePointerLeave);
          wrapEl.removeEventListener("click", handleClick);
          wrapEl.removeEventListener("wheel", handleWheel);
          containerEl.removeEventListener("keydown", handleKeyDown);
          containerEl.style.cursor = "";

          canvas.removeEventListener("webglcontextlost", onContextLost);
          canvas.removeEventListener("webglcontextrestored", onContextRestored);

          loadedImages.forEach((img) => {
            img.image.onload = null;
            img.texture.dispose();
          });
          cardMeshes.forEach((card) => card.mesh.material.dispose());
          placeholderTex.dispose();
          geometry.dispose();
          renderer.dispose();
          if (!renderer.getContext().isContextLost()) {
            renderer.forceContextLoss();
          }
          canvas.remove();
        }
      };
    };

    const ctrl = setup(
      container,
      canvasWrap,
      optionsRef,
      itemsRef,
      initialIndex,
      {
        onActive: (idx) => {
          setActiveIndex(idx);
          callbacksRef.current.onIndexChange?.(idx);
        },
        onSelect: (idx) => {
          const item = itemsRef.current[idx];
          if (item) {
            callbacksRef.current.onSelect?.(item, idx);
            if (item.href) {
              window.location.assign(item.href);
            }
          }
        }
      }
    );

    if (!ctrl) {
      const id = requestAnimationFrame(() => setWebglFailed(true));
      return () => cancelAnimationFrame(id);
    }

    controllerRef.current = ctrl;
    return () => {
      ctrl.destroy();
      controllerRef.current = null;
    };
  }, [initialIndex]);

  useEffect(() => {
    const el = captionRef.current;
    if (el && !reducedMotion) {
      el.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    }
  }, [activeIndex, reducedMotion]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => controllerRef.current?.step(1),
      previous: () => controllerRef.current?.step(-1),
      goTo: (idx) => controllerRef.current?.goTo(idx)
    }),
    []
  );

  const cleanBg = backgroundColor.trim().toLowerCase();
  const isTransparent = cleanBg === "transparent" || cleanBg === "";
  const isLightBg =
    !isTransparent &&
    (() => {
      const hex = cleanBg.replace("#", "");
      if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(hex)) return false;
      const fullHex =
        hex.length === 3
          ? hex.replace(/./g, (c) => c + c)
          : hex;
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
    })();

  const currentItem = itemsList[activeIndex] ?? itemsList[0];

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full min-h-0 w-full overflow-hidden", className)}
      style={{
        backgroundColor: isTransparent ? undefined : backgroundColor,
        color: isTransparent ? "currentColor" : isLightBg ? "#0a0a0a" : "#fafafa",
        ...style
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div ref={canvasWrapRef} style={WRAPPER_STYLES} />

      {webglFailed && currentItem ? (
        <div
          style={{
            position: "absolute",
            inset: "12%",
            display: "grid",
            placeItems: "center"
          }}
        >
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              borderRadius: radius
            }}
          />
        </div>
      ) : null}

      <ul style={SR_STYLES}>
        {itemsList.map((item, idx) => (
          <li
            key={item.src + idx}
            aria-current={idx === activeIndex ? "true" : undefined}
          >
            {item.title ? `${item.title}: ${item.alt}` : item.alt}
          </li>
        ))}
      </ul>

      {captions || controls ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "var(--prism-caption-y, 82%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            pointerEvents: "none"
          }}
        >
          {captions && currentItem ? (
            <div
              ref={captionRef}
              aria-live="polite"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                textAlign: "center"
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.35
                }}
              >
                {currentItem.title ?? currentItem.alt}
              </span>
              {currentItem.subtitle ? (
                <span
                  style={{
                    fontSize: 13,
                    opacity: 0.6,
                    lineHeight: 1.35
                  }}
                >
                  {currentItem.subtitle}
                </span>
              ) : null}
            </div>
          ) : null}

          {controls ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                pointerEvents: "auto",
                fontSize: 12,
                fontVariantNumeric: "tabular-nums"
              }}
            >
              <button
                type="button"
                aria-label="Previous"
                onClick={() => controllerRef.current?.step(-1)}
                onPointerEnter={(e) => {
                  e.currentTarget.style.background = BTN_BG_HOVER;
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.background = BTN_BG_REST;
                }}
                style={BTN_STYLES}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <span
                style={{
                  opacity: 0.6,
                  minWidth: 52,
                  textAlign: "center"
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(itemsList.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                aria-label="Next"
                onClick={() => controllerRef.current?.step(1)}
                onPointerEnter={(e) => {
                  e.currentTarget.style.background = BTN_BG_HOVER;
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.background = BTN_BG_REST;
                }}
                style={BTN_STYLES}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

export const PRISM_PRESETS = {
  prism: {
    aspect: 1.5,
    size: 0.62,
    neighborScale: 0.66,
    saturation: 0,
    dim: 0.2,
    sweep: 1,
    sweepDuration: 1.1,
    dispersion: 1
  },
  vivid: {
    aspect: 1.5,
    size: 0.62,
    neighborScale: 0.66,
    saturation: 1,
    dim: 0.15,
    sweep: 0.7,
    sweepDuration: 1,
    dispersion: 1
  },
  cinema: {
    aspect: 2.1,
    size: 0.56,
    neighborScale: 0.7,
    saturation: 0,
    dim: 0.35,
    sweep: 1,
    sweepDuration: 1.3,
    dispersion: 0.8
  },
  portrait: {
    aspect: 0.75,
    size: 0.74,
    neighborScale: 0.74,
    saturation: 0,
    dim: 0.2,
    sweep: 1,
    sweepDuration: 1.1,
    dispersion: 1
  },
  quiet: {
    aspect: 1.5,
    size: 0.62,
    neighborScale: 0.66,
    saturation: 0.25,
    dim: 0.25,
    sweep: 0,
    sweepDuration: 1.1,
    dispersion: 0
  },
  spectrum: {
    aspect: 1.5,
    size: 0.62,
    neighborScale: 0.66,
    saturation: 0,
    dim: 0.2,
    sweep: 1.7,
    sweepDuration: 1.5,
    dispersion: 2
  }
};

export default PrismCarousel;
