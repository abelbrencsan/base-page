/**
 * Router
 * This class is designed to handle routing between endpoints within the page.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Router {

	/**
	 * An array of routes.
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
	 * An array of of route triggers.
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
	routeNotFoundCallback = null;

	/**
	 * Creates a router.
	 * 
	 * @param {Object} options
	 * @param {Route[]} options.routes - An array of routes.
	 * @param {string} options.root - The root path that is prepended to every route.
	 * @param {Node[]} options.triggers - An array of of route triggers.
	 * @param {boolean} options.isHashMode - Indicates whether the router should use hashes instead of path names for routing.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the router has been initialized.
	 * @param {function():void|null} options.routeNotFoundCallback - Callback function that is called when no route was found.
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
	 * @param {string} path - The path to navigate to.
	 * @returns {void}
	 */
	navigate(path) {
		this.#update(path);
	}

	/**
	 * Returns the specified path if provided, or the current path otherwise.
	 * 
	 * @param {string|null} path - The path to use, or `null` to use the current path.
	 * @returns {string} The resolved path.
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
	 * @param {string|null} path - The path to route, or `null` to use the current path.
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
			if (typeof(this.routeNotFoundCallback) == "function") this.routeNotFoundCallback();
		}
	}

	/**
	 * Selects routes that match the specified pathname.
	 * 
	 * @param {string} pathname - The pathname to match against the routes.
	 * @param {URL} url - The base URL.
	 * @returns {Route[]} An array of routes that match the given pathname.
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
	 * @param {string} path - The path to be split.
	 * @returns {[string, string]} An array containing the pathname as the first element and search parameters as the second element.
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
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
	 * @param {string} path - The path to be normalized.
	 * @returns {string} The normalized path
	 */
	static removeAdditionalSlashes(path) {
		return path.replace(/\/+/g, "/");
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
	 * @param {string} path - The path to be processed.
	 * @returns {string} The path without hash symbol at the beginning.
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
	 * The regular expression that matches the route.
	 * 
	 * @type {RegExp}
	 */
	pattern;

	/**
	 * Callback function that is called after the route has been selected.
	 * 
	 * @type {function(Route,URL,RegExpMatchArray):void}
	 */
	callback;

	/**
	 * Creates a route.
	 * 
	 * @param {Object} options
	 * @param {string} options.name - The name of the route.
	 * @param {RegExp} options.pattern - The regular expression that matches the route.
	 * @param {function(Route,URL,RegExpMatchArray):void} options.callback - Callback function that is called after the route has been selected.
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