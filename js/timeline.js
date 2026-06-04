class TimelineSystem {
  constructor() {
    this.container = document.querySelector('.timeline-container');
    if (!this.container) return;
    
    this.line = document.querySelector('.timeline-line');
    this.progress = document.querySelector('.timeline-progress');
    this.items = document.querySelectorAll('.timeline-item');
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.updateTimeline());
    window.addEventListener('resize', () => this.updateTimeline());
    // Initial run
    setTimeout(() => this.updateTimeline(), 100);
  }
  
  updateTimeline() {
    if (!this.container || !this.progress) return;
    
    const rect = this.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate total height available for timeline scrolling
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    
    // We want the progress to start when the top of the container is at 70% of the viewport height,
    // and reach 100% when the bottom of the container reaches 50% of the viewport height.
    const startPoint = containerTop - windowHeight * 0.7;
    const endPoint = containerTop + containerHeight - windowHeight * 0.5;
    const currentScroll = window.scrollY;
    
    let percentage = 0;
    if (currentScroll > startPoint) {
      percentage = ((currentScroll - startPoint) / (endPoint - startPoint)) * 100;
    }
    
    percentage = Math.max(0, Math.min(100, percentage));
    this.progress.style.height = `${percentage}%`;
    
    // Activate timeline items
    this.items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      // If item top is above 75% of viewport height, activate it
      if (itemRect.top < windowHeight * 0.75) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TimelineSystem();
});
