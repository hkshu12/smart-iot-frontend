<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="ruleList"
      :loading="loading"
      :row-key="record => record.id"
      :pagination="false"
    >
      <template slot="ruleActionType" slot-scope="actionType">
        {{ruleActionType[actionType]}}
      </template>
      <template slot="updateTime" slot-scope="timeString">{{$timeFormat(timeString)}}</template>
      <template slot="condition" slot-scope="record">
        {{record.fieldName + ruleType[record.ruleType] + record.thresholdVal}}
      </template>
      <template slot="rule_operation" slot-scope="record">
        <a-button @click="onClickUpdateButton(record)">编辑</a-button>
        <a-popconfirm
          placement="topLeft"
          ok-text="确认"
          cancel-text="取消"
          @confirm="onClickDeleteButton(record.id)"
          style="margin-left:14px;">
          <template slot="title">
            <p>确认要删除该规则吗？</p>
          </template>
          <a-button
            type="danger"
          >删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <div class="table-footer">
        <a-button @click="showRuleModal()">添加规则</a-button>
    </div>
    <a-modal
      :visible="modalVisible"
      :confirm-loading="modalConfirmLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
     <template slot="footer">
        <a-button key="back" v-show="!isUpdate" @click="handleModalReset">
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
          label="规则名称"
          prop="name"
        >
          <a-input
          v-model="modalForm.name"
          placeholder="请输入规则名称"
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="description"
          label="规则描述"
          prop="description"
        >
          <a-textarea
          v-model="modalForm.description"
          :auto-size="{minRows:3, maxRows:3}"
          placeholder="请输入规则描述（可选项）"
          @blur="
            () => {
              $refs.description.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="ruleActionType"
          label="规则类型"
          prop="ruleActionType"
        >
        <a-radio-group
            button-style="solid"
            v-model="modalForm.ruleActionType"
            @blur="
              () => {
                $refs.ruleActionType.onFieldBlur();
              }
            "
          >
            <a-radio-button
              v-for="(type,index) in ['FORWARD','LINKAGE']"
              :value="type"
              :key="index"
            >
              {{ruleActionType[type]}}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          ref="deviceId"
          label="设备ID"
          prop="deviceId"
        >
          <a-input
            v-model="modalForm.deviceId"
            placeholder="请输入设备ID"
            type="number"
            @blur="
              () => {
                $refs.deviceId.onFieldBlur();
              }
            "/>
        </a-form-model-item>
        <a-form-model-item
          ref="fieldName"
          label="字段名称"
          prop="fieldName"
        >
          <a-input
          v-model="modalForm.fieldName"
          placeholder="请输入字段名称"
          @blur="
            () => {
              $refs.fieldName.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="cruleType"
          label="条件类型"
          prop="ruleType"
        >
        <a-radio-group
            button-style="solid"
            v-model="modalForm.ruleType"
            @blur="
              () => {
                $refs.ruleType.onFieldBlur();
              }
            "
          >
            <a-radio-button
              v-for="(type,index) in ['GT','LT','GE','LE','EQ','NE']"
              :value="type"
              :key="index"
            >
              {{ruleType[type]}}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          ref="thresholdVal"
          label="阈值"
          prop="thresholdVal"
        >
          <a-input
          v-model="modalForm.thresholdVal"
          placeholder="请输入阈值(数字)"
          type="number"
          @blur="
            () => {
              $refs.thresholdVal.onFieldBlur();
            }
          "/>
        </a-form-model-item>
        <a-form-model-item
          ref="target"
          label="目标"
          prop="target"
        >
          <a-input
          v-model="modalForm.target"
          placeholder="ip:port或deviceId:message"
          @blur="
            () => {
              $refs.target.onFieldBlur();
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
</style>

<script>
const columns = [
  {
    title: '规则名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '规则类型',
    dataIndex: 'ruleActionType',
    key: 'ruleActionType',
    scopedSlots: { customRender: 'ruleActionType' },
    align: 'center',
  },
  {
    title: '设备ID',
    dataIndex: 'deviceId',
    key: 'deviceId',
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
    title: '触发条件',
    key: 'condition',
    scopedSlots: { customRender: 'condition' },
    align: 'center',
  },
  {
    title: '目标',
    key: 'target',
    dataIndex: 'target',
    align: 'center',
  },
  {
    title: '规则操作',
    key: 'rule_operation',
    scopedSlots: { customRender: 'rule_operation' },
    align: 'center',
  },
];
let ruleType;
// eslint-disable-next-line func-names
(function (RuleType) {
  /* eslint-disable no-param-reassign */
  RuleType[RuleType['>'] = 'GT'] = '>';
  RuleType[RuleType['<'] = 'LT'] = '<';
  RuleType[RuleType['>='] = 'GE'] = '>=';
  RuleType[RuleType['<='] = 'LE'] = '<=';
  RuleType[RuleType['=='] = 'EQ'] = '==';
  RuleType[RuleType['!='] = 'NE'] = '!=';
}(ruleType || (ruleType = {})));

let ruleActionType;
// eslint-disable-next-line func-names
(function (RuleActionType) {
  /* eslint-disable no-param-reassign */
  RuleActionType[RuleActionType.FORWARD = '转发'] = 'FORWARD';
  RuleActionType[RuleActionType.LINKAGE = '联动'] = 'LINKAGE';
}(ruleActionType || (ruleActionType = {})));

export default {
  name: 'templateManagement',
  data() {
    return {
      ruleList: [],
      loading: false,
      columns,
      ruleType,
      ruleActionType,
      modalVisible: false,
      isUpdate: false,
      modalConfirmLoading: false,
      modalForm: {},
      formRules: {
        name: [
          { required: true, message: '请输入规则名称' },
        ],
        ruleType: [
          { required: true, message: '请选择条件类型' },
        ],
        ruleActionType: [
          { required: true, message: '请选择规则类型' },
        ],
        deviceId: [
          { required: true, message: '请输入设备ID' },
        ],
        fieldName: [
          { required: true, message: '请输入字段名' },
        ],
        thresholdVal: [
          { required: true, message: '请输入阈值' },
        ],
        target: [
          { required: true, message: '请输入目标' },
        ],
      },
    };
  },
  computed: {
    modalTitle() {
      if (this.isUpdate) {
        return '编辑规则';
      }
      return '新建规则';
    },
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const res = await this.$axios('/rule/get/all');
        this.ruleList = res.data;
      } catch (err) {
        // empty
      } finally {
        this.loading = false;
      }
    },
    showRuleModal(content = {}) {
      this.modalForm = { ...content };
      this.modalVisible = true;
    },
    onClickUpdateButton(record) {
      this.isUpdate = true;
      this.showRuleModal(record);
    },
    async onClickDeleteButton(id) {
      this.$message.loading({ content: '删除中...', key: id });
      try {
        const res = await this.$axios.delete(`/rule/delete/${id}`);
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
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          this.$message.warning({ content: '请检查表单！', key: 'validationCheck', duration: 3 });
        } else {
          let url;
          if (!this.isUpdate) {
            url = '/rule/add';
          } else {
            url = `/rule/modify/${this.modalForm.id}`;
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
        }
      });
    },
    handleModalReset() {
      this.modalForm = {};
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.modalForm = {};
      this.isUpdate = false;
    },
  },
};
</script>
