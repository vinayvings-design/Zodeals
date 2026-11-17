import React, { useEffect, useState } from 'react';
import mark from '../../assets/images/zodealsMark.png';
import { hosturl } from './Constant';

// Full-screen loader: the admin-uploaded category images sit faintly behind the logo,
// each category shown once. If the list is slow or unavailable the plain background shows.
const AppLoader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Start fade-out after 2s, unmount after 2.5s
    const fade = setTimeout(() => setFadeOut(true), 2000);
    const done = setTimeout(() => onFinish?.(), 2500);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, [onFinish]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${hosturl}/category`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !Array.isArray(d?.result)) return;
        setImages(d.result.filter((c) => c.image).map((c) => ({ id: c._id, src: `${hosturl}${c.image}` })));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`zd-loader ${fadeOut ? 'zd-loader--out' : ''}`}>
      {images.length > 0 && (
        <div className="zd-bg">
          {images.map((c) => (
            <div key={c.id}>
              <img src={c.src} alt="" draggable={false} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
            </div>
          ))}
        </div>
      )}

      <div className="zd-mark">
        <img src={mark} alt="ZoDeals" />
      </div>
      <p className="zd-name">zodeals.in</p>

      <p className="zd-tagline">Finding the best deals for you…</p>

      <div className="zd-bar-track">
        <div className="zd-bar-fill" />
      </div>
    </div>
  );
};

export default AppLoader;
