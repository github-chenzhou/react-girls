/**
 * @desc 图书列表项
 * @author 陈舟
 * @date 2016.2.14
*/

'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Bookitem = React.createClass({

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
    var href = '/book/' + this.props.id;

    return (
      <li className="book_box">
        <span className="pic_wrap">
          <Link to={`/book/${this.props.id}`}><img src={this.props.images["large"]}/></Link>
          <i className="valign"></i>
        </span>
        <p className="title"><a href={href}>{this.props.title}</a></p>
      </li>
    );
  },

  getStyle: function () {
    return {
      width: this.props.width,
      height: Item.getItemHeight(),
      backgroundColor: (this.props.itemIndex % 2) ? '#eee' : '#a5d2ee'
    };
  }

});

module.exports = Bookitem;