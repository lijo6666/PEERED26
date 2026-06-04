const MAGAZINE_DATA = {
  "2024": {
    title: "Empathy in Action",
    year: "2024",
    release: "April 2024",
    bgColor: "linear-gradient(135deg, #0f3460 0%, #07111d 100%)",
    lightBgColor: "linear-gradient(135deg, #dce4f0 0%, #ffffff 100%)",
    pages: [
      { title: "Editorial: Rising Together", author: "Counselling Team", type: "Editorial", content: "This edition explores how student communities adapted to new social dynamics with empathy, outlining the core values that bind our peer network." },
      { title: "The Power of Active Listening", author: "Neha S., Peer Educator", type: "Story", content: "A reflection on how learning to listen without judgment helped resolve a roommate conflict and build a lifelong friendship." },
      { title: "Echoes of Silence (Poem)", author: "Rohan M., Peer Educator", type: "Poetry", content: "A poem about finding calm amid campus hustle, focusing on mindfulness and self-care." },
      { title: "My Leadership Journey", author: "Drithi K., Coordinator", type: "Reflection", content: "How leading PES awareness camps helped me overcome public speaking anxiety and discover my voice as an empathetic leader." }
    ]
  },
  "2023": {
    title: "Resilience & Connection",
    year: "2023",
    release: "April 2023",
    bgColor: "linear-gradient(135deg, #133c75 0%, #081420 100%)",
    lightBgColor: "linear-gradient(135deg, #e8edf5 0%, #ffffff 100%)",
    pages: [
      { title: "Editorial: The Resilient Mind", author: "Counselling Team", type: "Editorial", content: "Reflecting on psychological resilience in academic spaces and the crucial role played by Peer Educators in supporting emotional well-being." },
      { title: "Empathy in Classroom Corridors", author: "Karthik R., Peer Educator", type: "Story", content: "How small conversations and check-ins in campus common areas created a supportive safety net for junior students." },
      { title: "A Safe Space to Fall", author: "Ananya P., Peer Educator", type: "Reflection", content: "Reflecting on the training sessions organized by CCHS and how active listening became a tool for personal healing." },
      { title: "Campus Inclusiveness", author: "Vikram S., Volunteer", type: "Story", content: "A story about creating study circles that welcome students from diverse linguistic backgrounds, fostering a true sense of belonging." }
    ]
  },
  "2022": {
    title: "Leadership and Hope",
    year: "2022",
    release: "May 2022",
    bgColor: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
    lightBgColor: "linear-gradient(135deg, #d2dbeb 0%, #ffffff 100%)",
    pages: [
      { title: "Editorial: Navigating New Horizons", author: "Counselling Team", type: "Editorial", content: "Focusing on transitions post-pandemic and rebuilding healthy, high-trust student connections on campus." },
      { title: "Beyond Academics", author: "Sonia G., Peer Educator", type: "Story", content: "Balancing exams while organizing well-being campaign stalls. Exploring how micro-activities draw massive student crowds." },
      { title: "Hope in a Cup of Chai", author: "Deepak J., Volunteer", type: "Poetry", content: "A heartwarming narrative poem on how deep conversations over warm drinks help relieve academic strain." },
      { title: "The Mentor Within", author: "Priya N., Coordinator", type: "Reflection", content: "Discovering how helping peers navigate their self-doubt unlocked my own self-confidence and career goals." }
    ]
  }
};

