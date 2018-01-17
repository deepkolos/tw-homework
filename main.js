/**
 * 根据无人机记录, 查询某条消息无人机的坐标
 * 
 * @param {String} logString 
 * @param {Number} signalIndex 
 * @returns 
 */
function getLocation(logString, signalIndex) {
  var UAVId      = null;
  var values     = null;
  var lastValues = null;
  var logArr     = logString.split('\n');
  var logArrLen  = logArr.length;

  var result = {
    error: `Error: ${signalIndex}`,
    notFound: `Cannot find ${signalIndex}`,
  };

  // signalIndex应该为正整数, 类型定义由注释给出
  signalIndex = parseInt(signalIndex);

  if (signalIndex > logArrLen || logArrLen === 0)
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

  if (signalIndex === 0)
    return `${UAVId} ${signalIndex} ${values[1]} ${values[2]} ${values[3]}`;

  // 检查后续消息
  for (var i = 1; i < logArrLen; i++) {
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

    if (i === signalIndex)
      return `${UAVId} ${signalIndex} ${values[1] + values[1 + 3]} ${values[2] + values[2 + 3]} ${values[3] + values[3 + 3]}`;

    lastValues = values;
  }
}

/**
 * 判断是否是整数
 * 
 * @param {String} string 
 * @returns {Boolean}
 */
function isInteger(string) {
  return string === parseInt(string).toString();
}

/**
 * 检查无人机ID是否合法
 * 
 * @param {String} string 
 * @returns {Boolean}
 */
function checkUAVId(string) {
  var match = string.match(/[A-Za-z0-9]+/);
  return match === null || match[0] === string;
}

/**
 * 用于检查一行记录的数值部分是否合法
 * 
 * @param {Array} values 
 * @returns {Boolean}
 */
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

module.exports.isInteger   = isInteger;
module.exports.checkUAVId  = checkUAVId;
module.exports.getLocation = getLocation;