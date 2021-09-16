import React from 'react';
import {handleize, queryStringVariant} from '../components/Helper';
class VariantSelector extends React.Component{
    
    checkVariantType = (name) => {
        let handleName = handleize(name);
        let type = "";
        if (handleName == "color" || handleName == "colour") {
          type = "color";
        } else {
          type = "normal";
        }
        return type;
    };
    findVariantImages = title =>{
      let {variantImages} = this.props;
      if(variantImages){
        let vimg = variantImages.filter((image) => image.title == title );
          if(vimg.length>0){
              return vimg[0].vimg; 
        }else{
            return null;
        }
      }
       return null; 
    }
    handleVariant = variant =>{
        let {setSelectedVariant,changeUrl} = this.props;
        console.log("object");
        setSelectedVariant(variant);
        if(true){
          queryStringVariant(variant);
        }
        if(this.props.callback){
          this.props.callback();
        }
    }
    render (){
      const {variant} = this.props;
      console.log(variant,'variantvariant');
      if(cn(variant)){
        return null;
      }
      const {option,selectedVariant,variantImages,setSelectedVariant} = this.props;
      // let vimg = this.findVariantImages(variant.title);
      let vimg = `https://cdn.shopify.com/s/files/1/0997/6284/files/${handleize(variant.title)}.png`;
      let Style = {}
      if(this.checkVariantType(option) === "color" && vimg){
        Style = {backgroundImage: `url(${vimg})`};
      }
      
      return(
        <li data-value={handleize(variant.title)} 
            onClick={()=>{ this.handleVariant(variant) }}
                  className={`swatch-element ${this.checkVariantType(option)} 
                  ${handleize(variant.title)} 
                  ${selectedVariant.id === variant.id ? 'active' : ''} ${!variant.available ? 'variant-soldout' : ''}`}>
                  <span className="variant-title variant-title-hidden">{variant.title}</span>
                  <label className="swatch-label" style={Style}>
                    <span>{variant.title}</span>
                  </label>
        </li>
    );
  }
}
export default VariantSelector;