class MagazineSystem {
  constructor() {
    this.activeYear = "2024";
    this.currentPage = 0;
    this.activePages = MAGAZINE_DATA[this.activeYear].pages;
    
    // UI Elements
    this.coverEl = document.getElementById('mag-cover');
    this.titleEl = document.getElementById('mag-title');
    this.yearEl = document.getElementById('mag-year');
    
    this.infoTitleEl = document.getElementById('mag-info-title');
    this.infoReleaseEl = document.getElementById('mag-info-release');
    this.infoDescEl = document.getElementById('mag-info-desc');
    
    this.archiveItems = document.querySelectorAll('.archive-item');
    this.searchBtn = document.getElementById('mag-search-btn');
    this.searchInput = document.getElementById('mag-search-input');
    
    // Reader Overlay Elements
    this.readerOverlay = document.getElementById('reader-overlay');
    this.readerContent = document.getElementById('reader-page-content');
    this.readerPageNum = document.getElementById('reader-page-num');
    this.readerPrevBtn = document.getElementById('reader-prev-btn');
    this.readerNextBtn = document.getElementById('reader-next-btn');
    this.readerTitle = document.getElementById('reader-issue-title');
    
    this.init();
  }
  
  init() {
    // Archive items click handlers
    this.archiveItems.forEach(item => {
      item.addEventListener('click', () => {
        const year = item.getAttribute('data-year');
        this.switchIssue(year);
        
        // Update active class in list
        this.archiveItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
    
    // Search event
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
    
    // Read button trigger
    const readBtn = document.getElementById('mag-read-btn');
    if (readBtn) {
      readBtn.addEventListener('click', () => this.openReader());
    }
    
    // Reader nav buttons
    if (this.readerPrevBtn) {
      this.readerPrevBtn.addEventListener('click', () => this.navigatePage(-1));
    }
    if (this.readerNextBtn) {
      this.readerNextBtn.addEventListener('click', () => this.navigatePage(1));
    }
    
    const closeReaderBtn = document.getElementById('reader-close-btn');
    if (closeReaderBtn) {
      closeReaderBtn.addEventListener('click', () => this.closeReader());
    }
    
    // Setup initial issue values
    this.switchIssue(this.activeYear);
  }
  
  switchIssue(year) {
    if (!MAGAZINE_DATA[year]) return;
    
    this.activeYear = year;
    this.currentPage = 0;
    this.activePages = MAGAZINE_DATA[year].pages;
    
    const data = MAGAZINE_DATA[year];
    
    // Update cover showcase details
    if (this.coverEl) {
      const isLightMode = document.documentElement.classList.contains('light-mode');
      this.coverEl.style.background = isLightMode ? data.lightBgColor : data.bgColor;
    }
    if (this.titleEl) this.titleEl.textContent = data.title;
    if (this.yearEl) this.yearEl.textContent = data.year;
    
    // Update side info card
    if (this.infoTitleEl) this.infoTitleEl.textContent = `Peer Treasure - ${data.title}`;
    if (this.infoReleaseEl) this.infoReleaseEl.innerHTML = `<i class="lucide-calendar"></i> Released: ${data.release}`;
    
    // Generate contents preview list
    if (this.infoDescEl) {
      let html = '<ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">';
      data.pages.forEach((page, idx) => {
        html += `
          <li style="display: flex; gap: 12px; align-items: center; font-size: 15px;">
            <span style="color: var(--accent-gold); font-weight: 700;">p.${idx+1}</span>
            <div>
              <strong style="color: var(--text-primary); display:block;">${page.title}</strong>
              <span style="color: var(--text-secondary); font-size:13px;">by ${page.author} (${page.type})</span>
            </div>
          </li>
        `;
      });
      html += '</ul>';
      this.infoDescEl.innerHTML = html;
    }
  }
  
  handleSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
      this.switchIssue(this.activeYear);
      return;
    }
    
    // Search across all issues and pages
    let results = [];
    Object.keys(MAGAZINE_DATA).forEach(year => {
      MAGAZINE_DATA[year].pages.forEach((page, index) => {
        if (page.title.toLowerCase().includes(query) || 
            page.content.toLowerCase().includes(query) || 
            page.author.toLowerCase().includes(query)) {
          results.push({
            year,
            pageIndex: index,
            ...page
          });
        }
      });
    });
    
    // Render results in info card
    if (this.infoTitleEl) this.infoTitleEl.textContent = `Search Results (${results.length})`;
    if (this.infoReleaseEl) this.infoReleaseEl.innerHTML = `<i class="lucide-search"></i> Showing matches for "${query}"`;
    
    if (this.infoDescEl) {
      if (results.length === 0) {
        this.infoDescEl.innerHTML = `<p style="color: var(--text-secondary); font-size:15px; margin-top: 15px;">No matches found. Try searching for "Listening", "Journey", "Poem", or "Empathy".</p>`;
        return;
      }
      
      let html = '<ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">';
      results.forEach((res) => {
        html += `
          <li class="glass-card" style="padding: 15px; cursor: pointer; border-radius: 12px;" onclick="window.magazineInstance.openReaderAt('${res.year}', ${res.pageIndex})">
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight:700; color:var(--accent-gold); text-transform:uppercase;">Peer Treasure ${res.year}</span>
              <span style="font-size: 11px; color:var(--secondary-blue);">Read Page →</span>
            </div>
            <strong style="color: var(--text-primary); font-size:15px; display:block;">${res.title}</strong>
            <span style="color: var(--text-secondary); font-size:13px; display:block; margin-bottom: 8px;">by ${res.author}</span>
            <p style="color: var(--text-tertiary); font-size: 13px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${res.content}</p>
          </li>
        `;
      });
      html += '</ul>';
      this.infoDescEl.innerHTML = html;
    }
  }
  
  openReader() {
    this.currentPage = 0;
    this.activePages = MAGAZINE_DATA[this.activeYear].pages;
    this.updateReaderContent();
    if (this.readerOverlay) this.readerOverlay.classList.add('open');
  }
  
  openReaderAt(year, pageIndex) {
    this.activeYear = year;
    this.activePages = MAGAZINE_DATA[year].pages;
    this.currentPage = pageIndex;
    this.updateReaderContent();
    if (this.readerOverlay) this.readerOverlay.classList.add('open');
  }
  
  closeReader() {
    if (this.readerOverlay) this.readerOverlay.classList.remove('open');
  }
  
  navigatePage(direction) {
    this.currentPage += direction;
    if (this.currentPage < 0) this.currentPage = 0;
    if (this.currentPage >= this.activePages.length) this.currentPage = this.activePages.length - 1;
    
    this.updateReaderContent();
  }
  
  updateReaderContent() {
    if (this.readerTitle) {
      this.readerTitle.textContent = `Peer Treasure - ${this.activeYear} (${MAGAZINE_DATA[this.activeYear].title})`;
    }
    
    const page = this.activePages[this.currentPage];
    if (!page) return;
    
    if (this.readerContent) {
      this.readerContent.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px; animation: pageFade 0.4s ease;">
          <span style="font-size: 13px; font-weight:700; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px;">${page.type}</span>
          <h2 style="font-size:32px; color:var(--text-primary); line-height:1.2;">${page.title}</h2>
          <span style="font-size:15px; color:var(--text-secondary); font-style:italic;">Author: ${page.author}</span>
          <hr style="border: 0; border-top:1px solid var(--border-color); margin: 8px 0;">
          <p style="font-size:18px; line-height:1.8; color:var(--text-primary); font-weight: 300;">${page.content}</p>
        </div>
      `;
    }
    
    if (this.readerPageNum) {
      this.readerPageNum.textContent = `Page ${this.currentPage + 1} of ${this.activePages.length}`;
    }
    
    // Enable/disable page trigger buttons
    if (this.readerPrevBtn) this.readerPrevBtn.disabled = (this.currentPage === 0);
    if (this.readerNextBtn) this.readerNextBtn.disabled = (this.currentPage === this.activePages.length - 1);
  }
}

// Add page animation styling inject
const style = document.createElement('style');
style.textContent = `
  @keyframes pageFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reader-controls-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  window.magazineInstance = new MagazineSystem();
});
