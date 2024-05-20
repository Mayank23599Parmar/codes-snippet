/**
 * This function gives shopify theme setting from shopify admin rest api.
 *
 * @param {string} pageType - shopify page template json ex. index,product, collection,cart etc.
 * @returns {Array} give json template section setiings.
 */
export async function getThemeSetting(pageType) {
    const themeSettings=[]
    const themeId=xxx
    const apiVersion=`2024-04`
    const shopName="xxx.myshopify.com"
    const shopifyAccessToken='xxx'
       try {
        if(pageType){
            // Define the URL for the GET request
            const url = `https://${shopName}/admin/api/${apiVersion}/themes/${themeId}/assets.json?asset[key]=templates/${pageType}.json`;
            // Define your custom headers
            const headers = {
              'X-Shopify-Access-Token':shopifyAccessToken , // shop access token
              'Content-Type': 'application/json'
            };
            let sectionData=await axios.get(url, { headers: headers })
            if(sectionData?.status === 200) {
                if(sectionData?.data?.asset?.value){
                    sectionData=await JSON.parse(sectionData.data.asset.value)
                     // for section theme setting order. gives customiser section order
                    for (let index = 0; index < sectionData.order.length; index++) {
                      const sectionName = sectionData.order[index];
                      const sectionValue=sectionData.sections[sectionName]
                      // check section have blocks or not
                      if(sectionValue?.block_order?.length > 0){
                        const blocksData=[]
                             // for section blocks setting order. gives customiser section blocks order
                        for (let j = 0; j < sectionValue?.block_order.length; j++) {
                          const block = sectionValue?.block_order[j];
                          blocksData.push(sectionValue.blocks[block])
                        }
                        sectionValue['blocks']=blocksData
                      }
                      themeSettings.push(sectionValue)
                    }
                  }
              }
              return themeSettings
        }
       } catch (error) {
        console.log(error.message)
        return themeSettings
       }
}

  const sections=await getThemeSetting("index")
