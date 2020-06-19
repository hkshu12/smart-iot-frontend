<template>
  <a-layout-content>
    <a-collapse accordion defaultActiveKey="model">
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
        <a-table
          :columns="taskColumns"
          :data-source="taskList"
          :loading="taskLoading"
          :row-key="record => record.taskId"
          :pagination="false"
        >
          <template slot="customTitle">
            <a-button @click="onClickAddTask">添加任务</a-button>
          </template>
          <template slot="operation" slot-scope="record">
            <a-button @click="onClickTaskDetail(record.taskId)">详情</a-button>
            <a-popconfirm
              placement="topLeft"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onClickDeleteTask(record.taskId)"
              style="margin-left:14px;">
              <template slot="title">
                <p>确认要删除该任务吗？</p>
              </template>
              <a-button
                type="danger"
              >删除</a-button>
            </a-popconfirm>
            <a-button
              @click="onClickExecuteTask(record.taskId)"
              style="margin-left:14px;"
            >执行</a-button>
          </template>
        </a-table>
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
    <a-modal
      :visible="taskModalVisible"
      title="添加模型"
      @cancel="handleTaskModalCancel"
      @ok="submitTask"
    >
      <a-form-model
        ref="taskForm"
        :model="taskForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item
        ref="taskName"
        label="任务名称"
        prop="taskName"
      >
        <a-input
          v-model="taskForm.name"
          placeholder="请输入任务名称"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        ref="description"
        label="任务描述"
        prop="description"
      >
        <a-textarea
          v-model="taskForm.description"
          :auto-size="{minRows:3, maxRows:3}"
          placeholder="请输入任务描述"
        />
      </a-form-model-item>
      <a-form-model-item
        ref="description"
        label="数据通道"
        prop="description"
      >
        <a-select
          v-model="taskForm.channelIds"
          mode="multiple"
          placeholder="请选择数据通道"
          @change="onSelectChannels"
          >
          <a-select-option
            v-for="channel in channelList"
            :key="channel.id"
            :value="channel.id">
            {{channel.channelName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
          ref="taskModel"
          label="选择模型"
          prop="taskModel"
        >
          <a-select
            v-model="taskForm.modelId"
            placeholder="请选择模型"
            @change="onSelectTaskModel"
            >
            <a-select-option v-for="model in modelList" :key="model.modelId" :value="model.modelId">
              {{model.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-for="input in taskModelInputs"
          :key="input.fieldId"
          :ref="`taskInput${input.fieldId}`"
          :label="input.fieldName"
          :prop="`taskInput${input.fieldId}`"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
           <a-select
            mode="multiple"
            placeholder="请选择数据通道中的字段"
            @change="(value) => onInputFieldChannelFieldChange(value, input.fieldId)"
            >
            <a-select-option
              v-for="field in fieldList"
              :key="field.id"
              :value="field.id">
              {{field.fieldName}}
            </a-select-option>
          </a-select>
          <a-select
            placeholder="请选择算子"
            @change="(value) => onInputFieldOperatorChange(value, input.fieldId)"
            >
            <a-select-option
              v-for="operator in operatorList"
              :key="operator.operatorId"
              :value="operator.operatorId">
              {{operator.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-if="taskDetailModalVisible"
      :visible="taskDetailModalVisible"
      @cancel="taskDetailModalVisible = false"
      :footer="null"
    >
      <div>任务名: {{taskDetail.name}}</div>
      <div>任务描述: {{taskDetail.description}}</div>
      <div>模型名: {{taskDetail.model.name}}</div>
      <div>模型描述: {{taskDetail.model.description}}</div>
      <div>数据通道:
        <ul>
        <li
          v-for="channel in taskDetail.channels"
          :key="channel.channelId"
        >{{channel.channelName}}</li>
        </ul>
      </div>
      <a-collapse>
      <a-collapse-panel
        v-for="field in taskDetail.inputFields"
        :key="field.inputFieldId"
        :header="field.inputFieldName"
      >
        <div>算子：{{field.operator.name}}</div>
        <div>字段：
          <span
            v-for="channelField in field.channelFields"
            :key="channelField.fieldId"
          >{{channelField.fieldName}}</span>
        </div>
      </a-collapse-panel>
      </a-collapse>
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

const taskColumns = [
  {
    title: '任务ID',
    dataIndex: 'taskId',
    key: 'taskId',
  },
  {
    title: '任务名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '任务描述',
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
      taskColumns,
      taskList: [],
      taskLoading: false,
      taskModalVisible: false,
      taskModalType: 0,
      taskForm: {
      },
      taskModelInputs: [],
      channelList: [],
      fieldList: [],
      inputForm: {},
      uploading: false,
      taskDetail: {
        name: '',
      },
      taskDetailModalVisible: false,
    };
  },
  mounted() {
    this.fetchModel();
    this.fetchOperator();
    this.fetchTask();
    this.fetchChannel();
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
    async fetchTask() {
      this.taskLoading = true;
      const res = await this.$axios('/analysis/online/task/all');
      this.taskList = res.data;
      this.taskLoading = false;
    },
    async fetchChannel() {
      const res = await this.$axios('/channel/list/device-channel');
      this.channelList = res;
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
    onClickAddTask() {
      this.taskModalVisible = true;
      this.taskModalType = 0;
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
    async onClickDeleteTask(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios(`/analysis/online/task/delete?taskId=${id}`);
        if (res.code === 1) {
          this.$message.success({ content: '删除成功', key: id, duration: 3 });
          this.fetchTask();
        } else {
          this.$message.error({ content: '删除失败', key: id, duration: 3 });
        }
      } catch (err) {
        this.$message.error({ content: '删除失败', key: id, duration: 3 });
      }
    },
    async onClickExecuteTask(id) {
      const res = await this.$axios(`/analysis/online/task/execute?taskId=${id}`);
      if (res.code === 1) {
        this.$notification.success({
          message: '执行成功',
          description: `${JSON.stringify(res.data.result, null, 2)}`,
        });
      } else {
        this.$notification.error({
          message: '执行失败',
          description: res.msg,
        });
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
        this.addModelModalVisible = false;
        this.modelForm = {};
        this.modelFile = [];
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
    async onSelectTaskModel(modelId) {
      const res = await this.$axios(`/analysis/online/model/inputs?modelId=${modelId}`);
      if (res.code === 1) {
        this.taskModelInputs = res.data;
        res.data.forEach((input) => {
          this.inputForm[input.fieldId] = {
            channelFieldIds: [],
          };
        });
      } else {
        this.$message.warning('请求模型输入字段出错!', 3);
      }
    },
    async onSelectChannels(channels) {
      let fieldList = [];
      const requestList = [];
      channels.forEach((channelId) => requestList.push(this.$axios(`/channel/get/data?channelType=1&channelId=${channelId}`)
        .then((res) => {
          fieldList = fieldList.concat(
            Array.from(res).map((field) => ({
              id: field.id,
              fieldName: `ChannelId:${channelId}:${field.fieldName}`,
            })),
          );
        })));
      Promise.all(requestList).then(() => { this.fieldList = fieldList; });
    },
    handleModelModalCancel() {
      this.addModelModalVisible = false;
      this.modelForm = {};
      this.modelFile = [];
    },
    handleOperatorModalCancel() {
      this.operatorModalVisible = false;
      this.operatorForm = {};
    },
    handleTaskModalCancel() {
      this.taskModalVisible = false;
      this.taskForm = {};
      this.inputForm = {};
    },
    onInputFieldChannelFieldChange(value, inputFieldId) {
      this.inputForm[inputFieldId].channelFieldIds = value;
    },
    onInputFieldOperatorChange(value, inputFieldId) {
      this.inputForm[inputFieldId].operatorId = value;
    },
    async submitTask() {
      const functions = Object.entries(this.inputForm).map(([inputFieldId, val]) => ({
        channelFieldIds: val.channelFieldIds,
        inputFieldId,
        operatorId: val.operatorId,
      }));
      const res = await this.$axios.post(
        '/analysis/online/task/create',
        { ...this.taskForm, functions },
      );
      if (res.code === 1) {
        this.fetchTask();
        this.taskModalVisible = false;
        this.taskForm = {};
        this.inputForm = {};
      } else {
        this.$message.warning(res.msg, 3);
      }
    },
    async onClickTaskDetail(taskId) {
      const res = await this.$axios(`/analysis/online/task/detail?taskId=${taskId}`);
      if (res.code === 1) {
        this.taskDetail = res.data;
        this.taskDetailModalVisible = true;
      } else {
        this.$message.warning(res.msg, 3);
      }
    },
  },
};
</script>
