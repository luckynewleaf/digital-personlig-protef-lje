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

async function navigatePortfolioPage(url, addHistory = true) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Page request failed");

    const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html");
    const nextPage = nextDocument.querySelector("main.page");
    const currentPage = document.querySelector("main.page");
    if (!nextPage || !currentPage) throw new Error("Portfolio page not found");

    currentPage.innerHTML = nextPage.innerHTML;
    document.title = nextDocument.title;

    const nextDescription = nextDocument.querySelector('meta[name="description"]');
    const currentDescription = document.querySelector('meta[name="description"]');
    if (nextDescription && currentDescription) currentDescription.content = nextDescription.content;

    if (addHistory) window.history.pushState({}, "", url);
    window.scrollTo(0, 0);
  } catch {
    window.location.assign(url);
  }
}

document.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;

  if (event.target.closest("[data-open-menu]")) {
    menu.showModal();
    return;
  }
  if (event.target.closest("[data-close]")) {
    menu.close();
    return;
  }
  if (event.target === menu) {
    menu.close();
    return;
  }

  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;

  const destination = new URL(link.href, window.location.href);
  const currentDirectory = new URL(".", window.location.href).pathname;
  const destinationDirectory = new URL(".", destination).pathname;
  if (destination.origin !== window.location.origin || destinationDirectory !== currentDirectory || !/\.html$/i.test(destination.pathname)) return;

  event.preventDefault();
  if (menu.open) menu.close();
  navigatePortfolioPage(destination.href);
});

window.addEventListener("popstate", () => navigatePortfolioPage(window.location.href, false));

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

function startMusicFromGesture(event) {
  if (event.target instanceof Element && event.target.closest(".music-toggle")) return;
  if (readMusicSetting("portfolioMusicPlaying") === "false") return;

  writeMusicSetting("portfolioMusicPlaying", "true");
  music.play().then(updateMusicButton).catch(updateMusicButton);
}

document.addEventListener("pointerdown", startMusicFromGesture, { once: true });
document.addEventListener("keydown", startMusicFromGesture, { once: true });

updateMusicButton();
if (readMusicSetting("portfolioMusicPlaying") !== "false") {
  music.play().catch(updateMusicButton);
}
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
