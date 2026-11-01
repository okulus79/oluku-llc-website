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

menuButton.addEventListener("click", window.toggleMenu);

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

document.getElementById("quoteForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const subject = `Quote request: ${formData.get("origin")} to ${formData.get("destination")}`;
  formData.set("_subject", subject);
  const status = document.getElementById("quoteStatus");
  const submitButton = form.querySelector('button[type="submit"]');
  const emailFallback = document.createElement("a");

  emailFallback.href = "mailto:lukeman.ibrahim@live.com";
  emailFallback.textContent = "email Oluku directly";
  submitButton.disabled = true;
  form.setAttribute("aria-busy", "true");
  status.textContent = "Sending your quote request...";

  try {
    const response = await fetch(form.action, {
      method: form.method.toUpperCase(),
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      status.replaceChildren(
        document.createTextNode(`Your request wasn't accepted (HTTP ${response.status}). Please try again or `),
        emailFallback,
        document.createTextNode(".")
      );
      return;
    }

    form.reset();
    status.textContent = "Your quote request was sent. Oluku will follow up using the contact details you provided.";
  } catch (error) {
    console.error("Quote request submission failed.", error);
    status.replaceChildren(
      document.createTextNode("We couldn't connect to the quote service. Please try again or "),
      emailFallback,
      document.createTextNode(".")
    );
  } finally {
    submitButton.disabled = false;
    form.removeAttribute("aria-busy");
  }
});

document.getElementById("trackForm").addEventListener("submit", event => {
  event.preventDefault();
  const trackingNumber = document.getElementById("trackingNumber").value.trim();
  const result = document.getElementById("trackingResult");
  const number = document.createElement("strong");
  const message = document.createElement("p");
  const phone = document.createElement("a");
  const email = document.createElement("a");

  number.textContent = `Shipment: ${trackingNumber}`;
  message.append("Live tracking isn't connected yet. For an update, call ");
  phone.href = "tel:+12409783987";
  phone.textContent = "(240) 978-3987";
  email.href = "mailto:lukeman.ibrahim@live.com";
  email.textContent = "email Oluku";
  message.append(phone, " or ", email, ".");
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
