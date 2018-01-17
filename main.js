/**
 * 根据无人机记录, 查询某条消息无人机的坐标
 * 
 * @param {String} logString 
 * @param {Number} signalIndex 
 * @returns 
 */
function getLocation(logString, signalIndex) {
  var UAVId = null;
  var values = null;
  var lastValues = null;
  var logArr = logString.split('\n');
  var logArrLen = logArr.length;

  var result = {
    error: `Error: ${signalIndex}`,
    notFound: `Cannot find ${signalIndex}`,
  };

  // signalIndex应该为十进制正整数, 类型定义由注释给出, 但是要求没有提供该类型的错误提示要求, 故修正之
  // 由于性能考虑, 不做强制修正
  signalIndex = +signalIndex;

  if (signalIndex > logArrLen || logArrLen === 0)
    return result.notFound;

  // 检查第一条消息
  lastValues = values = logArr[0].split(' ');
  UAVId = values[0];

  if (
    !checkUAVId(UAVId) || // 检查名字
    !checkValues(values)  // 检查数值
  ) return result.error;

  if (signalIndex === 0)
    return `${UAVId} ${signalIndex} ${values[1]} ${values[2]} ${values[3]}`;

  // 检查后续消息
  for (var i = 1; i < logArrLen; i++) {
    values = logArr[i].split(' ');

    if (
      values[0] !== UAVId  || // 检查无人机ID, 一个文件只记录一架无人机的数据, 所以后续的id都是一致的
      values.length !== 7  || // 检查数据项长度
      !checkValues(values) || // 检查数据部分格式

      i === 1 ? (             // 验证数据值, 第一条数据偏移值可视为0
        values[1] !== lastValues[1] ||
        values[2] !== lastValues[2] ||
        values[3] !== lastValues[3]
      ) : (
        values[1] !== lastValues[1] + lastValues[1 + 3] ||
        values[2] !== lastValues[2] + lastValues[2 + 3] ||
        values[3] !== lastValues[3] + lastValues[3 + 3]
      )
    ) return result.error;

    if (i === signalIndex)
      return `${UAVId} ${signalIndex} ${values[1] + values[1 + 3]} ${values[2] + values[2 + 3]} ${values[3] + values[3 + 3]}`;

    lastValues = values;
  }
}

/**
 * 判断字符串是否是整数
 * 
 * @param {String} string 
 * @returns {Boolean}
 */
function isInteger(string) {
  return string === (+string).toString();
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
function checkValues(values) {
  for (var j = 1, len = values.length; j < len; j++) {
    // 清楚末尾\r
    if (j === len - 1)
      values[j] = values[j].trim();

    if (!isInteger(values[j]))
      return false;

    values[j] = +values[j];
  }
  return true;
}

module.exports.isInteger = isInteger;
module.exports.checkUAVId = checkUAVId;
module.exports.getLocation = getLocation;