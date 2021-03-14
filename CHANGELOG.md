# Changelog

## 0.6.5

* Add `Game.fadeIn` and `Game.fadeOut`
* :arrow_up: @mousepox/math

## 0.6.4

* Ensure whole pixel coordinates for translation and drawing
* Disable alpha on 2D canvas context

## 0.6.3

* Add `TileMap`
* Change `fillStyle` parameter of the `Box` constructor to be optional

## 0.6.2

* Add `Game.loadSpriteFont`

## 0.6.1

* Improve canvas scaling in Safari

## 0.6.0

* Add `Scene.activate` method
* Add `Box.clip` property
* Use [howler.js](https://howlerjs.com) for audio
* :fire: Remove unused CLI code/assets/deps

## 0.5.2

* :bug: Floor Box rendering coordinates

## 0.5.1

* Add CSS class name to `Surface` canvas element
* :arrow_up: Update dependencies

## 0.5.0

* Add `SoundCache`
* Add `Keyboard.onFirstInteract` event
* Add `Keyboard.suppress` method

## 0.4.2

* :bug: Fix image-rendering CSS property on pixelated `Surface` objects

## 0.4.1

* Add `SpriteText.width` property

## 0.4.0

* Add `SpriteText`
* :boom: Remove `Grid`

## 0.3.0

* Add `ActionQueue`

## 0.2.2

* Add `Actor.drawOrder`
* Fix bug in `Actor.disposeChildren()`

## 0.2.1

* Add optional `frames` parameter to `Keyboard.getKeyState`

## 0.2.0

* Add `Keyboard` and `DataCache` to `Game`/`Scene`
* Add `SpriteGrid.width` and `SpriteGrid.height`
* Allow `SpriteGrid.grid` to be `undefined`
* Add `Grid.resize` and `Grid.forEachInRect`
* Add `Actor.dispose` and `Actor.disposeChildren`

## 0.1.0

* :rocket: Initial version
