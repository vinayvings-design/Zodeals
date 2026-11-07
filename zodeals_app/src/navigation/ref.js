import { createNavigationContainerRef } from '@react-navigation/native';
export const navRef = createNavigationContainerRef();
export const goTo = (name, params) => { if (navRef.isReady()) navRef.navigate(name, params); };
