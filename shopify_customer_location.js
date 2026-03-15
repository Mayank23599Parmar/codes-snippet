get shopify customer location and region 
window.Shopify.loadFeatures(
  [
    {
      name: "consent-tracking-api",
      version: "0.1",
    },
  ],
  async (error) => {
    if (error) {
      console.error("Consent API failed to load", error);
      return;
    }

    const region = await window.Shopify?.customerPrivacy?.getRegion();
    console.log(region, "dddqfdqdq");
  }
);
