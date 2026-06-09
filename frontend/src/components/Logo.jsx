import { Link } from 'react-router-dom';

const logos = {
  header: {
    src: '/logo-header.svg',
    className: 'h-11 sm:h-12 md:h-14 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[320px]',
  },
  footer: {
    src: '/logo-footer.svg',
    className: 'h-16 sm:h-20 md:h-24 w-auto max-w-[300px] sm:max-w-[400px] md:max-w-[460px] mb-3',
  },
};

export default function Logo({ variant = 'header', linked = true, className = '' }) {
  const config = logos[variant] || logos.header;
  const img = (
    <img
      src={config.src}
      alt="Luxe Beauty & Essentials"
      className={`${config.className} ${className} object-contain object-left`}
      width={variant === 'footer' ? 460 : 320}
      height={variant === 'footer' ? 96 : 56}
      decoding="async"
    />
  );

  if (!linked) return img;

  return (
    <Link
      to="/"
      className="inline-flex items-center shrink-0 min-w-0 max-w-[55%] sm:max-w-none focus:outline-none focus-visible:ring-2 focus-visible:ring-luxe-gold rounded-sm"
    >
      {img}
    </Link>
  );
}
