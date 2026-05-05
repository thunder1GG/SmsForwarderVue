<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});

function callType(type) {
  return {
    1: '来电',
    2: '去电',
    3: '未接',
    4: '来电提醒',
    5: '来电接通',
    6: '去电拨出',
  }[type] || `类型 ${type}`;
}

function formatTime(value) {
  return value ? new Date(value).toLocaleString() : '未知时间';
}
</script>

<template>
  <div>
    <div class="result-heading">
      <strong>通话记录</strong>
      <span>{{ result.data?.length || 0 }} 条</span>
    </div>
    <div v-if="result.data?.length" class="record-list">
      <article v-for="(item, index) in result.data" :key="`${item.dateLong}-${index}`" class="record-card">
        <div class="record-main">
          <strong>{{ item.name || item.number || '未知号码' }}</strong>
          <span>{{ callType(item.type) }}</span>
        </div>
        <div class="info-grid">
          <span>号码</span><strong>{{ item.number || '-' }}</strong>
          <span>时长</span><strong>{{ item.duration || 0 }} 秒</strong>
          <span>时间</span><strong>{{ formatTime(item.dateLong) }}</strong>
          <span>卡槽</span><strong>SIM{{ (item.sim_id ?? item.simId ?? -1) + 1 }}</strong>
        </div>
      </article>
    </div>
    <p v-else class="empty-text">没有查到通话记录</p>
  </div>
</template>
