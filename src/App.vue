<script setup>
import { computed, reactive, ref, watch } from 'vue';
import {
  Battery,
  BookUser,
  ClipboardList,
  Copy,
  History,
  LocateFixed,
  Moon,
  Phone,
  PlugZap,
  RadioTower,
  RefreshCw,
  Send,
  Server,
  Settings2,
  Smartphone,
  UserPlus,
  Wifi,
} from 'lucide-vue-next';
import { SECURITY_MODES, callSmsForwarder } from './lib/api';

const storageKey = 'sms-forwarder-vue-settings';
const savedSettings = JSON.parse(localStorage.getItem(storageKey) || '{}');

const settings = reactive({
  baseUrl: savedSettings.baseUrl || 'http://127.0.0.1:5000',
  securityMode: savedSettings.securityMode || SECURITY_MODES.NONE,
  secret: savedSettings.secret || '',
});

const activePanel = ref('smsSend');
const loading = ref(false);
const result = ref(null);
const serverConfig = ref(null);

const forms = reactive({
  smsSend: {
    sim_slot: 1,
    phone_numbers: '',
    msg_content: '',
  },
  smsQuery: {
    type: 1,
    page_num: 1,
    page_size: 10,
    keyword: '',
  },
  callQuery: {
    type: 1,
    page_num: 1,
    page_size: 10,
    phone_number: '',
  },
  contactQuery: {
    page_num: 1,
    page_size: 10,
    phone_number: '',
    name: '',
  },
  contactAdd: {
    name: '',
    phone_number: '',
  },
  wol: {
    mac: '',
    ip: '',
    port: 9,
  },
  clonePull: {
    version_code: 100055,
    version_name: '',
  },
  clonePush: {
    json: '',
  },
});

watch(
  settings,
  () => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  },
  { deep: true },
);

const panels = [
  { key: 'smsSend', label: '发短信', icon: Send, path: '/sms/send', form: 'smsSend' },
  { key: 'smsQuery', label: '查短信', icon: ClipboardList, path: '/sms/query', form: 'smsQuery' },
  { key: 'callQuery', label: '查通话', icon: Phone, path: '/call/query', form: 'callQuery' },
  { key: 'contactQuery', label: '查联系人', icon: BookUser, path: '/contact/query', form: 'contactQuery' },
  { key: 'contactAdd', label: '加联系人', icon: UserPlus, path: '/contact/add', form: 'contactAdd' },
  { key: 'battery', label: '电量', icon: Battery, path: '/battery/query', data: {} },
  { key: 'location', label: '定位', icon: LocateFixed, path: '/location/query', data: {} },
  { key: 'wol', label: 'WOL', icon: Wifi, path: '/wol/send', form: 'wol' },
  { key: 'clonePull', label: '拉取克隆', icon: History, path: '/clone/pull', form: 'clonePull' },
  { key: 'clonePush', label: '推送克隆', icon: PlugZap, path: '/clone/push', customData: parseClonePush },
];

const currentPanel = computed(() => panels.find((item) => item.key === activePanel.value));
const serverName = computed(() => serverConfig.value?.extra_device_mark || '未连接');
const simOptions = computed(() => {
  const list = serverConfig.value?.sim_info_list || {};
  return [1, 2].map((slot) => ({
    value: slot,
    label: list[slot - 1]?.simSlotName || list[slot - 1]?.displayName || `SIM${slot}`,
    extra: slot === 1 ? serverConfig.value?.extra_sim1 : serverConfig.value?.extra_sim2,
  }));
});

function parseClonePush() {
  if (!forms.clonePush.json.trim()) throw new Error('请粘贴 clone JSON');
  return JSON.parse(forms.clonePush.json);
}

function buildData(panel) {
  if (panel.customData) return panel.customData();
  if (panel.form) return { ...forms[panel.form] };
  return panel.data || {};
}

