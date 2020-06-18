import Vue from 'vue';
import {
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Notification,
  Table,
  Pagination,
  Popconfirm,
  Message,
  Modal,
  FormModel,
  Input,
  Radio,
  Switch,
  Select,
  DatePicker,
  Collapse,
  Upload,
} from 'ant-design-vue';

Vue.use(ConfigProvider);
Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Breadcrumb);
Vue.use(Table);
Vue.use(Pagination);
Vue.use(Popconfirm);
Vue.use(Modal);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Collapse);
Vue.use(Upload);

Vue.prototype.$notification = Notification;
Vue.prototype.$message = Message;
