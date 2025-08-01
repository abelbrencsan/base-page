import { AlertManager } from "../js/alert-manager.js";
import { Dialog } from "../js/dialog.js";
import { Dropdown } from "../js/dropdown.js";
import { Glider } from "../js/glider.js";
import { IconManager } from "../js/icon-manager.js";
import { LazyLoadDetector } from "../js/lazy-load-detector.js";
import { Notice } from "../js/notice.js";
import { RangeIndicator } from "../js/range-indicator.js";
import { Roll } from "../js/roll.js";
import { Router, Route } from "../js/router.js";
import { Slideshow, SlideshowTrigger } from "../js/slideshow.js";
import { SortableTree } from "../js/sortable-tree.js";
import { Stepper } from "../js/stepper.js";
import { Tab } from "../js/tab.js";
import { Validator } from "../js/validator.js";

/**
 * Application
 * This class is designed to handle the workflow of the application.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class App {

	/**
	 * Icon manager for the apllication.
	 * 
	 * @type {IconManager}
	 */
	iconManager = new IconManager();

	/**
	 * Callback function that is called after routing
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
	 * List of gliders.
	 * 
	 * @type {Array<Glider>}
	 */
	gliders = [];

	/**
	 * List of rolls.
	 * 
	 * @type {Array<Roll>}
	 */
	rolls = [];

	/**
	 * List of navigation bar sub-navigations.
	 * 
	 * @type {Array<Dropdown>}
	 */
	navbarSubnavs = [];

	/**
	 * List of button sub-navigations.
	 * 
	 * @type {Array<Dropdown>}
	 */
	buttonSubnavs = [];

	/**
	 * List of lazy load detectors.
	 * 
	 * @type {Array<LazyLoadDetector>}
	 */
	lazyLoadDetectors = [];

	/**
	 * List of dialogs.
	 * 
	 * @type {Array<Dialog>}
	 */
	dialogs = [];

	/**
	 * List of slideshows.
	 * 
	 * @type {Array<Slideshow>}
	 */
	slideshows = [];

	/**
	 * List of range indicators.
	 * 
	 * @type {Array<RangeIndicator>}
	 */
	rangeIndicators = [];

	/**
	 * List of validators.
	 * 
	 * @type {Array<Validator>}
	 */
	validators = [];

	/**
	 * List of notices.
	 * 
	 * @type {Array<Notice>}
	 */
	notices = [];

	/**
	 * List of tabs.
	 * 
	 * @type {Array<Tab>}
	 */
	tabs = [];

	/**
	 * List of sortable tres.
	 * 
	 * @type {Array<sortableTree>}
	 */
	sortableTrees = [];

	/**
	 * List of steppers.
	 * 
	 * @type {Array<Stepper>}
	 */
	steppers = [];

	/**
	 * List of pages.
	 * 
	 * @type {Array<Page>}
	 */
	pages = [];

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
	 * @param {Object} options
	 * @returns {App}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the application
		this.#initGliders();
		this.#initRolls();
		this.#initNavbarSubnavs();
		this.#initButtonSubnavs();
		this.#initLazyLoadDetectors();
		this.#initDialogs();
		this.#initSlideshows();
		this.#initRangeIndicators();
		this.#initValidators();
		this.#initNotices();
		this.#initTabs();
		this.#initSortableTrees();
		this.#initSteppers();
		this.#initSmoothScrolls();
		this.#detectBreakpointChange();
		this.#detectOffline();
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
				items: elem.querySelectorAll("[data-glider-list-item]"),
				prevTrigger: elem.querySelector("[data-glider-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-glider-next-trigger]")
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
			this.rolls.push(new Roll({
				wrapper: elem,
				viewport: elem.querySelector("[data-roll-viewport]"),
				items: elem.querySelectorAll("[data-roll-list-item]"),
				prevTrigger: elem.querySelector("[data-roll-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-roll-next-trigger]")
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
	 * Initializes the button sub-navigations.
	 * 
	 * @returns {void}
	 */
	#initButtonSubnavs() {
		let elems = document.querySelectorAll("[data-button-subnav]");
		elems.forEach((elem) => {
			this.buttonSubnavs.push(new Dropdown({
				trigger: elem.querySelector("[data-button-subnav-trigger]"),
				element: elem.querySelector("[data-button-subnav-element]")
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
				gliderItems: elem.querySelectorAll("[data-slideshow-glider-list-item]"),
				gliderPrevTrigger: elem.querySelector("[data-slideshow-glider-prev-trigger]"),
				gliderNextTrigger: elem.querySelector("[data-slideshow-glider-next-trigger]")
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
					let formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.setAttribute("data-label", message);
						formItem.classList.add("has-invalid-field");
						formItem.classList.remove("has-valid-field");
					}
					
				},
				validCallback: (input) => {
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
				element: elem,
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
				collapseTriggerSelector: "[draggable]"
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
		Object.entries(App.breakpoints).forEach(([, query]) => {
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
	 * @param {MediaQueryList} mediaQueryList
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
	 * @param {MediaQueryListEvent} event
	 * @returns {void}
	 */
	#onBreakpointChange(event) {
		this.#switchNavbarType(event.target);
		this.alertManager.updatePositions();
		this.gliders.forEach((glider) => {
			glider.detectIsScrollable();
		});
		this.slideshows.forEach((slideshow) => {
			if (slideshow.glider) slideshow.glider.detectIsScrollable();
		});
		this.pages.forEach((page) => {
			page.onBreakpointChange(event);
		});
	}
}

export { App };