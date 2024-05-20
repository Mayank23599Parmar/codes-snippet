/**
 * This function create and update shop metafield.
 *
 * @param {object} data - have secttion and metafield object as payload
 *  return metafield object
 */
async function manageShopMetaField(data) {
  try {
    const { session, payload } = data;
    const shop = session?.shop;
    const accessToken = session?.accessToken;
    const shopURL = `https://${shop}/admin/api/2024-04/metafields.json`;
    const entryConfig = {
      method: 'post',
      url: shopURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      data: payload,
    };

    const response = await axios.request(entryConfig);
    if (response?.status === 201) {
      const metafield = response?.data?.metafield;
      if (metafield?.admin_graphql_api_id) {
        return metafield;
      } else {
        throw new Error('Invalid metafield format in response');
      }
    } else {
      throw new Error(`Failed to create metafield. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating metafield:', error.message);
    return null; // Return null if an error occurs
  }
}
 const session = res.locals.shopify.session
  const data = {
    session,
    payload: {
      "metafield": {
        "namespace": "custom_fields",
        "key": "shop_description",
        "value": "I am shop metafield",
        "type": "single_line_text_field"
      }
    }
  }
  const mutationData = await manageShopMetaField(data)
