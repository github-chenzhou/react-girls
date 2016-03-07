/**
 * @desc 电影列表
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');
var MovieHeader = require('../components/header.jsx');
var Movieitem = require('../components/movieitem.jsx');

var Movies = React.createClass({
  propTypes: {
    // width: React.PropTypes.number.isRequired
    // height: React.PropTypes.number.isRequired,
    // imageUrl: React.PropTypes.string.isRequired,
    // title: React.PropTypes.string.isRequired
  },

  loadMoviesFromServer: function(pageNo) {
    var _this = this;
    var start = pageNo * 10;

    this.pageNo = pageNo;

    $.ajax({
      url: this.props.url || 'https://api.douban.com/v2/movie/search',
      dataType: 'jsonp',
      type: 'get',
      jsonp: 'callback',
      data: {'q': '', 'tag': '经典', 'start': start, 'count': 10, apikey:'0c9ca568e0e58e2025d5f03aa2b0aa60' }, 
      cache: false,
      success: function(json) {
         if (json.count) {
          var data = json.subjects;

          this.formatData(data);
          this.setState({data: this.state.data.concat(data)});        
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url||'', status, err);
      }.bind(this)
    });
  },
   
  formatData: function (data) {
    var _this = this;
    
    _.each(data, function ( obj, index ) {
      // 图片列表 人员列表：导演 主演
      var imgs = [];
      var actors = [];

      // 剧照
      obj.images && obj.images['large'] && imgs.push(obj.images['large']);
      // 导演 
      if( obj.directors && obj.directors.length > 0 ){
        _.each( obj.directors, function ( director, index ) {
          director.name && actors.push( director.name );
          director.avatars && imgs.push( director.avatars[ 'large' ] );
        });
      }

      if( obj.casts && obj.casts.length > 0 ) {
        _.each( obj.casts, function ( cast, index ) {
          cast.name && actors.push( cast.name );
          cast.avatars && imgs.push( cast.avatars[ 'large' ]);
        });
      }

      obj.actors = actors;
      obj.imgs = imgs;
    });
  },

  getInitialState: function() {
    this.loadMoviesFromServer(0);
    return {data: []};
  },

  componentDidMount: function() {
    this.el = document.getElementById('J_movies_list');
  },

  componentWillUnmount: function() {
  },

  handleEvent: function (event) {
    var _this = this;

    if(event.type == 'touchstart') {
       _this.start(event);
    } else if (event.type == 'touchmove') {
      _this.move(event);
    } else if (event.type == 'touchend') {
      _this.end(event);
    }
  },

  // 滑动开始
  start: function (event) {
    if (!event.touches || event.touches.length < 1) return;

    this.isMoving = true;
    this.startTime = new Date().getTime();
    this.startX = event.touches[0].pageX;
    this.startY = event.touches[0].pageY;

    // 绑定事件
    var movies = this.el;
    movies.addEventListener('touchmove', this, false);
    movies.addEventListener('touchend', this, false);
  },

  // 移动
  move: function (event) {
    if (!event.touches || event.touches.length < 1) return;
    
    if (this.isMoving) {
      var offset = {
        X: event.touches[0].pageX - this.startX,
        Y: event.touches[0].pageY - this.startY
      };

      this.offset = offset;
    }
  },

  // 滑动释放
  end: function (event) {
    if (!event.touches) return;

    this.isMoving = false;
    var offset = this.offset;
    var boundary = 100;
    var endTime = new Date().getTime();

    // a quick slide time must under 300ms
    // a quick slide should also slide at least 14 px
    //var duration = endTime - this.startTime > 300;
    if (!offset) return this;
    var xOffset = offset && Math.abs(offset['X']) || 0;

    // TODO: 向下滑动 增加开关量 做限制
    if (!this.isLoading && offset['Y'] < 0 && Math.abs(offset['Y'] + xOffset) > 10) {
      var wrapper = this.el;
      if (wrapper.scrollHeight - wrapper.clientHeight - wrapper.scrollTop < 500) {
        this.pageNo = this.pageNo + 1;
        this.loadMoviesFromServer(this.pageNo);
      }
    } 

    this.offset.X = this.offset.Y = 0;

    // 解绑事件
    var movies = this.el;
    movies.removeEventListener('touchmove', this, false);
    movies.removeEventListener('touchend', this, false);
  },

  render: function () {
    var items = this.state.data.map(function (item, i) {
      return (
        <Movieitem 
          rating={item.rating} 
          id={item.id} 
          title={item.title} 
          genres={item.genres} 
          actors={item.actors} 
          imgs={item.imgs} collect_count={item.collect_count} key={i}>
        </Movieitem>
      );
    });
    
    return (
      <div>
      <MovieHeader title="电影列表" />
      <section id='J_movies_list' className="list" onTouchStart={this.start}>
        <section id='J_movies' className="feed_list">
          {items}
        </section>
      </section>
      </div>
    );
  }
  

});

module.exports = Movies;