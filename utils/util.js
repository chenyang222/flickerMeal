const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//将数字转换成金额显示
const toMoney = num => {
  num = num.toFixed(2);
  num = parseFloat(num)
  num = num.toLocaleString();
  return num;
}

module.exports = {
  formatTime: formatTime,
  toMoney: toMoney
}
