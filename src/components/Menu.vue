<template>
  <div>
    <div id="logo">
      Smart IoT
    </div>
    <a-menu
      :default-selected-keys="this.selectedKey"
      :default-open-keys="this.openedKey"
      @click="handleSelect"
      @openChange="handleOpenChange"
      mode="inline"
      theme="dark"
    >
      <template v-for="item in list">
        <a-menu-item v-if="!item.children" :key="item.key">
          <router-link :to="item.path">
            <a-icon :type="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.key">
          <span slot="title">
            <a-icon :type="item.icon" />
            <span>{{item.title}}</span>
          </span>
          <a-menu-item v-for="item in item.children" :key="item.key">
            <router-link :to="item.path">
              <span>{{ item.title }}</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  data() {
    return {
      list: [
        {
          key: '1',
          title: '概览',
          icon: 'appstore',
          path: '/Summary',
        },
        {
          key: '2',
          title: '设备',
          icon: 'sliders',
          children: [
            {
              key: '2.1',
              title: '设备模板',
              path: '/Device/Template',
            },
            {
              key: '2.2',
              title: '设备管理',
              path: '/Device/Management',
            },
          ],
        },
        {
          key: '3',
          title: '数据通道',
          icon: 'funnel-plot',
          children: [
            {
              key: '3.1',
              title: '模板数据通道',
              path: '/Channel/Template',
            },
            {
              key: '3.2',
              title: '设备数据通道',
              path: '/Channel/Device',
            },
          ],
        },
        {
          key: '4',
          title: '规则引擎',
          icon: 'cloud-upload',
          path: '/Rule/',
        },
        {
          key: '5',
          title: '数据分析',
          icon: 'line-chart',
          children: [
            {
              key: '4.1',
              title: '时序分析',
              path: '/DataAnalytics/DataPresentation',
            },
            {
              key: '4.2',
              title: '实时分析',
              path: '/DataAnalytics/RealtimeAnalysis',
            },
          ],
        },
        {
          key: '6',
          title: '关于平台',
          icon: 'dash',
          path: '/About',
        },
      ],
    };
  },
  computed: {
    selectedKey() {
      return [sessionStorage.getItem('menu-key') || ''];
    },
    openedKey() {
      return JSON.parse(sessionStorage.getItem('opened-keys')) || [];
    },
  },
  methods: {
    handleSelect({ key }) {
      sessionStorage.setItem('menu-key', key);
    },
    handleOpenChange(openKeys) {
      sessionStorage.setItem('opened-keys', JSON.stringify(openKeys));
    },
  },
};
</script>

<style lang="stylus" scoped>
*
  user-select none
#logo
  text-align center
  padding 20px 0
  font-size 24px
  color rgba(#f0f2f5, 70%)
</style>
