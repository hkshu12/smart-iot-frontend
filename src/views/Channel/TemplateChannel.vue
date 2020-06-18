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
        <a-button @click="gotoDataField(record.id)">查看字段</a-button>
      </template>
      <template slot="message_operation" slot-scope="record">
        <a-button @click="sendMessage(record)" :disabled="record.channelType == 0">发送消息</a-button>
      </template>
    </a-table>
    <div class="table-footer">
      <a-button v-if="id != -1"
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
          ref="templateId"
          label="模板id"
          prop="templateId">
          <a-input :disabled= "true"
                   v-model="modalForm.templateId"
                   placeholder="模板id"
                   @blur="
            () => {
              $refs.templateId.onFieldBlur();
            }
          "/>
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
    title: '模板Id',
    dataIndex: 'templateId',
    key: 'templateId',
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
  // {
  //   title: '下发消息',
  //   scopedSlots: { customRender: 'message_operation' },
  //   align: 'center',
  // },
];
export default {
  name: 'TemplateChannel',

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
        templateId: [
          { required: true, message: '请输入设备id' },
        ],
      },
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
          const res = await this.$axios('/channel/list/template-channel');
          this.channelList = res;
        } else {
          const res = await this.$axios(`/channel/get/template-channel/${this.id}`);
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

    onClickUpdateButton(record) {
      this.modalType = 1;
      this.showTemplateModal(record);
    },

    async onClickDeleteButton(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios.post(`/channel/delete/template-channel/${id}`);
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
      this.modalForm.templateId = this.id;
      this.modalForm.channelDataString = JSON.stringify(this.modalForm.channelData);
      this.modalVisible = true;
    },

    async handleModalOk() {
      let url;
      if (this.modalType === 2) {
        url = '/channel/add/template-channel';
      } else if (this.modalType === 1) {
        url = `/channel/modify/template-chanel/${this.modalForm.id}`;
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

    gotoDataField(channelId) {
      this.$router.push(`/Channel/Data?channelId=${channelId}&channelType=0`);
    },
    sendMessage(record) {
      console.log(record);
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
