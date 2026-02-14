import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth Pages
import GetStarted from '../modules/auth/pages/GetStarted';
import SelectLanguage from '../modules/auth/pages/SelectLanguage';
import MobileInput from '../modules/auth/pages/MobileInput';
import OTPVerification from '../modules/auth/pages/OTPVerification';
import CompleteProfile from '../modules/auth/pages/CompleteProfile';

// User Pages
import UserHome from '../modules/user/pages/UserHome';
import HireWorkers from '../modules/user/pages/HireWorkers';
import FindContractor from '../modules/user/pages/FindContractor';
import Requests from '../modules/user/pages/Requests';
import ContractorRequest from '../modules/user/pages/ContractorRequest';
import WorkersRequest from '../modules/user/pages/WorkersRequest';
import Settings from '../modules/user/pages/Settings';
import PersonalDetails from '../modules/user/pages/PersonalDetails';
import MyProjects from '../modules/user/pages/MyProjects';
import PostJob from '../modules/user/pages/PostJob';
import Legal from '../modules/user/pages/Legal';
import ContactUs from '../modules/user/pages/ContactUs';
import AboutUs from '../modules/user/pages/AboutUs';
import Subscription from '../modules/user/pages/Subscription';
import Notifications from '../modules/user/pages/Notifications';
import UserHistory from '../modules/user/pages/History';

// Contractor Pages
import ContractorHome from '../modules/contractor/pages/ContractorHome';
import ContractorBusinessDetails from '../modules/contractor/pages/BusinessDetails';
import ContractorHireWorkers from '../modules/contractor/pages/HireWorkers';
import ContractorFindUser from '../modules/contractor/pages/FindUser';
import ContractorRequests from '../modules/contractor/pages/Requests';
import ContractorUserRequest from '../modules/contractor/pages/UserRequest';
import ContractorWorkersRequest from '../modules/contractor/pages/WorkersRequest';
import ContractorSettings from '../modules/contractor/pages/Settings';
import ContractorPersonalDetails from '../modules/contractor/pages/PersonalDetails';
import ContractorMyProjects from '../modules/contractor/pages/MyProjects';
import ContractorMyProjectForUser from '../modules/contractor/pages/MyProjectForUser';
import ContractorPostJob from '../modules/contractor/pages/PostJob';
import ContractorLegal from '../modules/contractor/pages/Legal';
import ContractorAboutUs from '../modules/contractor/pages/AboutUs';
import ContractorContactUs from '../modules/contractor/pages/ContactUs';
import ContractorNotifications from '../modules/contractor/pages/Notifications';
import ContractorSubscription from '../modules/contractor/pages/Subscription';
import ContractorHistory from '../modules/contractor/pages/History';

// Labour Pages
import LabourDetails from '../modules/labour/pages/LabourDetails';
import LabourDashboard from '../modules/labour/pages/LabourDashboard';
import LabourFindUser from '../modules/labour/pages/FindUser';
import LabourFindContractor from '../modules/labour/pages/FindContractor';
import LabourRequests from '../modules/labour/pages/Requests';
import LabourUserRequest from '../modules/labour/pages/UserRequest';
import LabourContractorRequest from '../modules/labour/pages/ContractorRequest';
import LabourSettings from '../modules/labour/pages/LabourSettings';
import LabourPersonalDetails from '../modules/labour/pages/LabourPersonalDetails';
import LabourWorkDetails from '../modules/labour/pages/LabourWorkDetails';
import LabourLegalDetails from '../modules/labour/pages/LabourLegalDetails';
import LabourPaymentDetails from '../modules/labour/pages/LabourPaymentDetails';
import LabourContactUs from '../modules/labour/pages/ContactUs';
import LabourAboutUs from '../modules/labour/pages/AboutUs';
import LabourNotifications from '../modules/labour/pages/Notifications';
import LabourSubscription from '../modules/labour/pages/Subscription';
import CreateLabourCard from '../modules/labour/pages/CreateLabourCard';
import LabourMyCard from '../modules/labour/pages/LabourMyCard';
import History from '../modules/labour/pages/History';

