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
    console.log('✅ Variant Changed! New ID:', newVariantId);
    console.log('On Form:', formElement);
    
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

    console.log('Attaching listener to form:', productForm);

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
