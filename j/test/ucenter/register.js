yp.ready(function() {
  // 模拟数据
  // window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return { code: code, data: data, message: message };
  };

  yp.test.ajax('user/reg', setMsg(0, '', '修改成功'));

});