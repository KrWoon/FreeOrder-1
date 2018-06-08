import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueAxios, axios);

import VueSocketio from 'vue-socket.io';

// Vue.use(VueSocketio, 'http://127.0.0.1:3000');
Vue.use(VueSocketio, 'https://freeorder1010.herokuapp.com');

import VuejsDialog from "vuejs-dialog"
 
Vue.use(VuejsDialog)

import App from './App.vue';

import StartPage from './components/main/StartPage.vue';

import Login from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';

import FormTop from './components/form/FormTop.vue';
import RootTop from './components/form/RootTop.vue';
import DisplayAdminPage from './components/form/DisplayAdminPage.vue';
import DisplayApplication from './components/form/DisplayApplication.vue';
import DisplayRestaurant from './components/form/DisplayRestaurant.vue';
import ApplyForm from './components/form/ApplyForm.vue';

import RestaurantTop from './components/restaurant/RestaurantTop.vue';
import Info from './components/restaurant/Info.vue';
import Home from './components/restaurant/Home.vue';
import Menu from './components/restaurant/Menu.vue';
import Order from './components/restaurant/Order.vue';
import Image from './components/restaurant/Image.vue';
import ViewOrder from './components/restaurant/ViewOrder.vue';
import PushOrder from './components/restaurant/PushOrder.vue';

var routes = [
    {
        name: 'StartPage',
        path: '/',
        component: StartPage
    },
    {
        name: 'Login',
        path: '/login',
        component: Login
    },  
    {
        name: 'Register',
        path: '/register',
        component: Register
    },      
    {
        name: 'DisplayRestaurant',
        path: '/view/restaurant',
        components: {
            default: DisplayRestaurant,
            a: FormTop
        }
    },
    {
        name: 'DisplayAdminPage',
        path: '/view/admin',
        components: {
            default: DisplayAdminPage,
            a: RootTop
        }
    },
    {
        name: 'DisplayApplication',
        path: '/view/application',
        components: {
            default: DisplayApplication,
            a: FormTop
        }
    },
    {
        name: 'ApplyForm',
        path: '/apply/application',
        components: {
            default: ApplyForm,
            a: FormTop
        }
    },
    {
        name: 'Home',
        path: '/view/home/:id',
        components: {
            default: Home,
            a: RestaurantTop
        }
    },
    {
        name: 'Info',
        path: '/view/info/:id',
        components: {
            default: Info,
            a: RestaurantTop
        }
    },
    {
        name: 'Menu',
        path: '/view/menu/:id',
        components: {
            default: Menu,
            a: RestaurantTop
        }
    },
    {
        name: 'Order',
        path: '/view/order/:id',
        components: {
            default: Order,
            a: RestaurantTop
        }
    },
    {
        name: 'ViewOrder',
        path: '/view/order/:id/detail/:oid',
        components: {
            default: ViewOrder,
            a: RestaurantTop
        }
    },
    {
        name: 'PushOrder',
        path: '/view/order/:id/push/:oid',
        components: {
            default: PushOrder,
            a: RestaurantTop
        }
    },
    {
        name: 'Image',
        path: '/view/image/:id',
        components: {
            default: Image,
            a: RestaurantTop
        }
    }
];

var router = new VueRouter({mode: 'history', routes: routes});
new Vue(Vue.util.extend({router}, App)).$mount('#app')