<script setup>
import { Moon, Server, Settings2 } from 'lucide-vue-next';
import { SECURITY_MODES } from '../lib/api';

const settings = defineModel('settings', {
  type: Object,
  required: true,
});
</script>

<template>
  <section class="connection-panel">
    <label>
      <span><Server :size="15" /> 服务端</span>
      <input v-model.trim="settings.baseUrl" inputmode="url" placeholder="http://192.168.1.8:5000" />
    </label>

    <div class="field-grid">
      <label>
        <span><Settings2 :size="15" /> 安全</span>
        <select v-model="settings.securityMode">
          <option :value="SECURITY_MODES.NONE">无</option>
          <option :value="SECURITY_MODES.SIGN">签名</option>
          <option :value="SECURITY_MODES.SM4">SM4</option>
        </select>
      </label>
      <label>
        <span><Moon :size="15" /> 密钥</span>
        <input
          v-model.trim="settings.secret"
          :type="settings.securityMode === SECURITY_MODES.NONE ? 'text' : 'password'"
          placeholder="签名密钥 / SM4密钥"
        />
      </label>
    </div>
  </section>
</template>
