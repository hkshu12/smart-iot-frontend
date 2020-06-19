<template>
  <a-layout-content>
    <div id="formContainer">
     <a-form-model
        ref="form"
        :model="form"
        :rules="formRules"
        hideRequiredMark
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 14 }"
      >
      <a-form-model-item
          ref="device"
          label="设备名称"
          prop="device"
        >
          <a-select
            v-model="form.device"
            placeholder="请选择设备"
            @change="handleDeviceChange"
            @blur="
              () => {
                $refs.device.onFieldBlur();
              }
            "
            style="width:160px;"
            >
            <a-select-option v-for="device in data" :key="device.deviceId" :value="device.deviceId">
              {{device.deviceName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="channel"
          label="通道名称"
          prop="channel"
        >
          <a-select
            v-model="form.channel"
            placeholder="请选择数据通道"
            @change="handleChannelChange"
            @blur="
              () => {
                $refs.channel.onFieldBlur();
              }
            "
            style="width:160px;"
            >
            <a-select-option
             v-for="channel in channels"
             :key="channel.channelId"
             :value="channel.channelId"
            >
              {{channel.channelName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="field"
          label="字段名称"
          prop="field"
        >
          <a-select
            v-model="form.field"
            placeholder="请选择设备"
            @blur="
              () => {
                $refs.field.onFieldBlur();
              }
            "
            style="width:160px;"
            >
            <a-select-option v-for="field in fields" :key="field.fieldId" :value="field.fieldId">
              {{field.fieldName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="aggregationType"
          label="聚合类型"
          prop="aggregationType"
        >
          <a-select
            v-model="form.aggregationType"
            placeholder="请选择设备"
            @blur="
              () => {
                $refs.aggregationType.onFieldBlur();
              }
            "
            style="width:160px;"
            >
            <a-select-option
              v-for="(type, index) in ['MAX','MIN','AVG','SUM','COUNT']"
              :key="index"
              :value="aggregationType[type]"
            >
              {{type}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="dateRange"
          label="选择时间范围"
          prop="dateRange"
        >
          <a-range-picker
          v-model="form.dateRange"
          :disabled-date="
            (current) => current > new Date()
          "
          />
        </a-form-model-item>
        <a-form-model-item
          ref="interval"
          label="时间间隔"
          prop="interval"
        >
          <a-input
            v-model="form.interval"
            placeholder="分钟"
            @blur="
            () => {
              $refs.interval.onFieldBlur();
            }
            "
            type="number"
            style="width:160px;"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
     </a-form-model>
    </div>
    <div>
      <div id="lineChartContainer"></div>
    </div>
  </a-layout-content>
</template>

<style lang="stylus" scoped>
#lineChartContainer
  margin-top 24px
  width 100%
  height 400px
#formContainer
  margin-top 50px
</style>

<script>
import echarts from '@/plugins/echarts';

let aggregationType;
/* eslint-disable no-param-reassign */
// eslint-disable-next-line func-names
(function (AggregationType) {
  AggregationType[AggregationType.MAX = 0] = 'MAX';
  AggregationType[AggregationType.MIN = 1] = 'MIN';
  AggregationType[AggregationType.AVG = 2] = 'AVG';
  AggregationType[AggregationType.SUM = 3] = 'SUM';
  AggregationType[AggregationType.COUNT = 4] = 'COUNT';
}(aggregationType || (aggregationType = {})));

export default {
  name: 'DataPresentation',
  data() {
    return {
      timerId: 0,
      timePoints: [],
      value: [],
      data: [],
      channels: [],
      fields: [],
      formRules: {
        device: { required: true, message: '请选择设备' },
        channel: { required: true, message: '请选择通道' },
        field: { required: true, message: '请选择字段' },
        dateRange: { required: true, message: '请选择时间段' },
        interval: { required: true, message: '请选择时间间隔' },
      },
      form: {},
      aggregationType,
    };
  },
  mounted() {
    this.getData();
    this.timerId = setInterval(() => this.getData(), 10000);
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  methods: {
    async getData() {
      const res = await this.$axios('/analysis/util/device/all');
      this.data = res.data;
    },
    handleDeviceChange(val) {
      let selectedDevice;
      this.data.forEach((device) => {
        if (device.deviceId === val) {
          selectedDevice = device;
        }
      });
      this.channels = selectedDevice.channels;
    },
    handleChannelChange(val) {
      let selectedChannel;
      this.channels.forEach((channel) => {
        if (channel.channelId === val) {
          selectedChannel = channel;
        }
      });
      this.fields = selectedChannel.dataFields;
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请检查表单！', 3);
        } else {
          const payload = {};
          [payload.startTime, payload.endTime] = this.form.dateRange;
          if (payload.startTime > payload.endTime) {
            [payload.startTime, payload.endTime] = [payload.endTime, payload.startTime];
          }
          payload.startTime = payload.startTime.startOf('day').add(8, 'h');
          payload.startTime = payload.startTime.toDate();
          const current = new Date();
          payload.endTime = payload.endTime.endOf('day').toDate() > current ? new Date(current.setHours(current.getHours() + 8)) : payload.endTime.endOf('day').add(8, 'h').toDate();
          payload.intervalMinutes = parseInt(this.form.interval, 10);
          payload.measurePoints = [
            {
              aggregationType: this.form.aggregationType,
              channelId: this.form.channel,
              deviceId: this.form.device,
              fieldId: this.form.field,
            },
          ];
          try {
            const res = await this.$axios.post('/analysis/timing/line-chart', payload);
            if (res.code === 1) {
              this.timePoints = res.data.timePoints;
              this.value = res.data.metrics[0].values;
              this.initCharts();
            } else {
              this.$message.warning({ content: res.msg, key: 'warning', duration: 3 });
            }
          } catch (err) {
            this.$message.error(err, 3);
            console.error(err);
          }
        }
      });
    },
    initCharts() {
      const lineChartContainer = document.getElementById('lineChartContainer');
      const zip = (...rows) => [...rows[0]].map((_, c) => rows.map((row) => row[c]));
      const data = zip(this.timePoints, this.value);
      const that = this;
      const options = {
        title: {
          text: '数据监控',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          /* eslint-disable guard-for-in */
          /* eslint-disable no-restricted-syntax */
          formatter(params) {
            return `${that.$timeFormat(new Date(params[0].data[0]))}<br/>${params[0].data[1]}`;
          },
        },
        xAxis: {
          type: 'time',
        },
        yAxis: {
          type: 'value',
          name: '值',
        },
        series: [
          {
            data,
            type: 'line',
          },
        ],
      };
      const lineChart = echarts.init(lineChartContainer);
      lineChart.setOption(options);
    },
  },
};
</script>
