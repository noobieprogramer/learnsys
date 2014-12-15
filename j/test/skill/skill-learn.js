yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };
  var data1 = [
    '笔记1', '笔记2', '笔记3'
  ];
  yp.test.ajax(/note/, setMsg(0, data1, 'hello!'));
});