/**
 * Page
 * This class is designed to handle scripts related to a page.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Page {

	/**
	 * The configurations for the page.
	 * 
	 * @typedef {Object} PageOptions
	 */

	/**
	 * Creates a page.
	 * 
	 * @param {PageOptions} options - The configurations for the page.
	 * @returns {Page}
	 */
	constructor(options = {}) {}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event - The event to be handled.
	 * @returns {void}
	 */
	onBreakpointChange(event) {}
}

export { Page };