const BENCHMARK_TIMES = 1000000;

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

// ========================

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
  checkUAVId_2('1231312edasdasdqwdADAD');
}
console.timeEnd(`checkUAVId_2_benchmark(${BENCHMARK_TIMES})`);

console.time(`checkUAVId_benchmark(${BENCHMARK_TIMES})`);
for (let i = 0; i < BENCHMARK_TIMES; i++) {
  checkUAVId('1231312edasdasdqwdADAD');
}
console.timeEnd(`checkUAVId_benchmark(${BENCHMARK_TIMES})`);
