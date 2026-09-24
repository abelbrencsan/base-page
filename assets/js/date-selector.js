/**
 * Date Selector
 * This class is designed to create date selectors.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class DateSelector {

	/**
	 * The select element in which the year can be changed.
	 * 
	 * @type {HTMLSelectElement}
	 */
	yearSelector;

	/**
	 * The select element in which the month can be changed.
	 * 
	 * @type {HTMLSelectElement}
	 */
	monthSelector;

	/**
	 * The select element in which the day can be changed.
	 * 
	 * @type {HTMLSelectElement}
	 */
	daySelector;

	/**
	 * Included intervals during which the date can be selected.
	 * 
	 * @type {DateSelectorInterval[]}
	 */
	intervals;

	/**
	 * Excluded Intervals during which the date cannot be selected.
	 * 
	 * @type {DateSelectorInterval[]}
	 */
	excludedIntervals = [];

	/**
	 * The label of the select option for a year.
	 * 
	 * @type {function(number):string}
	 */
	yearLabel = (year) => year.toString();

	/**
	 * The label of the select option for a month.
	 * 
	 * @type {function(Temporal.PlainYearMonth):string}
	 */
	monthLabel = (yearMonth) => yearMonth.toLocaleString("en-US", { calendar: "iso8601", month: "2-digit" });

	/**
	 * The label of the select option for a day.
	 * 
	 * @type {function(Temporal.PlainDate):string}
	 */
	dayLabel = (date) => date.toLocaleString("en-US", { day: "2-digit" });

	/**
	 * Callback function that is called after the date selector has been initialized.
	 * 
	 * @type {function(DateSelector):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the date has been selected.
	 * 
	 * @type {function(DateSelector,Temporal.PlainDate):void|null}
	 */
	selectCallback = null;

	/**
	 * Callback function that is called after the selected date has been reset.
	 * 
	 * @type {function(DateSelector):void|null}
	 */
	resetCallback = null;

	/**
	 * Callback function that is called after the year has been selected.
	 * 
	 * @type {function(DateSelector,number):void|null}
	 */
	selectYearCallback = null;

	/**
	 * Callback function that is called after the month has been selected.
	 * 
	 * @type {function(DateSelector,number,number):void|null}
	 */
	selectMonthCallback = null;

	/**
	 * The selected date.
	 * 
	 * @type {Temporal.PlainDate|null}
	 */
	selectedDate = null;

	/**
	 * The earliest date from the interval start dates.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	get minDate() {
		return this.intervals.reduce((acc, interval) => {
			const isEarlier = Temporal.PlainDate.compare(interval.from, acc) < 0;
			return isEarlier ? interval.from : acc;
		}, this.intervals[0].from);
	}

	/**
	 * The latest date from the interval end dates.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	get maxDate() {
		return this.intervals.reduce((acc, interval) => {
			const isLater = Temporal.PlainDate.compare(interval.to, acc) > 0;
			return isLater ? interval.to : acc;
		}, this.intervals[0].to);
	}

	/**
	 * Creates a date selector.
	 * 
	 * @param {Object} options
	 * @param {HTMLSelectElement} options.yearSelector - The select element in which the year can be changed.
	 * @param {HTMLSelectElement} options.monthSelector - The select element in which the month can be changed.
	 * @param {HTMLSelectElement} options.daySelector - The select element in which the day can be changed.
	 * @param {DateSelectorInterval[]} options.intervals - Included intervals during which the date can be selected.
	 * @param {DateSelectorInterval[]} options.excludedIntervals - Excluded Intervals during which the date cannot be selected.
	 * @param {function(number):string} options.yearLabel - The label of the select option for a year.
	 * @param {function(Temporal.PlainYearMonth):string} options.monthLabel - The label of the select option for a month.
	 * @param {function(Temporal.PlainDate):string} options.dayLabel - The label of the select option for a day.
	 * @param {function(DateSelector):void|null} options.initCallback - Callback function that is called after the date selector has been initialized.
	 * @param {function(DateSelector,Temporal.PlainDate):void|null} options.selectCallback - Callback function that is called after the date has been selected.
	 * @param {function(DateSelector):void|null} options.resetCallback - Callback function that is called after the selected date has been reset.
	 * @param {function(DateSelector,number):void|null} options.selectYearCallback - Callback function that is called after the year has been selected.
	 * @param {function(DateSelector,number,number):void|null} options.selectMonthCallback - Callback function that is called after the month has been selected.
	 * @returns {DateSelector}
	 */
	constructor(options) {

		// Test required options
		if (!(options.yearSelector instanceof HTMLSelectElement)) {
			throw new Error("Date selector \"yearSelector\" must be an `HTMLSelectElement`");
		}
		if (!(options.monthSelector instanceof HTMLSelectElement)) {
			throw new Error("Date selector \"monthSelector\" must be an `HTMLSelectElement`");
		}
		if (!(options.daySelector instanceof HTMLSelectElement)) {
			throw new Error("Date selector \"daySelector\" must be an `HTMLSelectElement`");
		}
		if (!(options.intervals instanceof Array)) {
			throw new Error("Date selector \"intervals\" must be an `array`");
		}
		if (!options.intervals.length) {
			throw new Error("Date selector must include at least one interval.");
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the date selector
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#setYearSelector();
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Selects the specified date.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be selected.
	 * @returns {void}
	 */
	selectDate(date) {
		if (!this.#isDateIncluded(date) || this.#isDateExcluded(date)) return;
		this.selectDay(date.year, date.month, date.day);
	}

	/**
	 * Resets the selected date.
	 * 
	 * @returns {void}
	 */
	resetDate() {
		if (this.selectedDate === null) return;
		this.selectedDate = null;
		if (typeof(this.resetCallback) == "function") this.resetCallback(this);
	}

	/**
	 * Selects the specified year.
	 * 
	 * @param {number} year - The year to be selected.
	 * @returns {void}
	 */
	selectYear(year) {
		this.#resetMonthSelector();
		if (!isNaN(year)) {
			if (this.yearSelector.value === "") {
				this.yearSelector.value = year.toString();
			}
			this.#setMonthSelector(year);
			if (typeof(this.selectYearCallback) == "function") this.selectYearCallback(this, year);
		}
	}

	/**
	 * Selects the specified month.
	 * 
	 * @param {number} year - The year to be selected.
	 * @param {number} month - The month to be selected.
	 * @returns {void}
	 */
	selectMonth(year, month) {
		if (this.yearSelector.value === "") this.selectYear(year);
		this.#resetDaySelector();
		if (!isNaN(year) && !isNaN(month)) {
			if (this.monthSelector.value === "") {
				this.monthSelector.value = month.toString();
			}
			this.#setDaySelector(year, month);	
			if (typeof(this.selectMonthCallback) == "function") this.selectMonthCallback(this, year, month);
		}
	}

	/**
	 * Selects the specified day.
	 * 
	 * @param {number} year - The year to be selected.
	 * @param {number} month - The month to be selected.
	 * @param {number} day - The day to be selected.
	 * @returns {void}
	 */
	selectDay(year, month, day) {
		if (this.yearSelector.value === "") this.selectYear(year);
		if (this.monthSelector.value === "") this.selectMonth(year, month);
		if (isNaN(day)) this.resetDate();
		if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
			if (this.daySelector.value === "") {
				this.daySelector.value = day.toString();
			}
			this.#setSelectedDate(year, month, day);
		}
	}

	/**
	 * Sets the selected the date with the specified year, month and day.
	 * 
	 * @param {number} year - The year to be selected.
	 * @param {number} month - The month to be selected.
	 * @param {number} day - The day to be selected.
	 * @returns {void}
	 */
	#setSelectedDate(year, month, day) {
		this.selectedDate = new Temporal.PlainDate(year, month, day);
		if (typeof(this.selectCallback) == "function") this.selectCallback(this, this.selectedDate);
	}

	/**
	 * A year option is selected.
	 * 
	 * @returns {void}
	 */
	#isYearSelected() {
		const year = parseInt(this.yearSelector.value);
		this.selectYear(year);
	}

	/**
	 * A month option is selected.
	 * 
	 * @returns {void}
	 */
	#isMonthSelected() {
		const year = parseInt(this.yearSelector.value);
		const month = parseInt(this.monthSelector.value);
		this.selectMonth(year, month);
	}

	/**
	 * A day option is selected.
	 * 
	 * @returns {void}
	 */
	#isDaySelected() {
		const year = parseInt(this.yearSelector.value);
		const month = parseInt(this.monthSelector.value);
		const day = parseInt(this.daySelector.value);
		this.selectDay(year, month, day);
	}

	/**
	 * Sets the year selector.
	 * 
	 * @returns {void}
	 */
	#setYearSelector() {
		const minYear = this.minDate.year;
		const maxYear = this.maxDate.year;
		this.yearSelector.appendChild(this.#createOption("", "-"));
		this.monthSelector.setAttribute("disabled", "disabled");
		this.daySelector.setAttribute("disabled", "disabled");
		for (let i = minYear; i <= maxYear; i++) {
			this.yearSelector.appendChild(this.#createOption(i, this.yearLabel(i)));
		}
	}

	/**
	 * Sets the month selector.
	 * 
	 * @param {number} year - The year whose month selector to set.
	 * @returns {void}
	 */
	#setMonthSelector(year) {
		this.monthSelector.removeAttribute("disabled");
		for (let i = 1; i <= 12; i++) {
			const yearMonth = new Temporal.PlainYearMonth(year, i);
			const option = this.#createOption(i, this.monthLabel(yearMonth));
			option.setAttribute("disabled", "disabled");
			this.monthSelector.appendChild(option);
			for (let j = 1; j <= yearMonth.daysInMonth; j++) {
				const date = new Temporal.PlainDate(year, i, j);
				if (this.#isDateIncluded(date) && !this.#isDateExcluded(date)) {
					option.removeAttribute("disabled");
				}
			}
		}
	}

	/**
	 * Sets the day selector.
	 * 
	 * @param {number} year - The year whose month selector to set.
	 * @param {number} month - The month whose month selector to set.
	 * @returns {void}
	 */
	#setDaySelector(year, month) {
		const daysInMonth = new Temporal.PlainYearMonth(year, month).daysInMonth;
		this.daySelector.removeAttribute("disabled");
		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Temporal.PlainDate(year, month, i);
			const option = this.#createOption(i, this.dayLabel(date));
			if (!this.#isDateIncluded(date) || this.#isDateExcluded(date)) {
				option.setAttribute("disabled", "disabled");
			}
			this.daySelector.appendChild(option);
		}
	}

	/**
	 * Resets the month selector.
	 * 
	 * @returns {void}
	 */
	#resetMonthSelector() {
		this.monthSelector.replaceChildren();
		this.monthSelector.appendChild(this.#createOption("", "-"));
		this.monthSelector.setAttribute("disabled", "disabled");
		this.#resetDaySelector();
	}

	/**
	 * Resets the day selector.
	 * 
	 * @returns {void}
	 */
	#resetDaySelector() {
		this.daySelector.replaceChildren();
		this.daySelector.appendChild(this.#createOption("", "-"));
		this.daySelector.setAttribute("disabled", "disabled");
		this.resetDate();
	}

	/**
	 * Indicates whether the specified date is within an interval.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be checked.
	 * @returns {boolean} `true` if the date is within an interval; otherwise, `false`.
	 */
	#isDateIncluded(date) {
		let isIncluded = false;
		this.intervals.forEach((interval) => {
			const fromComp = Temporal.PlainDate.compare(date, interval.from);
			const toComp = Temporal.PlainDate.compare(date, interval.to);
			if (fromComp >= 0 && toComp <= 0) {
				if (interval.weekdays.includes(date.dayOfWeek)) {
					isIncluded = true;
				}
			}
		});
		return isIncluded;
	}

	/**
	 * Indicates whether the specified date is within an excluded interval.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be checked.
	 * @returns {boolean} `true` if the date is within an excluded interval; otherwise, `false`.
	 */
	#isDateExcluded(date) {
		let isExcluded = false;
		this.excludedIntervals.forEach((excludedInterval) => {
			const fromComp = Temporal.PlainDate.compare(date, excludedInterval.from);
			const toComp = Temporal.PlainDate.compare(date, excludedInterval.to);
			if (fromComp >= 0 && toComp <= 0) {
				if (excludedInterval.weekdays.includes(date.dayOfWeek)) {
					isExcluded = true;
				}
			}
		});
		return isExcluded;
	}

	/**
	 * Creates and retrieves a select option with the specified value and label.
	 * 
	 * @param {string} value - The value of the option.
	 * @param {string|null} label - The label of the option.
	 * @returns {HTMLOptionElement} The created option.
	 */
	#createOption(value, label = "") {
		const option = document.createElement("option");
		option.value = value;
		option.innerText = label || value;
		return option;
	}

	/**
	 * Adds event listeners related to the date selector.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.yearSelector.addEventListener("input", this);
		this.monthSelector.addEventListener("input", this);
		this.daySelector.addEventListener("input", this);
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
				switch (event.target) {
					case this.yearSelector:
						this.#isYearSelected();
						break;
					case this.monthSelector:
						this.#isMonthSelected();
						break;
					case this.daySelector:
						this.#isDaySelected();
						break;
				}
				break;
		}
	}
}

/**
 * Date Selector Interval
 * This class is designed to define an interval within a date selector.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class DateSelectorInterval {

	/**
	 * The date at which the interval starts.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	from;

	/**
	 * The date at which the interval ends.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	to;

	/**
	 * The weekdays on which the interval applies.
	 * 
	 * @type {number[]}
	 */
	weekdays = [1, 2, 3, 4, 5, 6, 7];

	/**
	 * Callback function that is called after the date selector interval has been initialized.
	 * 
	 * @type {function(DateSelectorInterval):void|null}
	 */
	initCallback = null;

	/**
	 * Creates a date selector interval.
	 * 
	 * @param {Object} options
	 * @param {Temporal.PlainDate} options.from - The date at which the interval starts.
	 * @param {Temporal.PlainDate} options.to - The date at which the interval ends.
	 * @param {number[]} options.weekdays - The weekdays on which the interval applies.
	 * @param {function(DateSelectorInterval):void|null} options.initCallback - Callback function that is called after the date selector interval has been initialized.
	 * @returns {DateSelectorInterval}
	 */
	constructor(options) {

		// Test required options
		if (!(options.from instanceof Temporal.PlainDate)) {
			throw "Date selector interval \"from\" must be a `Temporal.PlainDate`";
		}
		if (!(options.to instanceof Temporal.PlainDate)) {
			throw "Date selector interval \"to\" must be a `Temporal.PlainDate`";
		}
		if (Temporal.PlainDate.compare(options.to, options.from) < 0) {
			throw new Error("Date selector interval end date must be later than start date.");
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the date selector interval.
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}
}

export { DateSelector, DateSelectorInterval };