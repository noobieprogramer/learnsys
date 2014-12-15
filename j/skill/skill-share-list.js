yp.use(['pagination'], function(yp) {
  yp.ready(function() {
    var ui = {
      $ypShareTable: $('#yp-share-table')
    };
    var oConfig = window.oPageConfig;
    var oPage = {
      init: function() {
        this.view();
        this.listen();
      }
    , totalCounts: null
    , view: function() {
        var self = this;
        self.getPaginationInfo(0);
      }
    , listen: function() {
      }
    , paginationCallback: function(page_index) {
        var self = oPage;
        self.getPaginationInfo(page_index);
      }
    , fPagination: function() {
        var self = this;
        $("#pagination").pagination(self.totalCounts, {
          num_edge_entries: 1, // 边缘页数
          num_display_entries: 4, // 主体页数
          callback: self.paginationCallback,
          items_per_page:6 // 每页显示1项
        });
      }
    , getPaginationInfo: function(page_index) {
        var self = this;
        yp.ajax(oConfig.oUrl.pagination, {
          type: 'post'
        , dataType: 'json'
        , data: {page_index: page_index}
        }).done(function(msg) {
          if (0 == msg.code) {
            var html = self.renderInfo(msg.data);
            ui.$ypShareTable.find('tbody').empty().html(html);
            if (!self.totalCounts) {
              self.totalCounts = msg.data.totalCounts;
              self.fPagination();
            }
          }
        });
      }
    , renderInfo: function(data) {
        var html = '';
        var list = data.list;
        for (var i = 0; i < list.length; i++) {
          html += '<tr>'
                + '<td>' + list[i].date + '</td>'
                + '<td><a href="' + 1 + '">' + list[i].title + '</a></td>'
                + '<td>' + list[i].uname + '</td>'
                + '<td><span title="回复">' + list[i].reply + '</span>/<span title="访问量">' + list[i].visit + '</span></td>'
                + '</tr>';
        }
        return html;
      }
    };
    oPage.init();
  });
});