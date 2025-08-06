function getMobileOS() {
  const uA = navigator.userAgent || navigator.vendor || window.opera || '';
  const platform = navigator.platform || '';
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // iOS detection
  if (
    (/iPhone|iPad|iPod/.test(uA) || /iPhone|iPad|iPod/.test(platform)) && 
    !/Windows Phone/.test(uA) && 
    !window.MSStream
  ) {
    return 'iOS';
  }
  
  // Additional iOS check for iPads reporting as Mac
  if (
    uA.includes('Macintosh') && 
    isTouchDevice && 
    !/Windows/.test(uA)
  ) {
    return 'iOS';
  }

  // Android detection
  if (/Android/.test(uA) || /Android/.test(platform)) {
    return 'Android';
  }

  // Windows Mobile/Tablet detection
  if (/Windows Phone|Windows NT/.test(uA) && isTouchDevice) {
    return 'Windows';
  }

  // Fallback for other or unknown devices
  return 'other';
}

function isWeekend() {
  const today = new Date();
  const day = today.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

 /**
 * =================================================================================
 * Universal Shopify Variant Change Listener
 * This script works on ANY theme because it watches the one input field
 * that Shopify requires for adding a product to the cart.
 * =================================================================================
 */
/**
 * =================================================================================
 * Universal Shopify Variant & Quick View Listener v2.0
 *
 * HOW IT WORKS:
 * 1. `initializeVariantListener(form)`: A reusable function that sets up our
 * variant-change listener on a *specific* product form.
 * 2. Initial Scan: On page load, it finds all existing product forms and
 * initializes the listener on them.
 * 3. Master Observer: It creates a "master" MutationObserver that watches the
 * entire page body for new elements being added.
 * 4. Dynamic Detection: When you open a Quick View, the master observer
 * detects the new content, finds the new product form inside it, and calls
 * `initializeVariantListener()` on that new form.
 * =================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const YOUR_CUSTOM_LOGIC = (newVariantId, formElement) => {
    const productID=formElement?.querySelector('input[name="product-id"]')?.value;
    debugger
    if(productID){
    const varaintData=JSON.parse(document.querySelector(`.test-variant-${productID}`)?.innerText)

    if(varaintData){
    console.log(varaintData[newVariantId])
    }
    }
    {% comment %} console.log(newVariantId,productID) {% endcomment %}
    
    // ==================================================
    // ✨ YOUR CUSTOM GLOBAL LOGIC GOES HERE ✨
    // You have access to the newVariantId and the specific form it belongs to.
    // Example: Find a price element *within the context of the current form*.
    // const priceDisplay = formElement.closest('.product-container')?.querySelector('.price');
    // if(priceDisplay) {
    //   // Do something with the price
    // }
    // ==================================================
  };

  /**
   * Attaches a variant change listener to a single product form.
   * @param {HTMLElement} productForm - The <form> element for a product.
   */
  const initializeVariantListener = (productForm) => {
    const variantInput = productForm.querySelector('input[name="id"]');
    if (!variantInput) return;
    
    // Check if a listener has already been attached to prevent duplicates.
    if (productForm.dataset.variantListenerAttached) return;
    productForm.dataset.variantListenerAttached = 'true';
    


    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
          YOUR_CUSTOM_LOGIC(mutation.target.value, productForm);
        }
      }
    });

    observer.observe(variantInput, { attributes: true });

    // Initial call for the pre-selected variant.
    if (variantInput.value) {
  
      YOUR_CUSTOM_LOGIC(variantInput.value, productForm);
    }
  };

  // 1. Initialize listeners for any forms already on the page.
  document.querySelectorAll('form[action*="/cart/add"]').forEach(initializeVariantListener);

  // 2. Create a master observer to watch for new forms being added to the page (e.g., in a Quick View modal).
  const masterObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is an element and contains a new product form.
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newForms = node.querySelectorAll('form[action*="/cart/add"]');
            newForms.forEach(initializeVariantListener);
          }
        });
      }
    }
  });

  // Start the master observer on the entire body of the page.
  masterObserver.observe(document.body, {
    childList: true, // Watch for nodes being added or removed.
    subtree: true    // Watch all descendants of the body.
  });
});

// Liquid code 

{%- assign variant_metafields_json = '{' -%}
{%- for variant in product.variants -%}
  {%- assign rule_data = variant.metafields.dynamic_price.rule_data.value | json -%}
  {%- assign variant_id = variant.id -%}
  {%- assign inventory_quantity = variant.inventory_quantity | default: 0 -%}
  {%- assign price = variant.price | money | json -%}
  {%- assign compare_at_price = variant.compare_at_price | default: null | money | json -%}
  {%- assign variant_data = '{"rule_data":' | append: rule_data | append: ',"inventory_quantity":' | append: inventory_quantity | append: ',"price":' | append: price | append: ',"compare_at_price":' | append: compare_at_price | append: '}' -%}
  {%- assign variant_metafields_json = variant_metafields_json | append: '"' | append: variant_id | append: '":' | append: variant_data -%}
  {%- unless forloop.last -%}
    {%- assign variant_metafields_json = variant_metafields_json | append: ',' -%}
  {%- endunless -%}
{%- endfor -%}
{%- assign variant_metafields_json = variant_metafields_json | append: '}' -%}

<script class="test-variant-{{  product.id }}">
{{ variant_metafields_json  }}
</script>
