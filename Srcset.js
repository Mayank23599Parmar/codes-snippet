import React from 'react';
import lazyload from './lazyload'
class Srcset extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { parentWidth: null };
  }
  imgURL = (src, size) => {
    try {
      return src
        .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
          return '_' + size + match;
        });
    }
    catch (e) {
      return src;
    }
  }
  setcallBack = (e) =>{
    if(!cn(this.props.callBack)){
      this.props.callBack(e);
    }
  }
  render() {
    let { src, alt, callBack, className, ...otherProps } = this.props;
    if (!src) {
      src = "https://cdn.shopify.com/s/files/1/0058/1402/6322/t/1/assets/no-image.png?1522";
    }
    let srcset = "";
    let srcsetArray = [180, 360, 480, 765, 900, 1000, 1200, 1500, 1900];
    srcsetArray = srcsetArray.map(srcNo => {
      srcset = `${srcset} ${this.imgURL(src, `${srcNo}x`)} ${srcNo}w,`;
      return src;
    });
    return (
      <img src={this.imgURL(src, "30x")}
        data-srcset={srcset}
        data-sizes="auto"
        className={`lazyload ${className}`} alt={alt} {...otherProps}
        ref={this.myRef}
        onLoad={(e) => this.setcallBack(e)}
        ></img>
    )
  }
}
export default Srcset;
