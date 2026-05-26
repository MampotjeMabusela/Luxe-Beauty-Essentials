import { Link } from 'react-router-dom';

const logos = {
  header: {
    src: '/logo-header.svg',
    className: 'h-8 sm:h-9 md:h-10 w-auto max-w-[140px] sm:max-w-[170px] md:max-w-[190px]',
  },
  footer: {
    src: '/logo-footer.svg',
    className: 'h-11 sm:h-12 md:h-14 w-auto max-w-[200px] sm:max-w-[240px] mb-3',
  },
};

export default function Logo({ variant = 'header', linked = true, className = '' }) {
  const config = logos[variant] || logos.header;
  const img = (
    <img
      src={config.src}
      alt="Luxe Beauty"
      className={`${config.className} ${className} object-contain object-left`}
      width={variant === 'footer' ? 240 : 190}
      height={variant === 'footer' ? 56 : 40}
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
