<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="templateList"
      :loading="loading"
      :row-key="record => record.id"
      :pagination="false"
    >
      <template slot="updateTime" slot-scope="timeString">{{$timeFormat(timeString)}}</template>
      <template slot="template_operation" slot-scope="record">
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
        <a-button @click="modalType=2;showTemplateModal()">添加模板</a-button>
      <div class="pagination-container">
        <a-pagination
          :defaultCurrent="page"
          :defaultPageSize="pageSize"
          :total="total"
          showLessItems
          showSizeChanger
          :showTotal="total => `共 ${total} 条数据`"
          @showSizeChange="onShowSizeChange"
          @change="onPageChange"
          style="display:inline;"
        ></a-pagination>
      </div>
    </div>
    <a-modal
      :visible="modalVisible"
      :confirm-loading="modalConfirmLoading"
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
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
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item
          ref="name"
          label="模板名称"
          prop="name"
        >
          <a-input :disable="!modalType"
          v-model="modalForm.name"
          placeholder="请输入模板名称"
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="description"
          label="模板描述"
          prop="description"
        >
          <a-textarea :disable="!modalType"
          v-model="modalForm.description"
          :auto-size="{minRows:3, maxRows:3}"
          placeholder="请输入模板描述（可选项）"
          @blur="
            () => {
              $refs.description.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="connectionType"
          label="连接类型"
          prop="onnectionType"
        >
          <a-radio-group
            button-style="solid"
            :disable="!modalType"
            v-model="modalForm.connectionType"
            @blur="
              () => {
                $refs.connectionType.onFieldBlur();
              }
            "
          >
            <a-radio-button value="MQTT">
              MQTT
            </a-radio-button>
            <a-radio-button value="HTTP">
              HTTP
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-show="modalType===2" label="数据通道">
          <a-switch
          v-model="showChannelSetting"
          @change="
          delete modalForm.channelName;
          delete modalForm.channelDataString;
          delete modalForm.channelData;
          "
        ></a-switch>
        </a-form-model-item>
        <a-form-model-item
          v-show="showChannelSetting"
          ref="channelName"
          label="通道名称"
          prop="channelName"
        >
          <a-input
          :disable="!modalType"
          v-model="modalForm.channelName"
          placeholder="请输入数据通道名称"
          @blur="
            () => {
              $refs.channelName.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          v-show="showChannelSetting"
          ref="channelDataString"
          label="数据字段"
          prop="channelDataString"
        >
          <a-textarea
          :disable="!modalType"
          v-model="modalForm.channelDataString"
          :auto-size="{minRows:5, maxRows:5}"
          placeholder='请按照{字段名:字段类型}形式输入数据字段，示例：
{"height": 1, "message": 2}
其中0表示布尔类型，1表示浮点型，2表示字符串，3表示整型。'
          @blur="
            () => {
              $refs.channelDataString.onFieldBlur();
            }
          "/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<style lang="stylus" scoped>
.table-footer
  position relative
  line-height 80px
  height 80px
  margin 0 20px
  .pagination-container
    float right
</style>

<script>
const columns = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '连接类型',
    dataIndex: 'connectionType',
    key: 'connectionType',
    align: 'center',
  },
  {
    title: '最后更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    scopedSlots: { customRender: 'updateTime' },
    align: 'center',
  },
  {
    title: '数据格式',
    key: 'dataFormatType',
    dataIndex: 'dataFormatType',
    align: 'center',
  },
  {
    title: '模板操作',
    scopedSlots: { customRender: 'template_operation' },
    align: 'center',
  },
  {
    title: '数据通道操作',
    scopedSlots: { customRender: 'channel_operation' },
    align: 'center',
  },
];
export default {
  name: 'templateManagement',
  data() {
    const dataFieldsValidator = (rule, value, callback) => {
      if (value.trim() === '') {
        callback('请输入数据字段');
      }
      try {
        const dataFields = JSON.parse(value);
        this.modalForm.channelData = dataFields;
        callback();
      } catch (err) {
        callback(err);
      }
    };
    return {
      templateList: [],
      pagination: {},
      loading: false,
      columns,
      page: 0,
      pageSize: 10,
      total: 0,
      modalType: 0,
      modalVisible: false,
      modalConfirmLoading: false,
      modalForm: {},
      formRules: {
        name: [
          { required: true, message: '请输入模板名称' },
        ],
        connectionType: [
          { required: true, message: '请选择连接类型' },
        ],
        channelName: [
          { required: true, message: '请输入数据通道名称' },
        ],
        channelDataString: [
          {
            validator: dataFieldsValidator,
            trigger: 'blur',
          },
        ],
      },
      showChannelSetting: false,
    };
  },
  computed: {
    modalTitle() {
      switch (this.modalType) {
        case 0:
          return '查看模板';
        case 1:
          return '编辑模板';
        case 2:
          return '新建模板';
        default:
          return undefined;
      }
    },
  },
  mounted() {
    this.fetch(this.page, this.pageSize);
  },
  methods: {
    async fetch(page = 0, pageSize = 10) {
      this.loading = true;
      try {
        const res = await this.$axios(`/template/list?page=${page}&pageSize=${pageSize}`);
        this.templateList = res.data.content;
        this.total = res.data.totalElements;
      } catch (err) {
        // empty
      } finally {
        this.loading = false;
      }
    },
    onShowSizeChange(current, newPageSize) {
      this.pageSize = newPageSize;
      this.fetch(this.page, this.pageSize);
    },
    onPageChange(page, pageSize) {
      this.fetch(page - 1, pageSize);
    },
    showTemplateModal(content = {}) {
      this.modalForm = content;
      this.modalForm.channelDataString = JSON.stringify(this.modalForm.channelData);
      this.modalVisible = true;
    },
    onClickUpdateButton(record) {
      this.modalType = 1;
      this.showTemplateModal(record);
    },
    async onClickDeleteButton(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios.get(`/template/delete/${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.fetch();
        } else {
          this.$message.error({ content: '删除失败', key: id, duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },
    async handleModalOk() {
      let url;
      if (this.modalType === 2) {
        url = '/template/add';
      } else if (this.modalType === 1) {
        url = `/template/update/${this.modalForm.id}`;
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
          this.showChannelSetting = false;
          this.fetch();
        } else {
          this.$message.error({ content: '更新失败', duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '更新失败', duration: 3 });
      } finally {
        this.modalConfirmLoading = false;
      }
    },
    handleModalReset() {
      this.modalForm = {};
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.modalForm = {};
      this.showChannelSetting = false;
    },
  },
};
</script>
