const fs = require('fs');

function getMsgFromLog(logString, msgId) {
  var i = 0;
  var values = null;
  var lastValues = null;
  var logArr = logString.split('\n');
  var logArrLen = logArr.length;
  var UAVId = null;
  var result = {
    error: `Error: ${msgId}`,
    notFound: `Cannot find ${msgId}`,
  };

  msgId = parseInt(msgId);

  if (msgId > logArrLen || logArrLen === 0)
    return result.notFound;

  // 检查第一条消息
  lastValues = values = logArr[0].split(' ');

  // 检查名字
  UAVId = values[0];
  if (!checkUAVId(UAVId))
    return result.error;
  // 检查数值
  if (!checkValues(values))
    return result.error;

  if (msgId === 0)
    return `${UAVId} ${msgId} ${values[1]} ${values[2]} ${values[3]}`;

  // 检查后续消息
  for (i = 1; i < logArrLen; i++) {
    // 一个文件只记录一架无人机
    values = logArr[i].split(' ');

    // 检查无人机ID, 一个文件只记录一架无人机的数据, 所以后续的id都是一致的
    if (UAVId !== values[0])
      return result.error;

    // 检查数据长度
    if (values.length !== 7)
      return result.error;

    // 检查数据是否格式
    if (!checkValues(values))
      return result.error;

    // 验证数据值
    if (i === 1) {
      if (
        values[1] !== lastValues[1] ||
        values[2] !== lastValues[2] ||
        values[3] !== lastValues[3]
      ) return result.error;
    } else if (
      values[1] !== lastValues[1] + lastValues[1 + 3] ||
      values[2] !== lastValues[2] + lastValues[2 + 3] ||
      values[3] !== lastValues[3] + lastValues[3 + 3]
    ) return result.error;

    if (i === msgId)
      return `${UAVId} ${msgId} ${values[1] + values[1 + 3]} ${values[2] + values[2 + 3]} ${values[3] + values[3 + 3]}`;

    lastValues = values;
  }
}

function isInteger(string) {
  return string === parseInt(string).toString();
}

function checkUAVId(string) {
  var match = string.match(/[A-Za-z0-9]+/);
  return match === null || match[0] === string;
}

function checkValues (values) {
  for (var j = 1; j < values.length; j++) {
    // 清楚末尾\r
    if (j === values.length - 1)
      values[j] = values[j].trim();

    if (!isInteger(values[j]))
      return false;

    values[j] = parseInt(values[j]);
  }
  return true;
}

module.exports.default = getMsgFromLog;
module.exports.checkUAVId = checkUAVId;
module.exports.isInteger = isInteger;