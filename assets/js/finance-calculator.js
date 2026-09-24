/**
 * Finance Calculator
 * This class is designed to calculate the monthly payment for a financed amount using either an annual percentage rate (APR) or an annual interest rate (AIR).
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class FinanceCalculator {

	/**
	 * The total amount.
	 * 
	 * @type {number}
	 */
	totalAmount;

	/**
	 * The monthly interest rate.
	 * 
	 * @type {number}
	 */
	interestRate;

	/**
	 * The input element used to select the down payment rate.
	 * 
	 * @type {HTMLInputElement}
	 */
	downPaymentRateInput;

	/**
	 * The input element used to select the number of payment periods (in months).
	 * 
	 * @type {HTMLInputElement}
	 */
	paymentPeriodsInput;

	/**
	 * The locale used to format values.
	 * 
	 * @type {string}
	 */
	locale = "en";

	/**
	 * The currency used for finance calculations.
	 * 
	 * @type {string}
	 */
	currency = "HUF";

	/**
	 * The element where the monthly payment is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	monthlyPaymentIndicator = null;

	/**
	 * The element where the total amount is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	totalAmountIndicator = null;

	/**
	 * The element where the financed amount is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	financedAmountIndicator = null;

	/**
	 * The element where the down payment amount is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	downPaymentAmountIndicator = null;

	/**
	 * The element where the total payment is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	totalPaymentIndicator = null;

	/**
	 * The element where the total cost is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	totalCostIndicator = null;

	/**
	 * The element where the number of payment periods is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	paymentPeriodsIndicator = null;

	/**
	 * The element where the annual interest rate (AIR) is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	airIndicator = null;

	/**
	 * The element where the annual percentage rate (APR) is rendered.
	 * 
	 * @type {HTMLElement|null}
	 */
	aprIndicator = null;

	/**
	 * Callback function that is called after the finance calculator has been initialized.
	 * 
	 * @type {function(FinanceCalculator):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the finance calculator has been updated.
	 * 
	 * @type {function(FinanceCalculator):void|null}
	 */
	updateCallback = null;

	/**
	 * The financed amount.
	 * 
	 * @type {number}
	 */
	get financedAmount() {
		return this.totalAmount * (1 - this.downPaymentRate);
	}

	/**
	 * The down payment amount.
	 * 
	 * @type {number}
	 */
	get downPaymentAmount() {
		return this.totalAmount - this.financedAmount;
	}

	/**
	 * The down payment rate.
	 * 
	 * @type {number}
	 */
	get downPaymentRate() {
		return parseFloat(this.downPaymentRateInput.value) / 100;
	}

	/**
	 * The payment amount for each month.
	 * 
	 * @type {number}
	 */
	get monthlyPayment() {
		if (this.paymentPeriods <= 0 || this.financedAmount <= 0) return 0;
		const r = this.interestRate;
		const p = this.financedAmount;
		const n = this.paymentPeriods;
		const e = Math.pow(1 + r, -n);
		if (this.interestRate === 0) {
			return p / n;
		} else {
			return (r * p) / (1 - e);
		}
	}

	/**
	 * The number of payment periods (in months).
	 * 
	 * @type {number}
	 */
	get paymentPeriods() {
		return parseFloat(this.paymentPeriodsInput.value);
	}

	/**
	 * The annual interest rate (AIR).
	 * 
	 * @type {number}
	 */
	get air() {
		return this.interestRate * 12;
	}

	/**
	 * The annual percentage rate (APR).
	 * 
	 * @type {number}
	 */
	get apr() {
		return Math.pow((1 + this.interestRate), 12) - 1;
	}

	/**
	 * The options for formatting currencies.
	 * 
	 * @type {{style: string, currency: string}}
	 */
	get #currencyFormat() {
		return {
			style: "currency",
			currency: this.currency
		};
	}

	/**
	 * The options for formatting rates.
	 * 
	 * @type {{style: string, minimumFractionDigits: number, maximumFractionDigits: number}}
	 */
	get #rateFormat() {
		return {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 2
		};
	}

	/**
	 * The options for formatting the number of months.
	 * 
	 * @type {{style: string, unit: string}}
	 */
	get #monthFormat() {
		return {
			style: "unit",
			unit: "month",
		};
	}

	/**
	 * Creates a finance calculator.
	 * 
	 * @param {Object} options
	 * @param {number} options.totalAmount - The total amount.
	 * @param {number} options.interestRate - The monthly interest rate.
	 * @param {HTMLInputElement} options.downPaymentRateInput - The input element used to select the down payment rate.
	 * @param {HTMLInputElement} options.paymentPeriodsInput - The input element used to select the number of payment periods (in months).
	 * @param {string} options.locale - The locale used to format values.
	 * @param {string} options.currency - The currency used for finance calculations.
	 * @param {HTMLElement|null} options.monthlyPaymentIndicator - The element where the monthly payment is rendered.
	 * @param {HTMLElement|null} options.totalAmountIndicator - The element where the total amount is rendered.
	 * @param {HTMLElement|null} options.financedAmountIndicator - The element where the financed amount is rendered.
	 * @param {HTMLElement|null} options.downPaymentAmountIndicator - The element where the down payment amount is rendered.
	 * @param {HTMLElement|null} options.totalPaymentIndicator - The element where the total payment is rendered.
	 * @param {HTMLElement|null} options.totalCostIndicator - The element where the total cost is rendered.
	 * @param {HTMLElement|null} options.paymentPeriodsIndicator - The element where the number of payment periods is rendered.
	 * @param {HTMLElement|null} options.airIndicator - The element where the annual interest rate (AIR) is rendered.
	 * @param {HTMLElement|null} options.aprIndicator - The element where the annual percentage rate (APR) is rendered.
	 * @param {function(FinanceCalculator):void|null} options.initCallback - Callback function that is called after the finance calculator has been initialized.
	 * @param {function(FinanceCalculator):void|null} options.updateCallback - Callback function that is called after the finance calculator has been updated.
	 * @returns {FinanceCalculator}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.totalAmount !== "number") {
			throw "Finance calculator \"totalAmount\" option must be a number";
		}
		if (typeof options.interestRate !== "number") {
			throw "Finance calculator \"interestRate\" option must be a number";
		}
		if (!(options.downPaymentRateInput instanceof HTMLInputElement)) {
			throw "Finance calculator \"downPaymentRateInput\" must be an `HTMLInputElement`";
		}
		if (!(options.paymentPeriodsInput instanceof HTMLInputElement)) {
			throw "Finance calculator \"paymentPeriodsInput\" must be an `HTMLInputElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the finance calculator
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.update();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Updates the finance calculation indicators based on the current parameters.
	 * 
	 * @returns {void}
	 */
	update() {
		const monthlyPayment = this.monthlyPayment;
		const paymentPeriods = this.paymentPeriods;
		const totalPayment = monthlyPayment * paymentPeriods;
		const totalCost = totalPayment - this.financedAmount;
		this.#updateMonthlyPaymentIndicator(monthlyPayment);
		this.#updateTotalAmountIndicator(this.totalAmount);
		this.#updateFinancedAmountIndicator(this.financedAmount);
		this.#updateDownPaymentAmountIndicator(this.downPaymentAmount);
		this.#updateTotalPaymentIndicator(totalPayment);
		this.#updateTotalCostIndicator(totalCost);
		this.#updatePaymentPeriodsIndicator(paymentPeriods);
		this.#updateAIRIndicator(this.air);
		this.#updateAPRIndicator(this.apr);
		if (typeof(this.updateCallback) == "function") this.updateCallback(this);
	}

	/**
	 * Updates the monthly payment indicator.
	 * 
	 * @param {number} value - The monthly payment to be displayed.
	 * @returns {void}
	 */
	#updateMonthlyPaymentIndicator(value) {
		if (!this.monthlyPaymentIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.monthlyPaymentIndicator.innerText = formatted;
	}

	/**
	 * Updates the total amount indicator.
	 * 
	 * @param {number} value - The total amount to be displayed.
	 * @returns {void}
	 */
	#updateTotalAmountIndicator(value) {
		if (!this.totalAmountIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.totalAmountIndicator.innerText = formatted;
	}

	/**
	 * Updates the financed amount indicator.
	 * 
	 * @param {number} value - The financed amount to be displayed.
	 * @returns {void}
	 */
	#updateFinancedAmountIndicator(value) {
		if (!this.financedAmountIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.financedAmountIndicator.innerText = formatted;
	}

	/**
	 * Updates the down payment amount indicator.
	 * 
	 * @param {number} value - The down payment amount to be displayed.
	 * @returns {void}
	 */
	#updateDownPaymentAmountIndicator(value) {
		if (!this.downPaymentAmountIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.downPaymentAmountIndicator.innerText = formatted;
	}

	/**
	 * Updates the total payment indicator.
	 * 
	 * @param {number} value - The total payment to be displayed.
	 * @returns {void}
	 */
	#updateTotalPaymentIndicator(value) {
		if (!this.totalPaymentIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.totalPaymentIndicator.innerText = formatted;
	}

	/**
	 * Updates the total cost indicator.
	 * 
	 * @param {number} value - The total cost to be displayed.
	 * @returns {void}
	 */
	#updateTotalCostIndicator(value) {
		if (!this.totalCostIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#currencyFormat);
		this.totalCostIndicator.innerText = formatted;
	}

	/**
	 * Updates the payment periods indicator.
	 * 
	 * @param {number} value - The payment periods to be displayed.
	 * @returns {void}
	 */
	#updatePaymentPeriodsIndicator(value) {
		if (!this.paymentPeriodsIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#monthFormat);
		this.paymentPeriodsIndicator.innerText = formatted;
	}

	/**
	 * Updates the annual interest rate (AIR) indicator.
	 * 
	 * @param {number} value - The annual interest rate (AIR) to be displayed.
	 * @returns {void}
	 */
	#updateAIRIndicator(value) {
		if (!this.airIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#rateFormat);
		this.airIndicator.innerText = formatted;
	}

	/**
	 * Updates the annual percentage rate (APR) indicator.
	 * 
	 * @param {number} value - The annual percentage rate (APR) to be displayed.
	 * @returns {void}
	 */
	#updateAPRIndicator(value) {
		if (!this.aprIndicator) return;
		const formatted = value.toLocaleString(this.locale, this.#rateFormat);
		this.aprIndicator.innerText = formatted;
	}

	/**
	 * Adds event listeners related to the finance calculator.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.downPaymentRateInput.addEventListener("input", this);
		this.paymentPeriodsInput.addEventListener("input", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "input":
				this.update();
				break;
		}
	}

	/**
	 * Retrieves the monthly interest rate from the specified annual interest rate (AIR).
	 * 
	 * @params {number} air - The annual interest rate (AIR) to be converted.
	 * @returns {number} The monthly interest rate.
	 */
	static interestRatefromAIR(air) {
		return air / 100 / 12;
	}

	/**
	 * Retrieves the monthly interest rate from the specified annual percentage rate (APR).
	 * 
	 * @params {number} apr - The annual precentage rate (APR) to be converted.
	 * @returns {number} The monthly interest rate.
	 */
	static interestRatefromAPR(apr) {
		return Math.pow(1 + apr / 100, 1 / 12) - 1;
	}
}

export { FinanceCalculator };