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
0. isInteger, checkUAVId优化
1. 整合重复的流程 done
2. 性能方面的考虑
3. 变量名字语义加强 done

### 试题理解

输入:

0. 记录着无人机活动信号的文本文件(或者文本内容)
1. 一个消息序号(Signal Index), 该序号代表着第几条消息(序号从0开始)

文本文件可以是文件路径? 文本内容的编码约定?
消息序号为: **十进制正整数**

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

parseInt("123123123123", 10) vs +"123123123123"

```
var BENCHMARK_TIMES = 1000000

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

output:
+_benchmark(1000000): 9.85888671875ms
parseInt()_benchmark(1000000): 185.21484375ms
```

> 由于性能的差距过大, 并且已经均假设是十进制, 故采用+"123"的方式来做字符串转换整形