import Vue from 'vue';
import VueRouter from 'vue-router';


Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueAxios, axios);

import VueSocketio from 'vue-socket.io';


import App from './App.vue';

import StartPage from './components/main/StartPage.vue';

import Login from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';

import FormTop from './components/form/FormTop.vue';
import DisplayApplication from './components/form/DisplayApplication.vue';
import DisplayRestaurant from './components/form/DisplayRestaurant.vue';
import ApplyForm from './components/form/ApplyForm.vue';

import DisplayOrder from './components/order/DisplayOrder.vue';
import CreateOrder from './components/order/CreateOrder.vue';
import EditOrder from './components/order/EditOrder.vue';

import RestaurantTop from './components/restaurant/RestaurantTop.vue';
import Info from './components/restaurant/Info.vue';
import Home from './components/restaurant/Home.vue';
import Menu from './components/restaurant/Menu.vue';
import Order from './components/restaurant/Order.vue';

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
        },
        // beforeEnter (to, from, next) {
        //     if(!Vue.prototype.$socket) {
        //         Vue.use(VueSocketio, 'http://freeorder1010.herokuapp.com:3000');
        //     }
        //     next()
        // }
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
        name: 'DisplayOrder',
        path: '/view/order',
        components: {
            default: DisplayOrder,
            a: RestaurantTop
        }
    },
    {
        name: 'CreateOrder',
        path: '/create/order',
        component: CreateOrder
    },
    {
        name: 'EditOrder',
        path: '/edit/order/:id',
        component: EditOrder
    }
];

var router = new VueRouter({mode: 'history', routes: routes});
new Vue(Vue.util.extend({router}, App)).$mount('#app')