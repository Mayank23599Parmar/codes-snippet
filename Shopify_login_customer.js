// Note: dont use shopify defualt login page create custom login form if we use shopify defualt login page then we have to pass recaptcha_token which is not feasible
async function shopify_user_login(params) {
    const loginFormData = new FormData();
    loginFormData.append("form_type","customer_login")
    loginFormData.append("utf8","✓")
    loginFormData.append("customer[email]","user_email")
    loginFormData.append("customer[password]","user_password")
    loginFormData.append("return_url","return_url")
    const login=await fetch('/account/login',{
        method: 'POST',
        body:loginFormData
    })
  
     //   API responce have text method which give html page where we mention in return URL
    //   also give return url for redirection
    // responce: {
    //     text: ƒ (),
    //     ok: true,
    //     redirected: true,
    //     status: 200,
    //     url: "return_url"
    // }
}