async function request(path, data) {
  loading.value = true;
  result.value = null;
  try {
    const payload = await callSmsForwarder(path, data, settings);
    result.value = {
      ok: true,
      title: payload.msg || 'success',
      payload,
    };
    return payload;
  } catch (error) {
    result.value = {
      ok: false,
      title: error.message,
      payload: null,
    };
    throw error;
  } finally {
    loading.value = false;
  }
}

async function testServer() {
  try {
    const payload = await request('/config/query', {});
    serverConfig.value = payload.data;
  } catch {
    serverConfig.value = null;
  }
}

async function submitCurrent() {
  const panel = currentPanel.value;
  await request(panel.path, buildData(panel));
}

async function copyResult() {
  if (!result.value) return;
  await navigator.clipboard.writeText(JSON.stringify(result.value.payload ?? result.value, null, 2));
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}
</script>

<template>
  <main class="app-shell">
    <section class="topbar">
      <div class="brand">
        <div class="brand-mark">
          <Smartphone :size="22" />
        </div>
        <div>
          <h1>SmsForwarder</h1>
          <p>{{ serverName }}</p>
        </div>
      </div>
      <button class="icon-button" type="button" title="测试连接" :disabled="loading" @click="testServer">
        <RefreshCw :size="18" :class="{ spinning: loading }" />
      </button>
    </section>

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
          <input v-model.trim="settings.secret" :type="settings.securityMode === SECURITY_MODES.NONE ? 'text' : 'password'" placeholder="签名密钥 / SM4密钥" />
        </label>
      </div>
    </section>

    <nav class="panel-tabs" aria-label="接口">
      <button
        v-for="panel in panels"
        :key="panel.key"
        type="button"
        :class="{ active: activePanel === panel.key }"
        @click="activePanel = panel.key"
      >
        <component :is="panel.icon" :size="17" />
        <span>{{ panel.label }}</span>
      </button>
    </nav>

    <section class="work-panel">
      <header>
        <div>
          <h2>{{ currentPanel.label }}</h2>
          <p>{{ currentPanel.path }}</p>
        </div>
        <button class="primary-button" type="button" :disabled="loading" @click="submitCurrent">
          <RadioTower v-if="loading" :size="17" class="spinning" />
          <Send v-else :size="17" />
          <span>发送</span>
        </button>
      </header>

      <div v-if="activePanel === 'smsSend'" class="form-stack">
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

      <div v-else-if="activePanel === 'smsQuery'" class="form-stack">
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

      <div v-else-if="activePanel === 'callQuery'" class="form-stack">
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

      <div v-else-if="activePanel === 'contactQuery'" class="form-stack">
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

      <div v-else-if="activePanel === 'contactAdd'" class="form-stack">
        <label>
          <span>姓名</span>
          <input v-model.trim="forms.contactAdd.name" placeholder="联系人姓名" />
        </label>
        <label>
          <span>号码</span>
          <input v-model.trim="forms.contactAdd.phone_number" inputmode="tel" placeholder="多个号码用 ; 分隔" />
        </label>
      </div>

      <div v-else-if="activePanel === 'wol'" class="form-stack">
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

      <div v-else-if="activePanel === 'clonePull'" class="form-stack">
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

      <div v-else-if="activePanel === 'clonePush'" class="form-stack">
        <label>
          <span>Clone JSON</span>
          <textarea v-model="forms.clonePush.json" rows="9" placeholder='{"version_code":100055,"settings":"..."}' />
        </label>
      </div>

      <div v-else class="empty-call">
        <component :is="currentPanel.icon" :size="28" />
      </div>
    </section>

    <section v-if="result" class="result-panel" :class="{ error: !result.ok }">
      <div class="result-title">
        <strong>{{ result.ok ? '响应成功' : '请求失败' }}</strong>
        <button class="icon-button small" type="button" title="复制结果" @click="copyResult">
          <Copy :size="16" />
        </button>
      </div>
      <p>{{ result.title }}</p>
      <pre v-if="result.payload">{{ prettyJson(result.payload) }}</pre>
    </section>
  </main>
</template>
