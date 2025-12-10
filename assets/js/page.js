/**
 * Page
 * This class is designed to handle scripts related to a page.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Page {

	/**
	 * Represents the configurations for the page.
	 * 
	 * @typedef {Object} PageOptions
	 */

	/**
	 * Creates a page.
	 * 
	 * @param {PageOptions} options
	 * @returns {Page}
	 */
	constructor(options = {}) {}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event
	 * @returns {void}
	 */
	onBreakpointChange(event) {}

	/**
	 * Destroys the page.
	 * 
	 * @returnsrns {void}
	 */
	destroy() {}
}

export { Page };