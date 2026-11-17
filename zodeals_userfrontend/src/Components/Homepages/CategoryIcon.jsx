import React, { useState } from 'react';
import { hosturl } from '../libs/Constant';

// Shows the icon the admin uploaded for a category. If there is none (or it fails to load),
// it falls back to the built-in icon for that category name.
const CategoryIcon = ({ image, title, Fallback, size = 26, color, strokeWidth = 1.5 }) => {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <img
        crossOrigin="anonymous"
        src={`${hosturl}${image}`}
        alt={title || ''}
        onError={() => setFailed(true)}
        style={{ width: Math.round(size * 1.7), height: Math.round(size * 1.7), objectFit: 'contain', display: 'block' }}
      />
    );
  }
  return <Fallback size={size} color={color} strokeWidth={strokeWidth} />;
};

export default CategoryIcon;
