/**
 * Tour
 * This class is designed to create image-based clickable tours.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tour {

	/**
	 * Represents the wrapper element that includes all the scenes and the trigger button.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents the trigger button that reverts to the previous scene on click.
	 * 
	 * @type {HTMLButtonElement}
	 */
	backTrigger;

	/**
	 * List of scenes within the tour.
	 * 
	 * @type {Array<TourScene>}
	 */
	scenes;

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
	 * The class that is added to the wrapper when history is available for the tour.
	 * 
	 * @type {string}
	 */
	hasHistoryClass = "has-history";

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
	 * Callback function that is called after the previous scene is reverted in the history.
	 * 
	 * @type {function():void|null}
	 */
	goBackCallback = null;

	/**
	 * Callback function that is called after the tour has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * List of previously opened scenes in the tour.
	 * 
	 * @type {Array<TourScene>}
	 */
	sceneHistory = [];

	/**
	 * Creates a tour.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLButtonElement} options.backTrigger
	 * @param {Array<TourScene>} options.scenes
	 * @param {string} options.isInitializedClass
	 * @param {string} options.isSelectedClass
	 * @param {string} options.hasHistoryClass
	 * @param {function():void} options.initCallback
	 * @param {function(TourScene):void} options.selectSceneCallback
	 * @param {function():void} options.goBackCallback
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
				throw 'Tour \"scene\" must be a `TourScene`';
			}
			if (sceneIds.includes(scene.id)) {
				throw 'Tour \"scene\" ids must be unique';
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
		this.selectScene(this.scenes[0]);
		this.wrapper.classList.add(this.isInitializedClass);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Selects the specified scene.
	 * 
	 * @param {TourScene} scene
	 * @param {boolean} addToHistory
	 * @returns {void}
	 */
	selectScene(scene, addToHistory = true) {
		this.#updateSelectedSceneClass(scene);
		if (addToHistory) this.sceneHistory.push(scene);
		this.#isHistoryUpdated();
		if (typeof(this.selectSceneCallback) == "function") this.selectSceneCallback(scene);
	}

	/**
	 * Selects the scene by the specified ID.
	 * 
	 * @param {string} id
	 * @returns {void}
	 */
	selectSceneById(id) {
		let scene = this.getSceneById(id);
		if (scene) this.selectScene(scene);
	}

	/**
	 * Retrieves the scene with the specified ID.
	 * 
	 * @param {string} id
	 * @returns {Scene|undefined}
	 */
	getSceneById(id) {
		return this.scenes.find((scene) => scene.id == id);
	}

	/**
	 * Reverts to the previous scene in the history within the tour.
	 * 
	 * @returns {void}
	 */
	goBack() {
		if (this.sceneHistory.length < 2) return;
		let removedScene = this.sceneHistory.pop();
		if (this.sceneHistory.length) {
			let lastIndex = this.sceneHistory.length - 1;
			let lastScene = this.sceneHistory[lastIndex];
			this.selectScene(lastScene, false);
			lastScene.sceneTriggers.forEach((sceneTrigger) => {
				if (sceneTrigger.targetId == removedScene.id) {
					sceneTrigger.trigger.focus();
				}
			});
		}
		if (typeof(this.goBackCallback) == "function") this.goBackCallback();
	}

	/**
	 * Destroys the tour.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.wrapper.classList.remove(this.isInitializedClass);
		this.wrapper.classList.remove(this.hasHistoryClass);
		this.backTrigger.removeAttribute("disabled");
		this.scenes.forEach((scene) => {
			scene.wrapper.classList.remove(this.isSelectedClass);
			scene.destroy();
		});
		this.sceneHistory = [];
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Executes after the history has been updated.
	 * 
	 * @returns {void}
	 */
	#isHistoryUpdated() {
		this.#updateHasHistoryClass();
		this.#updateBackTrigger();
	}

	/**
	 * Adds the class to the wrapper when history is available for the tour.
	 * 
	 * @returns {void}
	 */
	#updateHasHistoryClass() {
		this.wrapper.classList.remove(this.hasHistoryClass);
		if (this.sceneHistory.length > 1) {
			this.wrapper.classList.add(this.hasHistoryClass);
		}
	}

	/**
	 * Disables the back trigger when history is not available for the tour.
	 * 
	 * @returns {void}
	 */
	#updateBackTrigger() {
		this.backTrigger.setAttribute("disabled", "disabled");
		if (this.sceneHistory.length > 1) {
			this.backTrigger.removeAttribute("disabled");
		}
	}

	/**
	 * Adds the class to the selected scene and removes it from others.
	 * 
	 * @param {TourScene} selectedScene
	 * @returns {void}
	 */
	#updateSelectedSceneClass(selectedScene) {
		this.scenes.forEach((scene) => {
			scene.wrapper.classList.remove(this.isSelectedClass);
		});
		selectedScene.wrapper.classList.add(this.isSelectedClass);
	}

	/**
	 * Executes after the tour wrapper is clicked.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#isWrapperClicked(event) {
		this.scenes.forEach((scene) => {
			scene.sceneTriggers.forEach((sceneTrigger) => {
				if (sceneTrigger.trigger == event.target) {
					this.selectSceneById(sceneTrigger.targetId);
				}
			});
		});
	}

	/**
	 * Adds event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("click", this);
	}

	/**
	 * Removes event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.wrapper.removeEventListener("click", this);
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
				if (this.backTrigger === event.target) {
					this.goBack();
				} else if (this.wrapper.contains(event.target)) {
					this.#isWrapperClicked(event);
				}
				break;
		}
	}
}

/**
 * Tour scene
 * This class is designed to create a scene for a tour.
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
	 * Represents the wrapper element that contains the image and the available hotspots for interaction.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * List of triggers within the tour scene.
	 * 
	 * @type {Array<TourSceneTrigger>}
	 */
	sceneTriggers;

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
	 * @param {NodeList} options.sceneTriggers
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
		this.sceneTriggers.forEach((sceneTrigger) => {
			sceneTrigger.destroy();
		});
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
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
	 * Represents the trigger button that directs to the scene specified by the target ID.
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