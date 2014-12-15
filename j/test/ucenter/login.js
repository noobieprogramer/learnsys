yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };

  yp.test.ajax("user/verify", setMsg(0, {uid: '888888', permission:'0'}, '提交成功！'));
});