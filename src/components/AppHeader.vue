<script setup>
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-vue-next';

defineProps({
  serverName: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['back', 'test']);
</script>

<template>
  <section class="topbar">
    <button v-if="showBack" class="icon-button muted" type="button" title="返回首页" @click="$emit('back')">
      <ArrowLeft :size="20" />
    </button>
    <div class="brand">
      <div class="brand-mark">
        <Smartphone :size="22" />
      </div>
      <div>
        <h1>SmsForwarder</h1>
        <p>{{ serverName }}</p>
      </div>
    </div>
    <button class="icon-button" type="button" title="测试连接" :disabled="loading" @click="$emit('test')">
      <RefreshCw :size="18" :class="{ spinning: loading }" />
    </button>
  </section>
</template>
