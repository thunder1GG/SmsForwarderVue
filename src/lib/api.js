import { calcSign, sm4DecryptText, sm4EncryptText } from './crypto';

export const SECURITY_MODES = {
  NONE: 'none',
  SIGN: 'sign',
  SM4: 'sm4',
};

function normalizeBaseUrl(baseUrl) {
  return baseUrl.trim().replace(/\/+$/, '');
}

export async function callSmsForwarder(path, data, options) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  if (!baseUrl) throw new Error('请先填写服务端地址');

  const timestamp = Date.now();
  const requestBody = {
    timestamp,
    data: data ?? {},
  };

  if (options.securityMode === SECURITY_MODES.SIGN) {
    if (!options.secret) throw new Error('签名模式需要填写签名密钥');
    requestBody.sign = await calcSign(String(timestamp), options.secret);
  }

  let body = JSON.stringify(requestBody);
  let headers = { 'Content-Type': 'application/json' };

  if (options.securityMode === SECURITY_MODES.SM4) {
    if (!options.secret) throw new Error('SM4 模式需要填写 16 字节十六进制密钥');
    if (!/^[0-9a-fA-F]{32}$/.test(options.secret)) {
      throw new Error('SM4 密钥应为 32 位十六进制字符串');
    }
    body = sm4EncryptText(body, options.secret);
    headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body,
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${raw || response.statusText}`);
  }

  const jsonText = options.securityMode === SECURITY_MODES.SM4
    ? sm4DecryptText(raw, options.secret)
    : raw;

  const payload = JSON.parse(jsonText);
  if (payload.code !== 200) {
    throw new Error(payload.msg || '请求失败');
  }
  return payload;
}
