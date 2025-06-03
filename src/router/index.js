import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignupView.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import HomeView from '../views/HomeView.vue';
import ResetPassword from "../views/ResetPassword.vue";
import 'vue-step-progress/dist/main.css';
import Availablity from "../views/Availability.vue";
import PersonalInfo from "../views/PersonalInfo.vue";
import VehicleAndBagDetails from "../views/VehicleAndBagDetails.vue";
import PaymentValidation from "../views/PaymentValidation.vue";
import DeliveryLocation from "../views/DeliveryLocation.vue";
import FAQ from "../views/FAQ.vue";
import MyDetails from "../views/MyDetails.vue";
import Stats from "../views/Stats.vue";
import TrainingVideos from '../views/TrainingVideos.vue';
import Announcements from '../views/Announcements.vue';
import BlogView from "../components/BlogView.vue";
import UrgentOrder from "../openboard/UrgentOrder.vue"
import openOrders from "../openboard/OpenOrders.vue"
import openOrdersLogin from "../openboard/OpenLoginView.vue"
import LegalZoomLink from "../views/LegalZoomLink.vue";
import openForgetPassword from "../openboard/OrderForgotPassword.vue"
import OpenOrdersDetail from "../openboard/OpenOrdersDetail.vue"
import SubmitApplication from "../views/SubmitApplication.vue";
import AccountRecovery from "../openboard/AccountRecovery.vue";
import BailUrgentOrder from "../views/BailUrgentOrder.vue"
import OrdersOpen from "../openboard/OrdersOpen.vue";
import Feedback from "../openboard/Feedback.vue";
import OpenBoardSettings from "../openboard/OpenBoardSettings.vue";
import FAQIframe from "@/views/FAQIframe.vue";


// Openboard
import OAccountRecovery from "../views/AccountRecovery.vue";
import OFeedback from "../views/Feedback.vue";
import OOpenBoardHelp from "../views/OpenBoardHelp.vue";
import OOpenBoardSettings from "../views/OpenBoardSettings.vue";
import OopenOrdersLogin from "../views/OpenLoginView.vue"
import OopenOrders from "../views/OpenOrders.vue"
import OOpenOrdersDetail from "../views/OpenOrdersDetail.vue"
import OOpenOrdersDetailRestaurantDriver from "../views/OpenOrdersDetailRestaurantDriver.vue"
import OphVerification from "../views/phVerification.vue";
import OpenBoardDesktop from "../views/OpenBoardDesktop.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/ph/:tokenid',
      name: 'phVerification',
      component: OphVerification
    },
    {
      path: '/rd/:token',
      name: 'OpenOrdersDetailRestaurantDriver',
      component: OOpenOrdersDetailRestaurantDriver
    },
    {
      path: '/OpenOrdersDetail/:Order_id',
      name: 'OpenOrdersDetail',
      component: OOpenOrdersDetail
    },
    {
      path: '/openOrders',
      name: 'openOrders',
      component: OopenOrders
    },
    {
      path: '/O',
      name: 'openOrdersLogin',
      component: OopenOrdersLogin
    },
    {
      path: '/settings',
      name: 'OpenBoardSettings',
      component: OOpenBoardSettings
    },
    {
      path: '/help',
      name: 'OpenBoardHelp',
      component: OOpenBoardHelp
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: OFeedback
    },
    {
      path: '/AccountRecovery',
      name: 'AccountRecovery',
      component: OAccountRecovery
    },

    {
      path: '/open-opportunity-board',
      name: 'OpenBoardDesktop',
      component: OpenBoardDesktop
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/announcements',
      name: 'Announcements',
      component: Announcements
    },
    {
      path: '/availability',
      name: 'availability',
      component: Availablity
    },
    {
      path: '/personalDetails',
      name: 'PersonalInfo',
      component: PersonalInfo
    },
    {
      path: '/vehicleandbagdetails',
      name: 'VehicleAndBagDetails',
      component: VehicleAndBagDetails
    },
    {
      path: '/deliverylocation',
      name: 'DeliveryLocation',
      component: DeliveryLocation
    },
    {
      path: '/llc',
      name: 'LegalZoomLink',
      component: LegalZoomLink
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    },
    {
      path: '/blog',
      name: 'BlogView',
      component: BlogView
    },
    {
      path: '/training',
      name: 'TrainingVideos',
      component: TrainingVideos
    },
    {
      path: '/analytics',
      name: 'Stats',
      component: Stats
    },
    {
      path: '/validation',
      name: 'PaymentValidation',
      component: PaymentValidation
    },
    {
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: ForgotPassword
    },
    {
      path: '/documents',
      name: 'MyDetails',
      component: MyDetails
    },
    {
      path: '/resetPassword/:tokenId',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/drive',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/educate',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/order/urgentOrder',
      name: 'UrgentOrder',
      component: UrgentOrder
    },
    // {
    //   path: '/order/openOrders',
    //   name: 'openOrders',
    //   component: openOrders
    // },
    {
      path: '/order/OrdersOpen',
      name: 'OrdersOpen',
      component: OrdersOpen
    },
    // {
    //   path: '/order/',
    //   name: 'openOrdersLogin',
    //   component: openOrdersLogin
    // },
    {
      path: '/order/forgotpassword',
      name: 'openForgetPassword',
      component: openForgetPassword
    },
    // {
    //   path: '/order/AccountRecovery',
    //   name: 'AccountRecovery',
    //   component: AccountRecovery
    // },
    {
      path: '/BailUrgentOrder',
      name: 'BailUrgentOrder',
      component: BailUrgentOrder
    },
    {
      path: '/checklist',
      name: 'SubmitApplication',
      component: SubmitApplication
    },
    {
      path: '/faqiframe',
      name: 'FAQIframe',
      component: FAQIframe
    },
  ]
})

export default router
