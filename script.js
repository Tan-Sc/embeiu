// ===== Settings =====
const MESSAGE =
  "Thoa Thoa à, anh muốn tặng em một vườn hoa nhỏ. " +
  "Mong em ngày nào cũng vui vẻ, luôn được yêu thương và dịu dàng với chính mình. " +
  "Anh có thể không phải lúc nào cũng giỏi nói lời ngọt ngào, nhưng anh thật lòng thương em. " +
  "Khi em mệt, nhớ là vẫn có anh ở đây nha. " +
  "Anh thương em bé nhiều lắm. 💗";

const HEARTS = ["💗", "💖", "💕", "🌷", "💘", "✨"];

// Small square photos (made from the images/ folder). Add or remove files here.
const PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `images/bouquet-${n}.jpg`);

// ===== Elements =====
const $ = (id) => document.getElementById(id);
const intro = $("intro");
const letter = $("letter");
const letterCard = $("letter-card");
const letterText = $("letter-text");
const garden = $("garden");
const openBtn = $("open-btn");
const replayBtn = $("replay-btn");

let tulips = [];
let timers = [];
let heartsInterval = null;
let heartCount = 0;

const rand = (min, max) => Math.random() * (max - min) + min;
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

// ===== Night sky: stars =====
function createStars() {
  const box = $("stars");
  const count = window.innerWidth < 600 ? 80 : 150;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const size = rand(1, 3);
    s.className = "star";
    s.style.cssText =
      `left:${rand(0, 100)}%;top:${rand(0, 80)}%;width:${size}px;height:${size}px;` +
      `--d:${rand(2, 5)}s;--delay:${rand(0, 5)}s`;
    box.appendChild(s);
  }
}

// ===== Glowing particles =====
function createParticles() {
  const box = $("particles");
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.cssText =
      `left:${rand(0, 100)}%;--s:${rand(4, 10)}px;--d:${rand(9, 18)}s;` +
      `--delay:${rand(0, 12)}s;--x:${rand(-60, 60)}px`;
    box.appendChild(p);
  }
}

// ===== Floating hearts (background) =====
function spawnFloatingHeart() {
  const box = $("floating-hearts");
  if (box.childElementCount > 18) return;
  const h = document.createElement("span");
  h.className = "fheart";
  const dur = rand(8, 13);
  h.style.cssText = `--l:${rand(3, 95)}%;--s:${rand(14, 30)}px;--d:${dur}s;--sway:${rand(-40, 40)}px`;
  heartCount++;
  if (heartCount % 3 === 0) {
    // every 3rd floater is a photo bubble
    h.className = "fheart fphoto";
    h.style.backgroundImage = `url(${PHOTOS[Math.floor(rand(0, PHOTOS.length))]})`;
    const small = window.innerWidth < 600;
    h.style.setProperty("--s", (small ? rand(64, 96) : rand(90, 140)) + "px");
    h.style.setProperty("--d", rand(14, 20) + "s");
    h.style.setProperty("--l", rand(2, small ? 70 : 88) + "%"); // keep fully on screen
  } else {
    h.textContent = HEARTS[Math.floor(rand(0, 3))];
  }
  box.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}
function startFloatingHearts() {
  if (heartsInterval) return;
  heartsInterval = setInterval(spawnFloatingHeart, 800);
}

// ===== Tulips =====
function createTulips() {
  garden.querySelectorAll(".tulip").forEach((t) => t.remove());
  tulips = [];
  const count = window.innerWidth < 600 ? 8 : 14;
  const maxH = Math.min(window.innerHeight * 0.3, 260);

  for (let i = 0; i < count; i++) {
    const t = document.createElement("div");
    const variant = ["", "v2", "v3", "v4"][i % 4];
    t.className = "tulip " + variant;
    const x = ((i + 0.5) / count) * 100 + rand(-2, 2);
    const h = rand(maxH * 0.55, maxH);
    t.style.cssText =
      `--x:${x}%;--h:${h}px;--k:${rand(0.8, 1.1).toFixed(2)};--sd:${rand(0, 3).toFixed(1)}s`;
    t.innerHTML =
      '<div class="stem"></div>' +
      '<div class="leaf l"></div><div class="leaf r"></div>' +
      '<div class="head">' +
      '<div class="petal back-l"></div><div class="petal back-r"></div><div class="petal front"></div>' +
      "</div>";
    garden.appendChild(t);
    tulips.push(t);
  }
}

