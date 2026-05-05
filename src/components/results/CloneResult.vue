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
      <strong>克隆数据</strong>
      <span>{{ result.data?.version_name || result.data?.version_code || '-' }}</span>
    </div>
    <div class="metric-grid">
      <div><span>发送通道</span><strong>{{ result.data?.sender_list?.length || 0 }}</strong></div>
      <div><span>转发规则</span><strong>{{ result.data?.rule_list?.length || 0 }}</strong></div>
      <div><span>FRPC</span><strong>{{ result.data?.frpc_list?.length || 0 }}</strong></div>
      <div><span>任务</span><strong>{{ result.data?.task_list?.length || 0 }}</strong></div>
    </div>
    <p class="hint-text">完整克隆内容已保留在响应对象中，可继续用于推送恢复。</p>
  </div>
</template>
