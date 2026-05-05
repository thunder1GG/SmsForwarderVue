<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});

function formatTime(value) {
  return value ? new Date(value).toLocaleString() : '未知时间';
}
</script>

<template>
  <div>
    <div class="result-heading">
      <strong>短信记录</strong>
      <span>{{ result.data?.length || 0 }} 条</span>
    </div>
    <div v-if="result.data?.length" class="record-list">
      <article v-for="(item, index) in result.data" :key="`${item.date}-${index}`" class="record-card">
        <div class="record-main">
          <strong>{{ item.name || item.number || '未知号码' }}</strong>
          <span>{{ item.type === 2 ? '发送' : '接收' }}</span>
        </div>
        <p>{{ item.content || '无内容' }}</p>
        <div class="record-meta">
          <span>{{ item.number }}</span>
          <span>{{ formatTime(item.date) }}</span>
        </div>
      </article>
    </div>
    <p v-else class="empty-text">没有查到短信记录</p>
  </div>
</template>
