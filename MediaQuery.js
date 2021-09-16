import React from 'react';
import Media from 'react-media';
class MediaQuery extends React.Component {
  render() {
    const { query, ...otherPorps } = this.props;
    let finalQuery;
    switch (query) {
      case "phone":
        finalQuery = "screen and (max-width: 767px)";
        break;
      case "phone-portrait":
        finalQuery = "screen and (max-width: 551px)";
        break;
      case "phone-landscape":
        finalQuery = "screen and (min-width: 552px) and (max-width: 767px)";
        break;
      case "tablet":
        finalQuery = "screen and (min-width: 768px) and (max-width: 1024px)";
        break;
      case "phone-and-tablet":
        finalQuery = "screen and (max-width: 1024px)";
        break;
      case "tablet-and-up":
        finalQuery = "screen and (min-width: 768px)";
        break;
      case "tablet-portrait":
        finalQuery = "screen and (min-width: 768px) and (max-width: 991px)";
        break;
      case "tablet-landscape":
        finalQuery = "screen and (min-width: 992px) and (max-width: 1024px)";
        break;
      case "lap":
        finalQuery = "(min-width: 1025px) and (max-width: 1199px)";
        break;
      case "lap-and-below":
        finalQuery = "screen and (max-width: 1199px)";
        break;
      case "lap-and-up":
        finalQuery = "screen and (min-width: 1025px)";
        break;
      case "desk-and-up":
        finalQuery = "screen and (min-width: 1200px)";
        break;
      case "large-desk-and-up":
        finalQuery = "screen and (min-width: 1400px)";
        break;
      case "lap-and-desk":
        finalQuery = "screen and (min-width: 1025px) and (max-width: 1679px)";
        break;
      default:
        break;
    }
    return (
      <Media query={finalQuery} {...otherPorps} render={() => (
        this.props.children
      )}
      />
    )
  }
}
export default MediaQuery;
