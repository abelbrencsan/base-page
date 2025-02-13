import { Page } from "../page.js";

/**
 * Index Page
 * This class is designed to handle scripts related to index page.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class IndexPage extends Page {

	/**
	 * Creates an index page.
	 * 
	 * @param {Object} options
	 * @returns {Page}
	 */  
	constructor(options) {
		super(options);
	}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} _event
	 * @returns {void}
	 */
	onBreakpointChange(_event) {}
}

export { IndexPage };