<script setup>
defineProps({
  actions: {
    type: Array,
    required: true,
  },
  serverConfig: {
    type: Object,
    default: null,
  },
});

defineEmits(['open']);

function apiEnabled(action, config) {
  if (!config) return true;
  const map = {
    smsSend: 'enable_api_sms_send',
    smsQuery: 'enable_api_sms_query',
    callQuery: 'enable_api_call_query',
    contactQuery: 'enable_api_contact_query',
    contactAdd: 'enable_api_contact_add',
    battery: 'enable_api_battery_query',
    location: 'enable_api_location',
    wol: 'enable_api_wol',
    clonePull: 'enable_api_clone',
    clonePush: 'enable_api_clone',
  };
  return config[map[action.key]] !== false;
}
</script>

<template>
  <section class="home-section">
    <div class="home-title">
      <h2>接口操作</h2>
      <p>选择一个功能进入对应页面</p>
    </div>

    <div class="action-grid">
      <button
        v-for="action in actions"
        :key="action.key"
        type="button"
        class="action-tile"
        :class="[`tone-${action.tone}`, { disabled: !apiEnabled(action, serverConfig) }]"
        @click="$emit('open', action)"
      >
        <span class="tile-icon">
          <component :is="action.icon" :size="24" />
        </span>
        <span class="tile-label">{{ action.label }}</span>
        <span class="tile-path">{{ action.path }}</span>
      </button>
    </div>
  </section>
</template>
