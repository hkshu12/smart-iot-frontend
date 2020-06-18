<template>
  <div class="channel">
    <a-table
      :columns="columns"
      :data-source="channelList"
      :loading="loading"
      :row-key="record => record.id"
      :pagination="false">

      <template slot="channelType" slot-scope="channelTypeInt">
        {{convertChannelType(channelTypeInt)}}</template>
      <template slot="templateChannelId" slot-scope="templateChannelId">
        {{convertTemplateChannelId(templateChannelId)}}</template>
      <template slot="channel_operation" slot-scope="record">
        <a-button @click="onClickUpdateButton(record)">编辑</a-button>
        <a-popconfirm
          placement="topLeft"
          ok-text="确认"
          cancel-text="取消"
          @confirm="onClickDeleteButton(record.id)"
          style="margin-left:14px;">
          <template slot="title">
            <p>确认要删除该模板吗？</p>
          </template>
          <a-button
            type="danger"
          >删除</a-button>
        </a-popconfirm>
      </template>
      <template slot="field_operation" slot-scope="record">
        <a-button @click="gotoDataField(record.id,record.templateChannelId)">查看字段</a-button>
      </template>
      <template slot="message_operation" slot-scope="record">
        <a-button @click="sendMessage(record)" :disabled="record.channelType == 0">发送消息</a-button>
      </template>
    </a-table>
    <div class="table-footer">
      <a-button v-if="id!=-1"
                class="back" @click="goBack()">
        返回
      </a-button>
      <div class="add">
      <a-button v-if="canAdd" type="primary"
                @click="modalType=2;showTemplateModal()">
        添加通道
      </a-button>
      </div>
    </div>
    <a-modal
      :visible="modalVisible"
      :confirm-loading="modalConfirmLoading"
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel">

      <template slot="footer">
        <a-button key="back" @click="handleModalReset">
          重置
        </a-button>
        <a-button key="submit" type="primary" :loading="modalConfirmLoading" @click="handleModalOk">
          提交
        </a-button>
      </template>

      <a-form-model
        ref="ruleForm"
        :model="modalForm"
        :rules="formRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }">
        <a-form-model-item
          ref="channelName"
          label="通道名称"
          prop="channelName">
          <a-input :disabled="modalType == 0"
                   v-model="modalForm.channelName"
                   placeholder="请输入通道名称"
                   @blur="
            () => {
              $refs.channelName.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="channelType"
          label="通道类型"
          prop="channelType">
          <a-input :disabled= "modalType != 2"
                   v-model="modalForm.channelType"
                   placeholder="0：向上通道，设备到平台，1：向下通道，平台到设备"
                   @blur="
            () => {
              $refs.channelName.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="deviceId"
          label="设备id"
          prop="deviceId">
          <a-input :disabled= "true"
                   v-model="modalForm.deviceId"
                   placeholder="设备id"
                   @blur="
            () => {
              $refs.deviceId.onFieldBlur();
            }
          "/>
        </a-form-model-item>

      </a-form-model>
    </a-modal>
    <a-modal :visible="showMessageModal"
             :confirm-loading="false"
             :title="messageModalTitle"
             @ok="handleMessageModalOk"
             @cancel="handleMessageModalCancel">
      <a-form-model
        v-if="showMessageModal"
        :model="messageForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }">

        <a-form-model-item
          v-for="(item,index) in this.channelData" :key="index">
          <span slot="label">{{item.fieldName}}</span>
          <span><a-input v-model="dataForMessageForm[index].value"/>
          </span>
        </a-form-model-item>

      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
const columns = [
  {
    title: '通道名称',
    dataIndex: 'channelName',
    key: 'channelName',
  },
  {
    title: '通道方向',
    dataIndex: 'channelType',
    key: 'channelType',
    scopedSlots: { customRender: 'channelType' },
    align: 'center',
  },
  {
    title: '从属模板通道id',
    dataIndex: 'templateChannelId',
    key: 'templateChannelId',
    scopedSlots: { customRender: 'templateChannelId' },
    align: 'center',
  },
  {
    title: '设备Id',
    dataIndex: 'deviceId',
    key: 'deviceId',
    align: 'center',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'channel_operation' },
    align: 'center',
  },
  {
    title: '查看通道内容',
    scopedSlots: { customRender: 'field_operation' },
    align: 'center',
  },
  {
    title: '下发消息',
    scopedSlots: { customRender: 'message_operation' },
    align: 'center',
  },
];
export default {
  name: 'DeviceChannel',

  data() {
    return {
      loading: false,
      channelList: [],
      columns,

      id: -1,
      canAdd: true,

      modalType: 0,
      modalVisible: false,
      modalConfirmLoading: false,
      modalForm: {},
      showChannelSetting: false,

      formRules: {
        channelType: [
          { required: true, message: '请选择通道类型' },
        ],
        channelName: [
          { required: true, message: '请输入数据通道名称' },
        ],
        deviceId: [
          { required: true, message: '请输入设备id' },
        ],
      },

      channelData: [],
      messageForm: {
        channelId: -1,
        data: [
          {},
        ],
        date: '',
        deviceId: -1,
        direction: 1,
        topic: '',
      },
      messageFormRules: {},
      showMessageModal: false,
      messageModalTitle: '数据下发',
      dataForMessageForm: [],
      dataStr: '',
      dataJson: {},
    };
  },

  computed: {
    modalTitle() {
      switch (this.modalType) {
        case 0:
          return '查看通道';
        case 1:
          return '编辑通道';
        case 2:
          return '新建通道';
        default:
          return undefined;
      }
    },
  },

  mounted() {
    this.id = this.$route.query.id;
    if (this.id === undefined) {
      this.id = -1;
      this.canAdd = false;
    }
    this.getChannels();
  },

  methods: {
    async getChannels() {
      this.loading = true;
      try {
        if (this.id === -1) {
          const res = await this.$axios('/channel/list/device-channel');
          this.channelList = res;
        } else {
          const res = await this.$axios(`/channel/get/device-channel/${this.id}`);
          this.channelList = res;
        }
        this.loading = false;
      } catch (err) {
        // empty
      }
    },

    // eslint-disable-next-line consistent-return
    convertChannelType(channelTypeInt) {
      if (channelTypeInt === 0) {
        return '向上通道';
      }
      if (channelTypeInt === 1) {
        return '向下通道';
      }
    },

    convertTemplateChannelId(templateChanelId) {
      if (templateChanelId === -1) {
        return '无模板通道';
      }
      return templateChanelId;
    },

    onClickUpdateButton(record) {
      this.modalType = 1;
      this.showTemplateModal(record);
    },

    async onClickDeleteButton(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios.post(`/channel/delete/device-channel/${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.getChannels();
        } else {
          this.$message.error({ content: '删除失败', key: id, duration: 3 });
        }
      } catch (e) {
        console.log(e);
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },

    showTemplateModal(content = {}) {
      this.modalForm = content;
      this.modalForm.deviceId = this.id;
      this.modalForm.channelDataString = JSON.stringify(this.modalForm.channelData);
      this.modalVisible = true;
    },

    async handleModalOk() {
      let url;
      if (this.modalType === 2) {
        url = '/channel/add/device-channel';
      } else if (this.modalType === 1) {
        url = `/channel/modify/device-chanel/${this.modalForm.id}`;
      } else {
        console.err('未知的模态框类型！');
        this.$message.error('未知的模态框类型！', 3);
        return;
      }
      this.modalConfirmLoading = true;
      try {
        const res = await this.$axios.post(url, this.modalForm);
        if (res.code === 1) {
          this.$message.success({ content: '更新成功', duration: 3 });
          this.modalVisible = false;
          this.modalForm = {};
          this.showChannelSetting = false;
          await this.getChannels();
        } else {
          this.$message.error({ content: '更新失败', duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '更新失败', duration: 3 });
      } finally {
        this.modalConfirmLoading = false;
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.modalForm = {};
      this.showChannelSetting = false;
    },
    handleModalReset() {
      this.modalForm = {};
    },

    async gotoDataField(channelId, templateChannelId) {
      if (templateChannelId === -1) {
        this.$router.push(`/Channel/Data?channelId=${channelId}&channelType=1`);
      } else {
        this.$router.push(`/Channel/Data?channelId=${templateChannelId}&channelType=0`);
      }
    },
    async sendMessage(record) {
      this.messageForm.channelId = record.id;
      this.messageForm.topic = record.id.toString();
      this.messageForm.date = new Date();
      this.messageForm.deviceId = record.deviceId;
      this.messageForm.direction = 1;
      this.dataForMessageForm = [];

      try {
        if (record.templateChannelId === -1) {
          const res = await this.$axios(`/channel/get/data?channelType=1&channelId=${record.id}`);
          this.channelData = res;
        } else {
          const res = await this.$axios(`/channel/get/data?channelType=0&channelId=${record.templateChannelId}`);
          this.channelData = res;
        }

        this.channelData.forEach((item) => {
          if (item.fieldType === 0) {
            // eslint-disable-next-line max-len
            this.dataForMessageForm.push({ name: item.fieldName, type: item.fieldType, value: false });
          }
          if (item.fieldType === 1) {
            // eslint-disable-next-line max-len
            this.dataForMessageForm.push({ name: item.fieldName, type: item.fieldType, value: 0.1 });
          }
          if (item.fieldType === 2) {
            this.dataForMessageForm.push({ name: item.fieldName, type: item.fieldType, value: 'string' });
          }
          if (item.fieldType === 3) {
            this.dataForMessageForm.push({ name: item.fieldName, type: item.fieldType, value: 1 });
          }
        });
        this.showMessageModal = true;
      } catch (e) {
        // empty
      }
    },
    handleMessageModalCancel() {
      this.showMessageModal = false;
      this.messageForm = {};
    },
    async handleMessageModalOk() {
      if (this.dataForMessageForm.length < 1) {
        this.$message.error({ content: '没有内容可发送！', duration: 3 });
        this.showMessageModal = false;
        this.dataStr = '';
        this.dataJson = {};
      } else {
        this.dataStr = '[';
        this.dataForMessageForm.forEach((item) => {
          if (item.type !== 2) {
            this.dataStr += `{"${item.name}":${item.value}},`;
          } else {
            this.dataStr += `{"${item.name}":"${item.value}"},`;
          }
        });
        this.dataStr = `${this.dataStr.substr(0, this.dataStr.length - 1)}]`;
        this.dataJson = JSON.parse(this.dataStr);
        this.messageForm.data = this.dataJson;
        try {
          const res = await this.$axios.post(`/message/send-to-device?deviceId=${this.messageForm.deviceId}`,
            this.messageForm);
          if (res.code === 1) {
            this.showMessageModal = false;
            this.messageForm = {};
            this.$message.success({ content: '发送成功', duration: 3 });
          } else {
            this.$message.error({ content: res.msg, duration: 3 });
          }
        } catch (err) {
          this.$message.error({ content: '更新失败', duration: 3 });
        } finally {
          this.dataStr = '';
          this.dataJson = {};
        }
      }
    },
    goBack() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="stylus" scoped>
  .table-footer
    position relative
    line-height 80px
    height 80px
    margin 0 20px
    .add
      float right
</style>
