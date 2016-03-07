/**
 * @desc 图书列表项
 * @author 陈舟
 * @date 2016.2.14
*/

'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Dailyitem = React.createClass({

  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  },

  render: function () {
  
    return (
      <div className="daily-item-wrap">
        <div className="daily-item-box">
        <Link to={`/daily/${this.props.id}`}>
          <img src={this.props.image} className="preview-image" />
          <span className="daily-item-title">{this.props.title}</span>
        </Link>
        </div>
      </div>
    );
  }

});

module.exports = Dailyitem;