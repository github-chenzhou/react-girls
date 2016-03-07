/**
 * @desc 电影列表项 图片组件
 * @author 陈舟
 * @date 2016.2.5
*/

'use strict';

var React = require('react');

var Itemimgs = React.createClass({
  render: function () {
    var imgs = this.props.imgs;

    return (
      <section className="feed_cont">
        <div className="feed_pic">
        <ul className="feed_pic_list">
          {imgs.map(function(src, i) {
            if(i < 4){
              return (
                <li key={i}>
                  <span className="pic_wrap">
                    <img src={src} className="J_feed_img" data-src={src} onLoad={this.load} />
                    <i className="valign"></i>
                  </span>
                </li>
              );
            }
          }, this)}
        </ul>
        </div>
      </section>
    );
  },

  load: function(evt){
    var imgEl = $(evt.target);

    var standardRatio = 5.25 / 7;
    var fixWidth = lib && lib.flexible && lib.flexible.rem2px(7) || 212;
    var fixHeight = lib && lib.flexible && lib.flexible.rem2px(5.25) || 159;

    var width = imgEl.width() || fixWidth;
    var height = imgEl.height() || fixHeight;
    var origiRatio = height / width;

    // 特别小的图标
    if ( width < 100 && height < 100 ) {
      imgEl.attr('width', width).attr('height', height);
    } else if ( standardRatio < origiRatio ) {
      // 高比较大
      var reHeight =  fixWidth * height / width;
      imgEl.attr( 'width', fixWidth);
      imgEl.attr('height', reHeight );
    } else if ( origiRatio < standardRatio ) {
      // 宽大很多
      var reWidth = fixHeight * width / height;
      var marginLeft = (fixWidth - reWidth) / 2;

      imgEl.attr('height', fixHeight );
      imgEl.attr('width', reWidth);
      imgEl.css('marginLeft', marginLeft );
    } else {
      // 宽 高 相似
      imgEl.attr('width', fixWidth);
      imgEl.attr('height', fixHeight );
    }
  }

});

module.exports = Itemimgs;