import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class UrlSet extends Component {
  render() {
    let { nonReact, href, ...otherPorps } = this.props;
    if(href){
      if(href.includes('http')){
        nonReact = true;
      }
      if(simply.template == 'customers/login' || simply.template == 'gift_card' ){
        nonReact = true;
      }
    }else if(href == null){
        href ="";
    }
    if (nonReact) {
      return (<a href={href} {...otherPorps} >{this.props.children}</a>)
    }
    return (<Link to={href} {...otherPorps} data-react='true'>{this.props.children}</Link>)
  }
}
export default UrlSet;
