// Function to get cookie by name
function getCartTokenCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
export const getcartId = () => {
    const cartToken = getCartTokenCookie('cart');
    if (cartToken) {
            return `gid://shopify/Cart/${cartToken}`;
    }
    return null
}

const cartDiscountCodesUpdate=`mutation MyMutation {
  cartDiscountCodesUpdate(
    cartId: "gid://shopify/Cart/CART_ID"
    discountCodes: "x123"
  ) {
    userErrors {
      code
      field
      message
    }
    cart {
      checkoutUrl
      discountCodes {
        applicable
        code
      }
    }
  }
}`
