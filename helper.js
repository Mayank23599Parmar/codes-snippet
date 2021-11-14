// import { singleAddToCart } from '../shopify/AddtoCart';
// import { setSideCartToggle } from '../redux/cart/cartAction';
import { store } from '../redux/store';
import { setLoader } from '../redux/shop/shopAction';
import toast from "toasted-notes";
// import { scroller } from "react-scroll";
export const checkErrorPage = url =>{
  const http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  if (http.status === 404) {
    return true;
  }else{
    return false;
  }
}
export const getHeaderHeight = () =>{
    let topBarHeight = 0,HeaderHeight = 0, finalHeight = 0;

    if(document.getElementById('Topbar')){
      topBarHeight = document.getElementById('Topbar').clientHeight;
    }
    if(document.getElementById('mainHeader')){
      HeaderHeight = document.getElementById('mainHeader').clientHeight;
    }
    finalHeight = topBarHeight + HeaderHeight;
    return finalHeight;
}

export const manageHeight = (selector) =>{
  var max = 0;
  selector.forEach((el)=>{
      if (el.offsetHeight > max) {
        max = el.offsetHeight;
      }
    }
  );
  return max;
}

export const replaceAll = (string, search, replace)=> {
  return string.split(search).join(replace);
}
export const fetchProductTitle = tags =>{
  let title = tags.find((tag) => tag.includes('title_'));
  if(title){
    // title = title.replace('_sms-ct-','');
    // title = title.replace('_','');
    // title = title.replace('-',' ').replace('-',' ').replace('-',' ');
    title = title.replace('title_','');
  }
  return title;
}

export const isGift = tags =>{
  let hasGiftWrap = tags.find((tag)=>tag.includes('gift_wrap'));
  if (hasGiftWrap){
    return true;
  }
}

export const needWrapper = ids =>{
  let isGiftWrap = ids.find(id=>id === '39357298016343');
  if (isGiftWrap){
    return true;
  }
}

// export const openSideCart = () =>{
//   var root = document.getElementsByTagName( 'html' )[0];
//   root.classList.add('overflow-hidden');
//   document.body.classList.add("overflow-hidden");
//   store.dispatch(setSideCartToggle(true));
// }
export const closeSideCart = (callback) =>{
  var root = document.getElementsByTagName( 'html' )[0];
  root.classList.remove('overflow-hidden');
  document.body.classList.remove("overflow-hidden");
  // store.dispatch(setSideCartToggle(false));
}

export const closeAllDrawer = () =>{
  closeSideCart();
}

export const handleize = e => {
  return e.toLowerCase().replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "")
}

export const queryStringVariant = (variant) => {
    let value = variant.id
    let key = "variant";
    let uri = window.location.href;
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    let newUrl = "";
    if (uri.match(re)) {
      newUrl = uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      newUrl = uri + separator + key + "=" + value;
    }
    window.history.replaceState({}, document.title, newUrl);
}
export const dateFormatter = (createdAt) =>{
  const monthNames = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
  ];

  let date = new Date(createdAt);
  let orderDate = date.getDate();
  let orderMonth = monthNames[date.getMonth()];
  let orderYear = date.getFullYear();

  return `${orderMonth} ${orderDate}, ${orderYear}`;
 }

const showToast = (message,position="top") => {
  toast.notify(message, {
    position: position, // top-left, top, top-right, bottom-left, bottom, bottom-right
    duration: 2500, // null: notification will not automatically close
  });
};
const showCartPopUp = (message,position="top-right") => {
  toast.notify(message, {
    position: position, // top-left, top, top-right, bottom-left, bottom, bottom-right
    duration: 1500, // null: notification will not automatically close
  });
};

// global export on pdp
window.showToast = function (message) {
  showToast(message);
};

// global export on pdp
window.showCartPopUp = function (message) {
  showCartPopUp(message);
};


const productAddCallback = data => {
  showToast("Item(s) added successfully!")
}

