<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  Battery,
  BookUser,
  ClipboardList,
  History,
  LocateFixed,
  Phone,
  PlugZap,
  Send,
  UserPlus,
  Wifi,
} from 'lucide-vue-next';
import AppHeader from './components/AppHeader.vue';
import ConnectionCard from './components/ConnectionCard.vue';
import HomeGrid from './components/HomeGrid.vue';
import OperationPage from './components/OperationPage.vue';
import ResultRenderer from './components/results/ResultRenderer.vue';
import { SECURITY_MODES, callSmsForwarder } from './lib/api';

const storageKey = 'sms-forwarder-vue-settings';
const savedSettings = JSON.parse(localStorage.getItem(storageKey) || '{}');

const settings = reactive({
  baseUrl: savedSettings.baseUrl || 'http://127.0.0.1:5000',
  securityMode: savedSettings.securityMode || SECURITY_MODES.NONE,
  secret: savedSettings.secret || '',
});

const view = ref('home');
const activeKey = ref('');
const loading = ref(false);
const result = ref(null);
const serverConfig = ref(null);
const connectionChecked = ref(false);

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

const actions = [
  {
    key: 'smsSend',
    label: '发短信',
    path: '/sms/send',
    icon: Send,
    tone: 'teal',
    resultType: 'status',
    form: 'smsSend',
  },
  {
    key: 'smsQuery',
    label: '查短信',
    path: '/sms/query',
    icon: ClipboardList,
    tone: 'blue',
    resultType: 'sms',
    form: 'smsQuery',
  },
  {
    key: 'callQuery',
    label: '查通话',
    path: '/call/query',
    icon: Phone,
    tone: 'green',
    resultType: 'call',
    form: 'callQuery',
  },
  {
    key: 'contactQuery',
    label: '查联系人',
    path: '/contact/query',
    icon: BookUser,
    tone: 'slate',
    resultType: 'contact',
    form: 'contactQuery',
  },
  {
    key: 'contactAdd',
    label: '加联系人',
    path: '/contact/add',
    icon: UserPlus,
    tone: 'rose',
    resultType: 'status',
    form: 'contactAdd',
  },
  {
    key: 'battery',
    label: '查电量',
    path: '/battery/query',
    icon: Battery,
    tone: 'amber',
    resultType: 'battery',
    data: {},
  },
  {
    key: 'location',
    label: '定位',
    path: '/location/query',
    icon: LocateFixed,
    tone: 'indigo',
    resultType: 'location',
    data: {},
  },
  {
    key: 'wol',
    label: 'WOL',
    path: '/wol/send',
    icon: Wifi,
    tone: 'cyan',
    resultType: 'status',
    form: 'wol',
  },
  {
    key: 'clonePull',
    label: '拉取克隆',
    path: '/clone/pull',
    icon: History,
    tone: 'violet',
    resultType: 'clone',
    form: 'clonePull',
  },
  {
    key: 'clonePush',
    label: '推送克隆',
    path: '/clone/push',
    icon: PlugZap,
    tone: 'orange',
    resultType: 'status',
    customData: parseClonePush,
  },
];

watch(
  settings,
  () => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  },
  { deep: true },
);

const activeAction = computed(() => actions.find((item) => item.key === activeKey.value));
const serverName = computed(() => {
  if (serverConfig.value) {
    const deviceName = serverConfig.value.extra_device_mark || serverConfig.value.extraDeviceMark;
    return deviceName ? `已连接 · ${deviceName}` : `已连接 · ${settings.baseUrl}`;
  }
  return connectionChecked.value ? `连接失败 · ${settings.baseUrl}` : `未测试 · ${settings.baseUrl}`;
});
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

function buildData(action) {
  if (action.customData) return action.customData();
  if (action.form) return { ...forms[action.form] };
  return action.data || {};
}

function openAction(action) {
  if (!action) return;
  activeKey.value = action.key;
  result.value = null;
  view.value = 'action';
}

function backHome() {
  view.value = 'home';
  activeKey.value = '';
  result.value = null;
}

async function request(path, data, resultType = 'status', options = {}) {
  const showResult = options.showResult !== false;
  loading.value = true;
  if (showResult) result.value = null;
  try {
    const payload = await callSmsForwarder(path, data, settings);
    if (showResult) {
      result.value = {
        ok: true,
        type: resultType,
        message: payload.msg || 'success',
        data: payload.data,
        raw: payload,
      };
    }
    return payload;
  } catch (error) {
    if (showResult) {
      result.value = {
        ok: false,
        type: 'error',
        message: error.message,
        data: null,
        raw: null,
      };
    }
    throw error;
  } finally {
    loading.value = false;
  }
}

async function testServer(options = {}) {
  connectionChecked.value = true;
  try {
    const payload = await request('/config/query', {}, 'config', options);
    serverConfig.value = payload.data;
  } catch {
    serverConfig.value = null;
  }
}

async function submitAction() {
  const action = activeAction.value;
  if (!action) return;
  await request(action.path, buildData(action), action.resultType);
}

onMounted(() => {
  if (settings.baseUrl) testServer({ showResult: false });
});
</script>

<template>
  <main class="app-shell">
    <AppHeader
      :server-name="serverName"
      :loading="loading"
      :show-back="view !== 'home'"
      @back="backHome"
      @test="testServer"
    />

    <ConnectionCard v-model:settings="settings" />

    <HomeGrid
      v-if="view === 'home'"
      :actions="actions"
      :server-config="serverConfig"
      @open="openAction"
    />

    <ResultRenderer v-if="view === 'home' && result" :result="result" />

    <OperationPage
      v-else-if="activeAction"
      :key="activeAction.key"
      v-model:forms="forms"
      :action="activeAction"
      :loading="loading"
      :sim-options="simOptions"
      @submit="submitAction"
    >
      <ResultRenderer v-if="result" :result="result" />
    </OperationPage>

    <HomeGrid
      v-else
      :actions="actions"
      :server-config="serverConfig"
      @open="openAction"
    />
  </main>
</template>
