<template>
  <a-layout-content>
    <a-collapse accordion>
      <a-collapse-panel key="model" header="模型">
        <a-table
          :columns="modelColumns"
          :data-source="modelList"
          :loading="modelLoading"
          :row-key="record => record.modelId"
          :pagination="false"
        >
          <template slot="customTitle">
            <a-button @click="onClickAddModel">添加模型</a-button>
          </template>
          <template slot="delete" slot-scope="record">
            <a-popconfirm
              placement="topLeft"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onClickDeleteModel(record.modelId)"
              style="margin-left:14px;">
              <template slot="title">
                <p>确认要删除该模型吗？</p>
              </template>
              <a-button
                type="danger"
              >删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="operator" header="算子">
        <a-table
          :columns="operatorColumns"
          :data-source="operatorList"
          :loading="operatorLoading"
          :row-key="record => record.operatorId"
          :pagination="false"
        >
          <template slot="customTitle">
            <a-button @click="onClickAddOperator">添加算子</a-button>
          </template>
          <template slot="operation" slot-scope="record">
            <a-button @click="onClickUpdateOperator(record)">编辑</a-button>
            <a-popconfirm
              placement="topLeft"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onClickDeleteOperator(record.operatorId)"
              style="margin-left:14px;">
              <template slot="title">
                <p>确认要删除该算子吗？</p>
              </template>
              <a-button
                type="danger"
              >删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="task" header="任务">
      </a-collapse-panel>
    </a-collapse>
    <a-modal
      :visible="addModelModalVisible"
      title="添加模型"
      @cancel="handleModelModalCancel"
      :footer="null"
    >
      <a-form-model
        ref="modelForm"
        :model="modelForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item
        ref="modelName"
        label="模型名称"
        prop="modelName"
      >
        <a-input
          v-model="modelForm.modelName"
          placeholder="请输入模型名称"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        ref="description"
        label="模型描述"
        prop="description"
      >
        <a-textarea
          v-model="modelForm.description"
          :auto-size="{minRows:3, maxRows:3}"
          placeholder="请输入模型描述"
        />
      </a-form-model-item>
      <a-form-model-item
        ref="modelFile"
        label="模型文件"
        prop="modelFile"
      >
        <a-upload
          :file-list="modelFile"
          accept=".xml,.pmml"
          :before-upload="beforeModelUpload"
          >
          <a-button > <a-icon type="upload" /> Select File </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          :disabled="modelFile.length !== 1"
          :loading="uploading"
          style="margin-top: 16px"
          @click="uploadModel"
        >
          {{ uploading ? '上传中' : '提交' }}
        </a-button>
      </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :visible="operatorModalVisible"
      :title="operatorModalType === 0? '新建算子':'编辑算子'"
      @cancel="handleOperatorModalCancel"
      @ok="submitOperator"
    >
      <a-form-model
        ref="operatorForm"
        :model="operatorForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item
        ref="name"
        label="算子名称"
        prop="name"
        >
        <a-input
          v-model="operatorForm.name"
          placeholder="请输入模型名称"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        ref="description"
        label="模型描述"
        prop="description"
      >
        <a-textarea
          v-model="operatorForm.description"
          :auto-size="{minRows:3, maxRows:3}"
          placeholder="请输入算子描述"
        />
      </a-form-model-item>
        <a-form-model-item
        ref="funcName"
        label="函数名称"
        prop="funcName"
      >
        <a-input
          v-model="operatorForm.funcName"
          placeholder="请输入函数名称"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        ref="jsCode"
        label="算子函数"
        prop="jsCode"
      >
        <a-textarea
          v-model="operatorForm.jsCode"
          :auto-size="{minRows:5, maxRows:5}"
          placeholder="请输入算子函数(javascript)"
        />
      </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-layout-content>
</template>

<script>
const modelColumns = [
  {
    title: '模型ID',
    dataIndex: 'modelId',
    key: 'modelId',
  },
  {
    title: '模型名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '模型描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    slots: { title: 'customTitle' },
    key: 'delete',
    scopedSlots: { customRender: 'delete' },
  },
];

const operatorColumns = [
  {
    title: '算子ID',
    dataIndex: 'operatorId',
    key: 'operatorId',
  },
  {
    title: '算子名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '算子描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    slots: { title: 'customTitle' },
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  name: 'RealtimeAnalysis',
  data() {
    return {
      modelColumns,
      modelList: [],
      modelLoading: false,
      addModelModalVisible: false,
      modelForm: {
      },
      modelFile: [],
      operatorColumns,
      operatorList: [],
      operatorLoading: false,
      operatorModalVisible: false,
      operatorModalType: 0,
      operatorForm: {
      },
      uploading: false,
    };
  },
  mounted() {
    this.fetchModel();
    this.fetchOperator();
  },
  methods: {
    async fetchModel() {
      this.modelLoading = true;
      const res = await this.$axios('/analysis/online/model/all');
      this.modelList = res.data;
      this.modelLoading = false;
    },
    async fetchOperator() {
      this.operatorLoading = true;
      const res = await this.$axios('/analysis/online/operator/all');
      this.operatorList = res.data;
      this.operatorLoading = false;
    },
    onClickAddModel() {
      this.addModelModalVisible = true;
    },
    onClickAddOperator() {
      this.operatorModalVisible = true;
      this.operatorModalType = 0;
    },
    onClickUpdateOperator(record) {
      this.operatorModalVisible = true;
      this.operatorModalType = 1;
      this.operatorForm = { ...record };
    },
    async onClickDeleteModel(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios(`/analysis/online/model/delete?modelId=${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.fetchModel();
        } else {
          this.$message.error({ content: '删除失败', key: id, duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },
    async onClickDeleteOperator(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios(`/analysis/online/operator/delete?operatorId=${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.fetchOperator();
        } else {
          this.$message.error({ content: '删除失败', key: id, duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },
    beforeModelUpload(file) {
      this.modelFile = [file];
      return false;
    },
    async uploadModel() {
      const formData = new FormData();
      formData.append('file', this.modelFile[0]);
      const res = await this.$axios.post(
        `/analysis/online/model/save?name=${this.modelForm.modelName}&description=${this.modelForm.description}`,
        formData,
        {
          'Content-Type': 'multipart/form-data',
        },
      );
      if (res.code === 1) {
        this.fetchModel();
      } else {
        this.$message.warning(res.msg, 3);
      }
    },
    async submitOperator() {
      const url = this.operatorModalType === 0 ? '/analysis/online/operator/create' : `/analysis/online/operator/modify?operatorId=${this.operatorForm.operatorId}`;
      const res = await this.$axios.post(
        url,
        this.operatorForm,
      );
      if (res.code === 1) {
        this.fetchOperator();
        this.$message.success(res.msg, 3);
        this.operatorModalVisible = false;
      } else {
        this.$message.warning(res.msg, 3);
      }
    },
    handleModelModalCancel() {
      this.addModelModalVisible = false;
    },
    handleOperatorModalCancel() {
      this.operatorModalVisible = false;
      this.operatorForm = {};
    },
  },
};
</script>
