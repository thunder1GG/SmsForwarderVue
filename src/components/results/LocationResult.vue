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
      <strong>定位结果</strong>
      <span>{{ result.data?.provider || '缓存' }}</span>
    </div>
    <div class="location-card">
      <strong>{{ result.data?.address || '暂无地址' }}</strong>
      <div class="info-grid">
        <span>经度</span><strong>{{ result.data?.longitude ?? '-' }}</strong>
        <span>纬度</span><strong>{{ result.data?.latitude ?? '-' }}</strong>
        <span>时间</span><strong>{{ result.data?.time || '-' }}</strong>
      </div>
      <a
        v-if="result.data?.latitude && result.data?.longitude"
        :href="`https://maps.google.com/?q=${result.data.latitude},${result.data.longitude}`"
        target="_blank"
        rel="noreferrer"
      >
        打开地图
      </a>
    </div>
  </div>
</template>
