// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const  lines= input?.cart?.lines
  const excludedMethods = new Set(["Apple Pay", "Google Pay", "Shop Pay", "Shop Pay Installments","Paypal Pay","Paypal"])
  const hidePaymentMethods=[]
  const paymentMethods=input?.paymentMethods
  let checkLineItemshasGiftCard=false;
  if(lines?.length > 0){
    for (let i = 0; i < lines.length; i++) {
       const line=  lines[i];
       const productType = line?.merchandise?.product?.productType
       if(productType == "Gift Card" || productType == "Spa Day"  ){
         checkLineItemshasGiftCard=true
       }
  }
  }  
  if(checkLineItemshasGiftCard && paymentMethods?.length > 0){
    for (var i = 0; i < paymentMethods.length; i++) {
      const method= paymentMethods[i]
      if( excludedMethods.has(method?.name)){
        hidePaymentMethods.push(    {
        hide: {
          paymentMethodId: method?.id
        }
      })
      }
    }
  }
  if(hidePaymentMethods?.length > 0){
    return {
      operations:hidePaymentMethods
    }
  }
  return NO_CHANGES
}
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Enable patament custimization function mutation 
================================================================================================
  mutation {
  paymentCustomizationCreate(
    paymentCustomization: {title: "Hide Payment Mehod, enabled: true, functionId: "xxxxxxxxxxxxxxxxxxxxxxxxxxx"}
  ) {
    paymentCustomization {
      id
    }
    userErrors {
      message
    }
  }
}
