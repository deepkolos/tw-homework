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
0. isInteger,checkUAVId优化
1. 整合重复的流程
2. 性能方面的考虑
3. 变量名字语义加强

### 试题理解

输入: \
0. 记录着无人机活动信号的文本文件(或者文本内容)
1. 一个消息序号(Signal Index), 该序号代表着第几条消息(序号从0开始)

文本文件是指文件路径?

根据要求理解出来当无人机正常的记录文件规范

```
{/[A-Za-z0-9]+/} {int} {int} {int}                    // 首行一定是4个数据
{/[A-Za-z0-9]+/} {int} {int} {int} {int} {int} {int}  // 后续一定是7个数据
{/[A-Za-z0-9]+/} {int} {int} {int} {int} {int} {int}  // 后续一定是7个数据
```