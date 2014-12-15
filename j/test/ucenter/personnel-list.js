yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };
// {uid: '001', name: '满春', command: 'mc123456', phone: '18868440602', url: 'www.baidu.com', mail: '708947913@qq.com', skill: 'js'}
  var dataObj = [
    {
      uid: '001'
    , name: '满春'
    , command: 'mc123456'
    , phone: '18868440602'
    , url: 'www.baidu.com'
    , mail: '708947913@qq.com'
    , skill: 'js'
    }
  , {
      uid: '002'
    , name: '麻凯倩'
    , command: 'mkq123456'
    , phone: '1008611'
    , url: 'www.baidu.com'
    , mail: 'mkq@qq.com'
    , skill: 'js'
    }
    
  ];

  yp.test.ajax("user/del", setMsg(0, {}, 'ok'));
  yp.test.ajax("user/getListInfo", setMsg(0, dataObj, 'ok'));
});