const vehicleToggle = document.querySelector('.vehicles-toggle');
const megaMenu = document.querySelector('.mega-menu');
vehicleToggle?.addEventListener('click', () => {
  const open = megaMenu.classList.toggle('is-open');
  vehicleToggle.setAttribute('aria-expanded', String(open));
});

const mobileToggle = document.querySelector('.mobile-toggle');
const primaryNav = document.querySelector('.primary-nav');
mobileToggle?.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('mobile-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});

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
