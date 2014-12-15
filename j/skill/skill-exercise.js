/* ==========================================================
 * skill-exercise.js v20140725
 * ==========================================================
 * 技能练习 JS by huangxiaowen
 *
 * ========================================================== */
yp.use(['pagination'], function(yp) {
  yp.ready(function() {
    var ui = {
      $exerciseQue: $('#exercise-que')
    , $addCollect: $('.add-collect')
    , $radio: $('.radio label')
    };
    var oConfig = window.oPageConfig;
    var oPage = {
      init: function() {
        this.view();
        this.listen();
      }
    , view: function() {
        var self = this;
        // 分页
        $("#Pagination").pagination(oConfig.oData.totalCounts, {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            callback: self.paginationCallback,
            items_per_page:20 //每页显示1项
        });
      }

    , listen: function() {
        //加入收藏
        ui.$exerciseQue.on('click','.add-collect',function(){
          var $this = $(this);
          yp.ajax(oConfig.oUrl.send, {
            type: 'post'
          , dataType: 'json'
          , data: {qid: $this.closest('.js-question').data('qid')}
          }).done(function(msg) {
            $this.text('[已收藏]');
          });
        });
        // 选择判断答案对错
        ui.$exerciseQue.on('click', 'input',function(){
          var $this = $(this);
          var answer = $(this).closest('.js-question').data('answer');
          if(answer == $this.val()){
            $this.closest('.js-question').find('.glyphicon').removeClass('glyphicon-remove');
            $this.closest('.js-question').find('.glyphicon').addClass('glyphicon-ok');
          } else {
            $this.closest('.js-question').find('.glyphicon').removeClass('glyphicon-ok');
            $this.closest('.js-question').find('.glyphicon').addClass('glyphicon-remove');
          }
          // yp.ajax(oConfig.oUrl.answer, {
          //   type: 'post'
          // , dataType: 'json'
          // , data: {id: $this.parents('li').attr('id')}
          // }).done(function(msg) {
          //   if(msg.data == $this.val()){
          //     $this.parents('.form-group').siblings("div").children('.glyphicon').removeClass('glyphicon-remove');
          //     $this.parents('.form-group').siblings("div").children('.glyphicon').addClass('glyphicon-ok');
          //   } else {
          //     $this.parents('.form-group').siblings("div").children('.glyphicon').removeClass('glyphicon-ok');
          //     $this.parents('.form-group').siblings("div").children('.glyphicon').addClass('glyphicon-remove');
          //   }
          // });
        });
      }
    , paginationCallback: function(page_index) {
        var self = this
          , html = '';
        yp.ajax(oConfig.oUrl.pagination, {
          type: 'get'
        , dataType: 'json'
        , data: {page_index: page_index, skillid: oConfig.oData.skillid}
        }).done(function(msg) {
          var list = msg.data.list;
          if(0 == msg.code){
            var str = '';
            for(var i = 0; i < msg.data.length; i++){
              str += '<li class="js-question" data-qid="'+msg.data[i].id+'" data-answer="'+msg.data[i].standard_answer+'">'
                  +  '<div>'+msg.data[i].qtitle+'<a href="javascript:;" data-toggle="tooltip" data-placement="top" title="添加到我的笔记"" class="add-collect">[收藏]</a>'
                  + '<span class="glyphicon"></span></div>';
              var list = JSON.parse(msg.data[i].qoptions);
              for(var j = 0; j < list.length; j++){
                 str += '<div class="radio"><label>'
                      + '<input type="radio" name="answer'+msg.data[i].id+'" value="'+ list[j].option +'">'+ list[j].option +'、'+list[j].content+'</label>'
                      + '</div>';
              }
              str += '</li>';
            }
            ui.$exerciseQue.empty().html(str);
            ui.$exerciseQue.find('a').tooltip();
          }
        })
      }




    };
    oPage.init();
  });
});