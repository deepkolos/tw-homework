
//定义简单的测试控制器
function Tester() {
  this._task = [];
}

Tester.prototype.fail = function (name, expect, ouput) {
  console.log('\x1b[31m' + name + '\x1b[0m');
  console.log('output: ' + ouput);
  console.log('expect: ' + expect);
};

Tester.prototype.success = function (name) {
  console.log('\x1b[32m' + name + '\x1b[0m');
};

Tester.prototype.push = function (name, cb) {
  cb._name = name;
  this._task.push(cb);
};

Tester.prototype.run = function (which) {
  var self = this;
  var test;
  var success = function () {
    self.success(test._name);
  };
  var fail = function (ouput, expect) {
    self.fail(test._name, ouput, expect);
  };
  var expect = function (ouput, expect) {
    if (ouput === expect) {
      self.success(test._name);
    } else {
      self.fail(test._name, ouput, expect);
    }
  };

  
  if (which < 0)
    which = this._task.length + which;

  if (which === undefined)
    this._task.forEach(function (_test) {
      test = _test;
      test(expect, success, fail);
    });
  else {
    test = self._task[which];
    test(expect, success, fail);
  }
};


module.exports = Tester;
