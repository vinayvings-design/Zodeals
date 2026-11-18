import React, { useEffect, useState } from 'react';
import mark from '../../assets/images/zodealsMark.png';
import { hosturl } from './Constant';

// Full-screen loader: the admin-uploaded category images sit faintly behind the logo,
// each category shown once. If the list is slow or unavailable the plain background shows.
const AppLoader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [images, setImages] = useState([]);
  const [bgReady, setBgReady] = useState(false); // category images fetched (or gave up)
  const [minTime, setMinTime] = useState(false); // shown for at least 2s

  useEffect(() => {
    const t = setTimeout(() => setMinTime(true), 2000);
    // Never wait more than 4.5s for the images: after that the plain loader is shown.
    const cap = setTimeout(() => setBgReady(true), 4500);
    return () => { clearTimeout(t); clearTimeout(cap); };
  }, []);

  useEffect(() => {
    if (!minTime || !bgReady) return undefined;
    // Fade out once the minimum time has passed and the background has had its chance to appear.
    setFadeOut(true);
    const done = setTimeout(() => onFinish?.(), 500);
    return () => clearTimeout(done);
  }, [minTime, bgReady, onFinish]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${hosturl}/category`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !Array.isArray(d?.result)) return;
        const list = d.result.filter((c) => c.image).map((c) => ({ id: c._id, src: `${hosturl}${c.image}` }));
        setImages(list);
        // Give the images a moment to arrive so they are on screen before the loader fades.
        let left = list.length;
        if (!left) { setBgReady(true); return; }
        const one = () => { left -= 1; if (left <= 0 && !cancelled) setBgReady(true); };
        list.forEach((c) => { const im = new Image(); im.onload = one; im.onerror = one; im.src = c.src; });
      })
      .catch(() => { if (!cancelled) setBgReady(true); });
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
