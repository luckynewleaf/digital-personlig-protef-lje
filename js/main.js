// Projects pop-up, shared by every page.
// To add or rename a project, edit this list only.
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

// open from any button marked data-open-menu
document.querySelectorAll("[data-open-menu]").forEach(btn =>
  btn.addEventListener("click", () => menu.showModal())
);

// close with the button or by clicking outside the box
menu.querySelector("[data-close]").addEventListener("click", () => menu.close());
menu.addEventListener("click", e => { if (e.target === menu) menu.close(); });

// current year in the footer
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
