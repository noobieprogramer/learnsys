/* ==========================================================
 * skill-challenge.js v20140722
 * ==========================================================
 * Copyright huangxiaowen
 *
 * 技能挑战页面js
 * ========================================================== */
  yp.ready(function() {
    var ui = {
      $progress: $('.progress li')
    , $challExercise: $('.chall-exercise')
    , $exercise: $('.chall-exercise li')
    , $btnPre: $('#btn-pre')
    , $btnNext: $('#btn-next')
    , $btnSubmit: $('#btn-submit')
    };
    var nowNum = 0;

    var oConfig = window.oPageConfig;
    var oPage = {
      // 初始化
      init: function() {
        this.view();
        this.listen();
      }
      // 视图管理
    , view: function() {
        var self = this;

        document.getElementById('challenge-time').innerHTML="00:00";

        $.ajax({
            type: 'get'
          , url: window.oPageConfig.oUrl['getChallenge']
          , dataType: 'json'
          , data: {'skillid':1}
          }).done(function(msg){
            if(0 == msg.code){
              var str = '';
              for(var i = 0; i < msg.data.length; i++){
                str += '<li class="js-question" data-qid="'+msg.data[i].id+'"><div>'+msg.data[i].qtitle+'</div>';
                var list = JSON.parse(msg.data[i].qoptions);
                for(var j = 0; j < list.length; j++){
                   str += '<div class="radio"><label>'
                        + '<input type="radio" name="answer'+msg.data[i].id+'" value="'+ list[j].option +'">'+ list[j].option +'、'+list[j].content+'</label>'
                        + '</div>';
                }
                str += '</li>';
              }
              $('#exampaper').html(str);
            }
        })

        // 只显示第一道题目
        ui.$exercise.hide();
        ui.$exercise.eq(0).show();
        ui.$btnPre.attr('disabled',true);
      }
      // 事件绑定
    , listen: function() {
        /* 计时功能 */
        var m2 = 00;
        var s2 = 00;
        var s = 0, m = 0;
        setInterval(function(){
          s = s + 1;
          if(s == 60){
            m = m + 1;
            s = 0;
          }
          s2 = s;
          m2 = m;
          if(s < 10){
            s2 = "0" + s;
          }
          if(m < 10){
            m2 = "0" + m;
          }
        //document.getElementById('challenge-time').innerHTML=m2+":"+s2;
        $('#challenge-time').html(m2+":"+s2);
        },1000);
        /* 计时功能 end */


        // add by shihua  Ajax获取试卷
        $('#exampaper').on('click', 'input',function(){
          $(this).closest('.js-question').data('answer',  $(this).val());
        })
        $('#js-btnCommitTest').on('click', function(){
          var data = [];
          $('.js-question').each(function(){
            var d = $(this).data();
            data.push(d);
          })
          $.ajax({
            type: 'post'
          , url: window.oPageConfig.oUrl['commitChallenge']
          , dataType: 'json'
          , data: {'answersheet': data}
          }).done(function(msg){
            if(0 == msg.code) {
              alert('提交成功!');
              }
          })
        })
        /* 题目轴点击效果 */
        for (var i = 19; i >= 0; i--) {
          ui.$progress[i].index=i;
          ui.$progress.eq(i).on('click',function(){
            //时间轴效果 
            ui.$progress.removeClass('on');
            $(this).addClass('on');
            // 题目变化
            ui.$exercise.hide();
            ui.$exercise.eq(this.index).show();
            // 标识  
            nowNum = this.index;
            if(nowNum == 19){
              ui.$btnNext.attr('disabled',true);
            } else if(nowNum == 0){
              ui.$btnPre.attr('disabled',true);
            } else {
              ui.$btnNext.attr('disabled',false);
              ui.$btnPre.attr('disabled',false);
            }
          })
        }
        
        // 上一题按钮
        ui.$btnPre.on('click',function(){
          ui.$exercise.eq(nowNum).hide();
          ui.$progress.removeClass('on');
          nowNum--;
          ui.$exercise.eq(nowNum).show();
          ui.$progress.eq(nowNum).addClass('on');
          if(nowNum == 0){
            ui.$btnPre.attr('disabled','true')
          } else {
            ui.$btnNext.attr('disabled',false);
            ui.$btnPre.attr('disabled',false);
          }
        });
        // 下一题按钮
        ui.$btnNext.on('click',function(){
          ui.$exercise.eq(nowNum).hide();
          ui.$progress.removeClass('on');
          nowNum++;
          ui.$exercise.eq(nowNum).show();
          ui.$progress.eq(nowNum).addClass('on');
          if(nowNum == 19){
            ui.$btnNext.attr('disabled','true')
          } else {
            ui.$btnNext.attr('disabled',false);
            ui.$btnPre.attr('disabled',false);
          }
        });
        // 选择答案后颜色变化
        ui.$exercise.on('click','label',function(){
          ui.$progress.eq(nowNum).css('color','#285e8e');
        });
        // 确定提交试卷
        ui.$btnSubmit.on('click',function(){
          alert('确定提交试卷吗？')
        });

      }
    };
  oPage.init();
  });
