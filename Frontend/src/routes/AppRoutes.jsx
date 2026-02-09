import { Routes, Route } from 'react-router-dom';

// Auth Pages
import GetStarted from '../modules/auth/pages/GetStarted';
import MobileInput from '../modules/auth/pages/MobileInput';
import OTPVerification from '../modules/auth/pages/OTPVerification';
import CompleteProfile from '../modules/auth/pages/CompleteProfile';

// User Pages
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

// Contractor Pages
import ContractorBusinessDetails from '../modules/contractor/pages/BusinessDetails';
import ContractorHireWorkers from '../modules/contractor/pages/HireWorkers';
import ContractorFindUser from '../modules/contractor/pages/FindUser';
import ContractorRequests from '../modules/contractor/pages/Requests';
import ContractorUserRequest from '../modules/contractor/pages/UserRequest';
import ContractorWorkersRequest from '../modules/contractor/pages/WorkersRequest';
import ContractorSettings from '../modules/contractor/pages/Settings';
import ContractorPersonalDetails from '../modules/contractor/pages/PersonalDetails';
import ContractorMyProjects from '../modules/contractor/pages/MyProjects';
import ContractorPostJob from '../modules/contractor/pages/PostJob';
import ContractorLegal from '../modules/contractor/pages/Legal';
import ContractorAboutUs from '../modules/contractor/pages/AboutUs';
import ContractorContactUs from '../modules/contractor/pages/ContactUs';
import ContractorNotifications from '../modules/contractor/pages/Notifications';
import ContractorSubscription from '../modules/contractor/pages/Subscription';

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

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<GetStarted />} />
            <Route path="/mobile-login" element={<MobileInput />} />
            <Route path="/otp-verify" element={<OTPVerification />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />

            {/* User Module Routes */}
            <Route path="/user/hire-workers" element={<HireWorkers />} />
            <Route path="/user/find-contractor" element={<FindContractor />} />
            <Route path="/user/requests" element={<Requests />} />
            <Route path="/user/contractor-request" element={<ContractorRequest />} />
            <Route path="/user/workers-request" element={<WorkersRequest />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/personal-details" element={<PersonalDetails />} />
            <Route path="/user/my-projects" element={<MyProjects />} />
            <Route path="/user/post-job" element={<PostJob />} />
            <Route path="/user/legal" element={<Legal />} />
            <Route path="/user/contact-us" element={<ContactUs />} />
            <Route path="/user/about-us" element={<AboutUs />} />
            <Route path="/user/subscription" element={<Subscription />} />
            <Route path="/user/notifications" element={<Notifications />} />

            {/* Contractor Module Routes */}
            <Route path="/contractor/business-details" element={<ContractorBusinessDetails />} />
            <Route path="/contractor/hire-workers" element={<ContractorHireWorkers />} />
            <Route path="/contractor/find-user" element={<ContractorFindUser />} />
            <Route path="/contractor/requests" element={<ContractorRequests />} />
            <Route path="/contractor/user-request" element={<ContractorUserRequest />} />
            <Route path="/contractor/workers-request" element={<ContractorWorkersRequest />} />
            <Route path="/contractor/settings" element={<ContractorSettings />} />
            <Route path="/contractor/personal-details" element={<ContractorPersonalDetails />} />
            <Route path="/contractor/my-projects" element={<ContractorMyProjects />} />
            <Route path="/contractor/post-job" element={<ContractorPostJob />} />
            <Route path="/contractor/legal" element={<ContractorLegal />} />
            <Route path="/contractor/about-us" element={<ContractorAboutUs />} />
            <Route path="/contractor/contact-us" element={<ContractorContactUs />} />
            <Route path="/contractor/notifications" element={<ContractorNotifications />} />
            <Route path="/contractor/subscription" element={<ContractorSubscription />} />

            {/* Labour Module Routes */}
            <Route path="/labour/details" element={<LabourDetails />} />
            <Route path="/labour/hire-workers" element={<LabourDashboard />} />
            <Route path="/labour/find-user" element={<LabourFindUser />} />
            <Route path="/labour/find-contractor" element={<LabourFindContractor />} />
            <Route path="/labour/requests" element={<LabourRequests />} />
            <Route path="/labour/user-request" element={<LabourUserRequest />} />
            <Route path="/labour/contractor-request" element={<LabourContractorRequest />} />
            <Route path="/labour/settings" element={<LabourSettings />} />
            <Route path="/labour/personal-details" element={<LabourPersonalDetails />} />
            <Route path="/labour/work-details" element={<LabourWorkDetails />} />
            <Route path="/labour/legal-details" element={<LabourLegalDetails />} />
            <Route path="/labour/payment-details" element={<LabourPaymentDetails />} />
            <Route path="/labour/contact-us" element={<LabourContactUs />} />
            <Route path="/labour/about-us" element={<LabourAboutUs />} />
            <Route path="/labour/notifications" element={<LabourNotifications />} />
            <Route path="/labour/subscription" element={<LabourSubscription />} />
            <Route path="/labour/create-card" element={<CreateLabourCard />} />
            <Route path="/labour/my-card" element={<LabourMyCard />} />
        </Routes>
    );
};

export default AppRoutes;
