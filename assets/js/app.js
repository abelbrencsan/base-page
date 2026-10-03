import { AlertManager } from "../js/alert-manager.js";
import { AudioManager, AudioManagerPlayTrigger } from "../js/audio-manager.js";
import { AudioPlayer } from "../js/audio-player.js";
import { Calendar, CalendarInterval } from "../js/calendar.js";
import { DateSelector, DateSelectorInterval } from "../js/date-selector.js";
import { Dialog } from "../js/dialog.js";
import { Dropdown } from "../js/dropdown.js";
import { Glider } from "../js/glider.js";
import { IconManager } from "../js/icon-manager.js";
import { LazyLoadDetector } from "../js/lazy-load-detector.js";
import { LiveFilter, LiveFilterItem } from "../js/live-filter.js";
import { MemoryGame, MemoryGameCard } from "../js/memory-game.js";
import { Notice } from "../js/notice.js";
import { PopupManager, PopupManagerPopup } from "../js/popup-manager.js";
import { Quiz, QuizQuestion, QuizQuestionOption } from "../js/quiz.js";
import { RangeIndicator } from "../js/range-indicator.js";
import { ScrollTable } from "../js/scroll-table.js";
import { Slideshow, SlideshowTrigger } from "../js/slideshow.js";
import { SortableTree } from "../js/sortable-tree.js";
import { Stepper } from "../js/stepper.js";
import { Tab } from "../js/tab.js";
import { Tour, TourMapScene, TourFieldScene, TourSceneHotspot, TourSceneCoordinate, TourSceneTrigger, TourInventoryTrigger, TourAudioPlayerTrigger, TourPopover } from "./tour.js";
import { Validator } from "../js/validator.js";

/**
 * Application
 * This class is designed to handle the workflow of the application.
 * 
 * @import { Page } from "../js/page.js"
 * @author Abel Brencsan
 * @license MIT License
 */
class App {

	/**
	 * The configurations for the application.
	 * 
	 * @typedef {Object} AppOptions
	 * @property {PopupConfig[]} options.popupConfigs - The configurations for the popups.
	 */

	/**
	 * The configuration for a popup.
	 * 
	 * @typedef {Object} PopupConfig
	 * @property {string} id - The ID of the popup.
	 * @property {string} target - The dialog appears when the element with the specified query selector becomes visible in the viewport.
	 * @property {boolean} onlyUpward - Indicates whether the dialog appears only if the target element becomes visible upon scrolling upward.
	 * @property {Object} dialog - The configuration for a popup dialog.
	 * @property {string} dialog.type - The type of the dialog.
	 * @property {string} dialog.source - The source of the dialog to be loaded.
	 */

	/**
	 * Icon manager for the application.
	 * 
	 * @type {IconManager}
	 */
	iconManager = new IconManager();

	/**
	 * Alert manager for the application.
	 * 
	 * @type {AlertManager}
	 */
	alertManager = new AlertManager({
		container: document.querySelector("[data-alert-container]"),
		closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
	});

	/**
	 * Popup manager for the application.
	 * 
	 * @type {PopupManager}
	 */
	popupManager = new PopupManager();

	/**
	 * Audio manager for the application.
	 * 
	 * @type {AudioManager}
	 */
	audioManager = new AudioManager({
		muteTriggers: this.#getAudioManagerMuteTriggers(),
		playTriggers: this.#getAudioManagerPlayTriggers(),
		backgroundAudio: new Map([
			["birdChirping", new Audio("../assets/sounds/bird-chirping.ogg")],
			["ambient", new Audio("../assets/sounds/ambient.ogg")]
		])
	});

	/**
	 * Array of audio players.
	 * 
	 * @type {AudioPlayer[]}
	 */
	audioPlayers = [];

	/**
	 * Array of gliders.
	 * 
	 * @type {Glider[]}
	 */
	gliders = [];

	/**
	 * Array of rolls.
	 * 
	 * @type {Glider[]}
	 */
	rolls = [];

	/**
	 * Array of scroll tables.
	 * 
	 * @type {ScrollTable[]}
	 */
	scrollTables = [];

	/**
	 * Array of navigation bar sub-navigations.
	 * 
	 * @type {Dropdown[]}
	 */
	navbarSubnavs = [];

	/**
	 * Array of lazy load detectors.
	 * 
	 * @type {LazyLoadDetector[]}
	 */
	lazyLoadDetectors = [];

	/**
	 * Array of dialogs.
	 * 
	 * @type {Dialog[]}
	 */
	dialogs = [];

	/**
	 * Array of slideshows.
	 * 
	 * @type {Slideshow[]}
	 */
	slideshows = [];

	/**
	 * Array of range indicators.
	 * 
	 * @type {RangeIndicator[]}
	 */
	rangeIndicators = [];

	/**
	 * Array of validators.
	 * 
	 * @type {Validator[]}
	 */
	validators = [];

	/**
	 * Array of notices.
	 * 
	 * @type {Notice[]}
	 */
	notices = [];

	/**
	 * Array of tabs.
	 * 
	 * @type {Tab[]}
	 */
	tabs = [];

	/**
	 * Array of sortable trees.
	 * 
	 * @type {SortableTree[]}
	 */
	sortableTrees = [];

	/**
	 * Array of steppers.
	 * 
	 * @type {Stepper[]}
	 */
	steppers = [];

	/**
	 * Array of tours.
	 * 
	 * @type {Tour[]}
	 */
	tours = [];

	/**
	 * Array of memory games.
	 * 
	 * @type {MemoryGame[]}
	 */
	memoryGames = [];

