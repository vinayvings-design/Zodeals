import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomepageComponent from './Components/HomepageComponent';
import LoginForm from './Components/Authentications/LoginPage';
import SignUpPage from './Components/Authentications/SignUpPage';
import Dashboard from './Components/DashBoard/Dashboard';
import StoreSettingsPage from './Components/StoreSettings/StoreSettingsPage';
import CouponDealForm from './Components/AddCoupens/AddCoupens';
import VendorCouponsandDeals from './Components/AllcoupensandDeals/AllCoupensandDeals';
import CheckoutPage from './Components/Checkout/checkoutpage';
import ContactUs from './Components/helpandsupport/contactus';
import ProtectedRoute from './Components/Authentications/ProtectedRoute';
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpPage />} /> {/* Separate Sign Up Route */}
            <Route element={<ProtectedRoute allowedRoles={"vendor"}/>}>
            <Route element={<HomepageComponent />}>
              <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/storesettings" element={<StoreSettingsPage />} />
               <Route path ="/addcoupens" element={<CouponDealForm/>}/>
                <Route path ="/get/all/vendor/coupens" element={<VendorCouponsandDeals/>}/>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path='/contactus' element={<ContactUs/>}/>
            </Route>
           </Route>
        </Routes>
    );
};

export default App;
