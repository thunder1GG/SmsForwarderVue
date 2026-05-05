<script setup>
import { RadioTower, Send } from 'lucide-vue-next';

defineProps({
  action: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  simOptions: {
    type: Array,
    default: () => [],
  },
});

const forms = defineModel('forms', {
  type: Object,
  required: true,
});

defineEmits(['submit']);
</script>

<template>
  <section v-if="action" class="page-panel">
    <header>
      <div>
        <h2>{{ action.label }}</h2>
        <p>{{ action.path }}</p>
      </div>
      <button class="primary-button" type="button" :disabled="loading" @click="$emit('submit')">
        <RadioTower v-if="loading" :size="17" class="spinning" />
        <Send v-else :size="17" />
        <span>发送</span>
      </button>
    </header>

    <div v-if="action.key === 'smsSend'" class="form-stack">
      <label>
        <span>发送卡槽</span>
        <select v-model.number="forms.smsSend.sim_slot">
          <option v-for="sim in simOptions" :key="sim.value" :value="sim.value">
            {{ sim.label }}{{ sim.extra ? ` · ${sim.extra}` : '' }}
          </option>
        </select>
      </label>
      <label>
        <span>收件号码</span>
        <input v-model.trim="forms.smsSend.phone_numbers" inputmode="tel" placeholder="多个号码用英文逗号分隔" />
      </label>
      <label>
        <span>短信内容</span>
        <textarea v-model="forms.smsSend.msg_content" rows="5" placeholder="请输入短信内容" />
      </label>
    </div>

    <div v-else-if="action.key === 'smsQuery'" class="form-stack">
      <div class="field-grid">
        <label>
          <span>类型</span>
          <select v-model.number="forms.smsQuery.type">
            <option :value="1">接收</option>
            <option :value="2">发送</option>
          </select>
        </label>
        <label>
          <span>关键词</span>
          <input v-model.trim="forms.smsQuery.keyword" placeholder="内容或号码" />
        </label>
      </div>
      <div class="field-grid">
        <label>
          <span>页码</span>
          <input v-model.number="forms.smsQuery.page_num" type="number" min="1" />
        </label>
        <label>
          <span>每页</span>
          <input v-model.number="forms.smsQuery.page_size" type="number" min="1" />
        </label>
      </div>
    </div>

    <div v-else-if="action.key === 'callQuery'" class="form-stack">
      <div class="field-grid">
        <label>
          <span>类型</span>
          <select v-model.number="forms.callQuery.type">
            <option :value="1">来电</option>
            <option :value="2">去电</option>
            <option :value="3">未接</option>
          </select>
        </label>
        <label>
          <span>号码</span>
          <input v-model.trim="forms.callQuery.phone_number" inputmode="tel" placeholder="可留空" />
        </label>
      </div>
      <div class="field-grid">
        <label>
          <span>页码</span>
          <input v-model.number="forms.callQuery.page_num" type="number" min="1" />
        </label>
        <label>
          <span>每页</span>
          <input v-model.number="forms.callQuery.page_size" type="number" min="1" />
        </label>
      </div>
    </div>

    <div v-else-if="action.key === 'contactQuery'" class="form-stack">
      <div class="field-grid">
        <label>
          <span>姓名</span>
          <input v-model.trim="forms.contactQuery.name" placeholder="可留空" />
        </label>
        <label>
          <span>号码</span>
          <input v-model.trim="forms.contactQuery.phone_number" inputmode="tel" placeholder="可留空" />
        </label>
      </div>
      <div class="field-grid">
        <label>
          <span>页码</span>
          <input v-model.number="forms.contactQuery.page_num" type="number" min="1" />
        </label>
        <label>
          <span>每页</span>
          <input v-model.number="forms.contactQuery.page_size" type="number" min="1" />
        </label>
      </div>
    </div>

    <div v-else-if="action.key === 'contactAdd'" class="form-stack">
      <label>
        <span>姓名</span>
        <input v-model.trim="forms.contactAdd.name" placeholder="联系人姓名" />
      </label>
      <label>
        <span>号码</span>
        <input v-model.trim="forms.contactAdd.phone_number" inputmode="tel" placeholder="多个号码用 ; 分隔" />
      </label>
    </div>

    <div v-else-if="action.key === 'wol'" class="form-stack">
      <label>
        <span>MAC</span>
        <input v-model.trim="forms.wol.mac" placeholder="AA:BB:CC:DD:EE:FF" />
      </label>
      <div class="field-grid">
        <label>
          <span>广播 IP</span>
          <input v-model.trim="forms.wol.ip" inputmode="decimal" placeholder="留空为 255.255.255.255" />
        </label>
        <label>
          <span>端口</span>
          <input v-model.number="forms.wol.port" type="number" min="1" />
        </label>
      </div>
    </div>

    <div v-else-if="action.key === 'clonePull'" class="form-stack">
      <div class="field-grid">
        <label>
          <span>版本号</span>
          <input v-model.number="forms.clonePull.version_code" type="number" />
        </label>
        <label>
          <span>版本名</span>
          <input v-model.trim="forms.clonePull.version_name" placeholder="可留空" />
        </label>
      </div>
    </div>

    <div v-else-if="action.key === 'clonePush'" class="form-stack">
      <label>
        <span>Clone JSON</span>
        <textarea v-model="forms.clonePush.json" rows="9" placeholder='{"version_code":100055,"settings":"..."}' />
      </label>
    </div>

    <div v-else class="empty-call">
      <component :is="action.icon" :size="30" />
      <span>这个接口无需额外参数</span>
    </div>
  </section>

  <slot v-if="action" />
</template>
