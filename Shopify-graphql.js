// COLLECTION FILTER START
query MyQuery {
  collection(handle: "polymer-additives") {
    products(
      first: 10
      filters: [{productMetafield: {namespace: "product", key: "topic", value: "Selection"}}]
    ) {
      edges {
        cursor
        node {
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      filters {
        id
        label
        type
        presentation
        values {
          count
          id
          input
          label
        }
      }
    }
  }
}

// COLLECTION FILTER END
//==============================================================================================



// SEARCH FILTER START
query Search($query: String!, $first: Int, $sortKey: SearchSortKeys, $types: [SearchType!], $productFilters: [ProductFilter!], $identifiers: [HasMetafieldsIdentifier!]!, $after: String, $variantsFirst2: Int) {
  search(query: $query, first: $first, sortKey: $sortKey, types: $types, productFilters: $productFilters, after: $after) {
    totalCount
    productFilters {
      id
      label
      presentation
      type
      values {
        label
        input
        id
        count
      }
    }
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        ... on Product {
          vendor
          totalInventory
          title
          tags
          handle
          featuredImage {
            altText
            height
            id
            url
            width
          }
          availableForSale
          productType
          compareAtPriceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(identifiers: $identifiers) {
            value
            key
            type
            reference {
              ... on Metaobject {
                type
                fields {
                  key
                  value
                  reference {
                    ... on GenericFile {
                      url
                      previewImage {
                        width
                        url
                        altText
                      }
                      mimeType
                      alt
                    }
                  }
                }
              }
            }
          }
          variants(first: $variantsFirst2) {
            nodes {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  }
}
 const variables = {
                query: searchValue,
                first: 9,
                sortKey: "RELEVANCE",
                types: "PRODUCT",
                productFilters: [
                    {
                        tag: searchCategory
                    },
                    {
                        productMetafield:{
                                namespace: "product",
                                key: "topic_list",
                                value: "Selection"
                            }
                        
                    }
                ],
                identifiers: [
                    {
                        key: "expert_details",
                        namespace: "product"
                    },
                    {
                        key: "course_start_at",
                        namespace: "product"
                    }
                ],
                after: endCursor,
                variantsFirst2: 4 
            }
// SEARCH FILTER END
//==============================================================================================
