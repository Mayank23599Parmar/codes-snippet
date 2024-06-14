// Function to get cookie by name
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Get the cart ID from the cookie
let cartToken = getCookie('cart');  // replace 'cart' with the actual cookie name

if (cartToken) {
    // Extract the cart ID without the key
    let cartId = cartId.split('?')[0];
    // Create the GID string
    let gidCartId = `gid://shopify/Cart/${extractedCartId}`;
    console.log('GID for Cart:', gidCartId);
} else {
    console.log('Cart ID not found in cookies');
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
