// ================= Bundle product Query Start ==================
const BundleProductQuery=`query Input {
  cart {
    lines {
      id
      quantity
         merchandise {
        __typename
        ... on ProductVariant {
          id
        }
      }
     timestamp: attribute(key: "_timestamp"){
        key,
        value
      }
       master_product_id: attribute(key: "_master_product_id"){
        key,
        value
      }  
          master_product: attribute(key: "_master_product"){
        key,
        value
      }  
     child_product: attribute(key: "_child_product"){
        key,
        value
      }
      bundle_product: attribute(key: "_bundle_product"){
        key,
        value
      }
    }
  }
}`
// ================= Bundle product Query END ==================

// ================================================================
// ================= Bundle product Cart transform Logic Start ==================
// @ts-check

/*
A straightforward example of a function that expands a bundle into its component parts.
The parts of a bundle are stored in a metafield on the product parent value with a specific format,
specifying each part's quantity and variant.

The function reads the cart. Any item containing the metafield that specifies the bundle parts
will return an Expand operation containing the parts.
*/

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionResult}
 */
const NO_CHANGES = {
  operations: [],
};

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */

(input) => {
  const acc={}
    const output = []
    const cartLines=input.cart.lines
    for (let index = 0; index < cartLines.length; index++) {
      const line = cartLines[index];
      const bundleProductExist=line?.bundle_product?.value;
      const parentVariantId = line?.master_product_id?.value;
      const productTimeStamp=line?.timestamp?.value
       if(bundleProductExist){
    // Check if the master product ID already exists in the accumulator
    if (acc[productTimeStamp]) {
      acc[productTimeStamp].cartLines.push({
        cartLineId:line.id,
        quantity:line.quantity
      });
    } else {
      // If it doesn't exist, create a new entry
      acc[productTimeStamp] = {
        parentVariantId : parentVariantId,
        cartLines : [{  cartLineId:line.id,
          quantity:line.quantity}],
        productTimeStamp:productTimeStamp
      };
    }
       }
    }
    
    if(Object.keys(acc).length > 0 && acc.constructor === Object){
      for (const [key, value] of Object.entries(acc)) {
       const {parentVariantId,cartLines,title}=value
          output.push({merge :{
            title,
            parentVariantId,
            cartLines
          }})   
      }
    }
   return {
    operations:output
   }
};

// ================= Bundle product Cart transform Logic END ==================
