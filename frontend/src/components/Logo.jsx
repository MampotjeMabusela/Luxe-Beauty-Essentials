import { Link } from 'react-router-dom';

const logos = {
  header: {
    src: '/logo-header.png',
    className:
      'logo-brand logo-brand--header h-14 sm:h-16 md:h-[4.5rem] lg:h-20 w-auto max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[440px]',
  },
  footer: {
    src: '/logo-footer.png',
    className:
      'logo-brand logo-brand--footer h-16 sm:h-20 md:h-24 w-auto max-w-[300px] sm:max-w-[400px] md:max-w-[460px] mb-3',
  },
};

export default function Logo({ variant = 'header', linked = true, className = '' }) {
  const config = logos[variant] || logos.header;
  const img = (
    <img
      src={config.src}
      alt="Luxe Beauty and Essentials"
      className={`${config.className} ${className} object-contain object-left`}
      width={variant === 'footer' ? 460 : 440}
      height={variant === 'footer' ? 96 : 80}
      decoding="async"
    />
  );

  if (!linked) return img;

  return (
    <Link
      to="/"
      className="inline-flex items-center shrink-0 min-w-0 max-w-[70%] sm:max-w-none focus:outline-none focus-visible:ring-2 focus-visible:ring-luxe-gold rounded-sm"
    >
      {img}
    </Link>
  );
}
