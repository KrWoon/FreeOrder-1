import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueAxios, axios);

import App from './App.vue';
import indexPage from './components/main/indexPage.vue';
import DisplayOrder from './components/order/DisplayOrder.vue';
import CreateOrder from './components/order/CreateOrder.vue';
import EditOrder from './components/order/EditOrder.vue';

var routes = [
    {
        name: 'indexPage',
        path: '/',
        component: indexPage
    },
    {
        name: 'DisplayOrder',
        path: '/view/order',
        component: DisplayOrder
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