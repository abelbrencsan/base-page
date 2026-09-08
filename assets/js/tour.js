/**
 * Tour
 * This class is designed to create virtual tours with multiple scenes.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tour {

	/**
	 * The wrapper element that includes all the scenes and control triggers.
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
	 * The trigger button that navigates back to the previous scene within the history when clicked.
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
	 * An array of triggers that navigate from one scene to another when clicked.
	 * 
	 * @type {TourSceneTrigger[]}
	 */
	sceneTriggers = [];

	/**
	 * An array of popovers that belong to the tour.
	 * 
	 * @type {TourPopover[]}
	 */
	popovers = [];

	/**
	 * The zoom-in trigger button that zooms the viewport to the next zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomInTrigger = null;

	/**
	 * The zoom-out trigger button that zooms the viewport to the previous zoom level when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	zoomOutTrigger = null;

	/**
	 * The trigger button that navigates back to the first scene within the history when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	backToRootTrigger = null;

	/**
	 * The trigger button that toggles fullscreen mode when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	fullscreenTrigger = null;

	/**
	 * The trigger button that mutes or unmutes the audio when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	muteTrigger = null;

	/**
	 * The audio element played in a loop in the background.
	 * 
	 * @type {HTMLAudioElement|null}
	 */
	backgroundAudio = null;

	/**
	 * The audio element used when changing scenes.
	 * 
	 * @type {HTMLAudioElement|null}
	 */
	changeSceneAudio = null;

	/**
	 * The audio element played when the zoom-in or zoom-out trigger is clicked.
	 * 
	 * @type {HTMLAudioElement|null}
	 */
	zoomAudio = null;

	/**
	 * The audio element played when a popover is opened.
	 * 
	 * @type {HTMLAudioElement|null}
	 */
	openPopoverAudio = null;

	/**
	 * The audio element played when a popover is closed.
	 * 
	 * @type {HTMLAudioElement|null}
	 */
	closePopoverAudio = null;

	/**
	 * The class that is added to the wrapper after the tour has been initialized.
	 * 
	 * @type {string}
	 */
	isInitializedClass = "is-initialized";

	/**
	 * The class that is added to the wrapper when the zoom is enabled for the selected scene.
	 * 
	 * @type {string}
	 */
	hasZoomClass = "has-zoom";

	/**
	 * The class that is added to the wrapper when previous scenes are available within the history.
	 * 
	 * @type {string}
	 */
	hasHistoryClass = "has-history";

	/**
	 * The class that is added to the wrapper while the scene is being panned.
	 * 
	 * @type {string}
	 */
	isPanningClass = "is-panning";

	/**
	 * The class that is added to the wrapper while the scene is being pinched.
	 * 
	 * @type {string}
	 */
	isPinchingClass = "is-pinching";

	/**
	 * The class that is added to the wrapper when the fullscreen API is supported by the browser.
	 * 
	 * @type {string}
	 */
	hasFullscreenSupportClass = "has-fullscreen-support";

	/**
	 * The class that is added to the wrapper when the audio is muted.
	 * 
	 * @type {string}
	 */
	isMutedClass = "is-muted";

	/**
	 * The class that is added to the wrapper while a popover is open.
	 * 
	 * @type {string}
	 */
	hasOpenedPopoverClass = "has-opened-popover";

	/**
	 * Indicates whether the wheel zoom is enabled only if the ctrl key is pressed.
	 * 
	 * @type {boolean}
	 */
	ctrlWheel = true;

	/**
	 * Callback function that is called after the tour has been initialized.
	 * 
	 * @type {function(Tour):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the next scene is selected.
	 * 
	 * @type {function(Tour,TourScene):void|null}
	 */
	goToSceneCallback = null;

	/**
	 * Callback function that is called after the previous scene is reverted.
	 * 
	 * @type {function(Tour,TourScene):void|null}
	 */
	goBackCallback = null;

	/**
	 * Callback function that is called after the root scene is reverted.
	 * 
	 * @type {function(Tour,TourScene):void|null}
	 */
	goBackToRootCallback = null;

	/**
	 * Callback function that is called after fullscreen mode is entered or exited.
	 * 
	 * @type {function(Tour):void|null}
	 */
	fullscreenChangeCallback = null;

	/**
	 * Callback function that is called after the tour is muted.
	 * 
	 * @type {function(Tour):void|null}
	 */
	muteCallback = null;

	/**
	 * Callback function that is called after the tour is unmuted.
	 * 
	 * @type {function(Tour):void|null}
	 */
	unmuteCallback = null;

	/**
	 * Callback function that is called while a popover is opening.
	 * 
	 * @type {function(Tour,ToggleEvent):void|null}
	 */
	popoverOpeningCallback = null;

	/**
	 * Callback function that is called while a popover is closing.
	 * 
	 * @type {function(Tour,ToggleEvent):void|null}
	 */
	popoverClosingCallback = null;

	/**
	 * Callback function that is called after a scene trigger is clicked.
	 * 
	 * @type {function(Tour,TourSceneTrigger,PointerEvent):void|null}
	 */
	sceneTriggerClickCallback = null;

	/**
	 * The currently selected scene.
	 * 
	 * @type {TourScene|null}
	 */
	selectedScene = null;

	/**
	 * Indicates whether the selected scene is currently being panned.
	 * 
	 * @type {boolean}
	 */
	isPanning = false;

	/**
	 * Indicates whether the selected scene is currently being pinched.
	 * 
	 * @type {boolean}
	 */
	isPinching = false;

	/**
	 * An array of previously visited scenes and their override settings.
	 * 
	 * @type {TourHistoryEntry[]}
	 */
	history = [];

	/**
	 * Indicates whether the audio is muted.
	 * 
	 * @type {boolean}
	 */
	#isMuted = true;

	/**
	 * Creates a tour.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that includes all the scenes and control triggers.
	 * @param {HTMLElement} options.viewport - The viewport element that displays the scenes and can be panned and zoomed.
	 * @param {HTMLButtonElement} options.backTrigger - The trigger button that navigates back to the previous scene within the history when clicked.
	 * @param {TourScene[]} options.scenes - An array of of scenes.
	 * @param {TourSceneTrigger[]} options.sceneTriggers - An array of triggers that navigate from one scene to another when clicked.
	 * @param {TourPopover[]} options.popovers - An array of popovers that belong to the tour.
	 * @param {HTMLButtonElement|null} options.zoomInTrigger - The zoom-in trigger button that zooms the viewport to the next zoom level when clicked.
	 * @param {HTMLButtonElement|null} options.zoomOutTrigger - The zoom-out trigger button that zooms the viewport to the previous zoom level when clicked.
	 * @param {HTMLButtonElement|null} options.backToRootTrigger - The trigger button that navigates back to the first scene within the history when clicked.
	 * @param {HTMLButtonElement|null} options.fullscreenTrigger - The trigger button that toggles fullscreen mode when clicked.
	 * @param {HTMLButtonElement|null} options.muteTrigger - The trigger button that mutes or unmutes the audio when clicked.
	 * @param {HTMLAudioElement|null} options.backgroundAudio - The audio element played in a loop in the background.
	 * @param {HTMLAudioElement|null} options.changeSceneAudio - The audio element used when changing scenes.
	 * @param {HTMLAudioElement|null} options.zoomAudio - The audio element played when the zoom-in or zoom-out trigger is clicked.
	 * @param {HTMLAudioElement|null} options.openPopoverAudio - The audio element played when a popover is opened.
	 * @param {HTMLAudioElement|null} options.closePopoverAudio - The audio element played when a popover is closed.
	 * @param {string} options.isInitializedClass - The class that is added to the wrapper after the tour has been initialized.
	 * @param {string} options.hasZoomClass - The class that is added to the wrapper when the zoom is enabled for the selected scene.
	 * @param {string} options.hasHistoryClass - The class that is added to the wrapper when previous scenes are available within the history.
	 * @param {string} options.isPanningClass - The class that is added to the viewport while the scene is being panned.
	 * @param {string} options.isPinchingClass - The class that is added to the viewport while the scene is being pinched.
	 * @param {string} options.hasFullscreenSupportClass - The class that is added to the wrapper when the fullscreen API is supported by the browser.
	 * @param {string} options.isMutedClass - The class that is added to the wrapper when the audio is muted.
	 * @param {string} options.hasOpenedPopoverClass - The class that is added to the wrapper while a popover is open.
	 * @param {boolean} options.ctrlWheel - Indicates whether the wheel zoom is enabled only if the ctrl key is pressed.
	 * @param {function(Tour):void|null} options.initCallback - Callback function that is called after the tour has been initialized.
	 * @param {function(Tour,TourScene):void|null} options.goToSceneCallback - Callback function that is called after the next scene is selected.
	 * @param {function(Tour,TourScene):void|null} options.goBackCallback - Callback function that is called after the previous scene is reverted.
	 * @param {function(Tour,TourScene):void|null} options.goBackToRootCallback - Callback function that is called after the root scene is reverted.
	 * @param {function(Tour):void|null} options.fullscreenChangeCallback - Callback function that is called after fullscreen mode is entered or exited.
	 * @param {function(Tour):void|null} options.muteCallback - Callback function that is called after the tour is muted.
	 * @param {function(Tour):void|null} options.unmuteCallback - Callback function that is called after the tour is unmuted.
	 * @param {function(Tour,ToggleEvent):void|null} options.popoverOpeningCallback - Callback function that is called while a popover is opening.
	 * @param {function(Tour,ToggleEvent):void|null} options.popoverClosingCallback - Callback function that is called while a popover is closing.
	 * @param {function(Tour,TourSceneTrigger,PointerEvent):void|null} options.sceneTriggerClickCallback - Callback function that is called after a scene trigger is clicked.
	 * @returns {Tour}
	 */
	constructor(options) {

		// Test required options
		let sceneIds = [];
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tour \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.viewport instanceof HTMLElement)) {
			throw "Tour \"viewport\" must be an `HTMLElement`";
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
		this.wrapper = options.wrapper;
		this.viewport = options.viewport;
		this.backTrigger = options.backTrigger;
		this.scenes = options.scenes;
		if ("sceneTriggers" in options) this.sceneTriggers = options.sceneTriggers;
		if ("popovers" in options) this.popovers = options.popovers;
		if ("zoomInTrigger" in options) this.zoomInTrigger = options.zoomInTrigger;
		if ("zoomOutTrigger" in options) this.zoomOutTrigger = options.zoomOutTrigger;
		if ("backToRootTrigger" in options) this.backToRootTrigger = options.backToRootTrigger;
		if ("fullscreenTrigger" in options) this.fullscreenTrigger = options.fullscreenTrigger;
		if ("muteTrigger" in options) this.muteTrigger = options.muteTrigger;
		if ("backgroundAudio" in options) this.backgroundAudio = options.backgroundAudio;
		if ("changeSceneAudio" in options) this.changeSceneAudio = options.changeSceneAudio;
		if ("zoomAudio" in options) this.zoomAudio = options.zoomAudio;
		if ("openPopoverAudio" in options) this.openPopoverAudio = options.openPopoverAudio;
		if ("closePopoverAudio" in options) this.closePopoverAudio = options.closePopoverAudio;
		if ("isInitializedClass" in options) this.isInitializedClass = options.isInitializedClass;
		if ("hasZoomClass" in options) this.hasZoomClass = options.hasZoomClass;
		if ("hasHistoryClass" in options) this.hasHistoryClass = options.hasHistoryClass;
		if ("isPanningClass" in options) this.isPanningClass = options.isPanningClass;
		if ("isPinchingClass" in options) this.isPinchingClass = options.isPinchingClass;
		if ("hasFullscreenSupportClass" in options) this.hasFullscreenSupportClass = options.hasFullscreenSupportClass;
		if ("isMutedClass" in options) this.isMutedClass = options.isMutedClass;
		if ("hasOpenedPopoverClass" in options) this.hasOpenedPopoverClass = options.hasOpenedPopoverClass;
		if ("ctrlWheel" in options) this.ctrlWheel = options.ctrlWheel;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("goToSceneCallback" in options) this.goToSceneCallback = options.goToSceneCallback;
		if ("goBackCallback" in options) this.goBackCallback = options.goBackCallback;
		if ("goBackToRootCallback" in options) this.goBackToRootCallback = options.goBackToRootCallback;
		if ("fullscreenChangeCallback" in options) this.fullscreenChangeCallback = options.fullscreenChangeCallback;
		if ("muteCallback" in options) this.muteCallback = options.muteCallback;
		if ("unmuteCallback" in options) this.unmuteCallback = options.unmuteCallback;
		if ("popoverOpeningCallback" in options) this.popoverOpeningCallback = options.popoverOpeningCallback;
		if ("popoverClosingCallback" in options) this.popoverClosingCallback = options.popoverClosingCallback;
		if ("sceneTriggerClickCallback" in options) this.sceneTriggerClickCallback = options.sceneTriggerClickCallback;

		// Initialize the tour
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#changeScene(this.scenes[0]);
		this.#detectFullscreenSupport();
		this.#toggleMute();
		this.viewport.setAttribute("tabindex", "0");
		this.wrapper.classList.add(this.isInitializedClass);
		if (this.backgroundAudio) this.backgroundAudio.loop = true; 
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Navigates to the specified scene.
	 * 
	 * @param {TourScene} scene - The scene to navigate to.
	 * @returns {void}
	 */
	goToScene(scene) {
		this.#changeScene(scene);
		this.viewport.focus({ preventScroll: true });
		if (typeof(this.goToSceneCallback) == "function") this.goToSceneCallback(this, scene);
	}

	/**
	 * Navigates to the scene with the specified ID.
	 * 
	 * @param {string} id - The ID of the scene to navigate to.
	 * @returns {void}
	 */
	goToSceneById(id) {
		const scene = this.getSceneById(id);
		if (scene) this.goToScene(scene);
	}

	/**
	 * Navigates back to the previous scene in the history.
	 * 
	 * @returns {void}
	 */
	goBack() {
		const history = this.history.pop();
		if (history) {
			this.#changeScene(history.scene, false, history.overrides);
			if (!this.history.length) {
				this.viewport.focus({ preventScroll: true });
			}
			if (typeof(this.goBackCallback) == "function") this.goBackCallback(this, history.scene);
		}
	}

	/**
	 * Navigates back through the history to the scene with the specified ID.
	 * 
	 * @param {string} sceneId - The ID of the scene to navigate back to.
	 * @returns {void}
	 */
	goBackToScene(sceneId) {
		while (this.history.length) {
			this.goBack();
			if (this.selectedScene.id == sceneId) return;
		}
	}

	/**
	 * Navigates back to the root scene in the history.
	 * 
	 * @returns {void}
	 */
	goBackToRoot() {
		const history = this.history.shift();
		if (history) {
			this.history = [];
			this.#changeScene(history.scene, false, history.overrides);
			this.viewport.focus({ preventScroll: true });
			if (typeof(this.goBackCallback) == "function") this.goBackCallback(this, history.scene);
			if (typeof(this.goBackToRootCallback) == "function") this.goBackToRootCallback(this, history.scene);
		}
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
	 * Indicates whether the scene with the specified ID is included within the history.
	 * 
	 * @param {string} id - The ID of the scene.
	 * @returns {boolean} `true` if the scene is included in the history; otherwise, `false`.
	 */
	isHistoryIncludes(id) {
		return this.history.some((history) => history.scene.id == id);
	}

	/**
	 * Enters or exits fullscreen mode.
	 * 
	 * @returns {void}
	 */
	toggleFullscreen() {
		if (!this.wrapper.requestFullscreen) return;
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			this.wrapper.requestFullscreen();
		}
	}

	/**
	 * Mutes the tour.
	 * 
	 * @returns {void}
	 */
	mute() {
		this.#isMuted = true;
		if (this.backgroundAudio) this.backgroundAudio.pause();
		this.#toggleMute();
		if (typeof(this.muteCallback) == "function") this.muteCallback(this);
	}

	/**
	 * Unmutes the tour.
	 * 
	 * @returns {void}
	 */
	unmute() {
		this.#isMuted = false;
		if (this.backgroundAudio) this.backgroundAudio.play();
		this.#toggleMute();
		if (typeof(this.unmuteCallback) == "function") this.unmuteCallback(this);
	}

	/**
	 * Plays the specified audio once.
	 * 
	 * @param {HTMLAudioElement} audio - The audio to be played.
	 * @returns {void}
	 */
	playAudio(audio) {
		if (this.#isMuted) return;
		audio.play();
		audio.currentTime = 0;
	}

	/**
	 * Changes the current scene to the specified one.
	 * 
	 * @param {TourScene} selectedScene - The scene to be selected.
	 * @param {boolean} addToHistory - Indicates whether to add the previous scene to the history.
	 * @param {Map<string,any>} overrides - The override settings for the scene to be selected.
	 * @returns {void}
	 */
	#changeScene(selectedScene, addToHistory = true, overrides = new Map()) {
		if (this.selectedScene === selectedScene) return;
		if (this.selectedScene !== null) {
			if (addToHistory) {
				this.history.push(new TourHistoryEntry({
					scene: this.selectedScene,
					overrides: this.selectedScene.getOverrides(this)
				}));
			}
			this.selectedScene.deselect(this);
		}
		this.selectedScene = selectedScene;
		this.selectedScene.select(this, overrides);
		this.#toggleZoom();
		this.#toggleHistory();
		this.#toggleSceneTriggers();
		if (this.changeSceneAudio) this.playAudio(this.changeSceneAudio);
	}

	/**
	 * Enables or disables zoom for the selected scene.
	 * 
	 * @returns {void}
	 */
	#toggleZoom() {
		if (this.selectedScene instanceof TourMapScene) {
			this.wrapper.classList.add(this.hasZoomClass);
			this.#toggleZoomTriggers(...this.selectedScene.zoomLimits);
		} else {
			this.wrapper.classList.remove(this.hasZoomClass);
		}
	}

	/**
	 * Enables or disables the zoom trigger buttons based on whether the maximum or minimum zoom level has been reached.
	 * 
	 * @param {boolean} isMax - Indicates whether the maximum zoom level is reached.
	 * @param {boolean} isMin - Indicates whether the minimum zoom level is reached.
	 * @returns {void}
	 */
	#toggleZoomTriggers(isMax, isMin) {
		if (this.zoomInTrigger !== null) {
			this.zoomInTrigger.toggleAttribute("disabled", isMax);
		}
		if (this.zoomOutTrigger !== null) {
			this.zoomOutTrigger.toggleAttribute("disabled", isMin);
		}
	}

	/**
	 * Enables or disables the back trigger button based on whether any previous scene is available within the history.
	 * 
	 * @returns {void}
	 */
	#toggleHistory() {
		const hasHistory = this.history.length;
		this.wrapper.classList.toggle(this.hasHistoryClass, hasHistory);
		this.backTrigger.toggleAttribute("disabled", !hasHistory);
	}

	/**
	 * Adds or removes classes from the scene trigger buttons based on whether their scenes are active or included in the history.
	 * 
	 * @returns {void}
	 */
	#toggleSceneTriggers() {
		this.sceneTriggers.forEach((sceneTrigger) => {
			if (!this.selectedScene) return;
			const isInHistory = this.isHistoryIncludes(sceneTrigger.sceneId);
			const isSelected = sceneTrigger.sceneId == this.selectedScene.id;
			sceneTrigger.trigger.classList.toggle(sceneTrigger.isSceneInHistory, isInHistory);
			sceneTrigger.trigger.classList.toggle(sceneTrigger.isSceneSelected, isSelected);
		});
	}

	/**
	 * Detects whether the fullscreen API is supported by the browser.
	 * 
	 * @returns {void}
	 */
	#detectFullscreenSupport() {
		const hasSupport = typeof this.wrapper.requestFullscreen == "function";
		this.wrapper.classList.toggle(this.hasFullscreenSupportClass, hasSupport);
		if (this.fullscreenTrigger) {
			this.fullscreenTrigger.toggleAttribute("disabled", !hasSupport);
		}
	}

	/**
	 * Toggles the mute class on the wrapper element based on whether the tour is muted.
	 * 
	 * @returns {void}
	 */
	#toggleMute() {
		this.wrapper.classList.toggle(this.isMutedClass, this.#isMuted);
	}

	/**
	 * Executes after the browser switches into or out of fullscreen mode.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isFullscreenChanged(event) {
		this.popovers.forEach((popover) => popover.wrapper.hidePopover());
		if (typeof(this.fullscreenChangeCallback) == "function") this.fullscreenChangeCallback(this);
	}

	/**
	 * Executes before a popover opens.
	 * 
	 * @param {ToggleEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#isPopoverOpening(event) {
		this.popovers.forEach((popover) => popover.wrapper.hidePopover());
		this.wrapper.classList.add(this.hasOpenedPopoverClass);
		if (this.openPopoverAudio) this.playAudio(this.openPopoverAudio);
		if (typeof(this.popoverOpeningCallback) == "function") this.popoverOpeningCallback(this, event);
	}

	/**
	 * Executes before a popover closes.
	 * 
	 * @param {ToggleEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#isPopoverClosing(event) {
		this.wrapper.classList.remove(this.hasOpenedPopoverClass);
		if (this.closePopoverAudio) this.playAudio(this.closePopoverAudio);
		if (typeof(this.popoverClosingCallback) == "function") this.popoverClosingCallback(this, event);
	}

	/**
	 * Executes after a scene trigger is clicked.
	 * 
	 * @param {TourSceneTrigger} sceneTrigger - The scene trigger that was clicked.
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#isSceneTriggerClicked(sceneTrigger, event) {
		if (typeof(this.sceneTriggerClickCallback) == "function") this.sceneTriggerClickCallback(this, sceneTrigger, event);
	}

	/**
	 * Adds event listeners related to the tour.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("click", this);
		this.wrapper.addEventListener("wheel", this);
		this.wrapper.addEventListener("fullscreenchange", this);
		this.viewport.addEventListener("pointerdown", this, { passive: true });
		this.viewport.addEventListener("touchstart", this, { passive: true });
		document.addEventListener("pointerup", this, { passive: true });
		document.addEventListener("pointermove", this, { passive: true });
		document.addEventListener("touchmove", this, { passive: true });
		document.addEventListener("touchend", this, { passive: true });
		this.popovers.forEach((popover) => {
			popover.wrapper.addEventListener("beforetoggle", this);
		});
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
				this.sceneTriggers.forEach((sceneTrigger) => {
					if (sceneTrigger.trigger == event.target) {
						if (sceneTrigger.preferHistory && this.isHistoryIncludes(sceneTrigger.sceneId)) {
							this.goBackToScene(sceneTrigger.sceneId);
						} else {
							this.goToSceneById(sceneTrigger.sceneId);
						}
						this.#isSceneTriggerClicked(sceneTrigger, event);
					}
				});
				if (this.selectedScene instanceof TourMapScene) {
					if (this.zoomInTrigger !== null && event.target == this.zoomInTrigger) {
						this.selectedScene.zoomIn(this);
						this.#toggleZoomTriggers(...this.selectedScene.zoomLimits);
						if (this.zoomAudio) this.playAudio(this.zoomAudio);
					}
					if (this.zoomOutTrigger !== null && event.target == this.zoomOutTrigger) {
						this.selectedScene.zoomOut(this);
						this.#toggleZoomTriggers(...this.selectedScene.zoomLimits);
						if (this.zoomAudio) this.playAudio(this.zoomAudio);
					}
				}
				if (event.target == this.backTrigger) {
					this.goBack();
				}
				if (event.target == this.backToRootTrigger) {
					this.goBackToRoot();
				}
				if (event.target == this.fullscreenTrigger) {
					this.toggleFullscreen();
				}
				if (event.target == this.muteTrigger) {
					this.#isMuted ? this.unmute() : this.mute();
				}
				break;
			case "wheel":
				if (!event.ctrlKey && this.ctrlWheel) return;
				event.preventDefault();
				if (this.selectedScene instanceof TourMapScene) {
					this.selectedScene.wheelZoom(this, event);
					this.#toggleZoomTriggers(...this.selectedScene.zoomLimits);
				}
				break;
			case "pointermove":
				if (this.selectedScene !== null) {
					this.selectedScene.panMove(this, event);
				}
				break;
			case "pointerdown":
				if (this.selectedScene !== null) {
					this.selectedScene.panStart(this, event);
				}
				break;
			case "pointerup":
				if (this.selectedScene !== null) {
					this.selectedScene.panEnd(this, event);
				}
				break;
			case "touchstart":
				if (this.selectedScene instanceof TourMapScene) {
					this.selectedScene.pinchStart(this, event);
				}
				break;
			case "touchmove":
				if (this.selectedScene instanceof TourMapScene) {
					this.selectedScene.pinchMove(this, event);
					this.#toggleZoomTriggers(...this.selectedScene.zoomLimits);
				}
				break;
			case "touchend":
				if (this.selectedScene instanceof TourMapScene) {
					this.selectedScene.pinchEnd(this, event);
				}
				break;
			case "fullscreenchange":
				this.#isFullscreenChanged(event);
				break;
			case "beforetoggle":
				if (event.newState === "open") {
					this.#isPopoverOpening(event);
				} else {
					this.#isPopoverClosing(event);
				}
				break;
		}
	}
}

/**
 * Tour Scene
 * This class is designed to create a scene within a tour.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourScene {

	/**
	 * The id of the scene.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * The wrapper element that contains the image tiles and the hotspots.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The element that contains the image tiles.
	 * 
	 * @type {HTMLElement}
	 */
	tileList;

	/**
	 * The latitude and longitude of the scene's top-left corner, used to calculate the position of the included hotspots.
	 * 
	 * @type {TourSceneCoordinate}
	 */
	topLeftCoordinate;

	/**
	 * The latitude and longitude of the scene's bottom-right corner, used to calculate the position of the included hotspots.
	 * 
	 * @type {TourSceneCoordinate}
	 */
	bottomRightCoordinate;

	/**
	 * An array of hotspots within the scene.
	 * 
	 * @type {TourSceneHotspot[]}
	 */
	hotspots = [];

	/**
	 * The name of the CSS variable that defines the scene's aspect ratio.
	 * 
	 * @type {string}
	 */
	aspectRatioCSSVariable = "--tour-scene-aspect-ratio";

	/**
	 * The class that is added to the wrapper when the scene is selected.
	 * 
	 * @type {string}
	 */
	isSelectedClass = "is-selected";

	/**
	 * The class that is added to the wrapper when the image tiles within the scene are loaded.
	 * 
	 * @type {string}
	 */
	isLoadedClass = "is-loaded"

	/**
	 * The class that is added to the wrapper when the scene is vertical rather than horizontal.
	 * 
	 * @type {string}
	 */
	isVerticalClass = "is-vertical";

	/**
	 * Callback function that is called after the scene has been initialized.
	 * 
	 * @type {function(TourScene):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the scene is selected.
	 * 
	 * @type {function(TourScene,Tour):void|null}
	 */
	selectCallback = null;

	/**
	 * Callback function that is called after the scene is deselected.
	 * 
	 * @type {function(TourScene,Tour):void|null}
	 */
	deselectCallback = null;

	/**
	 * Callback function that is called after the panning has started.
	 * 
	 * @type {function(TourScene,Tour,PointerEvent):void|null}
	 */
	panStartCallback = null;

	/**
	 * Callback function that is called after the panning has ended.
	 * 
	 * @type {function(TourScene,Tour,PointerEvent):void|null}
	 */
	panEndCallback = null;

	/**
	 * The horizontal coordinate in pixels at which the panning was started.
	 * 
	 * @type {number}
	 */
	#panStartX = 0;

	/**
	 * The vertical coordinate in pixels at which the panning was started.
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
	 * Indicates whether the scene is vertical rather than horizontal.
	 * 
	 * @type {boolean}
	 */
	get isVertical() {
		const width = this.bottomRightCoordinate.long - this.topLeftCoordinate.long;
		const height = this.bottomRightCoordinate.lat - this.topLeftCoordinate.lat;
		return height > width;
	}

	/**
	 * Creates a tour scene.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The id of the scene.
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the image tiles and the hotspots.
	 * @param {HTMLElement} options.tileList - The element that contains the image tiles.
	 * @param {TourSceneCoordinate} options.topLeftCoordinate - The latitude and longitude of the scene's top-left corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneCoordinate} options.bottomRightCoordinate - The latitude and longitude of the scene's bottom-right corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneHotspot[]} options.hotspots - An array of hotspots within the scene.
	 * @param {string} options.aspectRatioCSSVariable - The name of the CSS variable that defines the scene's aspect ratio.
	 * @param {string} options.isSelectedClass - The class that is added to the wrapper when the scene is selected.
	 * @param {string} options.isLoadedClass - The class that is added to the wrapper when the image tiles within the scene are loaded.
	 * @param {string} options.isVerticalClass - The class that is added to the wrapper when the scene is vertical rather than horizontal.
	 * @param {function(TourScene):void|null} options.initCallback - Callback function that is called after the scene has been initialized.
	 * @param {function(TourScene,Tour):void|null} options.selectCallback - Callback function that is called after the scene is selected.
	 * @param {function(TourScene,Tour):void|null} options.deselectCallback - Callback function that is called after the scene is deselected.
	 * @param {function(TourScene,Tour,PointerEvent):void|null} options.panStartCallback - Callback function that is called after the panning has started.
	 * @param {function(TourScene,Tour,PointerEvent):void|null} options.panEndCallback - Callback function that is called after the panning has ended.
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
		if (!(options.tileList instanceof HTMLElement)) {
			throw "Tour scene \"tileList\" must be an `HTMLElement`";
		}

		// Set fields from options
		this.id = options.id;
		this.wrapper = options.wrapper;
		this.tileList = options.tileList;
		if ("topLeftCoordinate" in options) this.topLeftCoordinate = options.topLeftCoordinate;
		if ("bottomRightCoordinate" in options) this.bottomRightCoordinate = options.bottomRightCoordinate;
		if ("hotspots" in options) this.hotspots = options.hotspots;
		if ("aspectRatioCSSVariable" in options) this.aspectRatioCSSVariable = options.aspectRatioCSSVariable;
		if ("isSelectedClass" in options) this.isSelectedClass = options.isSelectedClass;
		if ("isLoadedClass" in options) this.isLoadedClass = options.isLoadedClass;
		if ("isVerticalClass" in options) this.isVerticalClass = options.isVerticalClass;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("selectCallback" in options) this.selectCallback = options.selectCallback;
		if ("deselectCallback" in options) this.deselectCallback = options.deselectCallback;
		if ("panStartCallback" in options) this.panStartCallback = options.panStartCallback;
		if ("panEndCallback" in options) this.panEndCallback = options.panEndCallback;
	
		// Initialize the tour scene
		if (this.isVertical) this.wrapper.classList.add(this.isVerticalClass);
	}

	/**
	 * Selects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {Map<string,any>} overrides - The override settings for the scene.
	 * @returns {void}
	 */
	select(tour, overrides = new Map()) {
		this.wrapper.classList.add(this.isSelectedClass);
		this.#setApectRatio();
		this.#loadImageTiles();
	}

	/**
	 * Deselects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	deselect(tour) {
		this.wrapper.style.removeProperty(this.aspectRatioCSSVariable);
		this.wrapper.classList.remove(this.isLoadedClass);
		this.wrapper.classList.remove(this.isSelectedClass);
	}

	/**
	 * Starts the panning.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	panStart(tour, event) {
		if(tour.isPanning || tour.isPinching) return;
		tour.isPanning = true;
		this.#panStartX = event.pageX - tour.viewport.offsetLeft;
		this.#panStartY = event.pageY - tour.viewport.offsetTop;
		this.#panStartScrollLeft = tour.viewport.scrollLeft;
		this.#panStartScrollTop = tour.viewport.scrollTop;
		tour.wrapper.classList.add(tour.isPanningClass);
		if (typeof(this.panStartCallback) == "function") this.panStartCallback(this, tour, event);
	}

	/**
	 * Moves the panning.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	panMove(tour, event) {
		if(!tour.isPanning || tour.isPinching) return;
		const panCurrX = event.pageX - tour.viewport.offsetLeft;
		const panCurrY = event.pageY - tour.viewport.offsetTop;
		const panCurrScrollLeft = panCurrX - this.#panStartX;
		const panCurrScrollTop = panCurrY - this.#panStartY;
		tour.viewport.scrollTo({
			left: this.#panStartScrollLeft - panCurrScrollLeft,
			top: this.#panStartScrollTop - panCurrScrollTop,
			behavior: "instant"
		});
	}

	/**
	 * Ends the panning.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {PointerEvent} event - The event to be handled.
	 * @returns {void}
	 */
	panEnd(tour, event) {
		if(!tour.isPanning || tour.isPinching) return;
		tour.isPanning = false;
		tour.wrapper.classList.remove(tour.isPanningClass);
		if (typeof(this.panEndCallback) == "function") this.panEndCallback(this, tour, event);
	}

	/**
	 * Updates the hotspots' positions.
	 * 
	 * @returns {void}
	 */
	updateHotspots() {
		this.hotspots.forEach((hotspot) => hotspot.update(this));
	}

	/**
	 * Retrieves the override settings of the current state that can be saved in the tour history and retrieved when the scene is reverted.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {Map<string,any>} The override settings.
	 */
	getOverrides(tour) {
		return new Map();
	}

	/**
	 * Scrolls the scene to the specified element.
	 * 
	 * @param {Element} elem - The element to scroll the viewport to.
	 * @param {HTMLElement} viewport - The viewport element that is scrolled.
	 * @param {string} behavior - The behavior of the scroll.
	 * @returns {void}
	 */
	scrollToElem(elem, viewport, behavior = "smooth") {
		if (!viewport.contains(elem)) return;
		const elemRect = elem.getBoundingClientRect();
		const viewportRect = viewport.getBoundingClientRect();
		const top = elemRect.top - (viewportRect.top - viewport.scrollTop);
		const left = elemRect.left - (viewportRect.left - viewport.scrollLeft);
		viewport.scrollTo({
			top: top - (viewport.offsetHeight / 2),
			left: left - (viewport.offsetWidth / 2),
			behavior: behavior
		});
	}

	/**
	 * Scrolls the scene to the absolute positions corresponding to the specified relative horizontal and vertical offsets.
	 * 
	 * @param {number} offsetX - The relative horizontal offset.
	 * @param {number} offsetY - The relative vertical offset.
	 * @param {HTMLElement} viewport - The viewport element that is scrolled and defines the limits of the absolute scroll positions.
	 * @returns {void}
	 */
	scrollToOffset(offsetX, offsetY, viewport) {
		viewport.scrollTo({
			left: this.convertToXScroll(offsetX, viewport),
			top: this.convertToYScroll(offsetY, viewport)
		});
	}

	/**
	 * Converts the specified relative horizontal offset into an absolute horizontal scroll position.
	 * 
	 * @param {number} offsetX - The relative horizontal offset to be converted.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted absolute horizontal scroll position.
	 */
	convertToXScroll(offsetX, viewport) {
		return this.#convertToScroll(offsetX, false, viewport);
	}

	/**
	 * Converts the specified relative vertical offset into an absolute vertical scroll position.
	 * 
	 * @param {number} offsetY - The relative vertical offset to be converted.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted absolute vertical scroll position.
	 */
	convertToYScroll(offsetY, viewport) {
		return this.#convertToScroll(offsetY, true, viewport);
	}

	/**
	 * Converts the specified absolute horizontal scroll position into a relative horizontal offset.
	 * 
	 * @param {number} scrollLeft - The absolute horizontal scroll position to be converted.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted relative horizontal offset.
	 */
	convertToXOffset(scrollLeft, viewport) {
		return this.#convertToOffset(scrollLeft, false, viewport);
	}

	/**
	 * Converts the specified absolute vertical scroll position into a relative vertical offset.
	 * 
	 * @param {number} scrollTop - The absolute vertical scroll position to be converted.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted relative vertical offset.
	 */
	convertToYOffset(scrollTop, viewport) {
		return this.#convertToOffset(scrollTop, true, viewport);
	}

	/**
	 * Converts the specified relative offset into an absolute scroll position.
	 * 
	 * @param {number} offset - The relative offset to be converted.
	 * @param {boolean} isVertical - Indicates whether the relative offset is vertical or horizontal.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted absolute scroll position.
	 */
	#convertToScroll(offset, isVertical, viewport) {
		const absOffset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		const absScroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((offset / 100) * absScroll) - (absOffset / 2);
	}

	/**
	 * Converts the specified absolute scroll position into a relative offset.
	 * 
	 * @param {number} scroll - The absolute scroll position to be converted.
	 * @param {boolean} isVertical - Indicates whether the scroll position is vertical or horizontal.
	 * @param {HTMLElement} viewport - The viewport element that defines the limits of the absolute scroll positions.
	 * @returns {number} The converted relative offset.
	 */
	#convertToOffset(scroll, isVertical, viewport) {
		const absOffset = isVertical ? viewport.offsetHeight : viewport.offsetWidth;
		const absScroll = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
		return ((scroll + (absOffset / 2)) / absScroll) * 100;
	}

	/**
	 * Sets the wrapper's CSS variable to the scene's aspect ratio.
	 * 
	 * @returns {void}
	 */
	#setApectRatio() {
		const aspectRatio = this.tileList.scrollWidth / this.tileList.scrollHeight;
		this.wrapper.style.setProperty(this.aspectRatioCSSVariable, aspectRatio);
	}

	/**
	 * Loads all image tiles.
	 * 
	 * @returns {void}
	 */
	#loadImageTiles() {
		const images = Array.from(this.tileList.querySelectorAll("img"));
		images.forEach((img) => img.loading = "eager");
		const loadImages = images
			.filter((image) => !image.complete)
			.map((image) => {
				return new Promise((resolve) => {
					image.onload = image.onerror = resolve;
				})
			});
		Promise.all(loadImages).then(() => {
			this.wrapper.classList.add(this.isLoadedClass);
		});
	}
}