const imgURL = (src, size) => {
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
const showFullLoading = action => {
  store.dispatch(setLoader(action));
}
const formatMoney = function (t, e = "₹ {{amount}}") {
  function o(t, e) {
    return void 0 === t ? e : t
  }
  function i(t, e, i, r) {
    e = o(e, 2);
    i = o(i, ",");
    r = o(r, ".");
    if (isNaN(t) || null == t)
      return 0;
    t = (t / 100).toFixed(e);
    var n = t.split(".");
    return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) + (n[1] ? r + n[1] : "")
  }
  "string" == typeof t && (t = t.replace(".", ""));
  var r = ""
    , n = /\{\{\s*(\w+)\s*\}\}/
    , a = e || this.money_format;
  switch (a.match(n)[1]) {
    case "amount":
      // r = i(t, 2);
      r = i(t, 0);
      break;
    case "amount_no_decimals":
      r = i(t, 0);
      break;
    case "amount_with_comma_separator":
      r = i(t, 2, ".", ",");
      break;
    case "amount_with_space_separator":
      r = i(t, 2, " ", ",");
      break;
    case "amount_with_period_and_space_separator":
      r = i(t, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      r = i(t, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      r = i(t, 0, " ");
      break;
    case "amount_with_apostrophe_separator":
      r = i(t, 2, "'", ".")
      break
    default:
      r = i(t, 2);
  }
  return a.replace(n, r)
}
const formatMoneyNew = function (t, e = "₹{{amount}}") {
  function o(t, e) {
    return void 0 === t ? e : t
  }
  function i(t, e, i, r) {
    e = o(e, 2);
    i = o(i, ",");
    r = o(r, ".");
    if (isNaN(t) || null == t)
      return 0;
    t = (t / 100).toFixed(e);
    var n = t.split(".");
    return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) + (n[1] ? r + n[1] : "")
  }
  "string" == typeof t && (t = t.replace(".", ""));
  var r = ""
    , n = /\{\{\s*(\w+)\s*\}\}/
    , a = e || this.money_format;
  switch (a.match(n)[1]) {
    case "amount":
      // r = i(t, 2);
      r = i(t, 0);
      break;
    case "amount_no_decimals":
      r = i(t, 0);
      break;
    case "amount_with_comma_separator":
      r = i(t, 2, ".", ",");
      break;
    case "amount_with_space_separator":
      r = i(t, 2, " ", ",");
      break;
    case "amount_with_period_and_space_separator":
      r = i(t, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      r = i(t, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      r = i(t, 0, " ");
      break;
    case "amount_with_apostrophe_separator":
      r = i(t, 2, "'", ".")
      break
    default:
      r = i(t, 2);
  }
  return a.replace(n, r)
}
const findMeta = (metas, namespace, key) => {
  const result = metas.find(meta => meta.namespace === namespace && meta.key === key);
  return result;
};
const AddItems = async (e, data) => {
  // let url = "/cart/add.js";
  // let button = e.currentTarget;
  // let result;

  // button.children[0].textContent = "Adding...";
  // try {
  //   result = await axios.post(url, { items: data });
  // } catch (error) {
  //   result = error;
  // }

  // button.children[0].textContent = button.children[0].getAttribute("data-text");

  // if (result) {
  //   return result;
  // }
};
// const openCartCallback = data => {
//   store.dispatch(setSideCartToggle(true));
// }
const goToCheckout = data => {
  showFullLoading(true);
  window.setTimeout(function () {
    window.location.href = "/checkout";
  }, 50);
  window.setTimeout(function () {
    showFullLoading(false);
  }, 8000);
}
const setProductAvailable = products => {
  products = products.map(product => { //set available product
    let available = product.variants.find(variant => variant.available);
    available ? (product.available = true) : (product.available = false)
    return product
  })
  return products;
}
const FilterAvailableProducts = products => {
  let filterProducts = setProductAvailable(products);
  filterProducts = filterProducts.filter(product => product.available);
  return filterProducts;
}
const changeRatingText = () => {
  const ratings = document.querySelectorAll(".stamped-badge-caption");
  ratings.forEach(function (item, index) {
    if (item.classList.contains('done')) {
      return false;
    }
    let rate_count = item.innerText;
    rate_count = `(${rate_count})`;
    item.innerText = rate_count;
    item.classList.add("done");
  })
}
const setCookie = (e, t, n) => {
  var i = new Date();
  i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3);
  var o = "expires=" + i.toUTCString();
  document.cookie = e + "=" + t + ";" + o + ";path=/"
}
const getCookie = e => {
  for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
    for (var o = n[i]; " " === o.charAt(0);)
      o = o.substring(1);
    if (0 === o.indexOf(t))
      return o.substring(t.length, o.length)
  }
  return ""
}
const findDiscount = (a,b) =>{
  let price = parseInt(a);
  let comparePrice = parseInt(b);
  let discount = ((comparePrice-price)/comparePrice)*100;
  return discount.toFixed();
}
const queryString = function() {
  var vars = {};
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    var hash = hashes[i].split('=');
    var obj = {};
    obj.name = decodeURI(hash[0]);
    obj.value = decodeURI(hash[1]);
    vars[obj.name] = obj;
  }
  return vars;
};
// Using razor pay on account page and product page for pre-order
const RazorPayHandle = ({key,order_id,amount,email,contact}) => {
    const options = {
      key,amount,currency: "INR",name: "Noise",description: "Test Transaction",
      image: "https://cdn.shopify.com/s/files/1/0997/6284/files/noise_icon_black_on_white.svg?v=1587630341",
      order_id,
      callback_url: "https://pre-order.gonoise.in/pre/order/callback",
      prefill: {
        email,
        contact,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#000000",
      },
    };
    let rzp1 = new Razorpay(options);
    rzp1.open();
}

