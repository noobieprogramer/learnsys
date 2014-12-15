yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };
  var list = [
    {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , 'visit|+1': 10
    , uname: 'namename'
    }
  , {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , visit: 10
    , uname: 'namename'
    }
  , {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , visit: 10
    , uname: 'namename'
    }
  , {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , visit: 10
    , uname: 'namename'
    }
  , {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , visit: 10
    , uname: 'namename'
    }
  , {
      date: '2000/1/20'
    , title: 'xxxxxxxxx'
    , reply: 2
    , visit: 10
    , uname: 'namename'
    }
  ];
  var data1 = {list: list, totalCounts: 15};
  var data2 = {isCollect: 1}
  yp.test.ajax(/pagination/, setMsg(0, data1, 'hello!'));
  yp.test.ajax(/shareCollect/, setMsg(0, data2, 'hello!'));
});