var Multipassify = require('multipassify');
 
// Construct the Multipassify encoder
var multipassify = new Multipassify("Shopify multipass token"); // get for shopify setting customer account

// Create your customer data hash
var customerData = { email: 'user email', first_name : "user first name", return_to:"https://xyz.com"};

// Encode a Multipass token
// var token = multipassify.encode(customerData);

// Generate a Shopify multipass URL to your shop
var url = multipassify.generateUrl(customerData, "Your shop url without https");
console.log(url)

// if user is already created then simply login through this url or if user is not created then user is created and then login 
