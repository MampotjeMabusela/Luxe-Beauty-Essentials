/**
 * Animated 3D ambient layer for the product shop section only.
 * pointer-events-none — does not block clicks on products.
 */
export default function ProductAmbientBackground() {
  return (
    <div className="product-ambient" aria-hidden>
      <div className="product-ambient__base" />

      {/* Morphing colour orbs */}
      <div className="product-ambient__orb product-ambient__orb--1" />
      <div className="product-ambient__orb product-ambient__orb--2" />
      <div className="product-ambient__orb product-ambient__orb--3" />

      {/* 3D perspective grid floor */}
      <div className="product-ambient__perspective">
        <div className="product-ambient__grid-plane">
          <div className="product-ambient__grid-lines" />
        </div>
      </div>

      {/* Floating wire rings */}
      <div className="product-ambient__rings">
        <div className="product-ambient__ring product-ambient__ring--a" />
        <div className="product-ambient__ring product-ambient__ring--b" />
        <div className="product-ambient__ring product-ambient__ring--c" />
      </div>

      {/* Shimmer scan */}
      <div className="product-ambient__shimmer" />

      {/* Fine particle field */}
      <div className="product-ambient__particles">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="product-ambient__particle"
            style={{
              '--i': i,
              left: `${(i * 17 + 7) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Vignette + blend into cream page */}
      <div className="product-ambient__vignette" />
    </div>
  );
}
