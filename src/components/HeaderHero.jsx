import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeaderHero() {
  return (
    <section className="relative w-full h-[48vh] min-h-[320px] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/g5OaHmrKTDxRI7Ig/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70 pointer-events-none" />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-start justify-end pb-10 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Shopping Center – Floor 1</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/80">
          Zoom, pan, and navigate the indoor map. Tap any store to start navigation or explore deals.
        </p>
      </div>
    </section>
  );
}
