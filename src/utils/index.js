import i18n from '../locales/i18n';
const { t } = i18n.global;
export function readableTime(input) {
  const timeUnits = {
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hour'
  };
  const totalSeconds = Math.abs(parseInt(input)) || 0; // 使用Math.abs确保输入非负
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const result = [];
  if (hours > 0) {
    result.push(`${hours} ${t(`message.call.${timeUnits.hours}`)}`);
  }
  if (minutes > 0) {
    result.push(`${minutes} ${t(`message.call.${timeUnits.minutes}`)}`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) { // 如果小时和分钟都是0，并且秒数不为0，则显示秒数
    result.push(`${seconds} ${t(`message.call.${timeUnits.seconds}`)}`);
  }
  return result.join(' ');
}