/**
 * Tour Map Scene
 * This class is designed to create a scene within a tour that displays a pannable and zoomable map.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourMapScene extends TourScene {

	/**
	 * The maximum available zoom level for the scene.
	 * 
	 * @type {number}
	 */
	maxZoomLevel = 8;

	/**
	 * The initial zoom level applied when the scene is selected.
	 * 
	 * @type {number}
	 */
	zoomLevel = 0;

	/**
	 * The relative horizontal offset in percent to which the scene is scrolled by default.
	 * 
	 * @type {number}
	 */
	offsetX = 50;

	/**
	 * The relative vertical offset in percent to which the scene is scrolled by default.
	 * 
	 * @type {number}
	 */
	offsetY = 50;

	/**
	 * The name of the attribute added to the wrapper whose value contains the current zoom level.
	 * 
	 * @type {string}
	 */
	zoomLevelAttribute = "data-scene-tour-zoom-level";

	/**
	 * Callback function that is called after the scene is zoomed to the next zoom level.
	 * 
	 * @type {function(TourMapScene,Tour):void|null}
	 */
	zoomInCallback = null;

	/**
	 * Callback function that is called after the scene is zoomed to the previous zoom level.
	 * 
	 * @type {function(TourMapScene,Tour):void|null}
	 */
	zoomOutCallback = null;

	/**
	 * Callback function that is called after the scene is zoomed to a different zoom level.
	 * 
	 * @type {function(TourMapScene,Tour,number):void|null}
	 */
	zoomCallback = null;

	/**
	 * Callback function that is called after the pinching has started.
	 * 
	 * @type {function(TourMapScene,Tour,TouchEvent):void|null}
	 */
	pinchStartCallback = null;

	/**
	 * Callback function that is called after the pinching has ended.
	 * 
	 * @type {function(TourMapScene,Tour,TouchEvent):void|null}
	 */
	pinchEndCallback = null;

	/**
	 * The current zoom level.
	 * 
	 * @type {number}
	 */
	#currentZoomLevel = 0;

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
	 * An array indicating whether the maximum and minimum zoom levels have been reached.
	 * 
	 * @type {[boolean, boolean]}
	 */
	get zoomLimits() {
		return [
			this.#currentZoomLevel >= this.maxZoomLevel,
			this.#currentZoomLevel < 1
		]
	}

	/**
	 * Creates a tour scene that displays a pannable and zoomable map.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The id of the scene.
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the image tiles and the hotspots.
	 * @param {HTMLElement} options.tileList - The element that contains the image tiles.
	 * @param {TourSceneCoordinate} options.topLeftCoordinate - The latitude and longitude of the scene's top-left corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneCoordinate} options.bottomRightCoordinate - The latitude and longitude of the scene's bottom-right corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneHotspot[]} options.hotspots - An array of hotspots within the scene.
	 * @param {string} options.aspectRatioCSSVariable - The name of the CSS variable that defines the scene's aspect ratio.
	 * @param {string} options.isSelectedClass - The class that is added to the wrapper when the scene is selected.
	 * @param {string} options.isLoadedClass - The class that is added to the wrapper when the image tiles within the scene are loaded.
	 * @param {string} options.isVerticalClass - The class that is added to the wrapper when the scene is vertical rather than horizontal.
	 * @param {number} options.maxZoomLevel - The maximum available zoom level for the scene.
	 * @param {number} options.zoomLevel - The initial zoom level applied when the scene is selected.
	 * @param {number} options.offsetX - The relative horizontal offset in percent to which the scene is scrolled by default.
	 * @param {number} options.offsetY - The relative vertical offset in percent to which the scene is scrolled by default.
	 * @param {string} options.zoomLevelAttribute - The name of the attribute added to the wrapper whose value contains the current zoom level.
	 * @param {function(TourMapScene):void|null} options.initCallback - Callback function that is called after the scene has been initialized.
	 * @param {function(TourMapScene,Tour):void|null} options.selectCallback - Callback function that is called after the scene is selected.
	 * @param {function(TourMapScene,Tour):void|null} options.deselectCallback - Callback function that is called after the scene is deselected.
	 * @param {function(TourMapScene,Tour,PointerEvent):void|null} options.panStartCallback - Callback function that is called after the panning has started.
	 * @param {function(TourMapScene,Tour,PointerEvent):void|null} options.panEndCallback - Callback function that is called after the panning has ended.
	 * @param {function(TourMapScene,Tour):void|null} options.zoomInCallback - Callback function that is called after the scene is zoomed to the next zoom level.
	 * @param {function(TourMapScene,Tour):void|null} options.zoomOutCallback - Callback function that is called after the scene is zoomed to the previous zoom level.
	 * @param {function(TourMapScene,Tour,number):void|null} options.zoomCallback - Callback function that is called after the scene is zoomed to a different zoom level.
	 * @param {function(TourMapScene,Tour,TouchEvent):void|null} options.pinchStartCallback - Callback function that is called after the pinching has started.
	 * @param {function(TourMapScene,Tour,TouchEvent):void|null} options.pinchEndCallback - Callback function that is called after the pinching has ended.
	 * @returns {TourMapScene}
	 */
	constructor(options) {

		// Initialize the parent
		super(options);

		// Set fields from options
		if ("maxZoomLevel" in options) this.maxZoomLevel = options.maxZoomLevel;
		if ("zoomLevel" in options) this.zoomLevel = options.zoomLevel;
		if ("offsetX" in options) this.offsetX = options.offsetX;
		if ("offsetY" in options) this.offsetY = options.offsetY;
		if ("zoomLevelAttribute" in options) this.zoomLevelAttribute = options.zoomLevelAttribute;
		if ("zoomInCallback" in options) this.zoomInCallback = options.zoomInCallback;
		if ("zoomOutCallback" in options) this.zoomOutCallback = options.zoomOutCallback;
		if ("zoomCallback" in options) this.zoomCallback = options.zoomCallback;
		if ("pinchStartCallback" in options) this.pinchStartCallback = options.pinchStartCallback;
		if ("pinchEndCallback" in options) this.pinchEndCallback = options.pinchEndCallback;

		// Initialize the map tour scene
		this.#currentZoomLevel = this.zoomLevel;
		super.updateHotspots();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Selects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {Map<string,any>} overrides - The override settings for the scene.
	 * @returns {void}
	 */
	select(tour, overrides = new Map()) {
		super.select(tour);
		const zoomLevel = overrides.get("currentZoomLevel") ?? this.zoomLevel;
		const offsetX = overrides.get("offsetX") ?? this.offsetX;
		const offsetY = overrides.get("offsetY") ?? this.offsetY;
		this.zoomTo(zoomLevel, tour);
		tour.viewport.scrollTo({
			left: this.convertToXScroll(offsetX, tour.viewport),
			top: this.convertToYScroll(offsetY, tour.viewport)
		});
		if (typeof(this.selectCallback) == "function") this.selectCallback(this, tour);
	}

	/**
	 * Deselects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	deselect(tour) {
		super.deselect(tour);
		this.wrapper.removeAttribute(this.zoomLevelAttribute);
		if (typeof(this.deselectCallback) == "function") this.deselectCallback(this, tour);
	}

	/**
	 * Zooms to the next zoom level.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	zoomIn(tour) {
		this.zoomTo(this.#currentZoomLevel + 1, tour);
		if (typeof(this.zoomInCallback) == "function") this.zoomInCallback(this, tour);
	}

	/**
	 * Zooms to the previous zoom level.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	zoomOut(tour) {
		this.zoomTo(this.#currentZoomLevel - 1, tour);
		if (typeof(this.zoomOutCallback) == "function") this.zoomOutCallback(this, tour);
	}

	/**
	 * Zooms to the specified zoom level.
	 * 
	 * @param {number} zoomLevel - The zoom level to apply.
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	zoomTo(zoomLevel, tour) {
		const viewport = tour.viewport;
		const offsetX = this.convertToXOffset(viewport.scrollLeft, viewport);
		const offsetY = this.convertToYOffset(viewport.scrollTop, viewport);
		this.#currentZoomLevel = this.#clampZoomLevel(zoomLevel);
		this.wrapper.setAttribute(this.zoomLevelAttribute, this.#currentZoomLevel);
		this.scrollToOffset(offsetX, offsetY, viewport);
		if (typeof(this.zoomCallback) == "function") this.zoomCallback(this, tour, this.#currentZoomLevel);
	}

	/**
	 * Zooms to the specified zoom level while keeping the X and Y points stationary during the zoom.
	 * 
	 * @param {number} zoomLevel - The zoom level to apply
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {number} x - The X coordinate to keep stationary during the zoom.
	 * @param {number} y - The Y coordinate to keep stationary during the zoom.
	 * @returns {void}
	 */
	anchorZoomTo(zoomLevel, tour, x, y) {
		const viewport = tour.viewport;
		const rect = viewport.getBoundingClientRect();
		const viewAbsX = x - rect.left;
		const viewAbsY = y - rect.top;
		const mapAbsX = viewAbsX + viewport.scrollLeft;
		const mapAbsY = viewAbsY + viewport.scrollTop;
		const mapRelX = mapAbsX / viewport.scrollWidth;
		const mapRelY = mapAbsY / viewport.scrollHeight;
		const viewRelX = viewAbsX / viewport.offsetWidth;
		const viewRelY = viewAbsY / viewport.offsetHeight;
		this.zoomTo(zoomLevel, tour);
		const newMapAbsX = mapRelX * viewport.scrollWidth;
		const newMapAbsY = mapRelY * viewport.scrollHeight;
		viewport.scrollTo({
			left: newMapAbsX - (viewport.offsetWidth * viewRelX),
			top: newMapAbsY - (viewport.offsetHeight * viewRelY)	
		});
	}

	/**
	 * Zooms on mouse wheel.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {WheelEvent} event - The event to be handled.
	 * @returns {void}
	 */
	wheelZoom(tour, event) {
		const zoomLevel = event.deltaY < 0 ? this.#currentZoomLevel + 1 : this.#currentZoomLevel - 1;
		if (zoomLevel <= this.maxZoomLevel && zoomLevel >= 0) {
			this.anchorZoomTo(zoomLevel, tour, event.x, event.y);
		}
	}

	/**
	 * Starts the pinching.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	pinchStart(tour, event) {
		if (event.touches.length !== 2) return;
		tour.isPinching = true;
		tour.isPanning = false;
		this.#pinchStartDistance = this.#getPinchDistance(event);
		this.#pinchStartZoomLevel = this.#currentZoomLevel;
		tour.wrapper.classList.add(tour.isPinchingClass);
		if (typeof(this.pinchStartCallback) == "function") this.pinchStartCallback(this, tour, event);
	}

	/**
	 * Moves the pinching.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	pinchMove(tour, event) {
		if (!tour.isPinching) return;
		const zoomLevel = this.#getPinchZoomLevel(event);
		if (this.#currentZoomLevel !== zoomLevel && zoomLevel <= this.maxZoomLevel && zoomLevel >= 0) {
			const y = ((event.touches[0].pageY + event.touches[1].pageY) / 2);
			const x = ((event.touches[0].pageX + event.touches[1].pageX) / 2);
			this.anchorZoomTo(zoomLevel, tour, x, y);
		}
	}

	/**
	 * Ends the pinching.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {TouchEvent} event - The event to be handled.
	 * @returns {void}
	 */
	pinchEnd(tour, event) {
		if (!tour.isPinching) return;
		tour.isPinching = false;
		tour.wrapper.classList.remove(tour.isPinchingClass);
		if (typeof(this.pinchEndCallback) == "function") this.pinchEndCallback(this, tour, event);
	}

	/**
	 * Retrieves the override settings of the current state that can be saved in the tour history and retrieved when the scene is reverted.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {Map<string,any>} The override settings.
	 */
	getOverrides(tour) {
		const viewport = tour.viewport;
		return new Map([
			["offsetX", this.convertToXOffset(viewport.scrollLeft, viewport)],
			["offsetY", this.convertToYOffset(viewport.scrollTop, viewport)],
			["currentZoomLevel", this.#currentZoomLevel]
		]);
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
}

/**
 * Tour Field Scene
 * This class is designed to create a scene within a tour that displays a vertically pannable field.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourFieldScene extends TourScene {

	/**
	 * The relative horizontal or vertical offset in percent to which the scene is scrolled by default.
	 * 
	 * @type {number}
	 */
	offset = 50;

	/**
	 * Creates a tour scene that displays a vertically pannable field.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The id of the scene.
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the image tiles and the hotspots.
	 * @param {HTMLElement} options.tileList - The element that contains the image tiles.
	 * @param {TourSceneCoordinate} options.topLeftCoordinate - The latitude and longitude of the scene's top-left corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneCoordinate} options.bottomRightCoordinate - The latitude and longitude of the scene's bottom-right corner, used to calculate the position of the included hotspots.
	 * @param {TourSceneHotspot[]} options.hotspots - An array of hotspots within the scene.
	 * @param {string} options.aspectRatioCSSVariable - The name of the CSS variable that defines the scene's aspect ratio.
	 * @param {string} options.isSelectedClass - The class that is added to the wrapper when the scene is selected.
	 * @param {string} options.isLoadedClass - The class that is added to the wrapper when the image tiles within the scene are loaded.
	 * @param {string} options.isVerticalClass - The class that is added to the wrapper when the scene is vertical rather than horizontal.
	 * @param {number} options.offset - The relative horizontal or vertical offset in percent to which the scene is scrolled by default.
	 * @param {function(TourFieldScene):void|null} options.initCallback - Callback function that is called after the scene has been initialized.
	 * @param {function(TourFieldScene,Tour):void|null} options.selectCallback - Callback function that is called after the scene is selected.
	 * @param {function(TourFieldScene,Tour):void|null} options.deselectCallback - Callback function that is called after the scene is deselected.
	 * @param {function(TourFieldScene,Tour,PointerEvent):void|null} options.panStartCallback - Callback function that is called after the panning has started.
	 * @param {function(TourFieldScene,Tour,PointerEvent):void|null} options.panEndCallback - Callback function that is called after the panning has ended.
	 * @returns {TourFieldScene}
	 */
	constructor(options) {

		// Initialize the parent
		super(options);

		// Set fields from options
		if ("offset" in options) this.offset = options.offset;

		// Initialize the field tour scene
		super.updateHotspots();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Selects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @param {Map<string,any>} overrides - The override settings for the scene.
	 * @returns {void}
	 */
	select(tour, overrides = new Map()) {
		super.select(tour);
		const offset = overrides.get("offset") ?? this.offset;
		tour.viewport.scrollTo({
			left: this.convertToXScroll(offset, tour.viewport),
			top: this.convertToYScroll(offset, tour.viewport)
		});
		if (typeof(this.selectCallback) == "function") this.selectCallback(this, tour);
	}

	/**
	 * Deselects the scene.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {void}
	 */
	deselect(tour) {
		super.deselect(tour);
		if (typeof(this.deselectCallback) == "function") this.deselectCallback(this, tour);
	}

	/**
	 * Retrieves the override settings of the current state that can be saved in the tour history and retrieved when the scene is reverted.
	 * 
	 * @param {Tour} tour - The tour to which the scene belongs.
	 * @returns {Map<string,any>} The override settings.
	 */
	getOverrides(tour) {
		const viewport = tour.viewport;
		const offsetY = this.convertToYOffset(viewport.scrollTop, viewport);
		const offsetX = this.convertToXOffset(viewport.scrollLeft, viewport);
		return new Map([
			["offset", this.isVertical ? offsetY : offsetX]
		]);
	}
}

/**
 * Tour Scene Hotspot
 * This class is designed to create a hotspot that can be displayed at a specified coordinate within a tour scene.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourSceneHotspot {

	/**
	 * The wrapper element whose position is set by the hotspot's coordinate within the area defined by the scene's top-left and bottom-right coordinates.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The coordinate of the hotspot.
	 * 
	 * @type {TourSceneCoordinate}
	 */
	coordinate;

	/**
	 * The angle of the rotation on the x-axis (horizontal) in degrees.
	 * 
	 * @type {number}
	 */
	rotateX = 0;
	
	/**
	 * The angle of the rotation on the y-axis (vertical) in degrees.
	 * 
	 * @type {number}
	 */
	rotateY = 0;

	/**
	 * The name of the CSS variable to which the X-axis rotation is assigned (horizontal).
	 * 
	 * @type {string}
	 */
	rotateXCSSVariable = "--tour-scene-hotspot-rotate-x";

	/**
	 * The name of the CSS variable to which the Y-axis rotation is assigned (vertical).
	 * 
	 * @type {string}
	 */
	rotateYCSSVariable = "--tour-scene-hotspot-rotate-y";
	
	/**
	 * Callback function that is called after the hotspot has been initialized.
	 * 
	 * @type {function(TourSceneHotspot):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the hotspot has been updated.
	 * 
	 * @type {function(TourSceneHotspot,TourScene):void|null}
	 */
	updateCallback = null;

	/**
	 * Creates a tour scene hotspot.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element whose position is set by the hotspot's coordinate within the area defined by the scene's top-left and bottom-right coordinates.
	 * @param {TourSceneCoordinate} options.coordinate - The coordinate of the hotspot.
	 * @param {number} options.rotateX - The angle of the rotation on the x-axis (horizontal) in degrees.
	 * @param {number} options.rotateY - The angle of the rotation on the y-axis (vertical) in degrees.
	 * @param {number} options.rotateXCSSVariable - The name of the CSS variable to which the X-axis rotation is assigned (horizontal).
	 * @param {number} options.rotateYCSSVariable - The name of the CSS variable to which the Y-axis rotation is assigned (vertical).
	 * @param {function(TourSceneHotspot):void|null} options.initCallback - Callback function that is called after the hotspot has been initialized.
	 * @param {function(TourSceneHotspot,TourScene):void|null} options.updateCallback - Callback function that is called after the hotspot has been updated.
	 * @returns {TourSceneHotspot}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tour scene hotspot \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.coordinate instanceof TourSceneCoordinate)) {
			throw "Tour scene hotspot \"coordinate\" must be a `TourSceneCoordinate`";
		}

		// Set fields from options
		this.wrapper = options.wrapper;
		this.coordinate = options.coordinate;
		if ("rotateX" in options) this.rotateX = options.rotateX;
		if ("rotateY" in options) this.rotateY = options.rotateY;
		if ("rotateXCSSVariable" in options) this.rotateXCSSVariable = options.rotateXCSSVariable;
		if ("rotateYCSSVariable" in options) this.rotateYCSSVariable = options.rotateYCSSVariable;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("updateCallback" in options) this.updateCallback = options.updateCallback;

		// Initialize the tour scene hotspot
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Updates the hotspot's position based on the area defined by the specified scene's top-left and bottom-right coordinates.
	 * 
	 * @param {TourScene} scene - The scene whose coordinates define the positioning area.
	 * @returns {void}
	 */
	update(scene) {
		const topLeft = scene.topLeftCoordinate;
		const bottomRight = scene.bottomRightCoordinate;
		const lat = this.normalizePosition(this.coordinate.lat, topLeft.lat, bottomRight.lat);
		const long = this.normalizePosition(this.coordinate.long, topLeft.long, bottomRight.long);
		this.wrapper.style.top = `${lat * 100}%`;
		this.wrapper.style.left = `${long * 100}%`;
		this.wrapper.style.setProperty(this.rotateXCSSVariable, `${this.rotateX}deg`);
		this.wrapper.style.setProperty(this.rotateYCSSVariable, `${this.rotateY}deg`);
		if (typeof(this.updateCallback) == "function") this.updateCallback(this, scene);
	}

	/**
	 * Normalizes the specified position between the minimum and maximum range.
	 * 
	 * @param {number} value - The position to be normalized.
	 * @param {number} min - The minimum value of the range.
	 * @param {number} max - The maximum value of the range.
	 * @returns {number} The normalized position between 0 and 1.
	 */
	normalizePosition(value, min, max) {
		const isReverse = min >= max;
		if (isReverse) {
			[min, max] = [max, min];
		}
		const clampedValue = Math.max(min, Math.min(max, value));
		const relativeValue = (clampedValue - min) / (max - min);
		return isReverse ? 1 - relativeValue : relativeValue;
	}

	/**
	 * Parses the X- and Y-axis rotations from the specified comma-separated string.
	 * 
	 * @param {string} raw - The raw, comma-seperated string.
	 * @returns {{rotateX:number,rotateY:number}} An object containing the parsed X- and Y-axis rotations.
	 */
	static rotationsFromString(raw) {
		const values = raw.split(",").map((val) => parseFloat(val));
		if (values.length == 2) {
			return {
				rotateX: values[0],
				rotateY: values[1]
			};
		} else {
			return {
				rotateX: 0,
				rotateY: 0
			};
		}
	}
}

/**
 * Tour Scene Trigger
 * This class is designed to create a trigger that navigates from one tour screen to another when clicked.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourSceneTrigger {

	/**
	 * The ID of the target scene to navigate to when the trigger is clicked.
	 * 
	 * @type {string}
	 */
	sceneId;

	/**
	 * The trigger button that navigates to the target scene when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * Indicates whether to restore the scene from the history when it is already included; otherwise, navigates to the scene and adds the current scene to the history.
	 * 
	 * @type {boolean}
	 */
	preferHistory = false;

	/**
	 * The class that is added to the trigger while its scene is included in the history.
	 * 
	 * @type {string}
	 */
	isSceneInHistory = "is-scene-in-history";

	/**
	 * The class that is added to the trigger while its scene is selected.
	 * 
	 * @type {string}
	 */
	isSceneSelected = "is-scene-selected";

	/**
	 * Callback function that is called after the trigger has been initialized.
	 * 
	 * @type {function(TourSceneTrigger):void|null}
	 */
	initCallback = null;

	/**
	 * Creates a tour scene trigger.
	 * 
	 * @param {Object} options
	 * @param {string} options.sceneId - The ID of the target scene to navigate to when the trigger is clicked.
	 * @param {HTMLButtonElement} options.trigger - The trigger button that navigates to the target scene when clicked.
	 * @param {boolean} options.preferHistory - Indicates whether to restore the scene from the history when it is already included; otherwise, navigates to the scene and adds the current scene to the history.
	 * @param {string} options.isSceneInHistory - The class that is added to the trigger while its scene is included in the history.
	 * @param {string} options.isSceneSelected - The class that is added to the trigger while its scene is selected.
	 * @param {function(TourSceneTrigger):void|null} options.initCallback - Callback function that is called after the trigger has been initialized.
	 * @returns {TourSceneTrigger}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.sceneId !== "string") {
			throw "Tour scene trigger \"sceneId\" must be a string";
		}
		if (!(options.trigger instanceof HTMLButtonElement)) {
			throw "Tour scene trigger \"trigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		this.sceneId = options.sceneId;
		this.trigger = options.trigger;
		if ("preferHistory" in options) this.preferHistory = options.preferHistory;
		if ("isSceneInHistory" in options) this.isSceneInHistory = options.isSceneInHistory;
		if ("isSceneSelected" in options) this.isSceneSelected = options.isSceneSelected;
		if ("initCallback" in options) this.initCallback = options.initCallback;

		// Initialize the tour scene trigger
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}
}

/**
 * Tour Scene Coordinate
 * This class represents a latitude and a longitude within a tour scene.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourSceneCoordinate {

	/**
	 * The latitude of the coordinate.
	 * 
	 * @type {number}
	 */
	lat = 0;

	/**
	 * The longitude of the coordinate.
	 * 
	 * @type {number}
	 */
	long = 0;

	/**
	 * Creates a new tour scene coordinate.
	 * 
	 * @param {number} lat - The latitude of the coordinate.
	 * @param {number} long - The longitude of the coordinate.
	 * @returns {TourSceneCoordinate}
	 */
	constructor(lat = 0, long = 0) {
		this.lat = lat;
		this.long = long;
	}

	/**
	 * Creates a new tour scene coordinate from the specified comma-seperated string.
	 * 
	 * @param {string} raw - The raw, comma-seperated string.
	 * @returns {TourSceneCoordinate} The created coordinate.
	 */
	static fromString(raw) {
		const values = raw.split(",").map((val) => parseFloat(val));
		return values.length == 2 ? new this(...values) : new this(0, 0);
	}
}