const emailValidate = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
  return expression.test(String(email).toLowerCase())
}

const discountCalculator = (price,compare) =>{
    return `${parseInt(((compare - price) / compare)  * 100)}%`;
}
const saveCalculator = (price,compare) =>{
  let savePrice = parseInt((compare - price));
  savePrice = savePrice.toString().slice(0, -2);
  return `₹${savePrice}`;
}
// const scrollToElement = (element,duration = 800,type='easeInOutQuart') =>{
//     scroller.scrollTo(element, {
//       duration,
//       smooth: type,
//     });
// }

const reactShopifyAnalytics = ({pageType,resourceType,resourceId}) =>{
    try{
      let obj = {pageType};
      if(resourceType){
        obj['resourceType'] = resourceType
      }
      if(resourceId){
        obj['resourceId'] = resourceId
      }
      window.ShopifyAnalytics.lib.page(null,{obj});
    }catch(e){
      console.log(e);
    }
}
export const getProductData = async (handle) => {
  let url = window.location.origin + '/products/' + handle + '.json';
  let getProductData = await fetch(url);
  return await getProductData.json();
}

/* get Product metafields Data [Subtitle]*/
export const getProductMetaData = async (handle) => {
  let url = window.location.origin +'/products/' + handle + '?view=metafield';
  let getProductMetaData = await fetch(url);
  return await getProductMetaData.text();
}

/* Add to Cart */
export const addToCart = async (data, cb = undefined) => {
  let res = await fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  res = await res.json();

  if(cb){
    cb();
  }
}

e

export {
  imgURL,
  formatMoney,
  formatMoneyNew,
  findMeta,
  AddItems,
  setProductAvailable,
  FilterAvailableProducts,
  changeRatingText,
  setCookie,
  getCookie,
  // openCartCallback,
  goToCheckout,
  showFullLoading,
  showToast,
  showCartPopUp,
  productAddCallback,
  findDiscount,
  queryString,
  RazorPayHandle,
  emailValidate,
  discountCalculator,
  saveCalculator,
  reactShopifyAnalytics
  // scrollToElement,
getProductMetaData,
  getProductData

}
