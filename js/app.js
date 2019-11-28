/*global app, $on */
(function() {
  "use strict";
  /**
   * Sets up a brand new Todo list by creating a new instance of each classes.
   * @module App
   * @constructor
   * @param {string} name The name of your new to do list.
   */
  function Todo(name) {
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  /**
   * Create new instance of the App
   */
  var todo = new Todo("todos-vanillajs");

  /**
   * Set up the appropriate view and template according to the URL route.
   * @func setView
   */
  function setView() {
    todo.controller.setView(document.location.hash);
  }
  /**
   * Triggers setView() when the page is loaded or URL route is changed.
   * @func $on
   */
  $on(window, "load", setView);
  $on(window, "hashchange", setView);
})();
