/**
 * Cart Section Renderer - Simplified Version
 * 
 * A focused utility for rendering Shopify cart sections from API responses.
 * Works with any Shopify theme.
 * 
 * Usage:
 *   renderCartSectionsFromResponse(data, [
 *     'cart-items',
 *     { id: 'cart-icon-bubble', selector: '#cart-icon-bubble' }
 *   ], {
 *     onComplete: () => console.log('Done!')
 *   });
 */
(function() {
  'use strict';

  /**
   * Parse HTML and extract content by selector
   */
  function extractSectionHTML(htmlString, selector) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const element = doc.querySelector(selector);
      
      if (!element) {
        console.warn(`Selector "${selector}" not found in section HTML`);
        return null;
      }
      
      return element.innerHTML;
    } catch (error) {
      console.error('Error parsing section HTML:', error);
      return null;
    }
  }

  /**
   * Find DOM element for section
   */
  function findSectionElement(sectionId, customSelector) {
    // Try custom selector first
    if (customSelector) {
      const element = document.querySelector(customSelector);
      if (element) return element;
    }
    
    // Try section ID as element ID
    const byId = document.getElementById(sectionId);
    if (byId) return byId;
    
    // Try data-section-id attribute
    const byDataAttr = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (byDataAttr) return byDataAttr;
    
    // Try class with section name
    const byClass = document.querySelector(`.${sectionId}`);
    if (byClass) return byClass;
    
    // Try section wrapper pattern
    const bySection = document.querySelector(`section[data-section="${sectionId}"]`);
    if (bySection) return bySection;
    
    console.warn(`Section element not found for: ${sectionId}`);
    return null;
  }

  /**
   * Update DOM element with new HTML
   */
  function updateElement(element, html, selector) {
    if (!element) return false;
    
    try {
      // Default selector if not provided
      const defaultSelector = selector || '.shopify-section';
      
      // Extract innerHTML from the HTML string using selector
      const extractedHTML = extractSectionHTML(html, defaultSelector);
      if (extractedHTML !== null) {
        element.innerHTML = extractedHTML;
        return true;
      }
      
      // Fallback: use HTML as-is (if it's already just the content)
      element.innerHTML = html;
      return true;
    } catch (error) {
      console.error('Error updating element:', error);
      return false;
    }
  }

  /**
   * Publish cart update event (if pubsub available)
   */
  function publishCartUpdate(data) {
    if (typeof publish === 'function') {
      try {
        const eventName = typeof PUB_SUB_EVENTS !== 'undefined' && PUB_SUB_EVENTS.cartUpdate 
          ? PUB_SUB_EVENTS.cartUpdate 
          : 'cart-update';
        publish(eventName, data);
      } catch (error) {
        console.warn('PubSub publish failed:', error);
      }
    }
  }

  /**
   * Render cart sections from Shopify API response
   * 
   * @param {Object} response - API response with 'sections' property
   * @param {Array} sectionConfigs - Array of section configs (strings or objects)
   * @param {Object} options - Optional configuration
   * @param {Function} options.onComplete - Callback when all sections are rendered
   * @param {Function} options.onError - Callback when error occurs
   * @param {Function} options.onEachComplete - Callback after each section is rendered
   * @param {Boolean} options.usePubSub - Enable/disable pubsub (auto-detected)
   * 
   * @returns {Array} Array of result objects
   */
  function renderCartSectionsFromResponse(response, sectionConfigs = [], options = {}) {
    // Validate response
    if (!response || !response.sections) {
      const error = new Error('Response does not contain sections');
      console.warn(error.message);
      
      if (typeof options?.onError === 'function') {
        options?.onError(error, sectionConfigs);
      }
      
      return [];
    }

    const results = [];
    const defaultSelector = '.shopify-section';
    
    // If no sectionConfigs provided, try to render all sections in response
    if (sectionConfigs.length === 0) {
      sectionConfigs = Object.keys(response.sections);
    }

    // Process each section
    for (const config of sectionConfigs) {
      let sectionId;
      let selector;
      
      // Handle string config (just section name)
      if (typeof config === 'string') {
        sectionId = config;
        selector = defaultSelector;
      }
      // Handle object config { id: 'section-name', selector: '#selector' }
      else if (typeof config === 'object' && config.id) {
        sectionId = config.id;
        selector = config.selector || defaultSelector;
      } else {
        console.warn('Invalid section config:', config);
        results.push({ 
          success: false, 
          sectionId: null, 
          error: 'Invalid config',
          config 
        });
        continue;
      }

      // Get HTML from response
      const html = response.sections[sectionId];
      
      if (!html) {
        const error = `Section "${sectionId}" not found in response`;
        console.warn(error);
        results.push({ 
          success: false, 
          sectionId, 
          error,
          config 
        });
        continue;
      }

      // Find target element
      const element = findSectionElement(sectionId, selector);
      
      if (!element) {
        const error = `Element not found for section: ${sectionId}`;
        results.push({ 
          success: false, 
          sectionId, 
          error,
          config 
        });
        continue;
      }

      // Update element
      const success = updateElement(element, html, selector);
      
      const result = { 
        success, 
        sectionId, 
        element: success ? element : null,
        config 
      };
      
      results.push(result);

      // Call onEachComplete callback if provided
      if (typeof options.onEachComplete === 'function') {
        try {
          options.onEachComplete(result);
        } catch (error) {
          console.error('Error in onEachComplete callback:', error);
        }
      }
    }

    // Publish event if pubsub available
    if (options.usePubSub !== false) {
      publishCartUpdate({
        source: 'cart-section-renderer',
        sectionIds: results.map(r => r.sectionId).filter(Boolean),
        cartData: response,
        results: results
      });
    }

    // Call onComplete callback if provided
    if (typeof options.onComplete === 'function') {
      try {
        options.onComplete(results, response);
      } catch (error) {
        console.error('Error in onComplete callback:', error);
      }
    }

    return results;
  }

  /**
   * Helper: Normalize section IDs for cart API requests
   * 
   * @param {string|Array} sectionIds - Section ID(s) to normalize
   * @returns {Array} Array of normalized section IDs
   */
  function getSectionsForCartRequest(sectionIds) {
    const normalized = Array.isArray(sectionIds) ? sectionIds : [sectionIds];
    return normalized.map(id => {
      if (typeof id === 'string') {
        return id;
      } else if (typeof id === 'object' && id.id) {
        return id.id;
      } else if (typeof id === 'object' && id.section) {
        return id.section;
      }
      return String(id);
    }).filter(Boolean);
  }

  /**
   * Helper: Add sections parameter to FormData
   * 
   * @param {FormData} formData - FormData object to add sections to
   * @param {string|Array} sectionIds - Section ID(s) to include
   * @param {string} sectionsUrl - Optional sections URL (defaults to current pathname)
   * @returns {FormData} FormData object with sections added
   * 
   * @example
   * const formData = new FormData();
   * formData.append('id', variantId);
   * formData.append('quantity', 1);
   * addSectionsToFormData(formData, ['cart-drawer', 'cart-icon-bubble']);
   */
  function addSectionsToFormData(formData, sectionIds, sectionsUrl = null) {
    if (!formData || !(formData instanceof FormData)) {
      console.error('addSectionsToFormData: formData must be a FormData instance');
      return formData;
    }

    const sections = getSectionsForCartRequest(sectionIds);
    
    if (sections.length === 0) {
      console.warn('addSectionsToFormData: No sections provided');
      return formData;
    }

    // Add sections as comma-separated string
    formData.append('sections', sections.join(','));
    
    // Add sections_url
    if (sectionsUrl) {
      formData.append('sections_url', sectionsUrl);
    } else {
      formData.append('sections_url', window.location?.pathname || '/');
    }

    return formData;
  }
  // Export to global scope
  window.renderCartSectionsFromResponse = renderCartSectionsFromResponse;
  window.addSectionsToFormData = addSectionsToFormData;
  // Also export as module if supported
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
      renderCartSectionsFromResponse,
      addSectionsToFormData
    };
  }
  console.log('Cart Section Renderer loaded');
})();