	/**
	 * Array of quizzes.
	 * 
	 * @type {Quiz[]}
	 */
	quizzes = [];

	/**
	 * Array of live filters.
	 * 
	 * @type {LiveFilter[]}
	 */
	liveFilters = [];

	/**
	 * Array of calendars.
	 * 
	 * @type {Calendar[]}
	 */
	calendars = [];

	/**
	 * Array of date selectors.
	 * 
	 * @type {DateSelector[]}
	 */
	dateSelectors = [];

	/**
	 * The current page.
	 * 
	 * @type {Page|null}
	 */
	page = null;

	/**
	 * Breakpoints for responsive layout handling.
	 * 
	 * @param {Object} breakpoints
	 * @param {string} breakpoints.large - The breakpoint for large devices.
	 * @param {string} breakpoints.medium - The breakpoint for medium devices.
	 * @param {string} breakpoints.small - The breakpoint for small devices.
	 * @param {string} breakpoints.xsmall - The breakpoint for xsmall devices.
	 */
	static breakpoints = {
		large: "(max-width: 82em)",
		medium: "(max-width: 62em)",
		small: "(max-width: 47em)",
		xsmall: "(max-width: 32em)"
	};

	/**
	 * Creates an application.
	 * 
	 * @param {AppOptions} options - The configurations for the application.
	 * @returns {App}
	 */
	constructor(options = { popupConfigs: [] }) {

		// Initialize the application
		this.#initPopups(options.popupConfigs);
		this.#fetchAudioManagerAudioFiles();
		this.#initAudioPlayers();
		this.#initGliders();
		this.#initRolls();
		this.#initScrollTables();
		this.#initNavbarSubnavs();
		this.#initLazyLoadDetectors();
		this.#initDialogs();
		this.#initSlideshows();
		this.#initRangeIndicators();
		this.#initValidators();
		this.#initNotices();
		this.#initTabs();
		this.#initSortableTrees();
		this.#initSteppers();
		this.#initTours();
		this.#initTourScrollToTriggers();
		this.#initMemoryGames();
		this.#initQuizzes();
		this.#initLiveFilters();
		this.#initSmoothScrolls();
		this.#detectBreakpointChange();
		this.#detectOffline();

		// Initialize modules that require polyfills
		if (!window.Temporal) {
			this.loadScript("/assets/js/polyfill/temporal.js", (error) => {
				if (error !== undefined) return;
				this.#initCalendars();
				this.#initDateSelectors();
			});
		} else {
			this.#initCalendars();
			this.#initDateSelectors();
		}
	}

	/**
	 * Loads the script dynamically from the specified URI.
	 * 
	 * @param {src} src - The script URI to be loaded.
	 * @param {function(Error|undefined):void} callback - The callback function called on load or error.
	 * @returns {void}
	 */
	loadScript(src, callback) {
		const script = document.createElement("script");
		script.src = src;
		script.onload = () => callback();
		script.onerror = () => callback(new Error(`Failed to load script: ${src}`));
		document.head.appendChild(script);
	}

