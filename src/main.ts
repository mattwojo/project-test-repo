import './styles.css';

type Category = 'All' | 'Product' | 'Development' | 'Branding';
type Project = {
  title: string;
  description: string;
  category: Exclude<Category, 'All'>;
  tags: string[];
  accent: string;
};

const projects: Project[] = [
  { title: 'Northstar', description: 'A calmer way for distributed teams to plan, ship, and celebrate their best work.', category: 'Product', tags: ['Research', 'UX strategy'], accent: 'northstar' },
  { title: 'Morrow Finance', description: 'A friendly financial toolkit that makes confident decisions feel effortless.', category: 'Development', tags: ['TypeScript', 'Design system'], accent: 'morrow' },
  { title: 'Field Notes', description: 'A visual identity for a magazine exploring the people behind meaningful places.', category: 'Branding', tags: ['Art direction', 'Identity'], accent: 'field-notes' },
  { title: 'Goodfolk', description: 'An accessible community platform connecting neighbors with local makers.', category: 'Development', tags: ['Interaction', 'Front-end'], accent: 'goodfolk' },
];

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Alex Morgan home"><span>AM</span><strong>Alex Morgan</strong></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu <span class="menu-icon">+</span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a href="#work">Work</a><a href="#about">About</a><a href="#approach">Approach</a><a href="#contact">Contact</a>
      <button class="theme-toggle" aria-label="Switch to dark theme" title="Toggle theme">☼</button>
    </nav>
  </header>
  <main id="top">
    <section class="hero section-wrap">
      <p class="eyebrow reveal">Independent designer & developer <span class="status-dot"></span></p>
      <h1 class="reveal">Making digital things <em>feel</em> human.</h1>
      <div class="hero-bottom reveal">
        <p>I partner with ambitious teams to turn complex ideas into clear, useful, and memorable experiences.</p>
        <a class="text-link" href="#work">Scroll to explore <span>↓</span></a>
      </div>
      <div class="hero-shape" aria-hidden="true"><span>✦</span></div>
    </section>
    <section id="work" class="work section-wrap">
      <div class="section-heading reveal"><div><p class="eyebrow">Selected work</p><h2>A few things I've made.</h2></div>
        <div class="filters" role="group" aria-label="Filter projects">${(['All', 'Product', 'Development', 'Branding'] as Category[]).map((filter, index) => `<button class="filter ${index === 0 ? 'active' : ''}" data-filter="${filter}">${filter}</button>`).join('')}</div>
      </div>
      <div class="project-grid" id="project-grid"></div>
    </section>
    <section id="about" class="about section-wrap">
      <div class="section-heading reveal"><p class="eyebrow">A little about me</p><h2>Curious by nature,<br><em>craft-focused</em> by choice.</h2></div>
      <div class="about-content reveal"><p class="large-copy">I'm Alex, a multidisciplinary creative based in Portland, Oregon. For the past 8 years I've helped startups and thoughtful organizations find their voice, build their products, and make a positive mark.</p><div class="about-facts"><span>Currently</span><strong>Available for select projects</strong><span>Previously</span><strong>Pattern, Loom, independent</strong></div></div>
    </section>
    <section id="approach" class="approach section-wrap">
      <div class="section-heading reveal"><p class="eyebrow">How I work</p><h2>Good work is a<br><em>team sport.</em></h2></div>
      <div class="principles"><article class="principle reveal"><span>01</span><h3>Listen first</h3><p>Every great outcome starts with understanding the people and context behind the brief.</p></article><article class="principle reveal"><span>02</span><h3>Make it tangible</h3><p>Ideas get better when they are out in the world. I prototype early and often.</p></article><article class="principle reveal"><span>03</span><h3>Leave it better</h3><p>I care about the details, the handoff, and building systems that keep working.</p></article></div>
    </section>
    <section id="contact" class="contact section-wrap reveal"><p class="eyebrow">Have a good one?</p><h2>Let's make something<br><em>worth remembering.</em></h2><a class="email-link" href="mailto:hello@alexmorgan.design">hello@alexmorgan.design <span>↗</span></a><p class="form-status" role="status"></p></section>
  </main>
  <footer><span>© ${new Date().getFullYear()} Alex Morgan</span><div><a href="https://github.com/" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/" rel="noreferrer">LinkedIn</a><a href="#top">Back to top ↑</a></div></footer>
  <dialog class="project-dialog"><button class="dialog-close" aria-label="Close project details">×</button><div class="dialog-body"></div></dialog>
`;

const grid = document.querySelector<HTMLDivElement>('#project-grid')!;
const dialog = document.querySelector<HTMLDialogElement>('.project-dialog')!;
const dialogBody = document.querySelector<HTMLDivElement>('.dialog-body')!;

function renderProjects(category: Category = 'All') {
  grid.innerHTML = projects.filter((project) => category === 'All' || project.category === category).map((project, index) => `
    <button class="project-card reveal ${project.accent}" data-project="${projects.indexOf(project)}" style="--delay: ${index * 80}ms">
      <span class="project-art" aria-hidden="true"><i></i><b></b></span><span class="project-category">${project.category}</span><strong>${project.title}</strong><span class="project-description">${project.description}</span><span class="project-arrow">↗</span>
    </button>`).join('');
  grid.querySelectorAll<HTMLButtonElement>('.project-card').forEach((card) => card.addEventListener('click', () => openProject(Number(card.dataset.project))));
  observeReveals();
}

function openProject(index: number) {
  const project = projects[index];
  dialogBody.innerHTML = `<p class="eyebrow">${project.category}</p><h2>${project.title}</h2><p>${project.description}</p><div class="dialog-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>`;
  dialog.showModal();
}

document.querySelectorAll<HTMLButtonElement>('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active')?.classList.remove('active');
  button.classList.add('active');
  renderProjects(button.dataset.filter as Category);
}));
document.querySelector<HTMLButtonElement>('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const nav = document.querySelector<HTMLElement>('.site-nav')!;
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const themeToggle = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = dark ? '' : 'dark';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
  themeToggle.setAttribute('aria-label', dark ? 'Switch to dark theme' : 'Switch to light theme');
});

function observeReveals() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach((element) => observer.observe(element));
}
renderProjects();
observeReveals();
