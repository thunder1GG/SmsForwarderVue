<script setup>
import { computed } from 'vue';
import BatteryResult from './BatteryResult.vue';
import CallResult from './CallResult.vue';
import CloneResult from './CloneResult.vue';
import ConfigResult from './ConfigResult.vue';
import ContactResult from './ContactResult.vue';
import LocationResult from './LocationResult.vue';
import SmsResult from './SmsResult.vue';
import StatusResult from './StatusResult.vue';

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
});

const resultComponent = computed(() => {
  if (!props.result.ok) return StatusResult;
  return {
    battery: BatteryResult,
    call: CallResult,
    clone: CloneResult,
    config: ConfigResult,
    contact: ContactResult,
    location: LocationResult,
    sms: SmsResult,
    status: StatusResult,
  }[props.result.type] || StatusResult;
});
</script>

<template>
  <section class="result-panel" :class="{ error: !result.ok }">
    <component :is="resultComponent" :result="result" />
  </section>
</template>
