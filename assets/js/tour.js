/**
 * Tour
 * This class is designed to create image-based pannable and zoomable tours with multiple scenes.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tour {

	/**
	 * The wrapper element that includes all the scenes and triggers.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The viewport element that displays the scenes and can be panned and zoomed.
	 * 
	 * @type {HTMLElement}
	 */
	viewport;

	/**
	 * The trigger button that navigates back to the previous scene when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	backTrigger;

	/**
	 * An array of of scenes.
	 * 
	 * @type {TourScene[]}
	 */
	scenes;

	/**
	 * The zoom-in button that zooms the viewport to the next zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomInTrigger = null;

	/**
	 * The zoom-out button that zooms the viewport to the previous zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomOutTrigger = null;

	/**
	 * An array of classes added to the wrapper at the specified zoom level index.
	 * 
	 * @type {string[]}
	 */
	zoomLevelClasses = [
		"tour--zoom-0",
		"tour--zoom-1",
		"tour--zoom-2",
		"tour--zoom-3",
		"tour--zoom-4",
		"tour--zoom-5",
		"tour--zoom-6",
		"tour--zoom-7",
		"tour--zoom-8",
		"tour--zoom-9",
		"tour--zoom-10",
		"tour--zoom-11"
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
	 * Indicates whether the wheel zoom is enabled only if the ctrl key is pressed.
	 * 
	 * @type {boolean}
	 */
	ctrlWheel = true;

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
	 * Callback function that is called after the pinching has started.
	 * 
	 * @type {function():void|null}
	 */
	pinchStartCallback = null;

	/**
	 * Callback function that is called after the pinching has ended.
	 * 
	 * @type {function():void|null}
	 */
	pinchEndCallback = null;

	/**
	 * List of previously opened scenes.
	 * 
	 * @type {TourScene[]}
	 */
	#sceneHistory = [];

	/**
	 * List of zoom-levels recorded when a scene is added to the history.
	 * 
	 * @type {number[]}
	 */
	#zoomLevelHistory = [];

	/**
	 * List of X and Y relative offsets recorded when a scene is added to the history.
	 * 
	 * @type {[number, number][]}
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
	 * Indicates whether the viewport is currently being pinched.
	 * 
	 * @type {boolean}
	 */
	#isPinching = false;

	/**
	 * The distance between the two fingers when pinching has been started.
	 * 
	 * @type {number}
	 */
	#pinchStartDistance = 0;

	/**
	 * The zoom level when pinching has been started.
	 * 
	 * @type {number}
	 */
	#pinchStartZoomLevel = 0;

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
	 * The maximum available zoom level.
	 * 
	 * @returns {number}
	 */
	get maxZoomLevel() {
		return this.zoomLevelClasses.length - 1;
	}

	/**
	 * The current applied zoom level.
	 * 
	 * @type {number}
	 */
	get zoomLevel() {
		return this.#zoomLevel;
	}

	/**
	 * Creates a tour.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that includes all the scenes and triggers.
	 * @param {HTMLElement} options.viewport - The viewport element that displays the scenes and can be panned and zoomed.
	 * @param {HTMLButtonElement} options.backTrigger - The trigger button that navigates back to the previous scene when clicked.
	 * @param {TourScene[]} options.scenes - An array of of scenes.
	 * @param {HTMLButtonElement|null} options.zoomInTrigger - The zoom-in button that zooms the viewport to the next zoom level when clicked.
	 * @param {HTMLButtonElement|null} options.zoomOutTrigger - The zoom-out button that zooms the viewport to the previous zoom level when clicked.
	 * @param {string[]} options.zoomLevelClasses - An array of classes added to the wrapper at the specified zoom level index.
	 * @param {string} options.isInitializedClass - The class that is added to the wrapper after the tour has been initialized.
	 * @param {string} options.isSelectedClass - The class that is added to the wrapper of the scene when it is selected.
	 * @param {string} options.isPanningClass - The class that is added to the wrapper while the viewport is being panned.
	 * @param {string} options.hasHistoryClass - The class that is added to the wrapper when history is available.
	 * @param {string} options.hasZoomClass - The class that is added to the wrapper when zoom is available.
	 * @param {boolean} options.ctrlWheel - Indicates whether the wheel zoom is enabled only if the ctrl key is pressed.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the tour has been initialized.
	 * @param {function(TourScene):void|null} options.selectSceneCallback - 
	 * @param {function():void|null} options.goToSceneCallback - Callback function that is called after the next scene is selected.
	 * @param {function():void|null} options.goBackCallback - Callback function that is called after the previous scene is reverted.
	 * @param {function():void|null} options.zoomInCallback - Callback function that is called after the viewport is zoomed to the next zoom level.
	 * @param {function():void|null} options.zoomOutCallback - Callback function that is called after the viewport is zoomed to the previous zoom level.
	 * @param {function():void|null} options.zoomCallback - Callback function that is called after the viewport is zoomed to a different zoom level.
	 * @param {function():void|null} options.panStartCallback - Callback function that is called after the panning has started.
	 * @param {function():void|null} options.panEndCallback - Callback function that is called after the panning has ended.
	 * @param {function():void|null} options.pinchStartCallback - Callback function that is called after the pinching has started.
	 * @param {function():void|null} options.pinchEndCallback - Callback function that is called after the pinching has ended.
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
		options.scenes.forEach((scene) => {
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
	 * @param {TourScene} scene - The scene to navigate to.
	 * @param {boolean} setFocus - Indicates whether to set focus to the scene after navigating.
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
	 * @param {string} id - The ID of the scene.
	 * @param {boolean} setFocus - Indicates whether to set focus to the scene after navigating.
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
	 * @param {TourScene} scene - The scene to be selected.
	 * @param {number} offsetX - The X relative offset to which the scene is scrolled by default.
	 * @param {number} offsetY - The Y relative offset to which the scene is scrolled by default.
	 * @param {number} zoomLevel - The zoom level to which the scene is zoomed by default.
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
	 * @param {string} id - The ID of the scene to be selected.
	 * @param {number} offsetX - The X relative offset to which the scene is scrolled by default.
	 * @param {number} offsetY - The Y relative offset to which the scene is scrolled by default.
	 * @param {number} zoomLevel - The zoom level to which the scene is zoomed by default.
	 * @returns {void}
	 */
	selectSceneById(id, offsetX, offsetY, zoomLevel) {
		let scene = this.getSceneById(id);
		if (scene) this.selectScene(scene, offsetX, offsetY, zoomLevel);
	}

	/**
	 * Retrieves the scene with the specified ID.
	 * 
	 * @param {string} id - The ID of the scene.
	 * @returns {TourScene|undefined} The found scene, or `undefined` if no scene is found.
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
	 * @param {number} zoomLevel - The zoom level to zoom to.
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
	 * Zooms the viewport to the specified zoom level while keeping the X and Y points stationary during the zoom.
	 * 
	 * @param {number} zoomLevel - The zoom level to zoom to.
	 * @param {number} x - The X coordinate to keep stationary during the zoom.
	 * @param {number} y - The Y coordinate to keep stationary during the zoom.
	 * @returns {void}
	 */
	anchorZoomTo(zoomLevel, x, y) {
		const rect = this.viewport.getBoundingClientRect();
		const viewAbsX = x - rect.left;
		const viewAbsY = y - rect.top;
		const mapAbsX = viewAbsX + this.viewport.scrollLeft;
		const mapAbsY = viewAbsY + this.viewport.scrollTop;
		const mapRelX = mapAbsX / this.viewport.scrollWidth;
		const mapRelY = mapAbsY / this.viewport.scrollHeight;
		const viewRelX = viewAbsX / this.viewport.offsetWidth;
		const viewRelY = viewAbsY / this.viewport.offsetHeight;
		this.zoomTo(zoomLevel);
		const newMapAbsY = mapRelY * this.viewport.scrollHeight;
		const newMapAbsX = mapRelX * this.viewport.scrollWidth;
		this.viewport.scrollTo({
			top: newMapAbsY - (this.viewport.offsetHeight * viewRelY),
			left: newMapAbsX - (this.viewport.offsetWidth * viewRelX)
		});
	}

	/**
	 * Scrolls the viewport to the positions defined by the X and Y relative offsets.
	 * 
	 * @param {number|null} offsetX - The X relative offset.
	 * @param {number|null} offsetY - The Y relative offset.
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
	 * @param {number} scrollTop - The top scroll position.
	 * @param {number} scrollLeft - The left scroll position.
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
	 * @param {Element} elem - The element to scroll the viewport to.
	 * @param {string} behavior - The behavior of the scroll.
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
	 * Applies the specified scene as selected.
	 * 
	 * @param {TourScene} selectedScene - The selected scene.
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
	 * @param {TourScene} scene - The scene to be added.
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
	 * @returns {TourScene|undefined} The previous scene, or `undefined` if no previous scene is available.
	 */
	#removeCurrentAndPopPrevSceneFromHistory() {
		this.#sceneHistory.pop();
		if (this.#sceneHistory.length) {
			return this.#sceneHistory[this.#sceneHistory.length - 1];
		}
	}

	/**
	 * Removes and retrieves the zoom-level of the previous scene from the zoom level history.
	 * 
	 * @returns {number|undefined} The previous zoom level, or `undefined` if no previous zoom level is available.
	 */
	#popPrevZoomLevelFromHistory() {
		return this.#zoomLevelHistory.pop();
	}

	/**
	 * Removes and retrieves the X and Y offsets of the previous scene from the offset history.
	 * 
	 * @returns {[number, number][]|undefined} The previous X and Y offsets, or `undefined` if no previous X and Y offsets are available.
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
	 * Retrieves the clamped value of the specified zoom level to ensure it stays within the available range.
	 * 
	 * @param {number} zoomLevel - The zoom level to be clamped.
	 * @returns {number} The clamped zoom level.
	 */
	#clampZoomLevel(zoomLevel) {
		return Math.min(Math.max(0, zoomLevel), this.maxZoomLevel);
	}

	/**
	 * Converts the specified horizontal or vertical scroll position to an X or Y relative offset.
	 * 
	 * @param {number} scrollPosition - The scroll position to be converted.
	 * @param {boolean} isVertical - Indicates whether the scroll position is vertical or horizontal.
	 * @returns {number} The converted relative offset.
	 */
	#scrollToOffset(scrollPosition, isVertical = false) {
		let viewport = this.viewport;
		let offset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		let scroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((scrollPosition + (offset / 2)) / scroll) * 100;
	}

	/**
	 * Converts the specified X or Y relative offset to a horizontal or vertical scroll position.
	 * 
	 * @param {number} offsetPosition - The relative offset to be converted.
	 * @param {boolean} isVertical - Indicates whether the relative offset is vertical or horizontal.
	 * @returns {number} The converted scroll position.
	 */
	#offsetToScroll(offsetPosition, isVertical = false) {
		let viewport = this.viewport;
		let offset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		let scroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((offsetPosition / 100) * scroll) - (offset / 2);
	}

	/**
	 * Retrieves the pinch distance between the two fingers.
	 * 
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {number} The distance between the two fingers.
	 */
	#getPinchDistance(event) {
		if (event.touches.length !== 2) return 0;
		const xDistance = event.touches[0].pageX - event.touches[1].pageX;
		const yDistance = event.touches[0].pageY - event.touches[1].pageY;
		return Math.hypot(xDistance, yDistance);
	}

	/**
	 * Detects whether a tour scene trigger is clicked within the specified event and navigates to the scene if so.
	 * 
	 * @param {PointerEvent} event - The event to be handled.
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
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#panStart(event) {
		if(this.#isPanning || this.#isPinching) return;
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
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#panMove(event) {
		if(!this.#isPanning || this.#isPinching) return;
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
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#panEnd(event) {
		if(!this.#isPanning || this.#isPinching) return;
		this.#isPanning = false;
		this.wrapper.classList.remove(this.isPanningClass);
		if (typeof(this.panEndCallback) == "function") this.panEndCallback();
	}

	/**
	 * Starts the pinching.
	 * 
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#pinchStart(event) {
		if (event.touches.length !== 2) return;
		this.#isPanning = false;
		this.#isPinching = true;
		this.#pinchStartDistance = this.#getPinchDistance(event);
		this.#pinchStartZoomLevel = this.#zoomLevel;
		if (typeof(this.pinchStartCallback) == "function") this.pinchStartCallback();
	}

	/**
	 * Moves the pinching.
	 * 
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#pinchMove(event) {
		if (!this.#isPinching) return;
		const zoomLevel = this.#getPinchZoomLevel(event);
		if (this.#zoomLevel !== zoomLevel && zoomLevel <= this.maxZoomLevel && zoomLevel >= 0) {
			const y = ((event.touches[0].pageY + event.touches[1].pageY) / 2);
			const x = ((event.touches[0].pageX + event.touches[1].pageX) / 2);
			this.anchorZoomTo(zoomLevel, x, y);
		}
	}

	/**
	 * Retrieves the zoom level calculated from the start and the current pinch distances.
	 * 
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {number}
	 */
	#getPinchZoomLevel(event) {
		const startDist = this.#pinchStartDistance;
		const currDist = this.#getPinchDistance(event);
		if (currDist < startDist) {
			const zoomDiff = Math.floor(startDist / currDist);
			return this.#pinchStartZoomLevel - zoomDiff;
		} else {
			const zoomDiff = Math.floor(currDist / startDist);
			return this.#pinchStartZoomLevel + zoomDiff;
		}
	}

	/**
	 * Ends the pinching.
	 * 
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#pinchEnd(event) {
		if (!this.#isPinching) return;
		this.#isPinching = false;
		if (typeof(this.pinchEndCallback) == "function") this.pinchEndCallback();
	}

	/**
	 * Zooms the viewport on mouse wheel.
	 * 
	 * @param {WheelEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#wheelZoom(event) {
		if (!event.ctrlKey && this.ctrlWheel) return;
		event.preventDefault();
		let zoomLevel = event.deltaY < 0 ? this.#zoomLevel + 1 : this.#zoomLevel - 1;
		if (zoomLevel <= this.maxZoomLevel && zoomLevel >= 0) {
			this.anchorZoomTo(zoomLevel, event.x, event.y);
		}
	}

	/**
	 * Adds event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("contextmenu", this);
		this.wrapper.addEventListener("click", this);
		this.wrapper.addEventListener("wheel", this);
		this.viewport.addEventListener("pointerdown", this, { passive: true });
		this.viewport.addEventListener("touchstart", this, { passive: true });
		document.addEventListener("pointerup", this, { passive: true });
		document.addEventListener("pointermove", this, { passive: true });
		document.addEventListener("touchmove", this, { passive: true });
		document.addEventListener("touchend", this, { passive: true });
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
			case "wheel":
				this.#wheelZoom(event);
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
			case "touchstart":
				this.#pinchStart(event);
				break;
			case "touchmove":
				this.#pinchMove(event);
				break;
			case "touchend":
				this.#pinchEnd(event);
				break;
			case "contextmenu":
				event.preventDefault();
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
	 * The wrapper element that contains the image and the hotspots for interaction.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * An array of triggers that navigate to another tour scene when clicked.
	 * 
	 * @type {TourSceneTrigger[]}
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
	 * Creates a tour scene.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The id of the tour scene.
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the image and the hotspots for interaction.
	 * @param {TourSceneTrigger[]} options.sceneTriggers - An array of triggers that navigate to another tour scene when clicked.
	 * @param {number} options.zoomLevel - The initial zoom level applied when the tour scene is selected.
	 * @param {number} options.offsetX - The X relative offset to which the tour scene is scrolled by default.
	 * @param {number} options.offsetY - The Y relative offset to which the tour scene is scrolled by default.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the tour scene has been initialized.
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
	 * The trigger button that navigates to the tour scene specified by the target ID.
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
	 * Creates a tour scene trigger.
	 * 
	 * @param {Object} options
	 * @param {string} options.targetId - The ID of the target tour scene.
	 * @param {HTMLButtonElement} options.trigger - The trigger button that navigates to the tour scene specified by the target ID.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the tour scene trigger has been initialized.
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
}

export { Tour, TourScene, TourSceneTrigger };