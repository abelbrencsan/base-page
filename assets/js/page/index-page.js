import { Autocomplete } from "../autocomplete.js";
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
	 * Autocomplete for the search bar.
	 * 
	 * @type {Autocomplete}
	 */
	searchAutocomplete = new Autocomplete({
		input: document.getElementById("query"),
		id: "query-autcomplete",
		getSuggestions: (term, callback) => {
			const choices = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
			let suggestions = [];
			term = term.toLowerCase();
			choices.forEach((choice) => {
				if (~choice.toLowerCase().indexOf(term)) {
					suggestions.push(choice);
				}
			});
			callback(suggestions);
		},
		renderItem: (suggestion, term) => suggestion,
		renderInputValue: (suggestion) => suggestion
	});

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} _event
	 * @returns {void}
	 */
	onBreakpointChange(_event) {}
}

export { IndexPage };