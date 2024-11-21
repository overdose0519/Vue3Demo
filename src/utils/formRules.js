import i18n from '../locales/i18n';
const { t } = i18n.global;

const convertSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemainder = seconds % 60;
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secondsRemainder < 10 ? '0' : ''}${secondsRemainder}`;
}
// 是否含有非法字符串
const isContainNameSpecial = (rule, value, callback) => {
  const regexp = /[`~!@#$%^&*=+[\]{}\\;:'",<>?]/;
  if (regexp.test(value)) {
    callback(new Error(t('message.tips.illegalCharacter')));
  } else {
    callback()
  }
}
const utf8ToBytes = str => {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes.push(charCode);
    } else if (charCode < 0x800) {
      bytes.push(0xc0 | (charCode >> 6),
        0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      bytes.push(0xe0 | (charCode >> 12),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f));
    } else { // Surrogate Pair
      i++;
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f));
    }
  }
  return bytes;
}
// 判断长度超过32
const checkCharacterLength = (rule, value, callback) => {
  // 32字节长度
  const bytes = utf8ToBytes(value);
  if (bytes.length > 32) {
    callback(new Error(t('message.tips.lengthOverLimit')));
  } else {
    callback()
  }
}
// 判断是否是ip
const isValidIP = (rule, value, callback) => {
  const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (regex.test(value) || value === '') {
    callback()
  } else {
    callback(new Error(t('message.tips.invalidIP')));
  }
}
// 判断是否是端口
const isValidPort = (rule, value, callback) => {
  if (value > 0 && value < 0xffff) {
    callback()
  } else {
    callback(new Error(t('message.tips.invalidPort')));
  }
}
// 是否是手机号
const isValidMobile = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (regex.test(value)) {
      callback()
    } else {
      callback(new Error(t('message.tips.invalidMobile')));
    }
  }
}
// 是否是邮箱
const isValidPhoneEmail = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    const regex = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (regex.test(value)) {
      callback()
    } else {
      callback(new Error(t('message.tips.invalidEmail')));
    }
  }
}
// 判断是否是E164号码
const isValidE164 = (rule, value, callback, type = 'h323') => {
  if (type === 'sip' || value === '') {
    callback()
  } else {
    const regex = /^[0-9]+$/;
    if (regex.test(value)) {
      callback()
    } else {
      callback(new Error(t('message.tips.invalidE164')));
    }
  }
}

export {
  convertSeconds,
  isContainNameSpecial,
  checkCharacterLength,
  isValidIP,
  isValidPort,
  isValidMobile,
  isValidPhoneEmail,
  isValidE164
}
