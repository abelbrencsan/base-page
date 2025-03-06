import { Dropdown } from "../js/dropdown.js";

/**
 * Navigation bar
 * This class is designed to handle navigation bars with sub-navigation items.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Navbar {

	/**
	 * The class added to the document body when the navigation bar has an open subnavigation.
	 * 
	 * @type {string}
	 */
	hasOpenedSubnavClass = "has-opened-subnav";

	/**
	 * The class added to the document body when the offset navigation is open.
	 * 
	 * @type {string}
	 */
	isOffsetNavOpenedClass = "is-offset-nav-opened";

	/**
	 * Callback function that is called after the navigation bar has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the navigation bar has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Dropdown used for offset navigation.
	 * 
	 * @type {null|Dropdown}
	 */
	offsetNav = null;

	/**
	 * Dropdowns used for subnavigations.
	 * 
	 * @type {Array<Dropdown>}
	 */
	subnavs = [];

	/**
	 * Creates a navigation bar.
	 * 
	 * @param {Object} options
	 * @param {string} options.hasOpenedSubnavClass
	 * @param {string} options.isOffsetNavOpenedClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Navbar}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the navigation bar
		this.#initOffsetNav();
		this.#initSubnavs();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Switch the navigation bar type to offset navigation.
	 * 
	 * @returns {void}
	 */
	switchToOffsetNav() {
		if (!this.offsetNav) return;
		this.closeSubnavs();
		this.offsetNav.element.setAttribute("aria-hidden","true");
	}

	/**
	 * Switch the navigation bar type to full navigation.
	 * 
	 * @returns {void}
	 */
	switchToFullNav() {
		if (!this.offsetNav) return;
		this.closeSubnavs();
		if (this.offsetNav.isOpened) {
			this.offsetNav.close();
		}
		this.offsetNav.element.setAttribute("aria-hidden","false");
	}

	/**
	 * Close all subnavigations in the navigation bar.
	 * 
	 * @returns {void}
	 */
	closeSubnavs() {
		this.subnavs.forEach((subnav) => {
			subnav.close();
		});
	}

	/**
	 * Destroys the navigation bar.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Initializes offset navigation for the navigation bar.
	 * 
	 * @returns {void}
	 */
	#initOffsetNav() {
		let elem = document.querySelector("[data-offset-nav]");
		if (elem) {
			this.offsetNav = new Dropdown({
				trigger: elem.querySelector("[data-offset-nav-trigger]"),
				element: elem.querySelector("[data-offset-nav-element]"),
				closeButton: elem.querySelector("[data-offset-nav-close]"),
				openCallback: () => {
					document.body.classList.add(this.isOffsetNavOpenedClass);
				},
				closeCallback: () => {
					document.body.classList.remove(this.isOffsetNavOpenedClass);
				}
			});
		}
	}

	/**
	 * Initializes subnavigations for the navigation bar.
	 * 
	 * @returns {void}
	 */
	#initSubnavs() {
		let elems = document.querySelectorAll("[data-navbar-subnav]");
		elems.forEach((elem) => {
			this.subnavs.push(new Dropdown({
				trigger: elem.querySelector("[data-navbar-subnav-trigger]"),
				element: elem.querySelector("[data-navbar-subnav-element]"),
				openCallback: () => {
					document.body.classList.add(this.hasOpenedSubnavClass);
				},
				closeCallback: () => {
					document.body.classList.remove(this.hasOpenedSubnavClass);
				}
			}));
		});
	}
}

export { Navbar };