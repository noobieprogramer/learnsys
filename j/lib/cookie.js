+function($){
  $.extend({
    getCookie: function(name) {
      var search = name + "="
      offset = document.cookie.indexOf(search) 
      if (offset != -1) {
        offset += search.length ;
        end = document.cookie.indexOf(";", offset) ;
        if (end == -1)
          end = document.cookie.length;
        return unescape(document.cookie.substring(offset, end));
      }
      else
        return "";
    }

    , setCookie: function(name, value, days){
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+days);
      document.cookie = name + "=" + escape(value) +
      ((days==null) ? "" : "; expires=" + exdate.toGMTString())
      + ";path=/doc;";
    }
  });
}(jQuery);
