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

query MyQuery {
  search(query: "Striped", first: 10, productFilters: [
    {productMetafield: {namespace: "product", key: "topic", value: "Selection"}}
  ]) {
    totalCount
    productFilters {
      type
      values {
        count
        id
        label
        input
      }
      label
      id
      presentation
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      cursor
      node {
        ... on Product {
          id
          title
        }
      }
    }
  }
}
// SEARCH FILTER END
//==============================================================================================
