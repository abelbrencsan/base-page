/**
 * Page
 * This class is designed to handle scripts related to a page.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Page {

	/**
	 * Creates a page.
	 * 
	 * @param {Object} options
	 * @returns {Page}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}

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