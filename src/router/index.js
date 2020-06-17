import Vue from 'vue';
import VueRouter from 'vue-router';
import Summary from '@/views/Summary.vue';
import Channel from '../views/Channel/Channel.vue';
import DeviceChannel from '../views/Channel/DeviceChannel.vue';
import TemplateChannel from '../views/Channel/TemplateChannel.vue';

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
    meta: {
      title: '数据概览',
    },
  },
  {
    path: '/Device',
    name: '设备',
    component: () => import(/* webpackChunkName: "device" */ '@/views/Device/Device.vue'),
    children: [
      {
        path: 'Template',
        name: '设备模板',
        component: () => import(/* webpackChunkName: "device" */ '@/views/Device/Template.vue'),
        meta: {
          title: '设备模板',
        },
      },
      {
        path: 'Management',
        name: '设备管理',
        component: () => import(/* webpackChunkName: "device" */ '@/views/Device/Manage.vue'),
        meta: {
          title: '设备管理',
        },
      },
    ],
  },
  {
    path: '/Rule',
    name: '规则引擎',
    component: () => import(/* webpackChunkName: "rule" */ '@/views/Rule/Rule.vue'),
    meta: {
      title: '规则引擎',
    },
  },
  {
    path: '/DataAnalytics',
    name: '数据分析',
    component: () => import(/* webpackChunkName: "data" */ '@/views/DataAnalytics/DataAnalytics.vue'),
    meta: {
      title: '数据分析',
    },
  },
  {
    path: '/About',
    name: '关于平台',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    meta: {
      title: '关于平台',
    },
  },
  {
    path: '/Channel',
    name: '数据通道',
    component: Channel,
    children: [
      {
        path: 'Template',
        name: '模板数据通道',
        component: TemplateChannel,
        meta: {
          title: '模板数据通道',
        },
      },
      {
        path: 'Device',
        name: '设备数据通道',
        component: DeviceChannel,
        meta: {
          title: '设备数据通道',
        },
      },
    ],
    meta: {
      title: '数据通道',
    },
  },
  {
    path: '*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.afterEach((to) => {
  document.title = `Smart IoT | ${to.meta.title}`;
});

export default router;
