<template>
  <div class="channel">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :loading="loading"
      :row-key="record => record.id"
      :pagination="false">

      <template slot="fieldType" slot-scope="fieldTypeInt">
        {{convertFieldType(fieldTypeInt)}}</template>
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
    </a-table>
    <div class="table-footer">
      <a-button class="back" @click="goBack()">
        返回
      </a-button>
      <div class="add">
        <a-button v-if="canAdd" type="primary"
                  @click="modalType=2;showTemplateModal()">
          添加模板
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
          ref="fieldName"
          label="字段名称"
          prop="fieldName">
          <a-input :disabled="modalType == 0"
                   v-model="modalForm.fieldName"
                   placeholder="请输入字段名称"
                   @blur="
            () => {
              $refs.fieldName.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="fieldType"
          label="字段类型"
          prop="fieldType">
          <a-input :disabled= "modalType != 2"
                   v-model="modalForm.fieldType"
                   placeholder="0:bool,1:double;2:str;3:int"
                   @blur="
            () => {
              $refs.fieldType.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="channelId"
          label="通道id"
          prop="channelId">
          <a-input :disabled= "true"
                   v-model="modalForm.channelId"
                   placeholder="通道id"
                   @blur="
            () => {
              $refs.channelId.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="channelType"
          label="通道类型"
          prop="channelType">
          <a-input :disabled= "true"
                   v-model="modalForm.channelType"
                   placeholder="通道类型"
                   @blur="
            () => {
              $refs.channelType.onFieldBlur();
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
    title: '字段名称',
    dataIndex: 'fieldName',
    key: 'fieldName',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
    key: 'fieldType',
    scopedSlots: { customRender: 'fieldType' },
    align: 'center',
  },
  {
    title: '通道Id',
    dataIndex: 'channelId',
    key: 'channelId',
    align: 'center',
  },
  {
    title: '通道类型',
    dataIndex: 'channelType',
    key: 'channelType',
    scopedSlots: { customRender: 'channelType' },
    align: 'center',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'channel_operation' },
    align: 'center',
  },
];
export default {
  name: 'ChannelData',

  data() {
    return {
      loading: false,
      dataList: [],
      columns,

      channelId: -1,
      channelType: -1,
      canAdd: true,

      modalType: 0,
      modalVisible: false,
      modalConfirmLoading: false,
      modalForm: {},
      showChannelSetting: false,

      formRules: {
        fieldName: [
          { required: true, message: '请输入字段名称' },
        ],
        fieldType: [
          { required: true, message: '请输入字段类型' },
        ],
        channelId: [
          { required: true, message: '请输入通道id' },
        ],
        channelType: [
          { required: true, message: '请输入通道类型' },
        ],
        // channelDataString: [
        //   {
        //     validator: dataFieldsValidator,
        //     trigger: 'blur',
        //   },
        // ],
      },
    };
  },

  computed: {
    modalTitle() {
      switch (this.modalType) {
        case 0:
          return '查看字段';
        case 1:
          return '编辑字段';
        case 2:
          return '新建字段';
        default:
          return undefined;
      }
    },
  },

  mounted() {
    this.channelId = this.$route.query.channelId;
    this.channelType = this.$route.query.channelType;
    if (this.channelId === undefined || this.channelType === undefined) {
      this.$router.back(-1);
    }
    this.getDataFields();
  },

  methods: {
    async getDataFields() {
      this.loading = true;
      try {
        const res = await this.$axios(`/channel/get/data?channelType=${this.channelType}&channelId=${this.channelId}`);
        this.dataList = res;
        this.loading = false;
      } catch (err) {
        // empty
      }
    },

    // eslint-disable-next-line consistent-return
    convertChannelType(channelTypeInt) {
      if (channelTypeInt === 0) {
        return '隶属于模板通道';
      }
      if (channelTypeInt === 1) {
        return '隶属于设备通道';
      }
    },

    convertFieldType(fieldTypeInt) {
      if (fieldTypeInt === 0) {
        return 'boolean';
      }
      if (fieldTypeInt === 1) {
        return 'double';
      }
      if (fieldTypeInt === 2) {
        return 'string';
      }
      if (fieldTypeInt === 3) {
        return 'int';
      }
      return '未知';
    },

    onClickUpdateButton(record) {
      this.modalType = 1;
      this.showTemplateModal(record);
    },

    async onClickDeleteButton(id) {
      this.$message.loading({ content: '删除中...', key: id });
      console.log(id);
      try {
        const res = await this.$axios.post(`/channel/delete/data/${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.getDataFields();
        } else {
          this.$message.error({ content: '删除失败,请检查约束！', key: id, duration: 3 });
        }
      } catch (e) {
        console.log(e);
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },

    showTemplateModal(content = {}) {
      this.modalForm = content;
      this.modalForm.channelId = this.channelId;
      this.modalForm.channelType = this.channelType;
      this.modalVisible = true;
    },

    async handleModalOk() {
      let url;
      if (this.modalType === 2) {
        url = '/channel/add/field';
      } else if (this.modalType === 1) {
        url = `/channel/modify/data/${this.modalForm.id}`;
      } else {
        console.err('未知的模态框类型！');
        this.$message.error('未知的模态框类型！', 3);
        return;
      }
      this.modalConfirmLoading = true;
      try {
        const res = await this.$axios.post(url, this.modalForm);
        if (res.code === 1) {
          this.modalVisible = false;
          this.modalForm = {};
          await this.getDataFields();
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
