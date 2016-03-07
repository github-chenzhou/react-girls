/**
 * @desc 图书详情
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Book = React.createClass({
  propTypes: {
    // width: React.PropTypes.number.isRequired
    // height: React.PropTypes.number.isRequired,
    // imageUrl: React.PropTypes.string.isRequired,
    // title: React.PropTypes.string.isRequired
  },

  loadMovieInfo: function(id) {
    var _this = this;
    // TODO: 显示电影详情
    this.el.classList.add('info-into');

    $.ajax({
      url: 'https://api.douban.com/v2/book/'+id,
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

  getInitialState: function() {
    this.el = document.getElementById('J_container');
    return {data: {images: { large: ''}}};
  },

  componentDidMount: function() {
    var id = this.props.params.id;
    this.loadMovieInfo(id);
    this.el.addEventListener('touchstart', this, false);
  },

  componentWillUnmount: function() {
    this.el.removeEventListener('touchstart', this, false);
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
    return (
      <section id="J_book_info">
      <nav className="top_navgination clearfix">
        <a href="javascript:;" className="fl back J_movie_back" onClick={this.back}><i className="arror_left"></i></a>
        <h1 className="top_title txt_cut">图书介绍</h1>
      </nav>
      <div className="info-banner"><img width="100%" src={this.state.data.images["large"]} className="" /></div>
      <div className="artical_cont mb60">
        <header className="info_title information_title clearfix">
          <h2><a href={this.state.data.mobile_url}>{this.state.data.title}</a></h2>
        </header>
        <article className="info_detail">{this.state.data.summary}</article>
        <article className="info_detail">{this.state.data.catalog}</article>
        <article className="info_detail">{this.state.data.author_intro}</article>
      </div>
      </section>
    );
  }

});

module.exports = Book;