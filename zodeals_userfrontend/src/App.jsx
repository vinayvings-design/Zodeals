import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomepageComponent from './Components/HomepageComponent';
import MainPage from './Components/MainPage/mainPage';
import HomePage from './Components/Homepages/homePage';
import SingleStoreAllOffers from './Components/ShopPages/singlestorealloffers';
import AllDeals from './Components/alldeals/alldeals';
import ShopPage from './Components/ShopPages/shopPage';
import CategoriesSection from './Components/Categories/categorypage';
import LoginForm from './Components/authentications/singinpage';
import SingleCategoryPage from './Components/Categories/singleacategorypage'
import SignUpPage from './Components/authentications/signuppage';
import AllDealsofDay from './Components/Homepages/AllDealsofday';
import Notifications from './Components/notifications/notification';
import Profile from './Components/profile/profile';
import Favorites from './Components/favorites/favorites';
import AboutUs from './Components/Footerpages/aboutuspage';
import TermsAndConditions from './Components/Footerpages/termsandconditions';
import PrivacyPolicy from './Components/Footerpages/privacystatement';
import Faqs from './Components/Footerpages/faqs';
import { SearchProvider } from './Components/MainPage/SearchContext';
import RefundPolicy from './Components/Footerpages/refundPolicy';
import ProductPricingPolicy from './Components/Footerpages/ProductPricingPolicy';
import { ModalProvider } from './context/ModalContext';
import AgentContactForm from './Components/Footerpages/AgentContactForm';
const App = () => {
  return (
    <ModalProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/alloffers' element={<SingleStoreAllOffers />} />
          <Route path='/alldeals' element={<AllDeals />} />
          <Route path='/stores' element={<ShopPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/categories' element={<CategoriesSection />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/Terms-and-conditions' element={<TermsAndConditions />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/faq' element={<Faqs />} />
          <Route path='/refund/policy' element={< RefundPolicy />} />
          <Route path='/product/pricing/policy' element={< ProductPricingPolicy />} />


          <Route path='/category/:name' element={<SingleCategoryPage />} />
          <Route path='/single-store-page' element={<SingleStoreAllOffers />} />
          <Route path='/all/deals/today' element={<AllDealsofDay />} />
          <Route path='/agent-contact' element={<AgentContactForm />} />
        </Routes>
      </SearchProvider>
    </ModalProvider>
  );
};

export default App;
