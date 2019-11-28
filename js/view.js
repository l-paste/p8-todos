/*global qs, qsa, $on, $parent, $delegate */

(function(window) {
  "use strict";

  /**
   * View that abstracts away the browser's DOM completely.
   * It has two simple entry points:<br><br>
   * 
   * - bind(eventName, handler)<br>
   *   Takes a todo application event and registers the handler<br><br>
   * - render(command, parameterObject)<br>
   *   Renders the given command with the options
   * @alias View
   * @constructor
   */
  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$todoList = qs(".todo-list");
    this.$todoItemCounter = qs(".todo-count");
    this.$clearCompleted = qs(".clear-completed");
    this.$main = qs(".main");
    this.$footer = qs(".footer");
    this.$toggleAll = qs(".toggle-all");
    this.$newTodo = qs(".new-todo");
  }

  /**
   * Will remove an item from the View based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   */
  View.prototype._removeItem = function(id) {
    var elem = qs('[data-id="' + id + '"]');

    if (elem) {
      this.$todoList.removeChild(elem);
    }
  };

  /**
   * Will toggle the "Clear completed" button.
   * 
   * @param {number} completedCount Number of completed tasks.
   * @param {boolean} visible Is visible or not.
   */
  View.prototype._clearCompletedButton = function(completedCount, visible) {
    this.$clearCompleted.innerHTML = this.template.clearCompletedButton(
      completedCount
    );
    this.$clearCompleted.style.display = visible ? "block" : "none";
  };

  /**
   * Update the view according to the selected filter
   * 
   * @param {string} currentPage Value of the current URL route.
   */
  View.prototype._setFilter = function(currentPage) {
    qs(".filters .selected").className = "";
    qs('.filters [href="#/' + currentPage + '"]').className = "selected";
  };

  /** 
   * Update the view when a task is completed.
   * 
   * @param {number} id The ID of the selected task.
   * @param {boolean} completed Task is completed or not.
   */
  View.prototype._elementComplete = function(id, completed) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    listItem.className = completed ? "completed" : "";

    // In case it was toggled from an event and not by clicking the checkbox
    qs("input", listItem).checked = completed;
  };

  /**
   * Trigger the edit mode (input field with the current title)
   * 
   * @param {number} id The ID of the selected task.
   * @param {title} title Current task title that will be in the input field.  
   */
  View.prototype._editItem = function(id, title) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    listItem.className = listItem.className + " editing";

    var input = document.createElement("input");
    input.className = "edit";

    listItem.appendChild(input);
    input.focus();
    input.value = title;
  };

  /**
   * End the edit mode and display the new value.
   * 
   * @param {number} id The ID of the edited task.
   * @param {string} title New task title.
   */
  View.prototype._editItemDone = function(id, title) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    var input = qs("input.edit", listItem);
    listItem.removeChild(input);

    listItem.className = listItem.className.replace("editing", "");

    qsa("label", listItem).forEach(function(label) {
      label.textContent = title;
    });
  };

  /**
   * Update the view according to the command called by Controller.js.
   * 
   * @param {function} viewCmd Command called by Controller.js.
   * @param {object} parameter Parameters of the called function.
   */
  View.prototype.render = function(viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      showEntries: function() {
        self.$todoList.innerHTML = self.template.show(parameter);
      },
      removeItem: function() {
        self._removeItem(parameter);
      },
      updateElementCount: function() {
        self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
      },
      clearCompletedButton: function() {
        self._clearCompletedButton(parameter.completed, parameter.visible);
      },
      contentBlockVisibility: function() {
        self.$main.style.display = self.$footer.style.display = parameter.visible
          ? "block"
          : "none";
      },
      toggleAll: function() {
        self.$toggleAll.checked = parameter.checked;
      },
      setFilter: function() {
        self._setFilter(parameter);
      },
      clearNewTodo: function() {
        self.$newTodo.value = "";
      },
      elementComplete: function() {
        self._elementComplete(parameter.id, parameter.completed);
      },
      editItem: function() {
        self._editItem(parameter.id, parameter.title);
      },
      editItemDone: function() {
        self._editItemDone(parameter.id, parameter.title);
      }
    };

    viewCommands[viewCmd]();
  };

  /**
   * Add the task ID to the targeted element.
   * 
   * @param {object} element Targeted element.
   */
  View.prototype._itemId = function(element) {
    var li = $parent(element, "li");
    return parseInt(li.dataset.id, 10);
  };

  /**
   * Add events handlers to the edit mode : Enter keyboard press and loosing focus on the edit input field.
   * 
   * @param {function} handler Callback function.
   */
  View.prototype._bindItemEditDone = function(handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "blur", function() {
      if (!this.dataset.iscanceled) {
        handler({
          id: self._itemId(this),
          title: this.value
        });
      }
    });

    $delegate(self.$todoList, "li .edit", "keypress", function(event) {
      if (event.keyCode === self.ENTER_KEY) {
        // Remove the cursor from the input when you hit enter just like if it
        // were a real form
        this.blur();
      }
    });
  };

  /** 
   * Add events handler that cancel the edit mode when you press the Escape key.
   * 
   * @param {function} handler Callback function.
   */
  View.prototype._bindItemEditCancel = function(handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "keyup", function(event) {
      if (event.keyCode === self.ESCAPE_KEY) {
        this.dataset.iscanceled = true;
        this.blur();

        handler({ id: self._itemId(this) });
      }
    });
  };

  /**
   * Bind Controller.js functions to the view.
   * 
   * @param {function} event Event called by Controller.
   * @param {function} handler Callback function.
   */
  View.prototype.bind = function(event, handler) {
	var self = this;
	// Replaced if / else if with a switch
    switch (event) {
      case "newTodo":
        $on(self.$newTodo, "change", function() {
          handler(self.$newTodo.value);
        });
        break;
      case "removeCompleted":
        $on(self.$clearCompleted, "click", function() {
          handler();
        });
        break;
      case "toggleAll":
        $on(self.$toggleAll, "click", function() {
          handler({ completed: this.checked });
        });
        break;
      case "itemEdit":
        $delegate(self.$todoList, "li label", "dblclick", function() {
          handler({ id: self._itemId(this) });
        });
        break;
      case "itemRemove":
        $delegate(self.$todoList, ".destroy", "click", function() {
          handler({ id: self._itemId(this) });
        });
        break;
      case "itemToggle":
        $delegate(self.$todoList, ".toggle", "click", function() {
          handler({
            id: self._itemId(this),
            completed: this.checked
          });
        });
        break;
      case "itemEditDone":
        self._bindItemEditDone(handler);
        break;
      case "itemEditCancel":
        self._bindItemEditCancel(handler);
        break;
      default:
        console.log("Unexpected value");
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);
