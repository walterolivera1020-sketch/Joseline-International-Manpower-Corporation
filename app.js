
lucide.createIcons();


document.getElementById("year").textContent = new Date().getFullYear();


const mobileBtn = document.getElementById("mobileBtn");
const mobileMenu = document.getElementById("mobileMenu");
mobileBtn?.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
document.querySelectorAll(".mnav").forEach((a) =>
  a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
);


const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add("reveal-visible");
      io.unobserve(el);
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));


const header = document.getElementById("siteHeader");
const onScrollHeader = () => {
  if (window.scrollY > 12) header.classList.add("header-scrolled");
  else header.classList.remove("header-scrolled");
};
window.addEventListener("scroll", onScrollHeader);
onScrollHeader();


const navLinks = Array.from(document.querySelectorAll("#deskNav .navlink"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = "#" + entry.target.id;
      navLinks.forEach((a) =>
        a.classList.toggle("navlink-active", a.getAttribute("href") === id)
      );
    });
  },
  { threshold: 0.35 }
);
sections.forEach((sec) => navObserver.observe(sec));


const toTop = document.getElementById("toTop");
const onScrollTopBtn = () => {
  if (window.scrollY > 600) toTop.classList.add("show");
  else toTop.classList.remove("show");
};
window.addEventListener("scroll", onScrollTopBtn);
onScrollTopBtn();
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);


const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const toastClose = document.getElementById("toastClose");

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}
toastClose?.addEventListener("click", () => toast.classList.remove("show"));


const inquiryFab = document.getElementById("inquiryFab");
const inquirySection = document.getElementById("inquire");

const onScrollFab = () => {
  if (window.scrollY > 180) inquiryFab.classList.add("show");
  else inquiryFab.classList.remove("show");
};
window.addEventListener("scroll", onScrollFab);
onScrollFab();

inquiryFab?.addEventListener("click", () => {
  inquirySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById("fullName")?.focus(), 450);
});


function openInquiryWithRole(roleText) {
  const roleSelect = document.getElementById("role");
  if (roleSelect) {
    const options = Array.from(roleSelect.options);
    const match = options.find((o) => o.text.trim() === roleText.trim());
    if (match) roleSelect.value = match.value;
  }
  inquirySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById("fullName")?.focus(), 450);
}

document.querySelectorAll(".job-card").forEach((card) => {
  const role = card.getAttribute("data-role");
  const handler = () => role && openInquiryWithRole(role);
  card.addEventListener("click", handler);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("aboutModal");
  const openBtn = document.getElementById("aboutBtn");
  const closeX = document.getElementById("aboutCloseX");
  const closeBtn = document.getElementById("aboutCloseBtn");

  if (!modal || !openBtn) return;

  const open = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeX?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});



const EMAILJS_PUBLIC_KEY = "WiAtqNeHvWpevtr-a";


const EMAILJS_SERVICE_ID = "service_jyuebhq";


const EMAILJS_TEMPLATE_ADMIN = "template_3zg524e";


const EMAILJS_TEMPLATE_REPLY = ""; 


emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


const form = document.getElementById("inquiryForm");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("formStatus");

function setStatus(message, ok = true) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.classList.toggle("text-green-700", ok);
  statusEl.classList.toggle("text-red-700", !ok);
}

function setLoading(isLoading) {
  if (!sendBtn) return;
  sendBtn.disabled = isLoading;
  sendBtn.classList.toggle("opacity-70", isLoading);
  sendBtn.classList.toggle("cursor-not-allowed", isLoading);
  sendBtn.innerHTML = isLoading
    ? '<span class="inline-flex items-center gap-2"><span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span> Sending…</span>'
    : '<i data-lucide="send" class="h-4 w-4"></i> Send Inquiry';
  lucide.createIcons();
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  if (sendBtn?.disabled) return;

  const payload = {
    full_name: document.getElementById("fullName")?.value?.trim(),
    user_email: document.getElementById("email")?.value?.trim(),
    preferred_role: document.getElementById("role")?.value?.trim(),
    destination: document.getElementById("destination")?.value?.trim(),
    message: document.getElementById("message")?.value?.trim(),
    year: new Date().getFullYear(),
  };

  if (!payload.full_name || !payload.user_email || !payload.message) {
    setStatus("❌ Please complete Full Name, Email, and Message.", false);
    return;
  }

  setLoading(true);
  setStatus("Sending your inquiry…", true);

  try {
  
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, payload);

    
    if (EMAILJS_TEMPLATE_REPLY && EMAILJS_TEMPLATE_REPLY.startsWith("template_")) {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_REPLY, payload);
    }

    setStatus("✅ Inquiry sent! Please check your email for confirmation.", true);
    showToast(`Thanks, ${payload.full_name}! Your inquiry was sent.`);
    form.reset();
  } catch (err) {
    console.error("EmailJS error FULL:", err);

  
    const details = err?.text || err?.message || "Unknown error";
    setStatus(`❌ Email failed: ${details}`, false);
  } finally {
    setLoading(false);
  }
});