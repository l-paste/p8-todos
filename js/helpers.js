/*global NodeList */
(function(window) {
  "use strict";

  /**
   * Helpers function :<br>
   * It returns the first element that matches the specified CSS selector.
   * @func qs
   * @param {string} selector The name of the CSS selector.
   * @param {object} scope Scope where the selector is included.
   */
  window.qs = function(selector, scope) {
    return (scope || document).querySelector(selector);
  };

  /**
   * Helpers function :<br>
   * It returns all elements in the document that matches a specified CSS selector.
   * @func qa
   * @param {string} selector The name of the CSS selector.
   * @param {object} scope Scope where the selector is included.
   */
  window.qsa = function(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  /**
   * Helpers function
   * @func addEventListener wrapper
   */
  window.$on = function(target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  /**
   * Helpers function :<br>
   * Attach a handler to event for all elements that match the selector,
   * now or in the future, based on a root element
   * @func $delegate
   */
  window.$delegate = function(target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch =
        Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };
  /**
   * Helpers function :<br>
   * Find the element's parent with the given tag name :<br>
   * $parent(qs('a'), 'div');
   * @func $parent
   */
  window.$parent = function(element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  // Allow for looping on nodes by chaining:
  // qsa('.foo').forEach(function () {})
  NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
