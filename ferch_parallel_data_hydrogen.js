
// Parallel data loading with Promise.all()

// To avoid sequential requests and reduce loading time, Hydrogen employs the Promise.all() method, executing multiple data requests concurrently.
export async function loader({ context }) {
  const [{ product }, { availability }, { cart }] = await Promise.all([
    context.storefront.query(`#graphql
      /** Basic product information **/
      /** Product Recommendations **/
     `,
      { cache: context.storefront.CacheLong() },
    ),
    context.storefront.query(`#graphql
      /** Product price and availability **/
     `,
      {cache: context.storefront.CacheShort()},
    ),
    context.storefront.query(`#graphql
      /** Cart **/
     `,
      { cache: context.storefront.CacheNone() },
    ),
  ]);

  return json({ product, cart, availability });
}
