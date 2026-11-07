import { Linking } from 'react-native';

// Maps website paths (used by admin hero banners) to screens in the app.
export function openLink(navigation, link) {
  if (!link) return;
  if (/^https?:\/\//i.test(link)) { Linking.openURL(link).catch(() => {}); return; }
  const p = link.split('?')[0].replace(/\/+$/, '') || '/';
  const tab = (name) => navigation.navigate('Tabs', { screen: name });
  switch (p.toLowerCase()) {
    case '/': return tab('Home');
    case '/stores': case '/single-store-page': return tab('Stores');
    case '/categories': return tab('Categories');
    case '/alldeals': case '/alloffers': return tab('AllDeals');
    case '/all/deals/today': return navigation.navigate('DealsOfDay');
    case '/favorites': return navigation.navigate('Favorites');
    case '/notifications': return navigation.navigate('Notifications');
    case '/profile': return navigation.navigate('Profile');
    case '/login': return navigation.navigate('Login');
    case '/signup': return navigation.navigate('Signup');
    case '/aboutus': return navigation.navigate('Page', { page: 'about' });
    case '/terms-and-conditions': return navigation.navigate('Page', { page: 'terms' });
    case '/privacy-policy': return navigation.navigate('Page', { page: 'privacy' });
    case '/faq': return navigation.navigate('Page', { page: 'faq' });
    case '/refund/policy': return navigation.navigate('Page', { page: 'refund' });
    case '/product/pricing/policy': return navigation.navigate('Page', { page: 'pricing' });
    case '/agent-contact': return navigation.navigate('AgentContact');
    default: return tab('Home');
  }
}
