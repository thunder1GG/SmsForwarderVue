<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});

const labels = {
  enable_api_sms_send: '发短信',
  enable_api_sms_query: '查短信',
  enable_api_call_query: '查通话',
  enable_api_contact_query: '查联系人',
  enable_api_contact_add: '加联系人',
  enable_api_battery_query: '查电量',
  enable_api_location: '定位',
  enable_api_wol: 'WOL',
  enable_api_clone: '克隆',
};
</script>

<template>
  <div>
    <div class="result-heading">
      <strong>{{ result.data?.extra_device_mark || '服务端配置' }}</strong>
      <span>{{ result.data?.version_name || '-' }}</span>
    </div>
    <div class="capability-list">
      <span
        v-for="(label, key) in labels"
        :key="key"
        :class="{ off: result.data?.[key] === false }"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>
