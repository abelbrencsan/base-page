import { AlertManager } from "../js/alert-manager.js";
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
import { Router, Route } from "../js/router.js";
import { ScrollTable } from "../js/scroll-table.js";
import { Slideshow, SlideshowTrigger } from "../js/slideshow.js";
import { SortableTree } from "../js/sortable-tree.js";
import { Stepper } from "../js/stepper.js";
import { Tab } from "../js/tab.js";
import { Tour, TourMapScene, TourFieldScene, TourSceneHotspot, TourSceneCoordinate, TourSceneTrigger, TourPopover } from "./tour.js";
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
	 * Icon manager for the apllication.
	 * 
	 * @type {IconManager}
	 */
	iconManager = new IconManager();

	/**
	 * Callback function that is called after the routing.
	 * 
	 * @type {function(Route,URL,RegExpMatchArray):void}
	 */
	routeCallback = (route, url, match) => {};

	/**
	 * Router for the application.
	 * 
	 * @type {Router}
	 */
	router = new Router({
		routes: [],
		triggers: Array.from(document.querySelectorAll("[data-route-trigger]")),
		routeNotFoundCallback: () => {}
	});

	/**
	 * Alert manager for the apllication.
	 * 
	 * @type {AlertManager}
	 */
	alertManager = new AlertManager({
		container: document.querySelector("[data-alert-container]"),
		closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
	});

	/**
	 * Popup manager for the apllication.
	 * 
	 * @type {PopupManager}
	 */
	popupManager = new PopupManager();

	/**
	 * List of gliders.
	 * 
	 * @type {Glider[]}
	 */
	gliders = [];

	/**
	 * List of rolls.
	 * 
	 * @type {Glider[]}
	 */
	rolls = [];

	/**
	 * List of scroll tables.
	 * 
	 * @type {ScrollTable[]}
	 */
	scrollTables = [];

	/**
	 * List of navigation bar sub-navigations.
	 * 
	 * @type {Dropdown[]}
	 */
	navbarSubnavs = [];

	/**
	 * List of lazy load detectors.
	 * 
	 * @type {LazyLoadDetector[]}
	 */
	lazyLoadDetectors = [];

	/**
	 * List of dialogs.
	 * 
	 * @type {Dialog[]}
	 */
	dialogs = [];

	/**
	 * List of slideshows.
	 * 
	 * @type {Slideshow[]}
	 */
	slideshows = [];

	/**
	 * List of range indicators.
	 * 
	 * @type {RangeIndicator[]}
	 */
	rangeIndicators = [];

	/**
	 * List of validators.
	 * 
	 * @type {Validator[]}
	 */
	validators = [];

	/**
	 * List of notices.
	 * 
	 * @type {Notice[]}
	 */
	notices = [];

	/**
	 * List of tabs.
	 * 
	 * @type {Tab[]}
	 */
	tabs = [];

	/**
	 * List of sortable tres.
	 * 
	 * @type {SortableTree[]}
	 */
	sortableTrees = [];

	/**
	 * List of steppers.
	 * 
	 * @type {Stepper[]}
	 */
	steppers = [];

	/**
	 * List of tours.
	 * 
	 * @type {Tour[]}
	 */
	tours = [];

	/**
	 * List of memory games.
	 * 
	 * @type {MemoryGame[]}
	 */
	memoryGames = [];

	/**
	 * List of quizzes.
	 * 
	 * @type {Quiz[]}
	 */
	quizzes = [];

	/**
	 * List of live filters.
	 * 
	 * @type {LiveFilter[]}
	 */
	liveFilters = [];

	/**
	 * List of calendars.
	 * 
	 * @type {Calendar[]}
	 */
	calendars = [];

	/**
	 * List of date selectors.
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
			let targetElement = document.querySelector(popupConfig.target);
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
	 * Initializes the gliders.
	 * 
	 * @returns {void}
	 */
	#initGliders() {
		let elems = document.querySelectorAll("[data-glider]");
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
		let elems = document.querySelectorAll("[data-roll]");
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
		let elems = document.querySelectorAll("[data-scroll-table]");
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
		let elems = document.querySelectorAll("[data-navbar-subnav]");
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
		let elems = document.querySelectorAll("img[loading=lazy]");
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
		let elems = document.querySelectorAll("[data-dialog]");
		elems.forEach((elem) => {
			this.dialogs.push(new Dialog({
				type: elem.getAttribute("data-dialog"),
				source: elem.getAttribute("data-dialog-source") || elem.getAttribute("href"),
				triggers: [elem],
				description: elem.getAttribute("data-dialog-description") || "",
				customClasses: Dialog.parseCustomClasses(elem, "data-dialog-classes"),
				closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
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
		let triggerElems = document.querySelectorAll("[data-dialog-trigger]");
		triggerElems.forEach((triggerElem) => {
			this.dialogs.forEach((dialog) => {
				if (dialog.source == triggerElem.getAttribute('data-dialog-trigger')) {
					dialog.addTrigger(triggerElem);
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
		let elems = document.querySelectorAll("[data-slideshow]");
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
		let triggerElems = document.querySelectorAll("[data-slideshow-trigger]");
		triggerElems.forEach((triggerElem) => {
			this.slideshows.forEach((slideshow) => {
				if (slideshow.source == triggerElem.getAttribute('data-slideshow-trigger')) {
					slideshow.addTrigger(new SlideshowTrigger({
						elem: triggerElem,
						index: parseInt(triggerElem.getAttribute("data-slideshow-trigger-index")) || 0
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
		let elems = document.querySelectorAll("[data-range]");
		elems.forEach((elem) => {
			let input = elem.querySelector("input");
			let indicator = elem.querySelector("[data-range-indicator]");
			this.rangeIndicators.push(new RangeIndicator({
				input: input,
				indicator: indicator,
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
		let elems = document.querySelectorAll("[data-validator]");
		elems.forEach((elem) => {
			this.validators.push(new Validator({
				form: elem,
				invalidCallback: (input, message) => {
					if (input.type == "hidden") return;
					let formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.setAttribute("data-label", message);
						formItem.classList.add("has-invalid-field");
						formItem.classList.remove("has-valid-field");
					}
				},
				validCallback: (input) => {
					if (input.type == "hidden") return;
					let formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.removeAttribute("data-label");
						formItem.classList.remove("has-invalid-field");
						formItem.classList.add("has-valid-field");
					}
				},
				hasInvalidCallback: (elems) => {
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
		let elems = document.querySelectorAll("[data-notice]");
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
		let elems = document.querySelectorAll("[data-tab]");
		elems.forEach((elem) => {
			this.tabs.push(new Tab({
				wrapper: elem,
				triggers: elem.querySelectorAll("[data-tab-trigger]"),
				panels: elem.querySelectorAll("[data-tab-panel]")
			}));
		});
	}

	/**
	 * Initializes the sortables tees.
	 * 
	 * @returns {void}
	 */
	#initSortableTrees() {
		let elems = document.querySelectorAll("[data-sortable-tree]");
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
		let elems = document.querySelectorAll("[data-stepper]");
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
		const footstepAudio = new Audio("../assets/sounds/tour/footstep.ogg");
		const zoomAudio = new Audio("../assets/sounds/tour/zoom.ogg");
		const togglePopoverAudio = new Audio("../assets/sounds/tour/toggle-popover.ogg");
		elems.forEach((elem) => {
			const scenes = this.#initTourScenes(elem);
			const sceneTriggers = this.#initTourSceneTriggers(elem);
			const birdsAudio = new Audio("../assets/sounds/tour/birds.ogg");
			const popovers = this.#initTourPopovers(elem);
			this.tours.push(new Tour({
				wrapper: elem,
				viewport: elem.querySelector("[data-tour-viewport]"),
				backTrigger: elem.querySelector("[data-tour-back-trigger]"),
				scenes: scenes,
				sceneTriggers: sceneTriggers,
				popovers: popovers,
				zoomInTrigger: elem.querySelector("[data-tour-zoom-in-trigger]"),
				zoomOutTrigger: elem.querySelector("[data-tour-zoom-out-trigger]"),
				backToRootTrigger: elem.querySelector("[data-tour-back-to-root-trigger]"),
				fullscreenTrigger: elem.querySelector("[data-tour-fullscreen-trigger]"),
				muteTrigger: elem.querySelector("[data-tour-mute-trigger]"),
				backgroundAudio: birdsAudio,
				changeSceneAudio: footstepAudio,
				zoomAudio: zoomAudio,
				openPopoverAudio: togglePopoverAudio,
				closePopoverAudio: togglePopoverAudio,
				popoverOpeningCallback: (tour, event) => {
					tour.selectedScene.scrollToElem(event.source, tour.viewport);
				}
			}));
		});
	}

	/**
	 * Retrieves a list of tour scenes under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {(TourMapScene|TourFieldScene)[]} The created tour scenes.
	 */
	#initTourScenes(elem) {
		let tourScenes = [];
		let tourSceneElems = elem.querySelectorAll("[data-tour-scene]");
		tourSceneElems.forEach((tourSceneElem) => {
			const sceneType = tourSceneElem.getAttribute("data-tour-scene");
			switch (sceneType) {
				case "map":
					tourScenes.push(this.#createTourMapScene(tourSceneElem));
					break;
				case "field":
					tourScenes.push(this.#createTourFieldScene(tourSceneElem));
					break;
			}
		});
		return tourScenes;
	}

	/**
	 * Creates a map tour scene wrapped by the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {TourMapScene} The created map tour scene.
	 */
	#createTourMapScene(elem) {
		const hotspots = this.#initTourSceneHotspots(elem);
		const coordinates = this.#parseTourSceneCoordinates(elem);
		return new TourMapScene({
			id: elem.id,
			wrapper: elem,
			tileList: elem.querySelector("[data-tour-scene-tile-list]"),
			...coordinates,
			hotspots: hotspots
		});
	}

	/**
	 * Creates a field tour scene wrapped by the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {TourFieldScene} The created field tour scene.
	 */
	#createTourFieldScene(elem) {
		const hotspots = this.#initTourSceneHotspots(elem);
		const coordinates = this.#parseTourSceneCoordinates(elem);
		return new TourFieldScene({
			id: elem.id,
			wrapper: elem,
			tileList: elem.querySelector("[data-tour-scene-tile-list]"),
			...coordinates,
			hotspots: hotspots,
		});
	}

	/**
	 * Creates a list of tour scene hotspots under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {TourSceneHotspot[]} The created tour scene hotspots.
	 */
	#initTourSceneHotspots(elem) {
		let hotspots = [];
		const hotspotElems = elem.querySelectorAll("[data-tour-scene-hotspot]");
		hotspotElems.forEach((hotspotElem) => {
			const rawCoordinate = hotspotElem.getAttribute("data-tour-scene-hotspot") || "";
			const rawRotations = hotspotElem.getAttribute("data-tour-scene-hotspot-rotation") || "";
			hotspots.push(new TourSceneHotspot({
				wrapper: hotspotElem,
				coordinate: TourSceneCoordinate.fromString(rawCoordinate),
				...TourSceneHotspot.rotationsFromString(rawRotations)
			}));
		});
		return hotspots;
	}

	/**
	 * Creates a list of tour scene triggers under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {TourSceneTrigger[]} The created tour scene triggers.
	 */
	#initTourSceneTriggers(elem) {
		let triggers = [];
		const triggerElems = elem.querySelectorAll("[data-tour-scene-trigger]");
		triggerElems.forEach((triggerElem) => {
			const sceneId = triggerElem.getAttribute("data-tour-scene-trigger");
			triggers.push(new TourSceneTrigger({
				sceneId: sceneId,
				trigger: triggerElem
			}));
		});
		return triggers;
	}

	/**
	 * Creates a list of tour popovers under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element.
	 * @returns {TourPopover[]} The created tour popovers.
	 */
	#initTourPopovers(elem) {
		let popovers = [];
		const popoverElems = elem.querySelectorAll("[data-tour-popover]");
		popoverElems.forEach((popoverElem) => {
			popovers.push(new TourPopover({
				wrapper: popoverElem
			}));
		});
		return popovers;
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
	 * Initializes the memory games.
	 * 
	 * @returns {void}
	 */
	#initMemoryGames() {
		let cardFlipAudio = new Audio("../assets/sounds/memory-game/card-flip.ogg");
		let cardMatchAudio = new Audio("../assets/sounds/memory-game/card-match.ogg");
		let cardMismatchAudio = new Audio("../assets/sounds/memory-game/card-mismatch.ogg");
		let completeAudio = new Audio("../assets/sounds/memory-game/complete.ogg");
		let restartAudio = new Audio("../assets/sounds/memory-game/restart.ogg");
		let elems = document.querySelectorAll("[data-memory-game]");
		elems.forEach((elem) => {
			let cards = this.#initMemoryGameCards(elem);
			this.memoryGames.push(new MemoryGame({
				wrapper: elem,
				cardList: elem.querySelector("[data-memory-game-list]"),
				cards: cards,
				restartTrigger: elem.querySelector("[data-memory-game-restart-trigger]"),
				scoreIndicator: elem.querySelector("[data-memory-game-score-indicator]"),
				moveCountIndicator: elem.querySelector("[data-memory-game-move-count-indicator]"),
				timerIndicator: elem.querySelector("[data-memory-game-timer-indicator]"),
				cardFlipCallback: () => {					
					this.#playAudio(cardFlipAudio);
				},
				cardMatchCallback: (firstCard, secondCard, isCompleted) => {
					if (!isCompleted) {
						setTimeout(() => {
							this.#playAudio(cardMatchAudio);
						}, 300);
					}
				},
				cardMismatchCallback: (firstCard, secondCard) => {
					setTimeout(() => {
						if ("vibrate" in navigator) navigator.vibrate(200);
						this.#playAudio(cardMismatchAudio);
					}, 300);
				},
				completeCallback: (score, moveCount, timer) => {
					setTimeout(() => {
						this.#playAudio(completeAudio);
						this.dialogs[0].open();
					}, 300);
				},
				restartCallback: () => {
					this.#playAudio(restartAudio);
				}
			}));
		});
	}

	/**
	 * Retrieves a list of memory game cards under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the memory game.
	 * @returns {MemoryGameCard[]} The created memory game cards.
	 */
	#initMemoryGameCards(elem) {
		let cards = [];
		let cardElems = elem.querySelectorAll("[data-memory-game-card]");
		cardElems.forEach((cardElem) => {
			cards.push(new MemoryGameCard({
				id: cardElem.getAttribute("data-memory-game-card"),
				trigger: cardElem,
				frontView: cardElem.querySelector("[data-memory-game-card-front]"),
				backView: cardElem.querySelector("[data-memory-game-card-back]")
			}));
		});
		return cards;
	}

	/**
	 * Plays the specified audio once.
	 * 
	 * @param {HTMLAudioElement} audio - The audio to be played.
	 * @returns {void}
	 */
	#playAudio(audio) {
		audio.play();
		audio.currentTime = 0;
	}

	/**
	 * Initializes the quizzes
	 * 
	 * @returns {void}
	 */
	#initQuizzes() {
		let elems = document.querySelectorAll("[data-quiz]");
		elems.forEach((elem) => {
			let questions = this.#initQuizQuestions(elem);
			this.quizzes.push(new Quiz({
				wrapper: elem,
				questions: questions,
				nextTrigger: elem.querySelector("[data-quiz-next-trigger]"),
				startTriggers: Array.from(elem.querySelectorAll("[data-quiz-start-trigger]")),
				scoreIndicator: elem.querySelector("[data-quiz-score-indicator]"),
				questionCountIndicator: elem.querySelector("[data-quiz-question-count-indicator]"),
				timerIndicator: elem.querySelector("[data-quiz-timer-indicator]"),
				progressIndicator: elem.querySelector("[data-quiz-progress-indicator]"),
				completeCallback: (score, timer, questionResults) => {
					let rateElem = elem.querySelector("[data-quiz-result-rate]");
					if (rateElem) {
						rateElem.innerHTML = `<h3>You achieved a score of ${score}!</h3>`;
					}
				}
			}));
		});
	}

	/**
	 * Retrieves a list of quiz questions under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the quiz.
	 * @returns {QuizQuestion[]} The created quiz questions.
	 */
	#initQuizQuestions(elem) {
		let questions = [];
		let questionElems = elem.querySelectorAll("[data-quiz-question]");
		questionElems.forEach((questionElem) => {
			let options = this.#initQuizQuestionOptions(questionElem);
			let totalPoints = this.#getQuestionTotalPoints(questionElem);
			questions.push(new QuizQuestion({
				wrapper: questionElem,
				options: options,
				minPoints: totalPoints
			}));
		});
		return questions;
	}

	/**
	 * Retrieves a list of quiz question options under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the quiz question.
	 * @returns {QuizQuestionOption[]} The created quiz question options.
	 */
	#initQuizQuestionOptions(elem) {
		let options = [];
		let optionElems = elem.querySelectorAll("[data-quiz-question-option]");
		optionElems.forEach((optionElem) => {
			options.push(new QuizQuestionOption({
				input: optionElem,
				isInvalid: optionElem.value === "0"
			}));
		});
		return options;
	}

	/**
	 * Retrieves the total points of quiz question options under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the quiz question.
	 * @returns {number} The total points of the options for the quiz question.
	 */
	#getQuestionTotalPoints(elem) {
		let optionElems = elem.querySelectorAll("[data-quiz-question-option]");
		return Array.from(optionElems).reduce((acc, optionElem) => {
			return parseInt(optionElem.value) + acc;
		}, 0);
	}

	/**
	 * Initializes the live filters.
	 * 
	 * @returns {void}
	 */
	#initLiveFilters() {
		let elems = document.querySelectorAll("[data-live-filter]");
		elems.forEach((elem) => {
			let items = this.#initLiveFilterItems(elem);
			this.liveFilters.push(new LiveFilter({
				wrapper: elem,
				input: elem.querySelector("[data-live-filter-input]"),
				items: items
			}));
		});
	}

	/**
	 * Retrieves a list of live filter items under the specified element.
	 * 
	 * @param {Element} elem - The wrapper element of the live filter.
	 * @returns {LiveFilterItem[]} The created live filter items.
	 */
	#initLiveFilterItems(elem) {
		let items = [];
		let itemElems = elem.querySelectorAll("[data-live-filter-item]");
		itemElems.forEach((itemElem) => {
			items.push(new LiveFilterItem({
				wrapper: itemElem,
				content: itemElem.innerText
			}));
		});
		return items;
	}

	/**
	 * Initializes the calendars.
	 * 
	 * @returns {void}
	 */
	#initCalendars() {
		let elems = document.querySelectorAll("[data-calendar]");
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
				]
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
		let elems = document.querySelectorAll("[data-date-selector]");
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
				selectCallback: (date) => console.log(date.toString()),
				resetCallback: () => console.log("resetCallback")
			}));
		});
	}

	/**
	 * Initializes the smooth scrolls.
	 * 
	 * @returns {void}
	 */
	#initSmoothScrolls() {
		let elems = document.querySelectorAll("[data-smooth-scroll]");
		elems.forEach((elem) => {
			elem.addEventListener("click", (event) => {
				event.preventDefault();
				let target = document.querySelector(elem.getAttribute("href"));
				if (target) {
					target.scrollIntoView({
						behavior: "smooth"
					});
				}
			});
		});
	}

	/**
	 * Detects immediate and event-driven changes in breakpoints.
	 * 
	 * @returns {void}
	 */
	#detectBreakpointChange() {
		Object.entries(App.breakpoints).forEach(([name, query]) => {
			let mediaQueryList = window.matchMedia(query);
			this.#switchNavbarType(mediaQueryList);
			mediaQueryList.addEventListener("change", (event) => {
				this.#onBreakpointChange(event);
			});
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
	 * Switches between the offset and full navigation bar at the medium breakpoint.
	 * 
	 * @param {MediaQueryList} mediaQueryList - The media queries applied to the document. 
	 * @returns {void}
	 */
	#switchNavbarType(mediaQueryList) {
		if (mediaQueryList.media == App.breakpoints.medium) {
			const navbarNav = document.getElementById('navbar-nav');
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
	 * Executes after the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event - The event to be handled.
	 * @returns {void}
	 */
	#onBreakpointChange(event) {
		this.#switchNavbarType(event.target);
		this.alertManager.updatePositions();
		if (this.page) this.page.onBreakpointChange(event);
	}
}

export { App };