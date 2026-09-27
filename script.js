const vehicleToggle = document.querySelector('.vehicles-toggle');
const megaMenu = document.querySelector('.mega-menu');
const mobileToggle = document.querySelector('.mobile-toggle');
const primaryNav = document.querySelector('.primary-nav');

function setVehicleMenu(open) {
  megaMenu?.classList.toggle('is-open', open);
  vehicleToggle?.setAttribute('aria-expanded', String(open));
}

vehicleToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = !megaMenu?.classList.contains('is-open');
  setVehicleMenu(open);

  if (open && window.matchMedia('(max-width: 900px)').matches) {
    primaryNav?.classList.remove('mobile-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }
});

mobileToggle?.addEventListener('click', () => {
  setVehicleMenu(false);
  const open = primaryNav.classList.toggle('mobile-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  if (!megaMenu?.classList.contains('is-open')) return;
  if (megaMenu.contains(event.target) || vehicleToggle?.contains(event.target)) return;
  setVehicleMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setVehicleMenu(false);
    primaryNav?.classList.remove('mobile-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }
});

const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('#hero-title');
const heroTabs = [...document.querySelectorAll('.hero-tabs button')];

function selectHeroImage(selectedTab) {
  const image = selectedTab.dataset.image;
  const title = selectedTab.dataset.title;
  if (!hero || !image) return;

  hero.style.backgroundImage = `url("${image}")`;
  if (heroTitle && title) heroTitle.textContent = title;
  heroTabs.forEach((tab) => {
    const isActive = tab === selectedTab;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });
}

heroTabs.forEach((tab) => {
  const image = tab.dataset.image;
  if (image) new Image().src = image;
  tab.addEventListener('click', () => selectHeroImage(tab));
});

const milesCounter = document.querySelector('#miles-counter');

if (milesCounter) {
  const startValue = Number(milesCounter.dataset.start);
  const increasePerSecond = Number(milesCounter.dataset.increasePerSecond);
  const startedAt = performance.now();

  function renderMilesCounter(timestamp) {
    const elapsedSeconds = (timestamp - startedAt) / 1000;
    const currentValue = Math.floor(startValue + (elapsedSeconds * increasePerSecond));
    const groups = String(currentValue).replace(/\B(?=(\d{3})+(?!\d))/g, '.').split('.');

    milesCounter.innerHTML = groups
      .map((group, index) => `${group}${index < groups.length - 1 ? '.' : ''}`)
      .join('<br>');
    milesCounter.setAttribute('aria-label', `${currentValue.toLocaleString('en-US')} miles driven`);
    requestAnimationFrame(renderMilesCounter);
  }

  requestAnimationFrame(renderMilesCounter);
}

const videoPlayer = document.querySelector('#fsd-video');

if (videoPlayer) {
  const video = videoPlayer.querySelector('.fsd-video');
  const playButton = videoPlayer.querySelector('.video-play');

  function playVideo() {
    if (!video) return;
    video.play()
      .then(() => videoPlayer.classList.add('is-playing'))
      .catch(() => videoPlayer.classList.remove('is-playing'));
  }

  function stopVideo() {
    if (!video) return;
    video.pause();
    videoPlayer.classList.remove('is-playing');
  }

  playButton?.addEventListener('click', playVideo);

  const videoObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
      playVideo();
    } else {
      stopVideo();
    }
  }, { threshold: [0, 0.45] });

  videoObserver.observe(videoPlayer);
}

const slider = document.querySelector('.vehicle-slider');
const cards = [...document.querySelectorAll('.vehicle-card')];
const dots = [...document.querySelectorAll('.dots i')];
let slide = 0;

function updateSlider() {
  const card = cards[0];
  if (!card) return;
  const gap = 32;
  slider.style.transform = `translateX(-${slide * (card.getBoundingClientRect().width + gap)}px)`;
  dots.forEach((dot, index) => dot.classList.toggle('active', index === slide));
}

document.querySelector('.slide-next')?.addEventListener('click', () => { slide = Math.min(slide + 1, cards.length - 1); updateSlider(); });
document.querySelector('.slide-prev')?.addEventListener('click', () => { slide = Math.max(slide - 1, 0); updateSlider(); });
window.addEventListener('resize', updateSlider);

const orderButton = document.querySelector('#hero-order-button');
const checkoutStatus = document.querySelector('#checkout-status');

function setCheckoutState(message, isLoading = false) {
  if (checkoutStatus) checkoutStatus.textContent = message;
  if (!orderButton) return;

  orderButton.disabled = isLoading;
  orderButton.setAttribute('aria-busy', String(isLoading));
  orderButton.textContent = isLoading ? 'Redirecting...' : 'Order now';
}

orderButton?.addEventListener('click', async () => {
  setCheckoutState('Creating your secure checkout...', true);

  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Checkout could not be created. Please try again.');
    }

    if (!payload.url || !payload.url.startsWith('https://byl.mn/')) {
      throw new Error('The checkout link returned by Byl is invalid.');
    }

    window.location.assign(payload.url);
  } catch (error) {
    console.error('Byl checkout error:', error);
    setCheckoutState(error.message || 'Checkout could not be created. Please try again.');
  }
});
