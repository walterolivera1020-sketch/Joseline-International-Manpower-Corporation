lucide.createIcons();

    // Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu
    const btn = document.getElementById('mobileBtn');
    const menu = document.getElementById('mobileMenu');
    btn?.addEventListener('click', () => menu.classList.toggle('hidden'));
    document.querySelectorAll('.mnav').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));

    // Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('reveal-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    // Header scroll
    const header = document.getElementById('siteHeader');
    const onScrollHeader = () => {
      if (window.scrollY > 12) header.classList.add('header-scrolled');
      else header.classList.remove('header-scrolled');
    };
    window.addEventListener('scroll', onScrollHeader);
    onScrollHeader();

    // Active nav
    const navLinks = Array.from(document.querySelectorAll('#deskNav .navlink'));
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach(a => a.classList.toggle('navlink-active', a.getAttribute('href') === id));
      });
    }, { threshold: 0.35 });
    sections.forEach(sec => navObserver.observe(sec));

    // Back to top
    const toTop = document.getElementById('toTop');
    const onScrollTopBtn = () => {
      if (window.scrollY > 600) toTop.classList.add('show');
      else toTop.classList.remove('show');
    };
    window.addEventListener('scroll', onScrollTopBtn);
    onScrollTopBtn();
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastClose = document.getElementById('toastClose');

    function showToast(message) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }
    toastClose.addEventListener('click', () => toast.classList.remove('show'));

    // ONE Inquiry icon behavior
    const inquiryFab = document.getElementById('inquiryFab');
    const inquirySection = document.getElementById('inquire');

    const onScrollFab = () => {
      if (window.scrollY > 180) inquiryFab.classList.add('show');
      else inquiryFab.classList.remove('show');
    };
    window.addEventListener('scroll', onScrollFab);
    onScrollFab();

    inquiryFab.addEventListener('click', () => {
      inquirySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.getElementById('fullName')?.focus(), 450);
    });


    function openInquiryWithRole(roleText) {
      const roleSelect = document.getElementById('role');
      if (roleSelect) {
        const options = Array.from(roleSelect.options);
        const match = options.find(o => o.text.trim() === roleText.trim());
        if (match) roleSelect.value = match.value;
      }
      inquirySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.getElementById('fullName')?.focus(), 450);
    }

    document.querySelectorAll('.job-card').forEach(card => {
      const role = card.getAttribute('data-role');
      const handler = () => role && openInquiryWithRole(role);
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });

    // Save inquiry locally
    document.getElementById('sendBtn').addEventListener('click', () => {
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const role = document.getElementById('role').value;
      const dest = document.getElementById('destination').value;

      if (!name || !email) {
        showToast('Please enter your Full Name and Email before sending.');
        return;
      }

      const payload = {
        name, email, role, destination: dest,
        message: document.getElementById('message').value.trim(),
        created_at: new Date().toISOString()
      };

      const key = 'joseline_inquiries';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(payload);
      localStorage.setItem(key, JSON.stringify(existing));

      showToast(`Thanks, ${name}! Your inquiry was saved locally.`);
      document.getElementById('inquiryForm').reset();
    });