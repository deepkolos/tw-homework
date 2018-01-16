const fs = require('fs');
const getMsgFromLog = require('./main').default;
const checkUAVId = require('./main').checkUAVId;
const isInteger = require('./main').isInteger;
const Tester = require('./tester');
var input = fs.readFileSync('./input', 'utf8');
var tester = new Tester;

// 单元测试
tester.push('checkUAVId(\'plane1\')', function(expect){
  expect(
    checkUAVId('plane1'),
    true
  );
});

tester.push('checkUAVId(\'plane1[]\')', function(expect){
  expect(
    checkUAVId('plane1[]'),
    false
  );
});

tester.push('isInteger(\'123\')', function(expect){
  expect(
    isInteger('123'),
    true
  );
});

tester.push('isInteger(\'-123\')', function(expect){
  expect(
    isInteger('-123'),
    true
  );
});

tester.push('isInteger(\'0\')', function(expect){
  expect(
    isInteger('0'),
    true
  );
});

tester.push('isInteger(\'--123\')', function(expect){
  expect(
    isInteger('--123'),
    false
  );
});

// 功能测试
tester.push('测试msgId为: -1', function(expect){
  expect(
    getMsgFromLog(input, -1),
    'Error: -1'
  );
});

tester.push('测试msgId为: 0', function(expect){
  expect(
    getMsgFromLog(input, 0),
    'plane1 0 1 1 1'
  );
});

tester.push('测试msgId为: 2', function(expect){
  expect(
    getMsgFromLog(input, 2),
    'plane1 2 3 4 5'
  );
});

tester.push('测试msgId为: 3', function(expect){
  expect(
    getMsgFromLog(input, 3),
    'Error: 3'
  );
});

tester.push('测试msgId为: 4', function(expect){
  expect(
    getMsgFromLog(input, 4),
    'Error: 4'
  );
});

tester.push('测试msgId为: 100', function(expect){
  expect(
    getMsgFromLog(input, 100),
    'Cannot find 100'
  );
});

tester.run();