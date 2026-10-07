import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/zodealsLogo.png';

const AppLoader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2s, unmount after 2.5s
    const fade = setTimeout(() => setFadeOut(true), 2000);
    const done = setTimeout(() => onFinish?.(), 2500);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, [onFinish]);

  return (
    <div className={`zd-loader ${fadeOut ? 'zd-loader--out' : ''}`}>
      {/* Animated rings */}
      <div className="zd-rings">
        <span className="zd-ring zd-ring--1" />
        <span className="zd-ring zd-ring--2" />
        <span className="zd-ring zd-ring--3" />
      </div>

      {/* Logo */}
      <div className="zd-logo-wrap">
        <img src={logo} alt="ZoDeals" className="zd-logo" />
      </div>

      {/* Tagline */}
      <p className="zd-tagline">Finding the best deals for you…</p>

      {/* Progress bar */}
      <div className="zd-bar-track">
        <div className="zd-bar-fill" />
      </div>

      {/* Floating dots */}
      <span className="zd-dot zd-dot--1" />
      <span className="zd-dot zd-dot--2" />
      <span className="zd-dot zd-dot--3" />
      <span className="zd-dot zd-dot--4" />
    </div>
  );
};

export default AppLoader;
