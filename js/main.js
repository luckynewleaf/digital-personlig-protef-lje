if (document.querySelector("[data-open-menu]")) {
  const projects = [
    { num: "01", name: "playbook", tag: "gls", url: "playbook.html" },
    { num: "02", name: "unhush", tag: "branding", url: "unhush.html" },
    { num: "03", name: "cyber castle", tag: "game", url: "cyber-castle.html" },
    { num: "04", name: "disc delivery", tag: "own project", url: "disc-delivery.html" },
  ];

  const menu = document.createElement("dialog");
  menu.className = "menu";
  menu.setAttribute("aria-label", "projects");
  menu.innerHTML = `
    <div class="menu-head">
      <span>select a project</span>
      <button type="button" data-close>close ×</button>
    </div>
    <ol>
      ${projects.map(p => `
        <li><a href="${p.url}">
          <span class="num">${p.num}</span>
          <span class="name">${p.name}</span>
          <span class="tag">${p.tag}</span>
        </a></li>`).join("")}
    </ol>`;
  document.body.appendChild(menu);

  document.querySelectorAll("[data-open-menu]").forEach(btn =>
    btn.addEventListener("click", () => menu.showModal())
  );

  menu.querySelector("[data-close]").addEventListener("click", () => menu.close());
  menu.addEventListener("click", e => { if (e.target === menu) menu.close(); });
}

const scriptUrl = document.currentScript
  ? document.currentScript.src
  : new URL("js/main.js", document.baseURI).href;
const musicUrl = new URL("../music/background-song.mp3", scriptUrl);
const music = new Audio(musicUrl.href);
music.loop = true;
music.preload = "auto";

function readMusicSetting(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeMusicSetting(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable for local files or in restricted browsers.
  }
}

const musicButton = document.createElement("button");
musicButton.type = "button";
musicButton.className = "music-toggle";
musicButton.setAttribute("aria-pressed", "false");
document.documentElement.appendChild(musicButton);

function updateMusicButton() {
  setMusicButton(!music.paused);
}

function setMusicButton(playing) {
  musicButton.textContent = playing ? "stop music" : "play music";
  musicButton.setAttribute("aria-pressed", String(playing));
}

function saveMusicPosition() {
  if (Number.isFinite(music.currentTime)) {
    writeMusicSetting("portfolioMusicTime", String(music.currentTime));
  }
}

music.addEventListener("loadedmetadata", () => {
  const savedTime = Number(readMusicSetting("portfolioMusicTime"));
  if (savedTime > 0 && savedTime < music.duration) music.currentTime = savedTime;
});

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);
music.addEventListener("timeupdate", saveMusicPosition);
window.addEventListener("pagehide", saveMusicPosition);

musicButton.addEventListener("click", () => {
  if (music.paused) {
    writeMusicSetting("portfolioMusicPlaying", "true");
    setMusicButton(true);
    music.play().then(updateMusicButton).catch(updateMusicButton);
  } else {
    writeMusicSetting("portfolioMusicPlaying", "false");
    music.pause();
    updateMusicButton();
  }
});

updateMusicButton();
if (readMusicSetting("portfolioMusicPlaying") !== "false") {
  music.play().catch(updateMusicButton);
}
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
