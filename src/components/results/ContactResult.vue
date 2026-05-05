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
      <strong>联系人</strong>
      <span>{{ result.data?.length || 0 }} 个</span>
    </div>
    <div v-if="result.data?.length" class="contact-list">
      <article v-for="(item, index) in result.data" :key="`${item.phone_number}-${index}`" class="contact-card">
        <span>{{ (item.name || '#').slice(0, 1).toUpperCase() }}</span>
        <div>
          <strong>{{ item.name || '未命名' }}</strong>
          <p>{{ item.phone_number || item.phoneNumber || '-' }}</p>
        </div>
      </article>
    </div>
    <p v-else class="empty-text">没有查到联系人</p>
  </div>
</template>
