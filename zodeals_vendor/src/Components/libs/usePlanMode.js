import { useEffect, useState } from 'react';
import { hosturl } from './Constant';

// Reads the platform plan mode ('free' or 'paid') set by the admin.
// While it loads, or if it can't be read, it stays 'paid' (the original behaviour).
// `loaded` turns true once the answer is in, so pages can avoid a flash of the wrong UI.
export default function usePlanMode() {
  const [planMode, setPlanMode] = useState('paid');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${hosturl}/plan-mode`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (!cancelled && (data?.result?.planMode === 'free' || data?.result?.planMode === 'paid')) {
          setPlanMode(data.result.planMode);
        }
      } catch (e) {
        // keep 'paid'
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return { planMode, isFree: planMode === 'free', loaded };
}
