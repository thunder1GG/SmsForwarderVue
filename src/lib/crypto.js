import { sm4 } from 'sm-crypto';

const encoder = new TextEncoder();
const SM4_IV = '03050609060905090305060906090509';

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export async function calcSign(timestamp, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const payload = encoder.encode(`${timestamp}\n${secret}`);
  const digest = await crypto.subtle.sign('HMAC', key, payload);
  return encodeURIComponent(bytesToBase64(new Uint8Array(digest)));
}

export function sm4EncryptText(plainText, hexKey) {
  return sm4.encrypt(plainText, hexKey, {
    mode: 'cbc',
    iv: SM4_IV,
    output: 'hex',
  });
}

export function sm4DecryptText(cipherHex, hexKey) {
  return sm4.decrypt(cipherHex, hexKey, {
    mode: 'cbc',
    iv: SM4_IV,
    output: 'string',
  });
}
