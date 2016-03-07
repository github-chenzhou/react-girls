/**
 * @desc 电影列表
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var MovieHeader = require('../components/header.jsx');
var Bookitem = require('../components/bookitem.jsx');

var Books = React.createClass({
  propTypes: {
    // width: React.PropTypes.number.isRequired
  },

  getBooks: function(pageNo) {
    var _this = this;
    var start = pageNo * 10;

    this.pageNo = pageNo;

    $.ajax({
      url: 'https://api.douban.com/v2/book/search',
      dataType: 'jsonp',
      type: 'get',
      jsonp: 'callback',
      data: {'q': '', 'tag': '经典', 'start': start, 'count': 10, apikey:'0c9ca568e0e58e2025d5f03aa2b0aa60' }, 
      cache: false,
      success: function(json) {
        if (json) {
          var data = json.books;

          _.each(data, function(item, i){
            var img = new Image();
            img.src = item.images["large"];
          });

          this.renderItem(data);
          }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url||'', status, err);
      }.bind(this)
    });
  },
  

  getInitialState: function() {
    this.data = [];
    this.getBooks(0);
    return {data: [], column1: [], column2: []};
  },

  componentDidMount: function() {
    this.el = document.getElementById('J_books');
  },

  componentWillUnmount: function() {
    this.el.removeEventListener('touchmove', this.handleScroll);
  },

  handleEvent: function(event) {
    var _this = this;

    if (event.type == 'touchstart') {
      _this.start(event);
    } else if(event.type == 'touchmove') {
       _this.move(event);
    } else if(event.type == 'touchend') {
      _this.end(event);
    }
  },

  // 滑动开始
  start: function( event ) {
    if ( !event.touches || event.touches.length < 1) return;

    this.isMoving = true;
    this.startTime = new Date().getTime();
    this.startX = event.touches[0].pageX;
    this.startY = event.touches[0].pageY;

    // 绑定事件
    var Books = this.el;
    Books.addEventListener( 'touchmove', this, false );
    Books.addEventListener( 'touchend', this, false );
  },

  // 移动
  move: function(event) {
    if ( !event.touches || event.touches.length < 1) return;
    
    if (this.isMoving) {
      var offset = {
        X: event.touches[0].pageX - this.startX,
        Y: event.touches[0].pageY - this.startY
      };

      this.offset = offset;

      var xOffset = Math.abs(offset['X']) || 0;
      // 向下滑动 增加开关量 做限制
      if (!this.isLoading && offset['Y'] < 0  && Math.abs( offset['Y'] + xOffset ) > 10 ) {
        var wrapper = this.el;
        if(wrapper.scrollHeight - wrapper.clientHeight - wrapper.scrollTop < wrapper.clientHeight) {
          this.pageNo = this.pageNo + 1;
          this.getBooks(this.pageNo);
        }
      }
    }
  },

  // 滑动释放
  end: function( event ) {
    if ( !event.touches ) return;
    this.isMoving = false;

    var offset = this.offset;
    var endTime = new Date().getTime();

    // a quick slide time must under 300ms
    // a quick slide should also slide at least 14 px
    //var duration = endTime - this.startTime > 300;
    if(!offset) return this;

    var xOffset = Math.abs(offset['X']) || 0;

    // TODO: 向下滑动 增加开关量 做限制
    if (!this.isLoading && offset['Y'] < 0 && Math.abs( offset['Y'] + xOffset ) > 10) {
      var wrapper = this.el;

      if(wrapper.scrollHeight - wrapper.clientHeight - wrapper.scrollTop < wrapper.clientHeight) {
        // this.pageNo = this.pageNo + 1;
        // this.getBooks(this.pageNo);
      }
    }

    this.offset.X = this.offset.Y = 0;

    // 解绑事件
    var Books = this.el;
    Books.removeEventListener('touchmove', this, false);
    Books.removeEventListener('touchend', this, false);
  },

  renderItem: function(data) {
    var uls = $('#J_books ul');

    for(var i=0, len=data.length; i<len; i++){
      var item = data[i];
    
      uls[0].offsetHeight < uls[1].offsetHeight ? this.state.column1.push(item) : this.state.column2.push(item);

      this.setState({column1: this.state.column1, column2: this.state.column2}) 
    }
  },

  render: function () {
    var column1 = this.state.column1.map(function (item, i) {
      return (
        <Bookitem 
          id={item.id} 
          title={item.title} 
          images={item.images} key={i}>
        </Bookitem>
      );
    });

    var column2 = this.state.column2.map(function (item, i) {
      return (
        <Bookitem 
          id={item.id} 
          title={item.title} 
          images={item.images} key={i}>
        </Bookitem>
      );
    });
    
    // onTouchMove={this.handleScroll}
    return (
      <div>
      <MovieHeader title="图书" />
      <section id='J_books' className="list" onTouchStart={this.start}>
        <ul id='J_books_left' className="books books-left ">{column1}</ul>
        <ul id='J_books_right' className="books books-right ">{column2}</ul>
      </section>
      </div>
    );
  },

  getTitleStyle: function () {
    return {
      top: 32,
      left: 80,
      width: this.props.width - 90,
      height: 18,
      fontSize: 14,
      lineHeight: 18
    };
  }

});

module.exports = Books;