/**
 * Tour History Entry
 * This class represents an entry within a tour history.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourHistoryEntry {

	/**
	 * The visited scene.
	 * 
	 * @type {TourScene}
	 */
	scene;

	/**
	 * The override settings for the scene to be restored when the history entry is reverted.
	 * 
	 * @type {Map<string,any>}
	 */
	overrides = new Map();

	/**
	 * Creates a new tour history entry.
	 * 
	 * @param {Object} options
	 * @param {TourScene} options.scene - The visited scene.
	 * @param {Map<string,any>} options.overrides - The override settings for the scene to be restored when the history entry is reverted.
	 * @returns {TourHistoryEntry}
	 */
	constructor(options) {

		// Test required options
		if (!(options.scene instanceof TourScene)) {
			throw "Tour history entry \"scene\" must be a `TourScene`";
		}

		// Set fields from options
		this.scene = options.scene;
		if ("overrides" in options) this.overrides = options.overrides;
	}
}

/**
 * Tour Popover
 * This class represents a popover within a tour.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class TourPopover {

	/**
	 * The wrapper element that contains the content.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;
	
	/**
	 * Callback function that is called after the popover has been initialized.
	 * 
	 * @type {function(TourPopover):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called while the popover is opening.
	 * 
	 * @type {function(TourPopover,ToggleEvent):void|null}
	 */
	openingCallback = null;

	/**
	 * Callback function that is called while the popover is closing.
	 * 
	 * @type {function(TourPopover,ToggleEvent):void|null}
	 */
	closingCallback = null;

	/**
	 * Creates a tour popover.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the content.
	 * @param {function(TourPopover):void|null} options.initCallback - Callback function that is called after the popover has been initialized.
	 * @param {function(TourPopover,ToggleEvent):void|null} options.openingCallback - Callback function that is called while the popover is opening.
	 * @param {function(TourPopover,ToggleEvent):void|null} options.closingCallback - Callback function that is called while the popover is closing.
	 * @returns {TourPopover}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tour popover \"wrapper\" must be an `HTMLElement`";
		}

		// Set fields from options
		this.wrapper = options.wrapper;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("openingCallback" in options) this.openingCallback = options.openingCallback;
		if ("closingCallback" in options) this.closingCallback = options.closingCallback;

		// Initialize the tour popover
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Executes before the popover opens.
	 * 
	 * @param {ToggleEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#isOpening(event) {
		if (typeof(this.openingCallback) == "function") this.openingCallback(this, event);
	}

	/**
	 * Executes before the popover closes.
	 * 
	 * @param {ToggleEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#isClosing(event) {
		this.wrapper.scrollTop = 0;
		if (typeof(this.closingCallback) == "function") this.closingCallback(this, event);
	}

	/**
	 * Adds event listeners related to the tour popover.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("beforetoggle", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "beforetoggle":
				if (event.newState === "open") {
					this.#isOpening(event);
				} else {
					this.#isClosing(event);
				}
				break;
		}
	}
}

export { Tour, TourMapScene, TourFieldScene, TourSceneHotspot, TourSceneTrigger, TourSceneCoordinate, TourHistoryEntry, TourPopover }