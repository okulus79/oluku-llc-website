const nav = document.getElementById("nav");
const menuButton = document.querySelector(".menu");

function setMenuOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

window.toggleMenu = function toggleMenu() {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
};

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenuOpen(false);
});

const serviceSearch = document.getElementById("serviceSearch");
const serviceCards = [...document.querySelectorAll("#serviceGrid .card")];
const serviceResults = document.getElementById("serviceResults");

serviceSearch.addEventListener("input", () => {
  const query = serviceSearch.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  serviceCards.forEach(card => {
    const matches = card.textContent.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  serviceResults.textContent = !query
    ? ""
    : visibleCount
      ? `${visibleCount} ${visibleCount === 1 ? "service" : "services"} found.`
      : "No matching services. Try another search.";
});

document.getElementById("quoteForm").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const details = [...formData.entries()]
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${String(value).trim()}`)
    .join("\n");
  const subject = `Quote request: ${formData.get("origin")} to ${formData.get("destination")}`;
  const mailto = `mailto:lukeman.ibrahim@live.com?${new URLSearchParams({ subject, body: details })}`;
  const status = document.getElementById("quoteStatus");
  const manualEmail = document.createElement("a");

  status.replaceChildren(document.createTextNode("Opening your email app with the quote details. If it doesn't open, "));
  manualEmail.href = "mailto:lukeman.ibrahim@live.com";
  manualEmail.textContent = "email Oluku directly";
  status.append(manualEmail, document.createTextNode("."));
  window.location.href = mailto;
});

document.getElementById("trackForm").addEventListener("submit", event => {
  event.preventDefault();
  const trackingNumber = document.getElementById("trackingNumber").value.trim();
  const result = document.getElementById("trackingResult");
  const number = document.createElement("strong");
  const message = document.createElement("p");

  number.textContent = `Demo tracking request: ${trackingNumber}`;
  message.textContent = "This site preview is not connected to live carrier tracking. Contact Oluku for shipment updates.";
  result.replaceChildren(number, message);
  result.classList.remove("hidden");
});

document.getElementById("currentYear").textContent = String(new Date().getFullYear());

const backToTop = document.querySelector(".back-to-top");
const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 500);
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

if ("IntersectionObserver" in window) {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = new Map([...nav.querySelectorAll('a[href^="#"]')].map(link => [link.hash.slice(1), link]));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.removeAttribute("aria-current"));
      navLinks.get(entry.target.id)?.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach(section => sectionObserver.observe(section));
}
