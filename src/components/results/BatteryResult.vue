<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="result-heading">
      <strong>电量状态</strong>
      <span>{{ result.data?.level || '-' }}</span>
    </div>
    <div class="metric-grid">
      <div><span>电量</span><strong>{{ result.data?.level || '-' }}</strong></div>
      <div><span>电压</span><strong>{{ result.data?.voltage || '-' }}</strong></div>
      <div><span>温度</span><strong>{{ result.data?.temperature || '-' }}</strong></div>
      <div><span>状态</span><strong>{{ result.data?.status || '-' }}</strong></div>
      <div><span>健康</span><strong>{{ result.data?.health || '-' }}</strong></div>
      <div><span>供电</span><strong>{{ result.data?.plugged || '-' }}</strong></div>
    </div>
  </div>
</template>