	/**
	 * Creates popups from configurations and adds them to the popup manager.
	 * 
	 * @param {PopupConfig[]} popupConfigs - The configurations for the popups.
	 * @returns {void}
	 */
	#initPopups(popupConfigs) {
		popupConfigs.forEach((popupConfig) => {
			const targetElement = document.querySelector(popupConfig.target);
			if (targetElement) {
				this.popupManager.addPopup(new PopupManagerPopup({
					id: popupConfig.id,
					targetElement: targetElement,
					onlyUpward: popupConfig.onlyUpward,
					dialog: new Dialog({
						type: popupConfig.dialog.type,
						source: popupConfig.dialog.source,
						closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
					})
				}));
			}
		});
	}

	/**
	 * Retrieves an array of audio manager mute triggers.
	 * 
	 * @returns {Element[]} The found audio manager mute triggers.
	 */
	#getAudioManagerMuteTriggers() {
		const triggers = document.querySelectorAll("button[data-audio-manager-mute-trigger]");
		return Array.from(triggers);
	}

	/**
	 * Retrieves an array of initialized audio manager play triggers.
	 * 
	 * @returns {AudioManagerPlayTrigger[]} The initialized audio manager play triggers.
	 */
	#getAudioManagerPlayTriggers() {
		const triggers = document.querySelectorAll("button[data-audio-manager-play-trigger]");
		return Array.from(triggers).map((trigger) => {
			return new AudioManagerPlayTrigger({
				trigger: trigger,
				audioName: trigger.getAttribute("data-audio-manager-play-trigger")
			});
		});
	}

	/**
	 * Fetches the audio files for the audio manager and stores them as audio buffers.
	 * 
	 * @returns {void}
	 */
	#fetchAudioManagerAudioFiles() {
		this.audioManager.fetchAudioFile("../assets/sounds/flip.ogg", "flip");
		this.audioManager.fetchAudioFile("../assets/sounds/select.ogg", "select");
		this.audioManager.fetchAudioFile("../assets/sounds/error.ogg", "error");
		this.audioManager.fetchAudioFile("../assets/sounds/achieve.ogg", "achieve");
		this.audioManager.fetchAudioFile("../assets/sounds/click.ogg", "click");
	}

	/**
	 * Initializes the audio players.
	 * 
	 * @returns {void}
	 */
	#initAudioPlayers() {
		const elems = document.querySelectorAll("[data-audio-player]");
		elems.forEach((elem) => {
			this.audioPlayers.push(new AudioPlayer({
				wrapper: elem,
				playTrigger: elem.querySelector("[data-audio-player-play-trigger]"),
				stopTrigger: elem.querySelector("[data-audio-player-stop-trigger]"),
				seekRange: elem.querySelector("[data-audio-player-seek-range]"),
				source: elem.getAttribute("data-audio-player"),
				playCallback: (audioPlayer, event) => {
					this.pauseAllAudioPlayer(audioPlayer);
					this.#toggleAllBackgroundAudio();
				},
				pauseCallback: (audioPlayer, event) => {
					this.#toggleAllBackgroundAudio();
				}
			}));
		});
	}

	/**
	 * Initializes the gliders.
	 * 
	 * @returns {void}
	 */
	#initGliders() {
		const elems = document.querySelectorAll("[data-glider]");
		elems.forEach((elem) => {
			this.gliders.push(new Glider({
				wrapper: elem,
				viewport: elem.querySelector("[data-glider-viewport]"),
				prevTrigger: elem.querySelector("[data-glider-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-glider-next-trigger]"),
				items: Array.from(elem.querySelectorAll("[data-glider-list-item]"))
			}));
		});
	}

	/**
	 * Initializes the rolls.
	 * 
	 * @returns {void}
	 */
	#initRolls() {
		const elems = document.querySelectorAll("[data-roll]");
		elems.forEach((elem) => {
			this.rolls.push(new Glider({
				wrapper: elem,
				viewport: elem.querySelector("[data-roll-viewport]"),
				prevTrigger: elem.querySelector("[data-roll-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-roll-next-trigger]"),
				items: Array.from(elem.querySelectorAll("[data-roll-list-item]")),
				hasRewind: false
			}));
		});
	}

	/**
	 * Initializes the scroll tables.
	 * 
	 * @returns {void}
	 */
	#initScrollTables() {
		const elems = document.querySelectorAll("[data-scroll-table]");
		elems.forEach((elem) => {
			this.scrollTables.push(new ScrollTable({
				wrapper: elem,
				header: elem.querySelector("[data-scroll-table-header]"),
				body: elem.querySelector("[data-scroll-table-body]"),
				prevTrigger: elem.querySelector("[data-scroll-table-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-scroll-table-next-trigger]")
			}));
		});
	}

	/**
	 * Initializes the navigation bar sub-navigations.
	 * 
	 * @returns {void}
	 */
	#initNavbarSubnavs() {
		const elems = document.querySelectorAll("[data-navbar-subnav]");
		elems.forEach((elem) => {
			this.navbarSubnavs.push(new Dropdown({
				element: elem.querySelector("[data-navbar-subnav-element]"),
				trigger: elem.querySelector("[data-navbar-subnav-trigger]")
			}));
		});
	}

	/**
	 * Initializes the lazy load detectors.
	 * 
	 * @returns {void}
	 */
	#initLazyLoadDetectors() {
		const elems = document.querySelectorAll("img[loading=lazy]");
		elems.forEach((elem) => {
			this.lazyLoadDetectors.push(new LazyLoadDetector({
				element: elem
			}));
		});
	}

	/**
	 * Initializes the dialogs.
	 * 
	 * @returns {void}
	 */
	#initDialogs() {
		const elems = document.querySelectorAll("[data-dialog]");
		elems.forEach((elem) => {
			this.dialogs.push(new Dialog({
				type: elem.getAttribute("data-dialog"),
				source: elem.getAttribute("data-dialog-source") || elem.getAttribute("href"),
				triggers: [elem],
				description: elem.getAttribute("data-dialog-description") || "",
				customClasses: Dialog.parseCustomClasses(elem, "data-dialog-classes"),
				closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>",
				openCallback: (dialog) => {
					this.pauseAllAudioPlayer();
					this.#toggleAllBackgroundAudio();
				},
				closeCallback: (dialog) => {
					this.#toggleAllBackgroundAudio();
				}
			}));
		});
		this.#addDialogAdditionalTriggers();
	}

	/**
	 * Adds additional triggers to the dialogs.
	 * 
	 * @returns {void}
	 */
	#addDialogAdditionalTriggers() {
		const elems = document.querySelectorAll("[data-dialog-trigger]");
		elems.forEach((elem) => {
			this.dialogs.forEach((dialog) => {
				if (dialog.source == elem.getAttribute('data-dialog-trigger')) {
					dialog.addTrigger(elem);
				}
			});
		});
	}

	/**
	 * Initializes the slideshows.
	 * 
	 * @returns {void}
	 */
	#initSlideshows() {
		const elems = document.querySelectorAll("[data-slideshow]");
		elems.forEach((elem) => {
			this.slideshows.push(new Slideshow({
				source: `#${elem.id}`,
				closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>",
				gliderWrapper: elem.querySelector("[data-slideshow-glider]"),
				gliderViewport: elem.querySelector("[data-slideshow-glider-viewport]"),
				gliderPrevTrigger: elem.querySelector("[data-slideshow-glider-prev-trigger]"),
				gliderNextTrigger: elem.querySelector("[data-slideshow-glider-next-trigger]"),
				gliderItems: Array.from(elem.querySelectorAll("[data-slideshow-glider-list-item]")),
			}));
		});
		this.#addSlideshowAdditionalTriggers();
	}

	/**
	 * Adds additional triggers to the sideshows.
	 * 
	 * @returns {void}
	 */
	#addSlideshowAdditionalTriggers() {
		const elems = document.querySelectorAll("[data-slideshow-trigger]");
		elems.forEach((elem) => {
			this.slideshows.forEach((slideshow) => {
				if (slideshow.source == elem.getAttribute('data-slideshow-trigger')) {
					slideshow.addTrigger(new SlideshowTrigger({
						elem: elem,
						index: parseInt(elem.getAttribute("data-slideshow-trigger-index")) || 0
					}));
				}
			});
		});
	}

	/**
	 * Initializes the range indicators.
	 * 
	 * @returns {void}
	 */
	#initRangeIndicators() {
		const elems = document.querySelectorAll("[data-range]");
		elems.forEach((elem) => {
			this.rangeIndicators.push(new RangeIndicator({
				input: elem.querySelector("input"),
				indicator: elem.querySelector("[data-range-indicator]"),
				formatter: (value) => {
					return value.toLocaleString("en-US");
				}
			}));
		});
	}

	/**
	 * Initializes the validators.
	 * 
	 * @returns {void}
	 */
	#initValidators() {
		const elems = document.querySelectorAll("[data-validator]");
		elems.forEach((elem) => {
			this.validators.push(new Validator({
				form: elem,
				invalidCallback: (validator, input, message) => {
					if (input.type == "hidden") return;
					const formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.setAttribute("data-label", message);
						formItem.classList.add("has-invalid-field");
						formItem.classList.remove("has-valid-field");
					}
				},
				validCallback: (validator, input) => {
					if (input.type == "hidden") return;
					const formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.removeAttribute("data-label");
						formItem.classList.remove("has-invalid-field");
						formItem.classList.add("has-valid-field");
					}
				},
				hasInvalidCallback: (validator, elems) => {
					this.alertManager.addAlert("One or more fields are invalid!", "error");
				}
			}));
		});
	}

	/**
	 * Initializes the notices.
	 * 
	 * @returns {void}
	 */
	#initNotices() {
		const elems = document.querySelectorAll("[data-notice]");
		elems.forEach((elem) => {
			this.notices.push(new Notice({
				wrapper: elem,
				dismissButton: elem.querySelector("[data-notice-dismiss]")
			}));
		});
	}

	/**
	 * Initializes the tabs.
	 * 
	 * @returns {void}
	 */
	#initTabs() {
		const elems = document.querySelectorAll("[data-tab]");
		elems.forEach((elem) => {
			this.tabs.push(new Tab({
				wrapper: elem,
				triggers: elem.querySelectorAll("[data-tab-trigger]"),
				panels: elem.querySelectorAll("[data-tab-panel]")
			}));
		});
	}

	/**
	 * Initializes the sortables trees.
	 * 
	 * @returns {void}
	 */
	#initSortableTrees() {
		const elems = document.querySelectorAll("[data-sortable-tree]");
		elems.forEach((elem) => {
			this.sortableTrees.push(new SortableTree({
				wrapper: elem,
				nodeSelector: "[data-sortable-tree-node]",
				subtreeSelector: "[data-sortable-tree-subtree]",
				collapseTriggerSelector: "[draggable]",
				removeTriggerSelector: "[data-sortable-tree-node-remove-trigger]",
				blockSelector: "[data-sortable-tree-block]",
				blocksWrapper: elem.parentElement.querySelector('[data-sortable-tree-blocks]'),
				createNodeFromBlock: (option) => {
					const templateId = option.getAttribute('data-sortable-tree-block');
					if (templateId) {
						const template = document.getElementById(templateId);
						if (template instanceof HTMLTemplateElement) {
							const targetElem = template.content.firstElementChild;
							if (targetElem) {
								return targetElem.cloneNode(true);
							}
						}
					}
					return null;
				}
			}));
		});
	}

	/**
	 * Initializes the steppers.
	 * 
	 * @returns {void}
	 */
	#initSteppers() {
		const elems = document.querySelectorAll("[data-stepper]");
		elems.forEach((elem) => {
			this.steppers.push(new Stepper({
				input: elem.querySelector("[data-stepper-input]"),
				stepUpTrigger: elem.querySelector("[data-stepper-step-up-trigger]"),
				stepDownTrigger: elem.querySelector("[data-stepper-step-down-trigger]"),
				indicator: elem.querySelector("[data-stepper-indicator]"),
				formatter: (value) => {
					return `${value.toLocaleString("en-US")}`;
				}
			}));
		});
	} 

	/**
	 * Initializes the tours.
	 * 
	 * @returns {void}
	 */
	#initTours() {
		const elems = document.querySelectorAll("[data-tour]");
		elems.forEach((elem) => {
			const audioPlayer = this.#getTourAudioPlayer(elem);
			const scenes = this.#getTourScenes(elem);
			const sceneTriggers = this.#getTourSceneTriggers(elem);
			const sceneStartTriggers = this.#getTourSceneStartTriggers(elem);
			const inventoryTriggers = this.#getTourInventoryTriggers(elem);
			const audioPlayerTriggers = this.#getTourAudioPlayerTriggers(elem);
			const popovers = this.#getTourPopovers(elem);
			this.tours.push(new Tour({
				id: elem.id,
				wrapper: elem,
				viewport: elem.querySelector("[data-tour-viewport]"),
				backTrigger: elem.querySelector("[data-tour-back-trigger]"),
				audioPlayer: audioPlayer,
				scenes: scenes,
				sceneTriggers: sceneTriggers.concat(sceneStartTriggers),
				inventoryTriggers: inventoryTriggers,
				audioPlayerTriggers: audioPlayerTriggers,
				popovers: popovers,
				zoomInTrigger: elem.querySelector("[data-tour-zoom-in-trigger]"),
				zoomOutTrigger: elem.querySelector("[data-tour-zoom-out-trigger]"),
				backToRootTrigger: elem.querySelector("[data-tour-back-to-root-trigger]"),
				fullscreenTrigger: elem.querySelector("[data-tour-fullscreen-trigger]"),
				initCallback: (tour) => {
					this.#initTourOverviewPopover(tour);
				},
				changeSceneCallback: (tour, scene) => {
					this.#closeTourOverviewPopover(tour);
					this.audioManager.play("click");
					if (scene.id == "scene-1") {
						this.audioManager.pauseBackgroundAudio("birdChirping");
					} else {
						this.audioManager.playBackgroundAudio("birdChirping");
					}
				},
				popoverOpenedCallback: (tour, event) => {
					if (!tour.isSceneChanging) this.audioManager.play("flip");
				},
				popoverClosedCallback: (tour, event) => {
					if (!tour.isSceneChanging) this.audioManager.play("flip");
				},
				zoomCallback: (tour, scene, zoomLevel, isInitial) => {
					if (!tour.isSceneChanging) this.audioManager.play("click");
				},
				inventoryTriggerClickCallback: (tour, event) => {
					if (!tour.isSceneChanging) this.audioManager.play("click");
				},
				audioPlayerTriggerClickCallback: (tour, audioPlayerTrigger, event) => {
					if (!tour.isSceneChanging) this.audioManager.play("click");
				},
				audioPlayerPlayCallback: (tour, audioPlayer, event) => {
					this.pauseAllAudioPlayer(audioPlayer);
					this.#toggleAllBackgroundAudio();
				},
				audioPlayerPauseCallback: (tour, audioPlayer, event) => {
					this.#toggleAllBackgroundAudio();
				},
				audioPlayerAbortCallback: (tour, audioPlayer, event) => {
					this.#toggleAllBackgroundAudio();
				}
			}));
		});
	}

	/**
	 * Retrieves the initialized audio player for the tour under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {AudioPlayer|null} The initialized audio player, or `null` if no audio player was found.
	 */
	#getTourAudioPlayer(elem) {
		const audioPlayerElem = elem.querySelector("[data-tour-audio-player]");
		if (audioPlayerElem) {
			return new AudioPlayer({
				wrapper: audioPlayerElem,
				playTrigger: audioPlayerElem.querySelector("[data-tour-audio-player-play-trigger]"),
				abortTrigger: audioPlayerElem.querySelector("[data-tour-audio-player-abort-trigger]"),
				seekRange: audioPlayerElem.querySelector("[data-tour-audio-player-seek-range]")
			})
		} else {
			return null;
		}
	}

	/**
	 * Retrieves an array of initialized tour scenes under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {(TourMapScene|TourFieldScene)[]} The initialized tour scenes.
	 */
	#getTourScenes(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-scene]");
		return Array.from(elems).map((elem) => {
			const sceneType = elem.getAttribute("data-tour-scene");
			switch (sceneType) {
				case "map":
					return this.#getTourMapScene(elem);
				case "field":
					return this.#getTourFieldScene(elem);
			}
		});
	}

	/**
	 * Retrieves an initialized map-type tour scene wrapped by the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourMapScene} The initialized map-type tour scene.
	 */
	#getTourMapScene(wrapperElem) {
		const hotspots = this.#getTourSceneHotspots(wrapperElem);
		const coordinates = this.#parseTourSceneCoordinates(wrapperElem);
		return new TourMapScene({
			id: wrapperElem.id,
			wrapper: wrapperElem,
			tileList: wrapperElem.querySelector("[data-tour-scene-tile-list]"),
			...coordinates,
			hotspots: hotspots
		});
	}

	/**
	 * Retrieves an initialized field-type tour scene wrapped by the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourFieldScene} The initialized field-type tour scene.
	 */
	#getTourFieldScene(wrapperElem) {
		const hotspots = this.#getTourSceneHotspots(wrapperElem);
		const coordinates = this.#parseTourSceneCoordinates(wrapperElem);
		return new TourFieldScene({
			id: wrapperElem.id,
			wrapper: wrapperElem,
			tileList: wrapperElem.querySelector("[data-tour-scene-tile-list]"),
			...coordinates,
			hotspots: hotspots,
		});
	}

	/**
	 * Retrieves an array of initialized tour scene hotspots under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourSceneHotspot[]} The initialized tour scene hotspots.
	 */
	#getTourSceneHotspots(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-scene-hotspot]");
		return Array.from(elems).map((elem) => {
			const rawCoordinate = elem.getAttribute("data-tour-scene-hotspot") || "";
			const rawRotations = elem.getAttribute("data-tour-scene-hotspot-rotation") || "";
			const rawRequiredItemIds = elem.getAttribute("data-tour-scene-hotspot-required-item-ids") || "";
			return new TourSceneHotspot({
				wrapper: elem,
				coordinate: TourSceneCoordinate.fromString(rawCoordinate),
				requiredItemIds: TourSceneHotspot.idsFromString(rawRequiredItemIds),
				...TourSceneHotspot.rotationsFromString(rawRotations)
			});
		});
	}

	/**
	 * Retrieves an array of initialized tour scene triggers under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourSceneTrigger[]} The initialized tour scene triggers.
	 */
	#getTourSceneTriggers(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-scene-trigger]");
		return Array.from(elems).map((elem) => {
			const sceneId = elem.getAttribute("data-tour-scene-trigger");
			return new TourSceneTrigger({
				sceneId: sceneId,
				trigger: elem
			});
		});
	}

	/**
	 * Retrieves an array of initialized tour scene triggers under the specified element that clear the history and then navigate from the root scene to the specified scene.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourSceneTrigger[]} The initialized tour scene triggers.
	 */
	#getTourSceneStartTriggers(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-scene-start-trigger]");
		return Array.from(elems).map((elem) => {
			const sceneId = elem.getAttribute("data-tour-scene-start-trigger");
			return new TourSceneTrigger({
				sceneId: sceneId,
				trigger: elem,
				clearHistory: true
			});
		});
	}

	/**
	 * Retrieves an array of initialized tour inventory triggers under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourInventoryTrigger[]} The initialized tour inventory triggers.
	 */
	#getTourInventoryTriggers(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-inventory-trigger]");
		return Array.from(elems).map((elem) => {
			const itemId = parseInt(elem.getAttribute("data-tour-inventory-trigger"));
			return new TourInventoryTrigger({
				trigger: elem,
				itemId: itemId
			});
		});
	}

	/**
	 * Retrieves an array of initialized tour audio player triggers under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourAudioPlayerTrigger[]} The initialized tour audio player triggers.
	 */
	#getTourAudioPlayerTriggers(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-audio-player-trigger]");
		return Array.from(elems).map((elem) => {
			return new TourAudioPlayerTrigger({
				trigger: elem,
				source: elem.getAttribute("data-tour-audio-player-trigger")
			});
		});
	}

	/**
	 * Retrieves an array of initialized tour popovers under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element.
	 * @returns {TourPopover[]} The initialized tour popovers.
	 */
	#getTourPopovers(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-tour-popover]");
		return Array.from(elems).map((elem) => {
			return new TourPopover({
				wrapper: elem,
				closedCallback: ((tourPopover) => {
					this.audioPlayers.forEach((audioPlayer) => {
						if (tourPopover.wrapper.contains(audioPlayer.wrapper)) {
							audioPlayer.stop();
						}
					});
				})
			});
		});
	}

	/**
	 * Retrieves the parsed top-left and bottom-right tour scene coordinates from the specified element's attributes.
	 * 
	 * @param {Element} tourSceneElem - The element whose attributes contain the tour scene coordinates.
	 * @returns {{topLeftCoordinate: TourSceneCoordinate, bottomRightCoordinate: TourSceneCoordinate}} An object containing the parsed top-left and bottom-right tour scene coordinates.
	 */
	#parseTourSceneCoordinates(elem) {
		const rawTopLeft = elem.getAttribute("data-tour-scene-top-left-coordinate");
		const rawBottomRight = elem.getAttribute("data-tour-scene-bottom-right-coordinate");
		return {
			topLeftCoordinate: TourSceneCoordinate.fromString(rawTopLeft),
			bottomRightCoordinate: TourSceneCoordinate.fromString(rawBottomRight)
		};
	}

	/**
	 * Initializes triggers that navigate to the first scene and then scroll to the related hotspot within the tour.
	 * 
	 * @returns {void}
	 */
	#initTourScrollToTriggers() {
		this.tours.forEach((tour) => {
			const triggerElems = tour.wrapper.querySelectorAll("[data-tour-scroll-to-trigger]");
			triggerElems.forEach((triggerElem) => {
				const sceneId = triggerElem.getAttribute("data-tour-scroll-to-trigger");
				const targetElem = tour.wrapper.querySelector(`[data-tour-scene-trigger="${sceneId}"]`)
				if (targetElem) {
					triggerElem.addEventListener("click", (event) => {
						tour.goBackToRoot();
						tour.scrollToElem(targetElem);
						targetElem.focus({
							focusVisible: true,
							preventScroll: true
						});
					});
				}
			});
		});
	}

	/**
	 * Initializes the overview popover for the tour.
	 * 
	 * @param {Tour} tour - The tour whose overview popover is to be initialized.
	 * @returns {void}
	 */
	#initTourOverviewPopover(tour) {
		const overviewPopover = tour.wrapper.querySelector("[data-tour-overview-popover]");
		if (overviewPopover && overviewPopover.popover) {
			tour.meta.set("overviewPopover", overviewPopover);
			overviewPopover.addEventListener("toggle", (event) => {
				this.liveFilters.forEach((liveFilter) => {
					if (overviewPopover.contains(liveFilter.wrapper)) {
						liveFilter.input.value = "";
						liveFilter.filter();
					}
				});
			});
		}
	}

	/**
	 * Closes the overview popover of the specified tour.
	 * 
	 * @param {Tour} tour - The tour whose overview popover is to be closed.
	 * @returns {void}
	 */
	#closeTourOverviewPopover(tour) {
		const overviewPopover = tour.meta.get("overviewPopover");
		if (overviewPopover) {
			tour.meta.get("overviewPopover").hidePopover();
		}
	}

	/**
	 * Initializes the memory games.
	 * 
	 * @returns {void}
	 */
	#initMemoryGames() {
		const elems = document.querySelectorAll("[data-memory-game]");
		elems.forEach((elem) => {
			const cards = this.#getMemoryGameCards(elem);
			this.memoryGames.push(new MemoryGame({
				wrapper: elem,
				cardList: elem.querySelector("[data-memory-game-list]"),
				cards: cards,
				restartTrigger: elem.querySelector("[data-memory-game-restart-trigger]"),
				scoreIndicator: elem.querySelector("[data-memory-game-score-indicator]"),
				moveCountIndicator: elem.querySelector("[data-memory-game-move-count-indicator]"),
				timerIndicator: elem.querySelector("[data-memory-game-timer-indicator]"),
				cardFlipCallback: (memoryGame) => {
					this.audioManager.play("flip");
				},
				cardMatchCallback: (memoryGame, firstCard, secondCard, isCompleted) => {
					if (!isCompleted) {
						setTimeout(() => {
							this.audioManager.play("select");
						}, 300);
					}
				},
				cardMismatchCallback: (memoryGame, firstCard, secondCard) => {
					setTimeout(() => {
						if ("vibrate" in navigator) navigator.vibrate(200);
						this.audioManager.play("error");
					}, 300);
				},
				completeCallback: (memoryGame, score, moveCount, timer) => {
					setTimeout(() => {
						this.audioManager.play("achieve");
						this.dialogs[0].open();
					}, 300);
				},
				restartCallback: (memoryGame) => {
					this.audioManager.play("click");
				}
			}));
		});
	}

	/**
	 * Retrieves an array of initialized memory game cards under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element of the memory game.
	 * @returns {MemoryGameCard[]} The initialized memory game cards.
	 */
	#getMemoryGameCards(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-memory-game-card]");
		return Array.from(elems).map((elem) => {
			return new MemoryGameCard({
				id: elem.getAttribute("data-memory-game-card"),
				trigger: elem,
				frontView: elem.querySelector("[data-memory-game-card-front]"),
				backView: elem.querySelector("[data-memory-game-card-back]")
			});
		});
	}

	/**
	 * Initializes the quizzes.
	 * 
	 * @returns {void}
	 */
	#initQuizzes() {
		const elems = document.querySelectorAll("[data-quiz]");
		elems.forEach((elem) => {
			let questions = this.#getQuizQuestions(elem);
			this.quizzes.push(new Quiz({
				wrapper: elem,
				questions: questions,
				nextTrigger: elem.querySelector("[data-quiz-next-trigger]"),
				startTriggers: Array.from(elem.querySelectorAll("[data-quiz-start-trigger]")),
				scoreIndicator: elem.querySelector("[data-quiz-score-indicator]"),
				questionCountIndicator: elem.querySelector("[data-quiz-question-count-indicator]"),
				timerIndicator: elem.querySelector("[data-quiz-timer-indicator]"),
				progressIndicator: elem.querySelector("[data-quiz-progress-indicator]"),
				startCallback: (quiz) => {
					this.audioManager.play("flip");
				},
				questionAnsweredCallback: (quiz, result) => {
					const isLastQuestion = quiz.activeIndex >= quiz.questions.length - 1;
					if (!isLastQuestion) this.audioManager.play("select");
				},
				questionErrorCallback: (quiz, question) => {
					this.audioManager.play("error");
				},
				completeCallback: (quiz, score, timer, results) => {
					this.audioManager.play("achieve");
					let rateElem = elem.querySelector("[data-quiz-result-rate]");
					if (rateElem) {
						rateElem.innerHTML = `<h3>You achieved a score of ${score}!</h3>`;
					}
				}
			}));
		});
	}

	/**
	 * Retrieves an array of initialized quiz questions under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element of the quiz.
	 * @returns {QuizQuestion[]} The initialized quiz questions.
	 */
	#getQuizQuestions(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-quiz-question]");
		return Array.from(elems).map((elem) => {
			const options = this.#getQuizQuestionOptions(elem);
			const totalPoints = this.#getQuestionTotalPoints(elem);
			return new QuizQuestion({
				wrapper: elem,
				options: options,
				minPoints: totalPoints
			});
		});
	}

	/**
	 * Retrieves an array of initialized quiz question options under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element of the quiz question.
	 * @returns {QuizQuestionOption[]} The initialized quiz question options.
	 */
	#getQuizQuestionOptions(wrapperElem) {
		let elems = wrapperElem.querySelectorAll("[data-quiz-question-option]");
		return Array.from(elems).map((elem) => {
			return new QuizQuestionOption({
				input: elem,
				isInvalid: elem.value === "0",
				checkCallback: (option) => {
					this.audioManager.play("click");
				}
			});
		});
	}

	/**
	 * Retrieves the total points of quiz question options under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the quiz question.
	 * @returns {number} The total points of the options for the quiz question.
	 */
	#getQuestionTotalPoints(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-quiz-question-option]");
		return Array.from(elems).reduce((acc, elem) => {
			return parseInt(elem.value) + acc;
		}, 0);
	}

	/**
	 * Initializes the live filters.
	 * 
	 * @returns {void}
	 */
	#initLiveFilters() {
		const elems = document.querySelectorAll("[data-live-filter]");
		elems.forEach((elem) => {
			const items = this.#getLiveFilterItems(elem);
			this.liveFilters.push(new LiveFilter({
				wrapper: elem,
				input: elem.querySelector("[data-live-filter-input]"),
				items: items
			}));
		});
	}

	/**
	 * Retrieves an array of initialized live filter items under the specified element.
	 * 
	 * @param {Element} wrapperElem - The wrapper element of the live filter.
	 * @returns {LiveFilterItem[]} The initialized live filter items.
	 */
	#getLiveFilterItems(wrapperElem) {
		const elems = wrapperElem.querySelectorAll("[data-live-filter-item]");
		return Array.from(elems).map((elem) => {
			return new LiveFilterItem({
				wrapper: elem,
				content: elem.innerText
			});
		});
	}

	/**
	 * Initializes the calendars.
	 * 
	 * @returns {void}
	 */
	#initCalendars() {
		const elems = document.querySelectorAll("[data-calendar]");
		elems.forEach((elem) => {
			const currentMonthTrigger = elem.querySelector("[data-calendar-current-month-trigger]");
			this.calendars.push(new Calendar({
				wrapper: elem,
				dayWrapper: elem.querySelector("[data-calendar-day-wrapper]"),
				yearSelector: elem.querySelector("[data-calendar-year-selector]"),
				monthSelector: elem.querySelector("[data-calendar-month-selector]"),
				prevMonthTrigger: elem.querySelector("[data-calendar-prev-month-trigger]"),
				nextMonthTrigger: elem.querySelector("[data-calendar-next-month-trigger]"),
				currentMonthTrigger: currentMonthTrigger,
				intervals: [
					new CalendarInterval({
						from: Temporal.Now.plainDateISO(),
						to: Temporal.Now.plainDateISO().add({ days: 365 }),
						weekdays: [1, 2, 3, 4, 5, 6, 7]
					})
				],
				selectCallback: (calendar, date) => console.log(date.toString())
			}));
			if (currentMonthTrigger !== null) {
				const day = Temporal.Now.plainDateISO().day;
				currentMonthTrigger.setAttribute("data-calendar-current-day", day);
			}
		});
	}

	/**
	 * Initializes the date selectors.
	 * 
	 * @returns {void}
	 */
	#initDateSelectors() {
		const elems = document.querySelectorAll("[data-date-selector]");
		elems.forEach((elem) => {
			this.dateSelectors.push(new DateSelector({
				yearSelector: elem.querySelector("[data-date-selector-year-selector]"),
				monthSelector: elem.querySelector("[data-date-selector-month-selector]"),
				daySelector: elem.querySelector("[data-date-selector-day-selector]"),
				intervals: [
					new DateSelectorInterval({
						from: Temporal.Now.plainDateISO(),
						to: Temporal.Now.plainDateISO().add({ years: 1 }),
						weekdays: [1, 2, 3, 4, 5, 6, 7]
					})
				],
				excludedIntervals: [],
				selectCallback: (dateSelector, date) => console.log(date.toString())
			}));
		});
	}

	/**
	 * Initializes the smooth scrolls.
	 * 
	 * @returns {void}
	 */
	#initSmoothScrolls() {
		const elems = document.querySelectorAll("[data-smooth-scroll]");
		elems.forEach((elem) => {
			elem.addEventListener("click", (event) => {
				event.preventDefault();
				const target = document.querySelector(elem.getAttribute("href"));
				if (target) {
					target.scrollIntoView({
						behavior: "smooth"
					});
				}
			});
		});
	}

	/**
	 * Mutes or unmutes all background audio in the audio manager based on whether audio is being played by an audio player or dialog.
	 * 
	 * @returns {void}
	 */
	#toggleAllBackgroundAudio() {
		const dialogTypes = ["video", "youtube"];
		let hasPlayingAudioPlayer = this.audioPlayers.some((audioPlayer) => !audioPlayer.audio.paused);
		let hasPlayingTourAudioPlayer = this.tours.some((tour) => tour.audioPlayer && !tour.audioPlayer.audio.paused);
		let hasPlayingDialog = this.dialogs.some((dialog) => dialog.isOpened && dialogTypes.includes(dialog.type));
		if (hasPlayingAudioPlayer || hasPlayingTourAudioPlayer || hasPlayingDialog) {
			this.audioManager.muteAllBackgroundAudio();
		} else {
			this.audioManager.unmuteAllBackgroundAudio();
		}
	}

	/**
	 * Pauses all audio players except the specified one.
	 * 
	 * @param {AudioPlayer|null} enabledAudioPlayer - The audio player to keep playing, or `null` to pause all audio players.
	 * @returns {void}
	 */
	pauseAllAudioPlayer(enabledAudioPlayer = null) {
		this.tours.forEach((tour) => {
			if (tour.audioPlayer && enabledAudioPlayer != tour.audioPlayer) {
				tour.audioPlayer.pause();
			}
		});
		this.audioPlayers.forEach((audioPlayer) => {
			if (enabledAudioPlayer != audioPlayer) {
				audioPlayer.pause();
			}
		});
	}

	/**
	 * Detects whether the user is offline and has no access to the network.
	 * 
	 * @returns {void}
	 */
	#detectOffline() {
		if (!navigator.onLine) {
			document.body.classList.add("is-offline");
		}
		window.addEventListener("offline", () => {
			document.body.classList.add("is-offline");
			this.alertManager.addAlert("You are offline!", "error");
		});
		window.addEventListener("online", () => {
			document.body.classList.remove("is-offline");
			this.alertManager.addAlert("You are online!", "success");
		});
	}

	/**
	 * Toggles between the offset and full navigation bar at the medium breakpoint.
	 * 
	 * @param {MediaQueryList} mediaQueryList - The media queries applied to the document. 
	 * @returns {void}
	 */
	#toggleNavbarType(mediaQueryList) {
		if (mediaQueryList.media == App.breakpoints.medium) {
			const navbarNav = document.getElementById("navbar-nav");
			if (navbarNav) {
				if (mediaQueryList.matches) {
					navbarNav.popover = "auto";
				} else {
					navbarNav.removeAttribute("popover");
				}
			}
		}
	}

	/**
	 * Detects immediate and event-driven changes in breakpoints.
	 * 
	 * @returns {void}
	 */
	#detectBreakpointChange() {
		Object.entries(App.breakpoints).forEach(([name, query]) => {
			const mediaQueryList = window.matchMedia(query);
			this.#toggleNavbarType(mediaQueryList);
			mediaQueryList.addEventListener("change", (event) => {
				this.#onBreakpointChange(event);
			});
		});
	}

	/**
	 * Executes after the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#onBreakpointChange(event) {
		this.#toggleNavbarType(event.target);
		this.alertManager.updatePositions();
		if (this.page) this.page.onBreakpointChange(event);
	}
}

export { App };