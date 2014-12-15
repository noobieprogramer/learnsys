yp.ready(function() {
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  }
  var list = [
    {
      'skillname|+1': 100
    , skilltype: 'css'
    , deadline: '2014/10/10'
    , skillid: 1
    }
  , {
      skillname: 'html5'
    , skilltype: 'HTML'
    , deadline: '2014/10/10'
    , skillid: 2
    }
  , {
      skillname: 'javascript'
    , skilltype: 'JS'
    , deadline: '2014/10/10'
    , skillid: 3
    }
  , {
      skillname: 'css3'
    , skilltype: 'css'
    , deadline: '2014/10/10'
    , skillid: 4
    }
  , {
      skillname: 'css'
    , skilltype: 'css'
    , deadline: '2014/10/10'
    , skillid: 5
    }
  ];
  var data = {list: list};
  yp.test.ajax(/get/, setMsg(0, data, 'hello'));
});