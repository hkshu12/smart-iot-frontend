import Vue from 'vue';
import VueRouter from 'vue-router';
import Summary from '@/views/Summary.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/Summary',
  },
  {
    path: '/Summary',
    name: '数据概览',
    component: Summary,
    title: 'Summary',
  },
  {
    path: '/Device',
    name: '设备',
    component: () => import('@/views/Device/Device.vue'),
    children: [
      {
        path: 'Template',
        name: '设备模板',
        component: () => import('@/views/Device/Template.vue'),
      },
      {
        path: 'Management',
        name: '设备管理',
        component: () => import('@/views/Device/Manage.vue'),
      },
    ],
  },
  {
    path: '/Rule',
    name: '规则引擎',
    component: () => import('@/views/Rule/Rule.vue'),
    children: [
      {
        path: 'DeviceLinkage',
        name: '设备联动',
        component: () => import('@/views/Rule/DeviceLinkage.vue'),
      },
      {
        path: 'DataForwarding',
        name: '数据转发',
        component: () => import('@/views/Rule/DataForwarding.vue'),
      },
    ],
  },
  {
    path: '/DataAnalytics',
    name: '数据分析',
    component: () => import('@/views/DataAnalytics/DataAnalytics.vue'),
    title: 'DataAnalytics',
  },
  {
    path: '/About',
    name: '关于平台',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    title: 'About',
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