================================================================================================
  example
    // Render sections with callback
    renderCartSectionsFromResponse(data, [
      'cart-items',
      { id: 'cart-icon-bubble', selector: '#cart-icon-bubble' }
    ], {
      onComplete: (results, response) => {
        console.log('Cart updated!', results);
        console.log('Cart total:', response.total_price);
        
        // Open cart drawer if it exists
        const cartDrawer = document.querySelector('cart-drawer');
        if (cartDrawer && typeof cartDrawer.open === 'function') {
          cartDrawer.open();
        }
      },
      onError: (error, sectionConfigs) => {
        console.error('Failed to render sections:', error);
      }
    });
================================================================================================
  ## 📝 Function Signature

```javascript
renderCartSectionsFromResponse(response, sectionConfigs, options)
```

### Parameters:

1. **`response`** (Object, required)
   - API response from `/cart/add.js`, `/cart/change.js`, etc.
   - Must have `sections` property with HTML strings

2. **`sectionConfigs`** (Array, optional)
   - Array of section configurations
   - Can be strings: `['cart-items', 'cart-icon-bubble']`
   - Or objects: `[{ id: 'cart-items' }, { id: 'cart-icon-bubble', selector: '#cart-icon-bubble' }]`
   - If empty, renders all sections in response

3. **`options`** (Object, optional)
   - `onComplete(results, response)` - Called when all sections are rendered
   - `onError(error, sectionConfigs)` - Called when error occurs
   - `onEachComplete(result)` - Called after each section is rendered
   - `usePubSub` (Boolean) - Enable/disable pubsub (auto-detected)



## 🔍 How It Finds Elements

The function tries multiple strategies to find section elements:

1. **Custom selector** (if provided in config)
2. **Element ID** matching section name
3. **`data-section-id` attribute**
4. **Class name** matching section name
5. **`section[data-section]` attribute**

  
