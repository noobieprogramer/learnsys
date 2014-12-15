yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };

  yp.test.ajax('user/get', setMsg(0, {uid:'888888', name:'麻凯倩', mail:'makaiqian@makaiqian.com', phone:'15869165171', url:'http://www.makaiqian.com', permission:'1'}, ''));
  yp.test.ajax('user/edit', setMsg(0, '', '修改成功'));
  yp.test.ajax('user/editPsw', setMsg(0, '', '修改成功'));
  yp.test.ajax('skill/get', setMsg(0, [{ skillname: '洗碗', accuracy: '0.59' },{ skillname: '看书', accuracy: '0.60' },{ skillname: '胸口碎大石', accuracy: '0.61' },{ skillname: 'html',  accuracy: '0.79'},{ skillname: 'HTML5',  accuracy: '0.80'},{ skillname: 'CSS3',  accuracy: '0.81'},{ skillname: 'jQuery',  accuracy: '0.89'},{ skillname: '躺枪',  accuracy: '0.90'},{ skillname: '卖萌',  accuracy: '0.91'},{ skillname: '睡觉',  accuracy: '0.99'},{ skillname: '分享',  accuracy: '1'}], ''));
});