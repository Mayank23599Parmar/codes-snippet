import { useLoadScript } from '@shopify/hydrogen';
import { useRef } from 'react';
import { useEffect } from 'react';

// 'icecream-cakes-melbourne.myshopify.com'
// Removed the TypeScript type definition for the function arguments and return type
const useShopifyForm = ({ shopUrl }) => {
  const scriptLoadStatus=
  useLoadScript(
      'https://cdn.shopify.com/extensions/9118a869-43ed-4a7b-9a43-d1dbca3b0281/forms-2271/assets/shopify-forms-loader.js',
    );
  
  useEffect(() => {
    // Standard environment check is kept
    if (typeof window === 'undefined') return;

    const maxRetryCount = 5;
    let currentRetryCount = 0;
    const injectShopifyScript = () => {
      if (typeof window !== 'undefined' && !window.Shopify?.shop) {
        window.Shopify = window.Shopify || {};
        window.Shopify.shop = 'automotivetouch.myshopify.com';
      }
      const shopifyReady =
        typeof window.Shopify === 'object' &&
        window.Shopify !== null &&
        'customerPrivacy' in window.Shopify;

      if (shopifyReady) {
        // ✅ Set Shopify.shop without interfering with getters/setters
        // Removed the non-null assertion operator '!'
        if (!('shop' in window.Shopify)) {
          window.Shopify.shop = shopUrl;
        }

        // ✅ Set ShopifyForms safely
        window.ShopifyForms = window.ShopifyForms || {};
        window.ShopifyForms.currentPageType = 'index';

        // ✅ Dynamically load the Forms loader script
        // loadShopifyFormScript();
      } else {
        if (currentRetryCount <= maxRetryCount) {
          setTimeout(injectShopifyScript, 100);
          currentRetryCount++;
        }
      }
    };
    injectShopifyScript();
  }, [shopUrl]); // Added shopUrl to dependency array for correctness, even though the original TS didn't include it.

  return scriptLoadStatus;
};



 function useShopifyFormStyle({
  ref,
  scriptStatus,
  formStyle,
}) {
  useEffect(() => {
    let timer; // Removed ': NodeJS.Timeout | undefined' type annotation

    // Removed '!!formStyle' which is redundant for a JS check, though harmless.
    if (scriptStatus === 'done' && ref.current && formStyle) {
      const injectStyleInShadowDOM = () => {
        // Removed the non-null assertion operator '!'
        const formEmbedEl = ref.current.querySelector('form-embed');
        // Removed the 'as any' type assertion
        const shadowRootEl = formEmbedEl?.shadowRoot;

        if (shadowRootEl) {
          const style = document.createElement('style');
          style.textContent = formStyle;
          shadowRootEl.appendChild(style);
        }
      };

      const waitForFormEmbed = () => {
        // Removed the non-null assertion operator '!'
        const formEmbedEl = ref.current.querySelector('form-embed');
        if (formEmbedEl) {
          injectStyleInShadowDOM();
        } else {
          timer = setTimeout(waitForFormEmbed, 100);
        }
      };

      timer = setTimeout(waitForFormEmbed, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [ref, scriptStatus, formStyle]);
}

const ShopifyForm = ({
  formId,
  shopUrl,
  formProps,
  formStyle,
}) => {
  // Removed the TypeScript type annotation '<HTMLDivElement>'
  const formContainerRef = useRef(null);

  const scriptLoadStatus = useShopifyForm({
    shopUrl,
  });
console.log(scriptLoadStatus,"ssssssss");
  useShopifyFormStyle({
    ref: formContainerRef,
    scriptStatus: scriptLoadStatus,
    formStyle,
  });

  return (
    <div
      data-form-root="true"
      data-forms-text-color="#202020"
      data-forms-button-background-color="#202020"
      data-forms-button-label-color="#FFFFFF"
      data-forms-links-color="#1878B9"
      data-forms-errors-color="#E02229"
      data-forms-text-alignment="center"
      data-forms-alignment="center"
      data-forms-padding-top="0"
      data-forms-padding-right="0"
      data-forms-padding-bottom="0"
      data-forms-padding-left="0"
      {...formProps}
      data-forms-id={`forms-root-${formId}`}
      ref={formContainerRef}
    >
      {scriptLoadStatus === 'loading' ? <div>Loading...</div> : null}
    </div>
  );
};
export default ShopifyForm;


// ================================================================
//  go to entry.server.jsx and add below routes In handleRequest function

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },

    defaultSrc: [
      'self',
      'https://cdn.shopify.com',
      'https://shopify.com',
       'https://js.hcaptcha.com '
    ],
    // Allow YouTube iframes
    frameSrc: [
      "'self'",
      'https://www.youtube.com',
      'https://youtube.com',
      'https://*.youtube.com',
      'https://*.youtube-nocookie.com',
      'https://js.hcaptcha.com',
      'https://fonts.shopifycdn.com',
      'https://newassets.hcaptcha.com'
    ],
    connectSrc: [
      'self',
      'https://forms.shopifyapps.com',
      'https://otlp-http-production.shopifysvc.com',
      'https://notify.bugsnag.com',
    ]
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

