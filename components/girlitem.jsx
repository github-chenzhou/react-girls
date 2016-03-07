/**
 * @desc girl列表项
 * @author 陈舟
 * @date 2016.2.14
*/

'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Girlitem = React.createClass({

  propTypes: {
    // id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  },

  statics: {
    getItemHeight: function () {
      return 80;
    }
  },

  handleClick: function(){

  },

  render: function () {
    var href = '/book/';

    return (
      <li className="book_box">
        <span className="pic_wrap">
          <img src={this.props.src}/>
          <i className="valign"></i>
        </span>
        <p className="title"><a href={href}>{this.props.title}</a></p>
      </li>
    );
  }

});

module.exports = Girlitem;