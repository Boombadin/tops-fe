import {
  ROUTE_NEW_YEAR_BUSKET,
  ROUTE_NEW_YEAR_BUSKET_TAB_2,
  ROUTE_NEW_YEAR_BUSKET_TAB_3,
} from './config/promotions';
import CallbackPage from './pages/Callback';
import CategoryPage from './pages/Category';
import CMSPage from './pages/CMS';
import ContactUs from './pages/ContactUs';
import Deals from './pages/Deals';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordCompleted from './pages/ForgotPassword/ForgotPasswordCompleted';
import Help from './pages/Help';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MobileBilling from './pages/MobileBilling';
import MobileTimeslot from './pages/MobileTimeslot';
import MobileWishList from './pages/MobileWishlist';
import MultiCheckout from './pages/MultiCheckout';
import {
  NewYearBusketPageTab1,
  NewYearBusketPageTab2,
  NewYearBusketPageTab3,
} from './pages/NewYearBasket';
import NotFound from './pages/NotFound';
import OrderDetail from './pages/OrderDetail';
import OrderHistory from './pages/OrderHistory';
import Payment from './pages/Payment/Payment';
import PaymentSuccess from './pages/Payment/PaymentComplete';
import PaymentFail from './pages/Payment/PaymentFail';
import PersonalInfo from './pages/PersonalInfo';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Privilege from './pages/Privilege';
import Profile from './pages/Profile';
import Provider from './pages/Provider';
import Recommended from './pages/Recommended';
import Registration from './pages/Registration';
import RegisCompleted from './pages/Registration/RegisCompleted';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordCompleted from './pages/ResetPassword/ResetPasswordCompleted';
import SearchPage from './pages/Search';
import TermsAndCondition from './pages/TermsAndCondition/TermsAndCondition';
import Trending from './pages/Trending';
import UrlRewrite from './pages/UrlRewrite';
import WishList from './pages/Wishlist';

const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/home',
    exact: true,
    component: HomePage,
  },
  {
    path: '/wishlist',
    component: WishList,
  },
  {
    path: '/m/wishlist',
    component: MobileWishList,
  },
  {
    path: '/timeslot',
    exact: true,
    component: MobileTimeslot,
  },
  {
    path: '/billing',
    exact: true,
    component: MobileBilling,
  },
  {
    path: '/checkout',
    exact: true,
    component: MultiCheckout,
  },
  {
    path: '/profile',
    exact: true,
    component: Profile,
  },
  {
    path: '/personal-info',
    exact: true,
    component: PersonalInfo,
  },
  {
    path: '/checkout/payment',
    component: Payment,
  },
  {
    path: '/checkout/completed/:slug*',
    component: PaymentSuccess,
  },
  {
    path: '/checkout/error/:slug*',
    component: PaymentFail,
  },
  {
    path: '/callback/:slug',
    component: CallbackPage,
  },
  {
    path: '/category/:slug',
    component: CategoryPage,
  },
  {
    path: '/search',
    component: SearchPage,
  },
  {
    path: '/pages/:slug',
    component: CMSPage,
  },
  {
    path: '/recommended',
    //exact: true,
    component: Recommended,
  },
  // {
  //   path: '/recommended/:slug',
  //   component: Recommended
  // },
  {
    path: '/promotion',
    //exact: true,
    component: Trending,
  },
  // {
  //   path: '/promotion/:slug',
  //   component: Trending
  // },
  {
    path: '/deals',
    exact: true,
    component: Deals,
  },
  {
    path: '/privilege',
    exact: true,
    component: Privilege,
  },
  {
    path: '/order-history',
    exact: true,
    component: OrderHistory,
  },
  {
    path: '/help',
    exact: true,
    component: Help,
  },
  {
    path: '/contact',
    exact: true,
    component: ContactUs,
  },
  {
    path: '/order-detail/:id',
    exact: true,
    component: OrderDetail,
  },
  {
    path: '/registration',
    exact: true,
    component: Registration,
  },
  {
    path: '/privacy-policy',
    exact: true,
    component: PrivacyPolicy,
  },
  {
    path: '/terms-conditions',
    exact: true,
    component: TermsAndCondition,
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/forgot-password',
    exact: true,
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    exact: true,
    component: ResetPassword,
  },
  {
    path: '/reset-password/completed',
    exact: true,
    component: ResetPasswordCompleted,
  },
  {
    path: '/registration/completed',
    exact: true,
    component: RegisCompleted,
  },
  {
    path: '/forgot-password/completed',
    exact: true,
    component: ForgotPasswordCompleted,
  },
  {
    path: '/provider/:slug/:url_key*',
    exact: true,
    component: Provider,
  },

  {
    path: ROUTE_NEW_YEAR_BUSKET,
    exact: true,
    component: NewYearBusketPageTab1,
  },
  {
    path: ROUTE_NEW_YEAR_BUSKET_TAB_2,
    exact: true,
    component: NewYearBusketPageTab2,
  },
  {
    path: ROUTE_NEW_YEAR_BUSKET_TAB_3,
    exact: true,
    component: NewYearBusketPageTab3,
  },
  {
    path: '/:slug*',
    exact: true,
    component: UrlRewrite,
  },
  {
    component: NotFound,
  },
];

export default routes;
