### ThoughtWorks网申作业

#### 环境依赖
[nodejs](https://nodejs.org/)

#### 使用
```shell
> git clone https://github.com/deepkolos/tw-homework.git
> cd tw-homework && npm i
```

#### 测试
```shell
> npm run test
```

### TODO

```
0. isInteger, checkUAVId优化 done
1. 整合重复的流程           done
2. 性能方面的考虑           done
3. 变量名字语义加强         done
```

### 试题理解

输入:

0. 记录着无人机活动信号的文本文件(或者文本内容)
1. 一个消息序号(Signal Index), 该序号代表着第几条消息(序号从0开始)

消息序号为: **十进制正整数**\
文本文件可以是文件路径? 文本内容的编码约定?

根据要求理解出来当无人机正常的记录文件格式:

```
{string /[A-Za-z0-9]+/} {int} {int} {int}                    // 首行一定是4个数据
{string /[A-Za-z0-9]+/} {int} {int} {int} {int} {int} {int}  // 后续一定是7个数据, 并且无人机ID与第一条相同
```

> 面对疑问寻找了一些解决方案, 通过[jschardet](https://github.com/aadsm/jschardet)可做文件编码检测
> 暂定约定文件使用`utf-8`编码, 如果程序接口支持文件路径作为输入, 则需要支持编码自动识别
> 数据部分没有明确进制要求, 不过一般为**十进制**

### 临界条件考虑

需要考虑无人机记录下来的数据运算时无溢出, 经过测试js支持超长数据运算

经过google查询到博客[JavaScript实验：数值范围
](http://blog.shaochuancs.com/javascript-number-range/), 还有[这篇](https://waylau.com/long-number-in-javascript/)

```
> console.log(Number.MAX_VALUE);
VM103:1 1.7976931348623157e+308

> console.log(Number.MIN_VALUE);
VM105:1 5e-324

> console.log(Number.MAX_SAFE_INTEGER);
VM129:1 9007199254740991

> console.log(Number.MIN_SAFE_INTEGER);
VM131:1 -9007199254740991
```

那么可能因为计算精度问题导致, 错误判断无人机的状态

比如这种状态:
```
plane1 9007199254740991 0 0 4 0 0
plane1 9007199254740996 1 1 1 2 3
```

```
> console.log(9007199254740991 + 4)
VM148:1 9007199254740996
```

解决精度限制方案有: [node-bigint](https://github.com/substack/node-bigint), [node-bignum](https://github.com/justmoon/node-bignum)

### 性能考虑

#### parseInt("123123123123", 10) vs +"123123123123"

```javascript
var BENCHMARK_TIMES = 1000000

console.time(`0+_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  0+"123123123123";
}
console.timeEnd(`0+_benchmark(${BENCHMARK_TIMES})`);

console.time(`+_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  +"123123123123";
}
console.timeEnd(`+_benchmark(${BENCHMARK_TIMES})`);

console.time(`parseInt_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  parseInt("123123123123", 10);
}
console.timeEnd(`parseInt_benchmark(${BENCHMARK_TIMES})`);
```

output:
```
0+_benchmark(1000000): 3.39111328125ms
+_benchmark(1000000): 9.85888671875ms
parseInt()_benchmark(1000000): 185.21484375ms
```

> 由于性能的差距过大, 并且已经均假设是十进制, 故采用+"123"的方式来做类型转换
> 后面补充测试0+""效果更好~

#### checkUAVId优化

```javascript
function checkUAVId(string) {
  var match = string.match(/[A-Za-z0-9]+/);
  return match === null || match[0] === string;
}

function checkUAVId_2(string) {
  var i = 0;
  var len = string.length;
  var charCode;

  for (; i < len; i++) {
    charCode = string.charCodeAt(i);

    if (
      charCode > 122 ||
      charCode < 48  ||
      (
        charCode > 90 &&
        charCode < 97
      ) || (
        charCode > 57 &&
        charCode < 65
      )
    ) return false;
  }
  return true;
}

console.time(`checkUAVId_2_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  checkUAVId_2('1231312edasdasdqwdADAD')
}
console.timeEnd(`checkUAVId_2_benchmark(${BENCHMARK_TIMES})`);

console.time(`checkUAVId_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  checkUAVId('1231312edasdasdqwdADAD')
}
console.timeEnd(`checkUAVId_benchmark(${BENCHMARK_TIMES})`);
```

output:
```
checkUAVId_2_benchmark(1000000): 83.3671875ms
checkUAVId_benchmark(1000000): 84.97998046875ms
```

> 两者性能差距不大, 并且仅仅格式仅仅检查一次, 故不采用checkUAVId_2

前面是在浏览器的环境测试, 后面在node的环境跑了一次, 发现结果有差异

```shell
> npm run perf
0+_benchmark(1000000): 27.648ms
+_benchmark(1000000): 11.127ms
parseInt_benchmark(1000000): 124.930ms
checkUAVId_2_benchmark(1000000): 84.154ms
checkUAVId_benchmark(1000000): 103.684ms
```

#### 其他性能考虑

0. 目前接口方式对于多次接口调用性能优化不利, 非要采取这样的形式可以在内部使用缓存, 但是不如做接口调整
1. 理想的执行方式一次性/按需生成可再次使用的数据结构, 就是用数据库...解析一次多次轻松读, 而不是解析一次读一次

