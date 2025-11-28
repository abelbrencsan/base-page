import { Autocomplete } from "../autocomplete.js";
import { Chart } from "../chart.js";
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
	 * Sample gauge pie chart.
	 * 
	 * @type {Chart}
	 */
	sampleGaugePieChart = new Chart({
		type: "pie",
		wrapper: document.getElementById("sample-gauge-pie-chart-plot"),
		isGauge: true,
		isDonut: true,
		datasets: [
			[60, 50, 35, 18, 33],
			[75, 55, 32, 15, 45],
			[70, 40, 30, 25, 40]
		]
	});

	/**
	 * Sample pie chart.
	 * 
	 * @type {Chart}
	 */
	samplePieChart = new Chart({
		type: "pie",
		wrapper: document.getElementById("sample-pie-chart-plot"),
		isDonut: true,
		datasets: [
			[60, 50, 35, 18, 33, 33, 33],
			[75, 55, 32, 15, 45],
			[70, 40, 30, 25, 40]
		]
	});

	/**
	 * Sample line chart.
	 * 
	 * @type {Chart}
	 */
	sampleLineChart = new Chart({
		type: "line",
		wrapper: document.getElementById("sample-line-chart-plot"),
		datasets: [
			[60, 50, 35, 18, 33],
			[75, 55, 32, 15, 45],
			[70, 40, 30, 25, 40]
		],
		updateCallback: (chart) => {
			this.updateChartLabels(chart);
		}
	});

	/**
	 * Sample bar chart.
	 * 
	 * @type {Chart}
	 */
	sampleBarChart = new Chart({
		type: "bar",
		wrapper: document.getElementById("sample-bar-chart-plot"),
		datasets: [
			[60, 50, 35, 18, 33],
			[98, 55, 32, 15, 45],
			[70, 40, 30, 25, 40]
		],
		updateCallback: (chart) => {
			this.updateChartLabels(chart);
		}
	});

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
	 * Updates the labels for the specified chart.
	 * 
	 * @param {Chart} chart
	 * @returns {void}
	 */  
	updateChartLabels(chart) {
		let labelList = chart.wrapper.nextElementSibling;
		labelList.replaceChildren();
		chart.labels.forEach((label) => {
			let listItem = document.createElement("li");
			listItem.innerText = label.toLocaleString("en-US");
			labelList.append(listItem);
		});
	}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event
	 * @returns {void}
	 */
	onBreakpointChange(event) {}
}

export { IndexPage };