/**
 * @desc 电影列表
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');
var MovieHeader = require('./header.jsx');
var Movieitem = require('./movieitem.jsx');

var Movies = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired
    // height: React.PropTypes.number.isRequired,
    // imageUrl: React.PropTypes.string.isRequired,
    // title: React.PropTypes.string.isRequired
  },

  loadMoviesFromServer: function(pageNo) {
    var _this = this;
    var start = pageNo * 10;

    this.pageNo = pageNo;

    $.ajax({
      url: this.props.url,
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
        console.error(this.props.url, status, err.toString());
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
    this.el = document.getElementById('J_movies_area');
    // this.el && this.el.addEventListener('scroll', this.handleScroll);
    // document.addEventListener('scroll', this.handleScroll);
  },

  componentWillUnmount: function() {
    this.el.removeEventListener('touchmove', this.handleScroll);
  },

  handleScroll: function(evt) {
    var el = this.el;

    if (el.scrollHeight - el.clientHeight - el.scrollTop < 500) {
      this.pageNo = this.pageNo + 1;
      this.loadMoviesFromServer(this.pageNo);
    }
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
    
    // mui-table-view mui-table-view-chevron onTouchMove={this.handleScroll}
    return (
      <div className="mui-inner-wrap">
      <MovieHeader title="电影列表" />
      <section id='J_movies_area' className="view now mui-content J_index_list" onTouchMove={this.handleScroll}>
        <section id='J_movies' className="feed_list">
          {items}
        </section>
      </section>
      </div>
    );
  },

  getStyle: function () {
    return {
      width: this.props.width,
      height: Movieitem.getItemHeight(),
      backgroundColor: (this.props.itemIndex % 2) ? '#eee' : '#a5d2ee'
    };
  },

  getImageStyle: function () {
    return {
      top: 10,
      left: 10,
      width: 60,
      height: 60,
      backgroundColor: '#ddd',
      borderColor: '#999',
      borderWidth: 1
    };
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

module.exports = Movies;