<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <a-layout style="min-height:100%;">
        <a-layout-sider :style="{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          }">
          <SideMenu />
        </a-layout-sider>
        <a-layout style="margin-left:200px;">
          <a-layout-header style="background:transparent;">
            <a-breadcrumb style="line-height:inherit;user-select:none;">
              <a-breadcrumb-item>Smart IoT</a-breadcrumb-item>
              <a-breadcrumb-item v-for="(breadItem, index) in router" :key="index">
                {{breadItem.name}}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </a-layout-header>
          <a-layout-content style="margin:16px 50px;background:#ffffff;">
            <router-view />
          </a-layout-content>
          <a-layout-footer style="text-align:center;">
            Smart IoT Platform
            <br />
            NJUSOFTWARE2017
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script>
// eslint-disable-next-line camelcase
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import SideMenu from '@/components/Menu.vue';

export default {
  name: 'app',
  data() {
    return {
      zh_CN,
    };
  },
  computed: {
    router() {
      return this.$route.matched.filter((item) => item.name);
    },
  },
  components: {
    SideMenu,
  },
};
</script>

<style lang="stylus">
*
  margin 0
  padding 0

#app
  font-family "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  height 100%
</style>
