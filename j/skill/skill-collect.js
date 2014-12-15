yp.use(['pagination'], function(yp) {
  yp.ready(function() {
    var ui = {
      $questionClass: $('#question-class')
    , $allcollect: $('#allcollect')
    , $exerciseQue: $('#exercise-que')
    , $addCollect: $('.add-collect')
    , $radio: $('.radio label')

    , $exerciseQue: $('#exercise-que')
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
      var self = this;
        /* 选择相应类型显示相应题目 */
        ui.$questionClass.on('change',function(){
          if(this.value != 'all'){
            ui.$exerciseQue.children().hide();
            $('.'+this.value).show();
          }else {
            ui.$exerciseQue.children().show();
          }
        });
        /* 选择相应类型显示相应题目 end */

        /* 石华写的 */ 
        // yp.ajax(oConfig.oUrl.getMyCollect, {
        //   type: 'get'
        // , dataType: 'json'
        // }).done(function(msg) {
        //   var list = msg.data.list;
        //   if(0 == msg.code){
        //     var str = '';
        //     for(var i = 0; i < msg.data.length; i++){
        //       str += '<li class="js-question skillid-'+msg.data[i].skillid+'" data-qid="'+msg.data[i].id+'" data-answer="'+msg.data[i].standard_answer+'">'
        //           +  '<div>'+ msg.data[i].qtitle
        //           + '<span class="glyphicon"></span></div>';
        //       var list = JSON.parse(msg.data[i].qoptions);
        //       for(var j = 0; j < list.length; j++){
        //          str += '<div class="radio"><label>'
        //               + '<input type="radio" name="answer'+msg.data[i].id+'" value="'+ list[j].option +'">'+ list[j].option +'、'+list[j].content+'</label>'
        //               + '</div>';
        //       }
        //       str += '</li>';
        //     }
        //     ui.$exerciseQue.empty().html(str);
        //     ui.$exerciseQue.find('a').tooltip();
        //   }
        // })
      //取消收藏
        ui.$exerciseQue.on('click','.cancel-collect',function(){
          var $this = $(this);
          yp.ajax(oConfig.oUrl.send, {
            type: 'post'
          , dataType: 'json'
          , data: {qid: $this.closest('li').data('qid')}
          }).done(function(msg) {
            console.log('取消收藏成功')
          });
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
              str += '<li class="jquery" data-qid="'+msg.data[i].id+'" data-answer="'+msg.data[i].standard_answer+'">'
                  +  '<div>'+msg.data[i].qtitle+'<a href="javascript:;" data-toggle="tooltip" data-placement="top" title="取消收藏" class="cancel-collect">[取消收藏]</a>'
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
