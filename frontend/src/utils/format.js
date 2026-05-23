export function formatZAR(amount) {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(num);
}

export function categoryLabel(category) {
  const labels = {
    hair: 'Hair Extensions',
    acha: 'Acha Products',
    toilet_paper: 'Toilet Paper',
  };
  return labels[category] || category;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