// Grow the stems, then bloom the flowers one by one
function growGarden() {
  // shuffle order so they bloom in a pretty random pattern
  const order = [...tulips].sort(() => Math.random() - 0.5);
  order.forEach((t, i) => {
    later(() => t.classList.add("grow"), i * 320);
    later(() => t.classList.add("bloom"), i * 320 + 1400);
  });
  return order.length * 320 + 2400;
}

// ===== Memory bouquet (full-screen gallery) =====
const gallery = $("gallery");
const stage = $("g-stage");
const lightbox = $("lightbox");
const lbImg = $("lb-img");
let lbIndex = 0;

// Photos sit on a fan-shaped arc (alternating two heights so they never overlap),
// each joined to the paper wrap by a curved stem. All sizes come from the screen size.
function layoutBouquet(instant) {
  stage.className = "g-stage" + (instant ? " instant" : "");
  stage.innerHTML = "";
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const n = PHOTOS.length;

  const coneH = Math.min(110, h * 0.13);
  const coneW = coneH * 1.05;
  const bx = w / 2;
  const by = h - coneH * 0.8; // where all stems meet

  const theta = ((w / h < 0.8 ? 38 : 55) * Math.PI) / 180; // half-angle of the fan
  const R = Math.min((by - 6) / 1.32, (w / 2 - 6) / (Math.sin(theta) + 0.31), 520);

  const pts = PHOTOS.map((_, i) => {
    const t = -theta + (2 * theta * i) / (n - 1);
    const r = R * (i % 2 ? 0.7 : 1);
    return { x: bx + r * Math.sin(t), y: by - r * Math.cos(t) };
  });

  // photo size = a bit less than the closest pair of photos
  let minD = Infinity;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      minD = Math.min(minD, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y));
  // photos may touch/overlap a little, like real flowers in a bouquet
  const d = Math.min(minD * 1.12, R * 0.62, 280);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "g-svg");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  stage.appendChild(svg);

  pts.forEach((p, i) => {
    const path = document.createElementNS(svgNS, "path");
    const cx = bx + (p.x - bx) * 0.2;
    const cy = p.y + (by - p.y) * 0.45;
    path.setAttribute("d", `M${bx} ${by} Q${cx} ${cy} ${p.x} ${p.y}`);
    path.setAttribute("pathLength", "1");
    path.setAttribute("class", "g-stem");
    path.style.setProperty("--i", i);
    svg.appendChild(path);

    const el = document.createElement("div");
    el.className = "gphoto";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Xem ảnh ${i + 1}`);
    el.style.cssText = `left:${p.x - d / 2}px;top:${p.y - d / 2}px;width:${d}px;height:${d}px;--i:${i};`;
    el.innerHTML = `<div class="gbob" style="background-image:url(${PHOTOS[i]});--sd:${(i * 0.6).toFixed(1)}s"></div>`;
    el.addEventListener("click", (e) => {
      heartBurst(e.clientX, e.clientY);
      openLightbox(i);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });
    stage.appendChild(el);
  });

  const cone = document.createElement("div");
  cone.className = "gcone";
  cone.style.cssText = `left:${bx - coneW / 2}px;top:${by - coneH * 0.25}px;width:${coneW}px;height:${coneH}px`;
  const ribbon = document.createElement("div");
  ribbon.className = "gribbon";
  ribbon.textContent = "🎀";
  ribbon.style.cssText = `left:${bx}px;top:${by - coneH * 0.25 + coneH * 0.18}px;font-size:${coneH * 0.42}px`;
  stage.append(cone, ribbon);

  void stage.offsetWidth; // let the browser see the closed state, then animate open
  stage.classList.add("go");
}

function openGallery() {
  gallery.classList.add("open");
  gallery.setAttribute("aria-hidden", "false");
  layoutBouquet(false);
}
function closeGallery() {
  closeLightbox();
  gallery.classList.remove("open");
  gallery.setAttribute("aria-hidden", "true");
}

function openLightbox(i) {
  lbIndex = (i + PHOTOS.length) % PHOTOS.length;
  lbImg.src = PHOTOS[lbIndex];
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

$("gallery-btn").addEventListener("click", openGallery);
$("g-close").addEventListener("click", closeGallery);
$("lb-prev").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex - 1); });
$("lb-next").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex + 1); });
lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
lbImg.addEventListener("click", () => openLightbox(lbIndex + 1));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.contains("open") ? closeLightbox() : closeGallery();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (gallery.classList.contains("open")) layoutBouquet(true);
  }, 150);
});

// ===== Letter =====
function buildLetter() {
  letterText.innerHTML = "";
  MESSAGE.split(" ").forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.style.setProperty("--i", i);
    span.textContent = w;
    letterText.appendChild(span);
  });
  return MESSAGE.split(" ").length;
}

function showLetter() {
  const words = buildLetter();
  letter.classList.remove("show", "done");
  void letter.offsetWidth; // restart CSS animations
  letter.classList.add("show");
  // reveal signature + replay button after the last word appears
  later(() => letter.classList.add("done"), words * 90 + 1800);
}

// ===== Heart burst when tapping the letter =====
function heartBurst(x, y) {
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "heart-pop";
    h.textContent = HEARTS[Math.floor(rand(0, HEARTS.length))];
    const angle = rand(0, Math.PI * 2);
    const dist = rand(70, 180);
    h.style.cssText =
      `left:${x}px;top:${y}px;--s:${rand(16, 32)}px;` +
      `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist - 60}px;--r:${rand(-40, 40)}deg`;
    document.body.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
  letterCard.classList.remove("beat");
  void letterCard.offsetWidth;
  letterCard.classList.add("beat");
  if (navigator.vibrate) navigator.vibrate(30);
}

letterCard.addEventListener("click", (e) => heartBurst(e.clientX, e.clientY));
letterCard.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const r = letterCard.getBoundingClientRect();
    heartBurst(r.left + r.width / 2, r.top + r.height / 2);
  }
});

// ===== Music (YouTube) =====
const VIDEO_ID = "sZqFDriyLGs";
const musicBtn = $("music-btn");
let ytPlayer = null;
let ytReady = false;
let wantMusic = false; // true once she has tapped the open button
let musicOn = false;

// Called automatically by the YouTube script when it has loaded
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player("yt-player", {
    width: "200",
    height: "200",
    videoId: VIDEO_ID,
    playerVars: { loop: 1, playlist: VIDEO_ID, playsinline: 1, controls: 0 },
    events: {
      onReady: () => {
        ytReady = true;
        if (wantMusic) playMusic();
      },
    },
  });
};

function setMusicUI(on) {
  musicOn = on;
  musicBtn.textContent = on ? "🎵" : "🔇";
  musicBtn.classList.toggle("playing", on);
  musicBtn.classList.toggle("muted", !on);
}

function playMusic() {
  if (!ytReady) return;
  ytPlayer.setVolume(60);
  ytPlayer.playVideo();
  setMusicUI(true);
}

musicBtn.addEventListener("click", () => {
  if (!ytReady) return;
  if (musicOn) {
    ytPlayer.pauseVideo();
    setMusicUI(false);
  } else {
    playMusic();
  }
});

// ===== Flow =====
function start() {
  intro.classList.add("hide");
  startFloatingHearts();
  createTulips();
  // force a reflow so the transitions run from the "closed" state
  void garden.offsetWidth;
  growGarden();
  later(showLetter, 1800);
}

function replay() {
  timers.forEach(clearTimeout);
  timers = [];
  letter.classList.remove("show", "done");
  tulips.forEach((t) => t.classList.remove("grow", "bloom"));
  later(start, 1100);
}

openBtn.addEventListener("click", () => {
  // music must start from a tap, otherwise phones block it
  wantMusic = true;
  musicBtn.hidden = false;
  playMusic();
  start();
});
replayBtn.addEventListener("click", replay);

// ===== Init =====
createStars();
createParticles();
