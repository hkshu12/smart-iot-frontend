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
    meta: {
      title: '数据概览',
    },
  },
  {
    path: '/Device',
    name: '设备',
    component: () => import(/* webpackChunkName: "device" */ '@/views/Device/Device.vue'),
    meta: {
      title: '设备',
    },
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
    children: [
      {
        path: 'DataPresentation',
        name: '时序分析',
        component: () => import(/* webpackChunkName: "data" */ '@/views/DataAnalytics/DataPresentation.vue'),
        meta: {
          title: '时序分析',
        },
      },
      {
        path: 'RealtimeAnalysis',
        name: '实时分析',
        component: () => import(/* webpackChunkName: "data" */ '@/views/DataAnalytics/RealtimeAnalysis.vue'),
        meta: {
          title: '实时分析',
        },
      },
    ],
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
    component: () => import(/* webpackChunkName: "about" */ '@/views/Channel/Channel.vue'),
    children: [
      {
        path: 'Template',
        name: '模板数据通道',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Channel/TemplateChannel.vue'),
        meta: {
          title: '模板数据通道',
        },
      },
      {
        path: 'Device',
        name: '设备数据通道',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Channel/DeviceChannel.vue'),
        meta: {
          title: '设备数据通道',
        },
      },
      {
        path: 'Data',
        name: '数据通道字段',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Channel/ChannelData.vue'),
        meta: {
          title: '数据通道字段',
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
