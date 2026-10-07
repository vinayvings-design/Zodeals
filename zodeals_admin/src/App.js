import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomepageComponent from './Components/HomepageComponent';
import LoginForm from './Components/Authentications/LoginPage';
import SignUpPage from './Components/Authentications/SignUpPage';
import Dashboard from './Components/DashBoard/Dashboard';
import VendorTable from './Components/VendorManagement/Vendorpage';
import CouponDealForm from './Components/AddCoupens/AddCoupens';
import UserTable from './Components/Users/Userspage';
import PaymentHistory from './Components/Payements/PaymentPage';
import CategoryPage from './Components/Categories/Categoriespage';
import NotificationsMessage from './Components/Notifications/Notificationpage';
import CouponPriceManagement from './Components/CoupenPrice/CoupenPrice';
import TestimonialTable from './Components/Testimonials/Testimonial';
import ProductForm from './Components/Products/CreateProduct';
import ContactDetailsForm from './Components/Customersupport/helpandsupport';
import AgentManager from './Components/Agents/agents';
import AgentList from './Components/Agents/agenttransactions';
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpPage />} /> {/* Separate Sign Up Route */}
            <Route element={<HomepageComponent />}>
              <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/vendorpage" element={<VendorTable />} />
               <Route path ="/addcoupens" element={<CouponDealForm/>}/>
               <Route path='/userpage' element={<UserTable/>}/>
               <Route path='/payments' element={<PaymentHistory/>}/>
               <Route path='categorypage' element={<CategoryPage/>}/>
               <Route path='/notifications' element={<NotificationsMessage/>}/>
               {/* <Route path='/coupen/price' element={<CouponPriceManagement/>}/> */}
                <Route path='/testimonial' element={<TestimonialTable/>}/>
                 <Route path='/products' element={<ProductForm/>}/>
                 <Route path='/helpandsupport' element={<ContactDetailsForm/>}/>
                    <Route path='/agents' element={<AgentManager/>}/>
                <Route path='/agent/transactions' element={<AgentList/>}/>
            </Route>
        </Routes>
    );
};

export default App;
