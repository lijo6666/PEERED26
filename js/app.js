class AppController {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.navToggle = document.getElementById('nav-toggle');
    this.navLinks = document.getElementById('nav-links');
    this.navbar = document.getElementById('navbar');
    this.sections = document.querySelectorAll('section');
    this.navItems = document.querySelectorAll('.nav-links li');
    
    this.init();
  }
  
  init() {
    // Theme setup
    this.setupTheme();
    
    // Mobile navigation setup
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Smooth scroll navigation highlight
    window.addEventListener('scroll', () => {
      this.handleNavbarScroll();
      this.highlightNavLinks();
    });
    
    // Glass card lighting interaction
    this.setupGlassLighting();
    
    // Scroll entry animations (Intersection Observer)
    this.setupScrollReveal();
    
    // Process flow step interactive highlighting
    this.setupProcessFlow();
    
    // Load lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  setupTheme() {
    // Default to dark mode (empty class), check if light-mode stored
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      this.updateThemeButton(true);
    } else {
      document.documentElement.classList.remove('light-mode');
      this.updateThemeButton(false);
    }
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        this.updateThemeButton(isLight);
        
        // Re-render magazine cover gradients on theme change
        if (window.magazineInstance) {
          window.magazineInstance.switchIssue(window.magazineInstance.activeYear);
        }
      });
    }
  }
  
  updateThemeButton(isLight) {
    if (!this.themeToggle) return;
    if (isLight) {
      this.themeToggle.innerHTML = '<i class="lucide-moon" style="width:20px; height:20px;"></i>';
    } else {
      this.themeToggle.innerHTML = '<i class="lucide-sun" style="width:20px; height:20px;"></i>';
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  toggleMobileMenu() {
    if (this.navLinks) {
      this.navLinks.classList.toggle('open');
      const isOpen = this.navLinks.classList.contains('open');
      this.navToggle.innerHTML = isOpen ? '<i class="lucide-x"></i>' : '<i class="lucide-menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
  
  handleNavbarScroll() {
    if (!this.navbar) return;
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
  
  highlightNavLinks() {
    let scrollPosition = window.scrollY + 120; // offset for nav height
    
    this.sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        this.navItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }
  
  setupGlassLighting() {
    // Spotlight lighting effect for glass cards
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.glass-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
  
  setupScrollReveal() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, options);
    
    const revealEls = document.querySelectorAll('.reveal, .reveal-fade-up, .reveal-scale-in');
    revealEls.forEach(el => observer.observe(el));
  }
  
  setupProcessFlow() {
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
      step.classList.add('glass-card-hoverable');
      step.style.cursor = 'pointer';
      
      step.addEventListener('click', () => {
        // Simple micro-interaction: Pulse active step
        step.style.transform = 'scale(1.05)';
        step.style.borderColor = 'var(--accent-gold)';
        
        setTimeout(() => {
          step.style.transform = '';
          step.style.borderColor = '';
        }, 600);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  
  // Smooth scroll links inside page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        // Close mobile nav links panel if open
        const navLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (navToggle) {
            navToggle.innerHTML = '<i class="lucide-menu"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        }
        
        const offset = 90; // offset height of navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
