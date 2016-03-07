/**
 * @desc 电影列表
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');
var Link = require('react-router').Link;
// var MovieHeader = require('./components/.jsx');

var MovieInfo = React.createClass({
  propTypes: {
    // width: React.PropTypes.number.isRequired
    // imageUrl: React.PropTypes.string.isRequired,
    // title: React.PropTypes.string.isRequired
  },

  loadMovieInfo: function(id) {
    var _this = this;
    // TODO: 显示电影详情
    this.el.classList.add('info-into');

    $.ajax({
      url: 'https://api.douban.com/v2/movie/subject/'+id,
      dataType: 'jsonp',
      type: 'get',
      jsonp: 'callback',
      data: {apikey:'0c9ca568e0e58e2025d5f03aa2b0aa60'}, 
      cache: false,
      success: function(json) {
         if (json) {
          var data = json;

          // this.formatData(data);
          this.setState({data: data});   
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('', status, err.toString());
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
    this.el = document.getElementById('J_container');
    return {data: {images: { large: ''}}};
  },

  componentDidMount: function() {
    var id = this.props.params.id;
    this.loadMovieInfo(id);
    this.el.addEventListener('touchstart', this, false);
    $('#J_video').attr('src', 'http://vt3.douban.com/201602200921/f75dc84e00b2d97289d0a842ffec22db/view/movie/M/301040427.mp4');
  },

  componentWillUnmount: function() {
    this.el.removeEventListener('touchmove', this, false);
  },

  componentWillReceiveProps(nextProps) {
    var id = nextProps.params.id;
    this.loadMovieInfo(id);
  },

  // EVEVNT

  handleEvent: function(event) {
    var _this = this;

    if(event.type == 'touchstart') {
      _this.start(event);
    } else if(event.type == 'touchmove') {
      _this.move(event);
    } else if(event.type == 'touchend') {
       _this.end(event);
    }
  },

  // 滑动开始
  start: function(event) {
    if(!event.touches || event.touches.length < 1) return;
    // TODO 有浏览器 只触发一次 touchmove
    // /^(?:INPUT|SELECT|TEXTAREA|A)$/.test( event.target.tagName ) || event.preventDefault();
    // event.preventDefault();
    
    this.isMoving = true;
    this.sWidth = $(document.body).width();
    this.startTime = new Date().getTime();
    this.startX = event.touches[0].pageX || event.targetTouches[0].pageX;
    this.startY = event.touches[0].pageY || event.targetTouches[0].pageY;
    this.supportAnimations = vendor;

    // 绑定事件
    var infoContent = this.el;
    infoContent.addEventListener('touchmove', this, false );
    infoContent.addEventListener('touchend', this, false );
  },

  // 移动
  move: function(event) {
    if (!event.touches || event.touches.length < 1) return;
    
    if (this.isMoving && this.supportAnimations !== false ) {
      var offset = {
        X: event.targetTouches[0].pageX - this.startX,
        Y: event.targetTouches[0].pageY - this.startY
      };
      
      // TODO: 向右滑动
      if ( Math.abs(offset['X']) - Math.abs(offset['Y']) > 10 && offset['X'] > 0 ) {
        event.preventDefault();
        var sWidth = this.sWidth;
        var containerEl = this.el;          
        var transitionName = css3TransNames.transition;
        var transformName = css3TransNames.transform;
        
        var x = offset['X'] - sWidth; // containerEl.clientWidth
        containerEl.style[transitionName] = 'all 0s';
        containerEl.style[transformName] = 'translateX('+ x +'px)';
      }

      // 上下滑动方案 dom.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
      this.offset = offset;
    }
  },

  // 滑动释放
  end: function( event ) {
    if ( !event.touches ) return;
    
    var _this = this;
    this.isMoving = false;
    var offset = this.offset;
    var boundary = 150;
    //var endTime = new Date().getTime();

    // a quick slide time must under 300ms
    // a quick slide should also slide at least 14 px
    // boundary = endTime - this.startTime > 300 ? boundary : 14;
    var absOffset = Math.abs(offset['X']);
    var absReverseOffset = Math.abs(offset['Y']);

    var containerEl = _this.el;
    var transitionName = css3TransNames.transition;
    var transformName = css3TransNames.transform;

    // TODO 左右滑动
    if (this.supportAnimations!== false && offset['X'] >= boundary && absReverseOffset < absOffset) {
      containerEl.style[transitionName] = 'all 0.2s';;
      containerEl.style[transformName] = 'translateX(10%)';

      setTimeout( function() {
        _this.back();

        containerEl.style[transitionName] = '';
        containerEl.style[transformName] = '';
      }, 200);
    } else {
      containerEl.style[transitionName] = '';
      containerEl.style[transformName] = '';
    }

    this.offset.X = this.offset.Y = 0;

    // 解绑事件
    containerEl.removeEventListener( 'touchmove', this, false );
    containerEl.removeEventListener( 'touchend', this, false );
  },

  // 返回电影列表
  back: function(){
     this.el.classList.remove('info-into');
  },

  render: function () {
    // mui-table-view mui-table-view-chevron onTouchMove={this.handleScroll}
    // <span className="fr star"><span class="star50"></span>{this.props.rating.average}</span>
    // poster={this.state.data.images.large}

    return (
      <section>
      <nav className="top_navgination clearfix">
        <a href="javascript:;" className="fl back J_movie_back" onClick={this.back}><i className="arror_left"></i></a>
        <h1 className="top_title txt_cut">电影介绍</h1>
      </nav>
      <div className="info-banner"><img width="100%" src={this.state.data.images.large} className="" /></div>
      <div className="artical_cont mb60">
        <header className="info_title information_title clearfix">
          <h2><a href={this.state.data.mobile_url}>{this.state.data.title}</a></h2>
        </header>
        <article className="info_detail">{this.state.data.summary}</article>
        <video id="J_video" width="100%" src="http://vt3.douban.com/201602131838/3de37daa4b249e3fb9d5a499ff522337/view/movie/M/301080756.mp4" 
             controls="controls" autobuffer>
        </video>
      </div>
      </section>
    );
  },

  getStyle: function () {
    return {
      width: '100%'
    };
  }

});

module.exports = MovieInfo;