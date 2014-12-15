
yp.use(['iscroll, mousewheel'],function(yp) {
  yp.ready(function() {
    var ui = {
    };
    var oPage = {
      init: function() {
        this.view();
        this.listen();
      }
    , view: function() {
        var self = this;
        var num = $('.list').length;
        var wid = (+num*490 + (+num - 1)*10);
        $('#scroller').width(wid);

        window.myScroll = new IScroll('#wrapper',{
          scrollX: true
        , scrollY: false
        , scrollbars: true
        , mouseWheel:true
        , snap: '.list'
        , interactiveScrollbars: true
        });
      }
    , listen: function() {
        var self = this;

        /*首页-滚动效果*/
          $('#wrapper').on('mousewheel', '', function(event) {
            if(event.deltaY > 0){
              window.myScroll.scrollBy(320,0,333);
            }else{
              window.myScroll.scrollBy(-320,0,333);
            }
            // event.preventDefault();   // 效果等同于插件里的参数mouseWheel:true
          });
          $('#wrapper').on('mouseenter', '.big', function(event) {
            $(this).find('.slider').animate({'left':'-50%'},{
              easing: 'easeOutBounce',
              duration: 500,
              queue:false
            });
          }).on('mouseleave', '.big', function(event) {
            $(this).find('.slider').animate({'left':'0'},{
              easing: 'easeInOutBack',
              duration: 500,
              queue:false
            });
          }).on('mouseenter', '.small', function(event) {
            $(this).find('.slider').fadeOut(400);
          }).on('mouseleave', '.small', function(event) {
            $(this).find('.slider').fadeIn(500);
          }).on('mouseenter', '.huge', function(event) {
            $(this).find('.slider').animate({'top':'-50%'},{
              easing: 'easeOutBounce',
              duration: 500,
              queue:false
            });
          }).on('mouseleave', '.huge', function() {
            $(this).find('.slider').animate({'top':'0'},{
              easing: 'easeInOutBack',
              duration: 500,
              queue:false
            });
          });
        /*首页-滚动效果 end */
      }
    };
    oPage.init();
  });
});
