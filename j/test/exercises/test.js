yp.ready(function() {
  // 模拟数据
  ///window.oPageConfig

  // 生成指定格式消息
  var setMsg = function(code, data, message) {
    return {code: code, data: data, message: message};
  };

  var dataObj1 = {
        'skillid|+1': 100
      , 'skillname|1-3': '中文'
      , 'type|1-2': 1
      , 'availtime|1-2': 1
      }
    , listData1 = {
        'list|2-10': [dataObj1]
      , 'pager': {
          'totalCounts|20-40': 1
        , 'page|1-1': 1
        }
      }
    , questions = [
        {
          'option': 'A'
        , 'content': '明天周末'
        }
      , {
          'option': 'B'
        , 'content': '明天周末'
        }
      , {
          'option': 'C'
        , 'content': '明天周末'
        }
      , {
          'option': 'D'
        , 'content': '明天周末'
        }
      ]
    , dataObj2 = {
        'qid|+1': 100
      , 'qtitle|1-3': '中文'
      , 'qoptions': questions
      , 'standard_answer': 'B'
      }
    , listData2 = {
        'list|2-10': [dataObj2]
      , 'pager': {
          'totalCounts|20-40': 1
        , 'page|1-1': 1
        }
      };

  // 技能
  yp.test.ajax(/skill\/get/, setMsg(0, listData1, 'hello!'));
  yp.test.ajax(/skill\/del/, setMsg(0, {}, 'hello!'));
  yp.test.ajax(/skill\/new/, setMsg(0, {}, 'hello!'));
  yp.test.ajax(/skill\/edit/, setMsg(0, {skillname: 'new' , type: 1, availtime: 1}, 'hello!'));

  // 习题
  yp.test.ajax(/question\/getAll/, setMsg(0, listData2, 'hello!'));
  yp.test.ajax(/question\/del/, setMsg(0, {}, 'hello!'));
  yp.test.ajax(/question\/new/, setMsg(0, {}, 'hello!'));
  yp.test.ajax(/question\/edit/, setMsg(0, {qtitle: 'new' , qoptions: questions, standard_answer: 'D'}, 'hello!'));
});