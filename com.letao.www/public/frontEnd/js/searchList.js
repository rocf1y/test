$(function () {
  // 用于价格排序
  var flag = true;
  // 用于销量排序
  var judge = true;

  // 下拉刷新插件
  mui.init({
    // 注意: 按照文档上书写的DOM结构无特殊要求，只需要指定一个下拉刷新容器标识即可
    // 但是实际上不行,按照实践要求 必须在区域滚动的基础上才可以
    pullRefresh: {
      container: "#lt-search", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
        color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
        height: '50px', //可选,默认50px.下拉刷新控件的高度,
        range: '100px', //可选 默认100px,控件可下拉拖拽的范围
        offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
        auto: true, //可选,默认false.首次加载自动上拉刷新一次
        callback: function () {
          // 获取页面数据
          getSearchListData();
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  // 价格排序
  $('.order-price').on('tap', function () {
    $('.search-result-order a').removeClass('active');
    $(this).addClass('active');
    if (flag) {
      // 升序
      getSearchListData(1, 1, 2);
      flag = false;
      $(this).children().addClass('fa-angle-up');
      $(this).children().removeClass('fa-angle-down');
    } else {
      // 降序
      getSearchListData(1, 2, 2);
      flag = true;
      $(this).children().addClass('fa-angle-down');
      $(this).children().removeClass('fa-angle-up');
    }
  })

  // 销量排序
  $('.order-stock').on('tap', function () {
    $('.search-result-order a').removeClass('active');
    $(this).addClass('active');
    if (judge) {
      // 升序
      getSearchListData(1, null, 1);
      judge = false;
      $(this).children().addClass('fa-angle-up');
      $(this).children().removeClass('fa-angle-down');
    } else {
      // 降序
      getSearchListData(1, null, 1);
      judge = true;
      $(this).children().addClass('fa-angle-down');
      $(this).children().removeClass('fa-angle-up');
    }
  })

  // 点击进入商品详情页
  $('.search-result-list').on('tap', 'button', function () {
    var id = $(this).data('id');
    location.href = './detail.html?id=' + id;
  })
  
})


/**
 * 
 * @param {*} pageNum 当前页数
 * @param {*} price 产品价格
 * @param {*} num 产品库存
 */
var getSearchListData = function (pageNum, price, num) {
  // 获取整个url  location.search
  var url = new URLSearchParams(location.search);
  // 获取url中的参数 使用get获取指定的url参数
  var proName = url.get('proName');
  // 发送ajax请求
  $.ajax({
    type: 'get',
    url: '/product/queryProduct',
    data: {
      proName: proName || '', // 产品名称
      page: pageNum || 1, // 目前的页数
      pageSize: 6, // 每页显示的条数
      price: price || null, // 价格
      num: num || 2 // 库存
    },
    success: function (data) {
      var searchList = template('searchLishtTemplate', data);
      $('.search-result-list').html(searchList);
    }
  })
}