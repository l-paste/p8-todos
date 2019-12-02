# Projet 8 - Reprenez et améliorez un projet existant
Formation OpenClassrooms, parcours Développeur d'application front-end.

Reprise d'un projet d'application de *to-do list*, avec des erreurs à corriger, des tests à mettre en place, un audit à réaliser et une documentation à créer.

Installation :
```
npm install
```

## Étape 1 : Corrigez les bugs
#### Erreurs
- [Controller.js](/js/controller.js), ligne 95 : faute d'orthographe dans le nom d'une méthode : add**d**Item au lieu de addItem.
```javascript
  Controller.prototype.addItem = function(title) {
    // Première erreur : adddItem au lieu de addItem
    var self = this;

    if (title.trim() === "") {
      return;
    }

    self.model.create(title, function() {
      self.view.render("clearNewTodo");
      self._filter(true);
    });
  };
```

- [Store.js](js/store.js), ligne 87 : utilisation de la méthode *getTime* pour supprimer les problèmes de doublon d'ID.

```javascript
    // Generate an ID
    var newId = new Date().getTime(); // Ajout d'un timestamp pour éviter tout conflit d'ID identique.
    var charset = "0123456789";

    for (var i = 0; i < 6; i++) {
      newId += charset.charAt(Math.floor(Math.random() * charset.length));
    }
```

- [Index.html](index.html), ligne 16 : ajout de l'ID nécessaire à l'utilisation du *toggle all*.
```html
	<input class="toggle-all" id="toggle-all" type="checkbox">
```
#### Optimisations

- [View.js](js/view.js), ligne 240 : utilisation d'un switch à la place des *if / else if* à la chaîne.
```javascript
  View.prototype.bind = function(event, handler) {
	var self = this;
	// Replaced if / else if with a switch
    switch (event) {
    [...]
    }
  };
```

- [Controller.js](js/controller.js), ligne 125 : remplacement des deux boucles *while* par l'utilisation de regex.
```javascript
title = title.replace(/^\s+|\s+$/g, '');
```
Et ligne 169 : suppression d'un forEach utilisé pour afficher des données en console.
```javascript
    items.forEach(function(item) {
    if (item.id === id) {
   		console.log("Element with ID: " + id + " has been removed.");
     	}
    });
```

- [Store.js](js/store.js), ligne 129 : regroupement et optimisation des deux boucles *for*.
```javascript
    for (var i = todos.length; i--; ) {
      if (todos[i].id == id) {
        todoId = todos[i].id;
      }
      if (todos[i].id == todoId) {
        todos.splice(i, 1);
      }
    }
```

- Optimisation et reversing des boucles for (dans template.js et store.js) :
```javascript
for (var i = data.length; i--; ){
```

## Étape 2 : où sont les tests ?!
Pour lancer les tests, ouvrez le fichier [SpecRunner.html](test/SpecRunner.html) à la racine du dossier test dans votre navigateur. Les tests sont détaillés dans le fichier [ControllerSpec.js](test/ControllerSpec.js).

Les tests suivants ont été complétés :
```
should show entries on start-up
should show active entries
should show completed entries
should highlight "All" filter by default
should highlight "Active" filter when switching to active view
should toggle all todos to completed
should update the view
should add a new todo to the model
should remove an entry from the model
```
Les tests suivants ont été ajoutés :
```
should read completed entries from the model
should read active entries from the model
should toggle all todos to active if all todos are completed
```
## Étape 3 : optimisez la performance
- [Audit de performance](pdf/Audit.pdf)
## Étape 4 : 
- [Documentation technique](https://l-paste.github.io/p8-todos/)
- [Guide utilisateur](pdf/GuideUtilisateur.pdf)
