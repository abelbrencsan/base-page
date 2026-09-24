import { Autocomplete } from "../autocomplete.js";
import { Chart } from "../chart.js";
import { FinanceCalculator } from "../finance-calculator.js";
import { Glider } from "../glider.js";
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
	 * The configurations for the index page.
	 * 
	 * @typedef {Object} IndexPageOptions
	 */

	/**
	 * Home slider.
	 * 
	 * @type {Glider|null}
	 */
	homeSlider = null;

	/**
	 * Finance calculator.
	 * 
	 * @type {FinanceCalculator|null}
	 */
	financeCalculator = null;

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
			this.#updateChartLabels(chart);
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
			this.#updateChartLabels(chart);
		}
	});

	/**
	 * Creates an index page.
	 * 
	 * @param {IndexPageOptions} options - The configurations for the index page.
	 * @returns {Page}
	 */  
	constructor(options) {
		super(options);
		this.#initHomeSlider();
		this.#initFinanceCalculator();
	}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event - The event to be handled.
	 * @returns {void}
	 */
	onBreakpointChange(event) {}

	/**
	 * Initializes the home slider.
	 * 
	 * @returns {void}
	 */
	#initHomeSlider() {
		const elem = document.querySelector("[data-home-slider]");
		if (elem) {
			this.mainSlider = new Glider({
				wrapper: elem,
				viewport: elem.querySelector("[data-home-slider-viewport]"),
				prevTrigger: elem.querySelector("[data-home-slider-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-home-slider-next-trigger]"),
				items: Array.from(elem.querySelectorAll("[data-home-slider-list-item]")),
				autoplay: 5000,
				autoplayTrigger: elem.querySelector("[data-home-slider-autoplay-trigger]"),
				stopAutoplayCallback: function() {
					if (!this.autoplayTrigger) return;
					const icon = this.autoplayTrigger.querySelector("svg.icon use");
					if (icon) icon.setAttribute("xlink:href", "#icon-play");
				},
				startAutoplayCallback: function() {
					if (!this.autoplayTrigger) return;
					const icon = this.autoplayTrigger.querySelector("svg.icon use");
					if (icon) icon.setAttribute("xlink:href", "#icon-pause");
				}
			});
		};
	}

	/**
	 * Updates the labels for the specified chart.
	 * 
	 * @param {Chart} chart - The chart whose labels to be updated.
	 * @returns {void}
	 */  
	#updateChartLabels(chart) {
		const labelList = chart.wrapper.nextElementSibling;
		labelList.replaceChildren();
		chart.labels.forEach((label) => {
			const listItem = document.createElement("li");
			listItem.innerText = label.toLocaleString("en-US");
			labelList.append(listItem);
		});
	}

	/**
	 * Initializes the finance calculator.
	 * 
	 * @returns {void}
	 */
	#initFinanceCalculator() {
		const elem = document.querySelector("[data-finance-calculator]");
		const airInput = document.getElementById("annualInterestRate");
		const totalAmountInput = document.getElementById("totalAmount");
		if (elem && airInput && totalAmountInput) {
			const air = parseFloat(airInput.value);
			const totalAmount = parseFloat(totalAmountInput.value);
			this.financeCalculator = new FinanceCalculator({
				interestRate: FinanceCalculator.interestRatefromAPR(air),
				totalAmount: totalAmount,
				downPaymentRateInput: document.getElementById("downPaymentRate"),
				paymentPeriodsInput: document.getElementById("paymentPeriods"),
				totalAmountIndicator: elem.querySelector("[data-finance-calculator-total-amount-indicator]"),
				financedAmountIndicator: elem.querySelector("[data-finance-calculator-financed-amount-indicator]"),
				monthlyPaymentIndicator: elem.querySelector("[data-finance-calculator-monthly-payment-indicator]"),
				downPaymentAmountIndicator: elem.querySelector("[data-finance-calculator-down-payment-amount-indicator]"),
				totalPaymentIndicator: elem.querySelector("[data-finance-calculator-total-payment-indicator]"),
				paymentPeriodsIndicator: elem.querySelector("[data-finance-calculator-payment-periods-indicator]"),
				airIndicator: elem.querySelector("[data-finance-calculator-air-indicator]"),
				aprIndicator: elem.querySelector("[data-finance-calculator-apr-indicator]"),
				totalCostIndicator: elem.querySelector("[data-finance-calculator-total-cost-indicator]")
			});
			airInput.addEventListener(("input"), (event) => {
				if (this.financeCalculator === null) return;
				const air = parseFloat(airInput.value);
				this.financeCalculator.interestRate = FinanceCalculator.interestRatefromAPR(air);
				this.financeCalculator.update();
			});
			totalAmountInput.addEventListener(("input"), (event) => {
				if (this.financeCalculator === null) return;
				const totalAmount = parseFloat(totalAmountInput.value);
				this.financeCalculator.totalAmount = totalAmount;
				this.financeCalculator.update();
			});
		}
	}
}

export { IndexPage };