/**
 * Router
 * This class is designed to routing for single page applications.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Router {

	/**
	 * List of all routes.
	 * 
	 * @type {Route[]}
	 */
	routes = [];

	/**
	 * The root path that is prepended to every route.
	 * 
	 * @type {string}
	 */
	root = "";

	/**
	 * Represents a collection of route triggers.
	 * 
	 * @type {Node[]}
	 */
	triggers = [];

	/**
	 * Indicates whether the router should use hashes instead of path names for routing.
	 * 
	 * @type {boolean}
	 */
	isHashMode = true;

	/**
	 * Callback function that is called after the router has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called when no route was found.
	 * 
	 * @type {function():void|null}
	 */
	isRouteNotFoundCallback = null;

	/**
	 * Callback function that is called after the router has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a router.
	 * 
	 * @param {Object} options
	 * @param {Route[]} options.routes
	 * @param {string} options.root
	 * @param {boolean} options.isHashMode
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isRouteNotFoundCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Router}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the router
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Navigates the router to the specified path.
	 * 
	 * @param {string} path
	 * @returns {void}
	 */
	navigate(path) {
		this.#update(path);
	}

	/**
	 * Destroys the router.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Returns the specified path if provided, or the current path otherwise.
	 * 
	 * @param {string|null} path
	 * @returns {string}
	 */
	getOrCleanPath(path) {
		if (path === null) {
			if (this.isHashMode) {
				path = Router.removeHash(location.hash);
			} else {
				path = location.pathname;
			}
		}
		return Router.removeAdditionalSlashes(path);
	}

	/**
	 * Performs routing for the current or the specified path.
	 * 
	 * @param {string|null} path
	 * @returns {void}
	 */
	#update(path = null) {
		const [pathname, search] = this.#splitPath(path);
		const hashPrefix = (this.isHashMode ? "#" : "");
		const usedUrl = new URL(location.origin + this.root + pathname + search);
		const pushedUrl = new URL(location.origin + this.root + hashPrefix + pathname + search);
		window.history.pushState(null, null, pushedUrl);
		let selectedRoutes = this.#selectRoutes(pathname, usedUrl);
		if (!selectedRoutes.length) {
			if (typeof(this.isRouteNotFoundCallback) == "function") this.isRouteNotFoundCallback();
		}
	}

	/**
	 * Selects routes that match the specified pathname.
	 * 
	 * @param {string} pathname
	 * @param {URL} url
	 * @returns {Route[]}
	 */
	#selectRoutes(pathname, url) {
		return this.routes.filter((route) => {
			let match = pathname.match(route.pattern);
			if (match) {
				match.shift();
				route.callback(route, url, match);
				return true;
			}
			return false;
		});
	}

	/**
	 * Splits the search parameters from the path and returns the path and the search parameters as a separate array.
	 * 
	 * @param {string} path
	 * @returns {string[]}
	 */
	#splitPath(path) {
		let [pathname, search] = this.getOrCleanPath(path).split("?");
		pathname = Router.addEndingSlash(pathname);
		search = (search === undefined ? "" : "?" + search);
		return [pathname, search];
	}

	/**
	 * Adds event listeners related to the router.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		window.addEventListener("popstate", this);
		this.triggers.forEach((trigger) => {
			trigger.addEventListener("click", this);
		});
	}

	/**
	 * Removes event listeners related to the router.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		window.removeEventListener("popstate", this);
		this.triggers.forEach((trigger) => {
			trigger.removeEventListener("click", this);
		});
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
				this.triggers.forEach((trigger) => {
					event.preventDefault();
					this.navigate(trigger.getAttribute("href"));
				});
				break;
			case "popstate":
				this.#update();
				break;
		}
	}

	/**
	 * Removes additional slash characters from the given path string.
	 * 
	 * @param {string} path
	 * @returns {string}
	 */
	static removeAdditionalSlashes(path) {
		path = path.replace(/\/+/g, "/");
		return path;
	}

	/**
	 * Adds an ending slash character to the end of the path if it is not present.
	 * 
	 * @param {string} path
	 * @returns {string}
	 */
	static addEndingSlash(path) {
		if (!path.endsWith("/")) path += "/";
		return path;
	}

	/**
	 * Removes the hash symbol from the beginning of the given path string, if present.
	 * 
	 * @param {string} path
	 * @returns {string}
	 */
	static removeHash(path) {
		return path.replace(/^\#/, "");
	}
}

/**
 * Route
 * This class is designed to store a route for the router.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Route {

	/**
	 * The name of the route.
	 * 
	 * @type {string}
	 */
	name;

	/**
	 * A regular expression that matches the route.
	 * 
	 * @type {RegExp}
	 */
	pattern;

	/**
	 * A callback function that is called after the route has been selected.
	 * 
	 * @type {function(Route,URL,RegExpMatchArray):void}
	 */
	callback;

	/**
	 * Creates a route.
	 * 
	 * @param {Object} options
	 * @param {string} options.name
	 * @param {RegExp} options.pattern
	 * @param {function(Route,URL,RegExpMatchArray):void} options.callback
	 * @returns {Route}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.name !== "string") {
			throw "Route \"name\" must be a `string`";
		}
		if (!(options.pattern instanceof RegExp)) {
			throw "Route \"pattern\" must be a `RegExp`";
		}
		if (!(options.callback instanceof Function)) {
			throw "Route \"callback\" must be a `Function`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}
}

export { Router, Route };