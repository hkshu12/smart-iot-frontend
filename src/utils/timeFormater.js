/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    const that = this;
    // 1. 添加全局方法或属性
    // Vue.global = this
    // 2. 添加全局资源
    // 3. 注入组件
    Vue.mixin({
      created() {
        this.global = that;
      },
    });
    // 转成 yyyy-MM-DD HH:mm
    Vue.prototype.$timeFormat = (timeString) => {
      const date = new Date(timeString);
      const Y = `${date.getFullYear()}-`;
      const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      }-`;
      const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
      const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
      const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
      return Y + M + D + h + m;
    };
    // 转成 yyyy-MM-DD
    Vue.prototype.$timeFormatDay = (timeString) => {
      const date = new Date(timeString);
      const Y = `${date.getFullYear()}-`;
      const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      }-`;
      const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
      return Y + M + D;
    };
  },
};
