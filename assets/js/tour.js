/**
 * Tour
 * This class is designed to create image-based pannable and zoomable tours with multiple scenes.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tour {

	/**
	 * Represents the wrapper element that includes all the scenes and triggers.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents the viewport element that displays the scenes and can be panned and zoomed.
	 * 
	 * @type {HTMLElement}
	 */
	viewport;

	/**
	 * Represents a trigger button that navigates back to the previous scene when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	backTrigger;

	/**
	 * List of scenes.
	 * 
	 * @type {Array<TourScene>}
	 */
	scenes;

	/**
	 * Represents a zoom-in button that zooms the viewport to the next zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomInTrigger = null;

	/**
	 * Represents a zoom-out button that zooms the viewport to the previous zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomOutTrigger = null;

	/**
	 * List of classes added to the wrapper at the zoom level specified by the index.
	 * 
	 * @type {Array<string>}
	 */
	zoomLevelClasses = [
		"tour--zoom-1",
		"tour--zoom-2",
		"tour--zoom-3",
		"tour--zoom-4",
		"tour--zoom-5",
		"tour--zoom-6"
	];

	/**
	 * The class that is added to the wrapper after the tour has been initialized.
	 * 
	 * @type {string}
	 */
	isInitializedClass = "is-initialized";

	/**
	 * The class that is added to the wrapper of the scene when it is selected.
	 * 
	 * @type {string}
	 */
	isSelectedClass = "is-selected";

	/**
	 * The class that is added to the wrapper while the viewport is being panned.
	 * 
	 * @type {string}
	 */
	isPanningClass = "is-panning";

	/**
	 * The class that is added to the wrapper when history is available.
	 * 
	 * @type {string}
	 */
	hasHistoryClass = "has-history";

	/**
	 * The class that is added to the wrapper when zoom is available.
	 * 
	 * @type {string}
	 */
	hasZoomClass = "has-zoom";

	/**
	 * Callback function that is called after the tour has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after a scene has been selected.
	 * 
	 * @type {function(TourScene):void|null}
	 */
	selectSceneCallback = null;

	/**
	 * Callback function that is called after the next scene is selected.
	 * 
	 * @type {function():void|null}
	 */
	goToSceneCallback = null;

	/**
	 * Callback function that is called after the previous scene is reverted.
	 * 
	 * @type {function():void|null}
	 */
	goBackCallback = null;

	/**
	 * Callback function that is called after the viewport is zoomed to the next zoom level.
	 * 
	 * @type {function():void|null}
	 */
	zoomInCallback = null;

	/**
	 * Callback function that is called after the viewport is zoomed to the previous zoom level.
	 * 
	 * @type {function():void|null}
	 */
	zoomOutCallback = null;

	/**
	 * Callback function that is called after the viewport is zoomed to a different zoom level.
	 * 
	 * @type {function():void|null}
	 */
	zoomCallback = null;

	/**
	 * Callback function that is called after the panning has started.
	 * 
	 * @type {function():void|null}
	 */
	panStartCallback = null;

	/**
	 * Callback function that is called after the panning has ended.
	 * 
	 * @type {function():void|null}
	 */
	panEndCallback = null;

	/**
	 * Callback function that is called after the tour has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * List of previously opened scenes.
	 * 
	 * @type {Array<TourScene>}
	 */
	#sceneHistory = [];

	/**
	 * List of zoom-levels recorded when a scene is added to the history.
	 * 
	 * @type {Array<number>}
	 */
	#zoomLevelHistory = [];

	/**
	 * List of X and Y relative offsets recorded when a scene is added to the history.
	 * 
	 * @type {Array<[number, number]>}
	 */
	#offsetHistory = [];

	/**
	 * The current applied zoom level.
	 * 
	 * @type {number}
	 */
	#zoomLevel = 0;

	/**
	 * Indicates whether the viewport is currently being panned.
	 * 
	 * @type {boolean}
	 */
	#isPanning = false;

	/**
	 * The x pixel coordinate at which the panning was started.
	 * 
	 * @type {number}
	 */
	#panStartX = 0;

	/**
	 * The Y pixel coordinate at which the panning was started.
	 * 
	 * @type {number}
	 */
	#panStartY = 0;

	/**
	 * The horizontal scroll position of the viewport when the panning was started.
	 * 
	 * @type {number}
	 */
	#panStartScrollLeft = 0;

	/**
	 * The vertical scroll position of the viewport when the panning was started.
	 * 
	 * @type {number}
	 */
	#panStartScrollTop = 0;

	/**
	 * Creates a tour.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLButtonElement} options.backTrigger
	 * @param {Array<TourScene>} options.scenes
	 * @param {HTMLButtonElement|null} options.zoomInTrigger
	 * @param {HTMLButtonElement|null} options.zoomOutTrigger
	 * @param {Array<string>} options.zoomLevelClasses
	 * @param {string} options.isInitializedClass
	 * @param {string} options.isSelectedClass
	 * @param {string} options.isPanningClass
	 * @param {string} options.hasHistoryClass
	 * @param {string} options.hasZoomClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.selectSceneCallback
	 * @param {function():void} options.goToSceneCallback
	 * @param {function():void} options.goBackCallback
	 * @param {function():void} options.zoomInCallback
	 * @param {function():void} options.zoomOutCallback
	 * @param {function():void} options.zoomCallback
	 * @param {function():void} options.panStartCallback
	 * @param {function():void} options.panEndCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Tour}
	 */
	constructor(options) {

		// Test required options
		let sceneIds = [];
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tour \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.backTrigger instanceof HTMLButtonElement)) {
			throw "Tour \"backTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.scenes instanceof Array)) {
			throw 'Tour \"scenes\" must be an `array`';
		}
		if (options.scenes.length == 0) {
			throw 'Tour \"scenes\" must include at least one scene';
		}
		options.scenes.forEach((scene, index) => {
			if (!(scene instanceof TourScene)) {
				throw 'Tour scene must be a `TourScene`';
			}
			if (sceneIds.includes(scene.id)) {
				throw 'Tour scene ids must be unique';
			} else {
				sceneIds.push(scene.id);
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the tour
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.goToScene(this.scenes[0], false);
		this.wrapper.setAttribute("tabindex", "0");
		this.wrapper.classList.add(this.isInitializedClass);
		if (this.maxZoomLevel) this.wrapper.classList.add(this.hasZoomClass);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Navigates to the specified scene.
	 * 
	 * @param {TourScene} scene
	 * @param {boolean} setFocus
	 * @returns {void}
	 */
	goToScene(scene, setFocus = true) {
		this.#addSceneToHistory(scene);
		this.selectScene(scene, scene.offsetX, scene.offsetY, scene.zoomLevel);
		if (setFocus) this.wrapper.focus();
		if (typeof(this.goToSceneCallback) == "function") this.goToSceneCallback();
	}

	/**
	 * Navigates to the scene with the specified ID.
	 * 
	 * @param {string} id
	 * @param {boolean} setFocus
	 * @returns {void}
	 */
	goToSceneById(id, setFocus = true) {
		let scene = this.getSceneById(id);
		if (scene) this.goToScene(scene, setFocus);
	}

	/**
	 * Navigates back the previous scene in the history within the tour.
	 * 
	 * @returns {void}
	 */
	goBack() {
		let prevScene = this.#removeCurrentAndPopPrevSceneFromHistory();
		let prevZoomLevel = this.#popPrevZoomLevelFromHistory();
		let prevOffsets = this.#popPrevOffsetsFromHistory();
		if (prevScene !== undefined && prevZoomLevel !== undefined && prevOffsets !== undefined) {
			this.selectScene(prevScene, prevOffsets[0], prevOffsets[1], prevZoomLevel);
			this.wrapper.focus();
			if (typeof(this.goBackCallback) == "function") this.goBackCallback();
		}
	}

	/**
	 * Selects the specified scene.
	 * 
	 * @param {TourScene} scene
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} zoomLevel
	 * @returns {void}
	 */
	selectScene(scene, offsetX, offsetY, zoomLevel) {
		this.#applySceneAsSelected(scene);
		this.zoomTo(zoomLevel);
		this.scrollViewportByOffset(offsetX, offsetY);
		this.#detectHasHistory();
		if (typeof(this.selectSceneCallback) == "function") this.selectSceneCallback(scene);
	}

	/**
	 * Selects the scene by the specified ID.
	 * 
	 * @param {string} id
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} zoomLevel
	 * @returns {void}
	 */
	selectSceneById(id, offsetX, offsetY, zoomLevel) {
		let scene = this.getSceneById(id);
		if (scene) this.selectScene(scene, offsetX, offsetY, zoomLevel);
	}

	/**
	 * Retrieves the scene with the specified ID.
	 * 
	 * @param {string} id
	 * @returns {TourScene|undefined}
	 */
	getSceneById(id) {
		return this.scenes.find((scene) => scene.id == id);
	}

	/**
	 * Zooms the viewport to the next zoom level.
	 * 
	 * @returns {void}
	 */
	zoomIn() {
		this.zoomTo(this.#zoomLevel + 1);
		if (typeof(this.zoomInCallback) == "function") this.zoomInCallback();
	}

	/**
	 * Zooms the viewport to the previous zoom level.
	 * 
	 * @returns {void}
	 */
	zoomOut() {
		this.zoomTo(this.#zoomLevel - 1);
		if (typeof(this.zoomOutCallback) == "function") this.zoomOutCallback();
	}

	/**
	 * Zooms the viewport to the specified zoom level.
	 * 
	 * @param {number} zoomLevel
	 * @returns {void}
	 */
	zoomTo(zoomLevel) {
		let offsetX = this.#scrollToOffset(this.viewport.scrollLeft, false);
		let offsetY = this.#scrollToOffset(this.viewport.scrollTop, true);
		this.#zoomLevel = this.#clampZoomLevel(zoomLevel);
		this.#applyCurrentZoomLevel();
		this.scrollViewportByOffset(offsetX, offsetY);
		this.#updateZoomTriggers();
		if (typeof(this.zoomCallback) == "function") this.zoomCallback();
	}

	/**
	 * Scrolls the viewport to the positions defined by the X and Y relative offsets.
	 * 
	 * @param {number|null} offsetX
	 * @param {number|null} offsetY
	 * @returns {void}
	 */
	scrollViewportByOffset(offsetX, offsetY) {
		this.viewport.scrollTo({
			top: this.#offsetToScroll(offsetY, true),
			left: this.#offsetToScroll(offsetX, false)
		});
	}

	/**
	 * Scrolls the viewport to the defined scroll positions.
	 * 
	 * @param {number} scrollTop
	 * @param {number} scrollLeft
	 * @returns {void}
	 */
	scrollViewportTo(scrollTop, scrollLeft) {
		this.viewport.scrollTo({
			top: scrollTop,
			left: scrollLeft
		});
	}

	/**
	 * Scrolls the viewport to the specified element.
	 * 
	 * @param {Element} elem
	 * @param {string} behavior
	 * @returns {void}
	 */
	scrollViewportToElem(elem, behavior = "smooth") {
		if (!this.viewport.contains(elem)) return;
		let viewport = this.viewport;
		let viewportRect = viewport.getBoundingClientRect();
		let elemRect = elem.getBoundingClientRect();
		let top = elemRect.top - (viewportRect.top - viewport.scrollTop);
		let left = elemRect.left - (viewportRect.left - viewport.scrollLeft);
		viewport.scrollTo({
			top: top - (viewport.offsetHeight / 2),
			left: left - (viewport.offsetWidth / 2),
			behavior: behavior
		});
	}

	/**
	 * Destroys the tour.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.wrapper.removeAttribute("tabindex");
		this.wrapper.classList.remove(this.isInitializedClass);
		this.wrapper.classList.remove(this.hasHistoryClass);
		this.wrapper.classList.remove(this.hasZoomClass);
		this.#destroyScenes();
		this.#resetZoomLevel();
		this.#resetBackTrigger();
		this.#resetZoomTriggers();
		this.#resetProperties();
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the maximum available zoom level.
	 * 
	 * @returns {number}
	 */
	get maxZoomLevel() {
		return this.zoomLevelClasses.length - 1;
	}

	/**
	 * Applies the specified scene as selected.
	 * 
	 * @param {TourScene} selectedScene
	 * @returns {void}
	 */
	#applySceneAsSelected(selectedScene) {
		this.scenes.forEach((scene) => {
			scene.wrapper.classList.remove(this.isSelectedClass);
			if (scene == selectedScene) {
				scene.wrapper.classList.add(this.isSelectedClass);
			}
		});
	}

	/**
	 * Adds the specified scene to the history.
	 * 
	 * @param {TourScene} scene
	 * @returns {void}
	 */
	#addSceneToHistory(scene) {
		this.#sceneHistory.push(scene);
		this.#zoomLevelHistory.push(this.#zoomLevel);
		this.#offsetHistory.push([
			this.#scrollToOffset(this.viewport.scrollLeft, false),
			this.#scrollToOffset(this.viewport.scrollTop, true)
		]);
	}

	/**
	 * Removes the current scene from the scene history and retrieves the previous one.
	 * 
	 * @returns {TourScene|undefined}
	 */
	#removeCurrentAndPopPrevSceneFromHistory() {
		let removedScene = this.#sceneHistory.pop();
		if (this.#sceneHistory.length) {
			return this.#sceneHistory[this.#sceneHistory.length - 1];
		}
	}

	/**
	 * Removes and retrieves the zoom-level of the previous scene from the zoom level history.
	 * 
	 * @returns {number|undefined}
	 */
	#popPrevZoomLevelFromHistory() {
		return this.#zoomLevelHistory.pop();
	}

	/**
	 * Removes and retrieves the X and Y offsets of the previous scene from the offset history.
	 * 
	 * @returns {Array<[number, number]>|undefined}
	 */
	#popPrevOffsetsFromHistory() {
		return this.#offsetHistory.pop();
	}

	/**
	 * Detects whether history is available for the tour.
	 * 
	 * @returns {void}
	 */
	#detectHasHistory() {
		this.#updateBackTrigger();
		this.wrapper.classList.remove(this.hasHistoryClass);
		if (this.#sceneHistory.length > 1) {
			this.wrapper.classList.add(this.hasHistoryClass);
		}
	}

	/**
	 * Disables the back trigger when history is not available for the tour.
	 * 
	 * @returns {void}
	 */
	#updateBackTrigger() {
		this.backTrigger.removeAttribute("disabled");
		if (this.#sceneHistory.length < 2) {
			this.backTrigger.setAttribute("disabled", "disabled");
		}
	}

	/**
	 * Retrieves the clamped value of the specified zoom level to ensure it stays within the available range.
	 * 
	 * @param {number} zoomLevel
	 * @returns {number}
	 */
	#clampZoomLevel(zoomLevel) {
		return Math.min(Math.max(0, zoomLevel), this.maxZoomLevel);
	}

	/**
	 * Applies the currently set zoom level.
	 * 
	 * @returns {void}
	 */
	#applyCurrentZoomLevel() {
		this.zoomLevelClasses.forEach((zoomLevelClass, index) => {
			this.wrapper.classList.remove(zoomLevelClass);
			if (this.#zoomLevel == index) {
				this.wrapper.classList.add(zoomLevelClass);
			}
		});
	}

	/**
	 * Disables the zoom-in and zoom-out triggers when the maximum or minimum zoom level is reached.
	 * 
	 * @returns {void}
	 */
	#updateZoomTriggers() {
		this.#updateZoomInTrigger();
		this.#updateZoomOutTrigger();
	}

	/**
	 * Disables the zoom-in trigger when the maximum zoom level is reached.
	 * 
	 * @returns {void}
	 */
	#updateZoomInTrigger() {
		if (!this.zoomInTrigger) return;
		this.zoomInTrigger.removeAttribute("disabled");
		if (this.#zoomLevel >= this.maxZoomLevel) {
			this.zoomInTrigger.setAttribute("disabled", "disabled");
		}
	}

	/**
	 * Disables the zoom-out trigger when the minimum zoom level is reached.
	 * 
	 * @returns {void}
	 */
	#updateZoomOutTrigger() {
		if (!this.zoomOutTrigger) return;
		this.zoomOutTrigger.removeAttribute("disabled");
		if (this.#zoomLevel < 1) {
			this.zoomOutTrigger.setAttribute("disabled", "disabled");
		}
	}

	/**
	 * Converts the specified horizontal or vertical scroll position to an X or Y relative offset.
	 * 
	 * @param {boolean} isVertical
	 * @returns {number}
	 */
	#scrollToOffset(scrollVal, isVertical = false) {
		let viewport = this.viewport;
		let offset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		let scroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((scrollVal + (offset / 2)) / scroll) * 100;
	}

	/**
	 * Converts the specified X or Y relative offset to a horizontal or vertical scroll position.
	 * 
	 * @param {boolean} isVertical
	 * @returns {number}
	 */
	#offsetToScroll(offsetVal, isVertical = false) {
		let viewport = this.viewport;
		let offset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		let scroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((offsetVal / 100) * scroll) - (offset / 2);
	}

	/**
	 * Detects whether a tour scene trigger is clicked within the specified event and navigates to the scene if so.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#detectIsSceneTriggerClicked(event) {
		this.scenes.forEach((scene) => {
			scene.sceneTriggers.forEach((sceneTrigger) => {
				if (sceneTrigger.trigger == event.target) {
					this.goToSceneById(sceneTrigger.targetId);
				}
			});
		});
	}

	/**
	 * Starts the panning.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#panStart(event) {
		if(this.#isPanning) return;
		this.#isPanning = true;
		this.#panStartY = event.pageY - this.viewport.offsetTop;
		this.#panStartX = event.pageX - this.viewport.offsetLeft;
		this.#panStartScrollTop = this.viewport.scrollTop;
		this.#panStartScrollLeft = this.viewport.scrollLeft;
		this.wrapper.classList.add(this.isPanningClass);
		if (typeof(this.panStartCallback) == "function") this.panStartCallback();
	}

	/**
	 * Moves the panning.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#panMove(event) {
		if(!this.#isPanning) return;
		let panCurrY = event.pageY - this.viewport.offsetTop;
		let panCurrX = event.pageX - this.viewport.offsetLeft;
		let panCurrScrollTop = panCurrY - this.#panStartY;
		let panCurrScrollLeft = panCurrX - this.#panStartX;
		this.viewport.scrollTo({
			top: this.#panStartScrollTop - panCurrScrollTop,
			left: this.#panStartScrollLeft - panCurrScrollLeft,
			behavior: "instant"
		});
	}

	/**
	 * Ends the panning.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#panEnd(event) {
		if(!this.#isPanning) return;
		this.#isPanning = false;
		this.wrapper.classList.remove(this.isPanningClass);
		if (typeof(this.panEndCallback) == "function") this.panEndCallback();
	}

	/**
	 * Destroys the scenes of the tour.
	 * 
	 * @returns {void}
	 */
	#destroyScenes() {
		this.scenes.forEach((scene) => {
			scene.wrapper.classList.remove(this.isSelectedClass);
			scene.destroy();
		});
	}

	/**
	 * Resets the applied zoom level.
	 * 
	 * @returns {void}
	 */
	#resetZoomLevel() {
		this.zoomLevelClasses.forEach((zoomLevelClass, index) => {
			this.wrapper.classList.remove(zoomLevelClass);
		});
	}

	/**
	 * Resets the back trigger button.
	 * 
	 * @returns {void}
	 */
	#resetBackTrigger() {
		this.backTrigger.removeAttribute("disabled");
	}

	/**
	 * Resets the zoom trigger button.
	 * 
	 * @returns {void}
	 */
	#resetZoomTriggers() {
		if (this.zoomInTrigger) this.zoomInTrigger.removeAttribute("disabled");
		if (this.zoomOutTrigger) this.zoomOutTrigger.removeAttribute("disabled");
	}

	/**
	 * Resets the properties of the tour.
	 * 
	 * @returns {void}
	 */
	#resetProperties() {
		this.#sceneHistory = [];
		this.#zoomLevelHistory = [];
		this.#offsetHistory = [];
		this.#zoomLevel = 0;
		this.#isPanning = false;
		this.#panStartX = 0;
		this.#panStartY = 0;
		this.#panStartScrollLeft = 0;
		this.#panStartScrollTop = 0;
	}

	/**
	 * Adds event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("click", this);
		this.viewport.addEventListener("pointerdown", this);
		document.addEventListener("pointerup", this);
		document.addEventListener("pointermove", this);
	}

	/**
	 * Removes event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.wrapper.removeEventListener("click", this);
		this.viewport.removeEventListener("pointerdown", this);
		document.removeEventListener("pointerup", this);
		document.removeEventListener("pointermove", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				switch (event.target) {
					case this.backTrigger:
						this.goBack();
						break;
					case this.zoomInTrigger:
						this.zoomIn();
						break;
					case this.zoomOutTrigger:
						this.zoomOut();
						break;
					default:
						this.#detectIsSceneTriggerClicked(event);
				}
				break;
			case "pointermove":
				this.#panMove(event);
				break;
			case "pointerdown":
				this.#panStart(event);
				break;
			case "pointerup":
				this.#panEnd(event);
				break;
		}
	}
}

/**
 * Tour scene
 * This class is designed to create a scene within a tour.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourScene {

	/**
	 * The id of the tour scene.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * Represents the wrapper element that contains the image and the hotspots for interaction.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * List of triggers that navigate to another tour scene when clicked.
	 * 
	 * @type {Array<TourSceneTrigger>}
	 */
	sceneTriggers;

	/**
	 * The initial zoom level applied when the tour scene is selected.
	 * 
	 * @type {number}
	 */
	zoomLevel = 0;

	/**
	 * The X relative offset to which the tour scene is scrolled by default.
	 * 
	 * @type {number}
	 */
	offsetX = 50;

	/**
	 * The Y relative offset to which the tour scene is scrolled by default.
	 * 
	 * @type {number}
	 */
	offsetY = 50;

	/**
	 * Callback function that is called after the tour scene has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the tour scene has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a tour scene.
	 * 
	 * @param {Object} options
	 * @param {string} options.id
	 * @param {HTMLElement} options.wrapper
	 * @param {Array<TourSceneTrigger>} options.sceneTriggers
	 * @param {number} options.zoomLevel
	 * @param {number} options.offsetX
	 * @param {number} options.offsetY
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {TourScene}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.id !== "string") {
			throw "Tour scene \"id\" must be a string";
		}
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tour scene \"wrapper\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the tour scene
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the tour scene.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#destroySceneTriggers();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Destroys the tour scene triggers.
	 * 
	 * @returns {void}
	 */
	#destroySceneTriggers() {
		this.sceneTriggers.forEach((sceneTrigger) => {
			sceneTrigger.destroy();
		});
	}
}

/**
 * Tour scene trigger
 * This class is designed to create a trigger for a scene within a tour.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourSceneTrigger {

	/**
	 * The ID of the target tour scene.
	 * 
	 * @type {string}
	 */
	targetId;

	/**
	 * Represents the trigger button that navigates to the tour scene specified by the target ID.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * Callback function that is called after the tour scene trigger has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the tour scene trigger has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a tour scene trigger.
	 * 
	 * @param {Object} options
	 * @param {string} options.targetId
	 * @param {HTMLButtonElement} options.trigger
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {TourSceneTrigger}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.targetId !== "string") {
			throw "Tour scene trigger \"targetId\" must be a string";
		}
		if (!(options.trigger instanceof HTMLButtonElement)) {
			throw "Tour scene trigger \"trigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the tour scene trigger
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the tour scene trigger.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}
}

export { Tour, TourScene, TourSceneTrigger };