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
    hair: 'Hair Extensions & Wigs',
  };
  return labels[category] || 'Hair';
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
