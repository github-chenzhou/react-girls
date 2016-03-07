/**
 * @desc 电影列表
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');

var Header = React.createClass({
  propTypes: {
  },

  getInitialState: function() {
    return {keyword: []};
  },

  componentDidMount: function() {
     this.el = document.getElementById('J_container');
  },

  componentWillUnmount: function() {
  },

  render: function () {
    return (
      <header className="top_navgination mui-bar-nav clearfix">
        <a href="javascript:;" className="mui-icon mui-icon-bars mui-pull-left" onClick={this.showNav}></a>
        <h1 className="top_title">{this.props.title}</h1>
      </header>
    );
  },

  showNav: function(){
    this.el.classList.toggle('nav-in');
  },

  getStyle: function () {
    return {
      width: this.props.width,
      backgroundColor: '#eee'
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

module.exports = Header;