// Admin Pages
import AdminLogin from '../modules/admin/pages/AdminLogin';
import ProfessionalDashboard, { DashboardHome } from '../modules/admin/pages/ProfessionalDashboard';
import UserManagement from '../modules/admin/pages/UserManagement';
import LabourManagement from '../modules/admin/pages/LabourManagement';
import ContractorManagement from '../modules/admin/pages/ContractorManagement';
import VerificationManagement from '../modules/admin/pages/VerificationManagement';
import AdminSettings from '../modules/admin/pages/AdminSettings';
import RoleProtectedRoute from '../modules/admin/components/RoleProtectedRoute';
import LabourCategoryManagement from '../modules/admin/pages/LabourCategoryManagement';
import BroadcastManagement from '../modules/admin/pages/BroadcastManagement';
import BannerSection from '../modules/admin/pages/BannerSection';

const AppRoutes = () => {
    const location = useLocation();

    // Scroll to top and prevent layout shift on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        // Force reflow to prevent header shift
        document.body.offsetHeight;
    }, [location.pathname]);

    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<GetStarted />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/select-language" element={<SelectLanguage />} />
            <Route path="/mobile-login" element={<MobileInput />} />
            <Route path="/mobile-input" element={<MobileInput />} /> {/* Alias for backward compatibility */}
            <Route path="/otp-verify" element={<OTPVerification />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />

            {/* User Module Routes - Protected */}
            <Route path="/user/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
            <Route path="/user/hire-workers" element={<ProtectedRoute><HireWorkers /></ProtectedRoute>} />
            <Route path="/user/find-contractor" element={<ProtectedRoute><FindContractor /></ProtectedRoute>} />
            <Route path="/user/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/user/contractor-request" element={<ProtectedRoute><ContractorRequest /></ProtectedRoute>} />
            <Route path="/user/workers-request" element={<ProtectedRoute><WorkersRequest /></ProtectedRoute>} />
            <Route path="/user/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/user/personal-details" element={<ProtectedRoute><PersonalDetails /></ProtectedRoute>} />
            <Route path="/user/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
            <Route path="/user/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/user/legal" element={<ProtectedRoute><Legal /></ProtectedRoute>} />
            <Route path="/user/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
            <Route path="/user/about-us" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/user/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/user/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/user/history" element={<ProtectedRoute><UserHistory /></ProtectedRoute>} />

            {/* Contractor Module Routes - Protected */}
            <Route path="/contractor/home" element={<ProtectedRoute><ContractorHome /></ProtectedRoute>} />
            <Route path="/contractor/business-details" element={<ProtectedRoute><ContractorBusinessDetails /></ProtectedRoute>} />
            <Route path="/contractor/hire-workers" element={<ProtectedRoute><ContractorHireWorkers /></ProtectedRoute>} />
            <Route path="/contractor/find-user" element={<ProtectedRoute><ContractorFindUser /></ProtectedRoute>} />
            <Route path="/contractor/requests" element={<ProtectedRoute><ContractorRequests /></ProtectedRoute>} />
            <Route path="/contractor/user-request" element={<ProtectedRoute><ContractorUserRequest /></ProtectedRoute>} />
            <Route path="/contractor/workers-request" element={<ProtectedRoute><ContractorWorkersRequest /></ProtectedRoute>} />
            <Route path="/contractor/settings" element={<ProtectedRoute><ContractorSettings /></ProtectedRoute>} />
            <Route path="/contractor/personal-details" element={<ProtectedRoute><ContractorPersonalDetails /></ProtectedRoute>} />
            <Route path="/contractor/my-projects" element={<ProtectedRoute><ContractorMyProjects /></ProtectedRoute>} />
            <Route path="/contractor/my-project-for-user" element={<ProtectedRoute><ContractorMyProjectForUser /></ProtectedRoute>} />
            <Route path="/contractor/post-job" element={<ProtectedRoute><ContractorPostJob /></ProtectedRoute>} />
            <Route path="/contractor/legal" element={<ProtectedRoute><ContractorLegal /></ProtectedRoute>} />
            <Route path="/contractor/about-us" element={<ProtectedRoute><ContractorAboutUs /></ProtectedRoute>} />
            <Route path="/contractor/contact-us" element={<ProtectedRoute><ContractorContactUs /></ProtectedRoute>} />
            <Route path="/contractor/notifications" element={<ProtectedRoute><ContractorNotifications /></ProtectedRoute>} />
            <Route path="/contractor/subscription" element={<ProtectedRoute><ContractorSubscription /></ProtectedRoute>} />
            <Route path="/contractor/history" element={<ProtectedRoute><ContractorHistory /></ProtectedRoute>} />

            {/* Labour Module Routes - Protected */}
            <Route path="/labour/home" element={<ProtectedRoute><LabourDashboard /></ProtectedRoute>} />
            <Route path="/labour/details" element={<ProtectedRoute><LabourDetails /></ProtectedRoute>} />
            <Route path="/labour/hire-workers" element={<ProtectedRoute><LabourDashboard /></ProtectedRoute>} />
            <Route path="/labour/find-user" element={<ProtectedRoute><LabourFindUser /></ProtectedRoute>} />
            <Route path="/labour/find-contractor" element={<ProtectedRoute><LabourFindContractor /></ProtectedRoute>} />
            <Route path="/labour/requests" element={<ProtectedRoute><LabourRequests /></ProtectedRoute>} />
            <Route path="/labour/user-request" element={<ProtectedRoute><LabourUserRequest /></ProtectedRoute>} />
            <Route path="/labour/contractor-request" element={<ProtectedRoute><LabourContractorRequest /></ProtectedRoute>} />
            <Route path="/labour/settings" element={<ProtectedRoute><LabourSettings /></ProtectedRoute>} />
            <Route path="/labour/personal-details" element={<ProtectedRoute><LabourPersonalDetails /></ProtectedRoute>} />
            <Route path="/labour/work-details" element={<ProtectedRoute><LabourWorkDetails /></ProtectedRoute>} />
            <Route path="/labour/legal-details" element={<ProtectedRoute><LabourLegalDetails /></ProtectedRoute>} />
            <Route path="/labour/payment-details" element={<ProtectedRoute><LabourPaymentDetails /></ProtectedRoute>} />
            <Route path="/labour/contact-us" element={<ProtectedRoute><LabourContactUs /></ProtectedRoute>} />
            <Route path="/labour/about-us" element={<ProtectedRoute><LabourAboutUs /></ProtectedRoute>} />
            <Route path="/labour/notifications" element={<ProtectedRoute><LabourNotifications /></ProtectedRoute>} />
            <Route path="/labour/subscription" element={<ProtectedRoute><LabourSubscription /></ProtectedRoute>} />
            <Route path="/labour/create-card" element={<ProtectedRoute><CreateLabourCard /></ProtectedRoute>} />
            <Route path="/labour/my-card" element={<ProtectedRoute><LabourMyCard /></ProtectedRoute>} />
            <Route path="/labour/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

            {/* Admin Module Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_USER', 'ADMIN_LABOUR', 'ADMIN_CONTRACTOR']}><ProfessionalDashboard /></RoleProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="home" element={<DashboardHome />} />
                <Route path="users" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_USER']}><UserManagement /></RoleProtectedRoute>} />
                <Route path="labours" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_LABOUR']}><LabourManagement /></RoleProtectedRoute>} />
                <Route path="categories" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_LABOUR']}><LabourCategoryManagement /></RoleProtectedRoute>} />
                <Route path="contractors" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_CONTRACTOR']}><ContractorManagement /></RoleProtectedRoute>} />
                <Route path="verification" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}><VerificationManagement /></RoleProtectedRoute>} />
                <Route path="broadcasts" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_USER']}><BroadcastManagement /></RoleProtectedRoute>} />
                <Route path="banners" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}><BannerSection /></RoleProtectedRoute>} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
