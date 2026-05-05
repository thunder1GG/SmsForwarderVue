<script setup>
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next';

defineProps({
  result: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="status-result" :class="{ error: !result.ok }">
    <CheckCircle2 v-if="result.ok" :size="34" />
    <AlertCircle v-else :size="34" />
    <div>
      <strong>{{ result.ok ? '操作成功' : '请求失败' }}</strong>
      <p>{{ result.message }}</p>
    </div>
  </div>
</template>
