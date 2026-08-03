/**
 * Chart
 * This class is designed to create bar, line, and pie charts from the specified datasets.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Chart {

	/**
	 * The type of the chart, which can be "bar", "line", or "pie".
	 * 
	 * @type {string}
	 */
	type;

	/**
	 * The wrapper SVG element to which the chart is appended.
	 * 
	 * @type {SVGElement}
	 */
	wrapper;

	/**
	 * The datasets to be visualized within the chart, where each inner array represents a dataset.
	 * 
	 * @type {number[][]}
	 */
	datasets;

	/**
	 * The SVG viewport width of the chart. If the `width` attribute is defined for the SVG, that value will be used.
	 * 
	 * @type {number}
	 */
	width = 400;

	/**
	 * The SVG viewport width of the chart. If the `height` attribute is defined for the SVG, that value will be used.
	 * 
	 * @type {number}
	 */
	height = 200;

	/**
	 * The gap used to separate datasets within the bar chart, relative to the chart size, ranging from 0 to 1.
	 * 
	 * @type {number}
	 */
	gap = 0.05;

	/**
	 * The thickness of the bar within the bar chart, relative to the column size, ranging from 0 to 1.
	 * 
	 * @type {number}
	 */
	barThickness = 0.75;

	/**
	 * The roundness of the bars within the bar chart, ranging from 0 to 1.
	 * 
	 * @type {number}
	 */
	roundness = 0.25;

	/**
	 * The size of the markers within the line chart, relative to the viewport.
	 * 
	 * @type {number}
	 */
	markerSize = 4;

	/**
	 * Indicates whether the areas of the lines within the line chart are shown.
	 * 
	 * @type {boolean}
	 */
	showArea = true;

	/**
	 * Indicates whether a tooltip is shown while a data is hovered within a dataset.
	 * 
	 * @type {boolean}
	 */
	showTooltip = true;
	
	/**
	 * Indicates whether the pie chart is displayed as a donut chart.
	 * 
	 * @type {boolean}
	 */
	isDonut = false;

	/**
	 * Indicates whether the pie chart is displayed as a gauge chart.
	 * 
	 * @type {boolean}
	 */
	isGauge = false;

	/**
	 * The class that is added to the chart when its type is bar.
	 * 
	 * @type {string}
	 */
	chartBarClass = "chart-plot--bar";

	/**
	 * The class that is added to the chart when its type is line.
	 * 
	 * @type {string}
	 */
	chartLineClass = "chart-plot--line";

	/**
	 * The class that is added to the chart when its type is pie.
	 * 
	 * @type {string}
	 */
	chartPieClass = "chart-plot--pie";

	/**
	 * The class that is added to the dataset groups within the chart.
	 * 
	 * @type {string}
	 */
	datasetClass = "chart-plot-dataset";

	/**
	 * The class that is added to the data within the datasets.
	 * 
	 * @type {string}
	 */
	datasetDataClass = "chart-plot-dataset-data";

	/**
	 * The class that is added to the areas within the line chart.
	 * 
	 * @type {string}
	 */
	datasetAreaClass = "chart-plot-dataset-area";

	/**
	 * The class that is added to the line within the line chart.
	 * 
	 * @type {string}
	 */
	datasetLineClass = "chart-plot-dataset-line";

	/**
	 * The class that is added to the donut within the pie chart.
	 * 
	 * @type {string}
	 */
	datasetDonutClass = "chart-plot-dataset-donut";

	/**
	 * The class that is added to the tooltip.
	 * 
	 * @type {string}
	 */
	tooltipClass = "chart-tooltip";

	/**
	 * The class that is added to the tooltip while a data is hovered within a dataset.
	 * 
	 * @type {string}
	 */
	isTooltipVisibleClass = "is-visible";

	/**
	 * Function that is called to format the class that defines the grid lines is added to the chart.
	 * 
	 * @type {function(number):string}
	 */
	gridLineClass = (gridLineCount) => `chart-plot--${gridLineCount}`

	/**
	 * Function that is called to format the index-based custom class for each dataset.
	 * 
	 * @type {function(number):string}
	 */
	datasetItemClass = (datasetIndex) => `chart-plot-dataset--${datasetIndex}`;

	/**
	 * Function that is called to format the index-based custom class for each data within the dataset.
	 * 
	 * @type {function(number):string}
	 */
	datasetDataItemClass = (dataIndex) => `chart-plot-dataset-data--${dataIndex}`;

	/**
	 * The name of the attribute added to each data with its value within the dataset.
	 * 
	 * @type {string}
	 */
	datasetDataAttribute = "data-chart-dataset-data";

	/**
	 * Function that is called to handle how the value is rendered in the tooltip.
	 * 
	 * @type {function(number):string}
	 */
	tooltipFormatter = (value) => value.toString();

	/**
	 * The factor by which the highest data point is multiplied to calculate the X-axis value.
	 * 
	 * @type {number}
	 */
	axisMultiplier = 1;

	/**
	 * Callback function that is called after the chart has been initialized.
	 * 
	 * @type {function(Chart):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the chart has been updated.
	 * 
	 * @type {function(Chart):void|null}
	 */
	updateCallback = null;

	/**
	 * Represents the tooltip that displays the value of a data within a dataset.
	 * 
	 * @type {HTMLElement|null}
	 */
	tooltip = null;

	/**
	 * Available chart types.
	 * 
	 * @type {string[]}
	 */
	static types = ["bar", "line", "pie"];

	/**
	 * Creates a chart.
	 * 
	 * @param {Object} options
	 * @param {string} options.type - The type of the chart, which can be "bar", "line", or "pie".
	 * @param {SVGElement} options.wrapper - The wrapper SVG element to which the chart is appended.
	 * @param {number[][]} options.datasets - The datasets to be visualized within the chart, where each inner array represents a dataset.
	 * @param {number} options.width - The SVG viewport width of the chart. If the `width` attribute is defined for the SVG, that value will be used.
	 * @param {number} options.height - The SVG viewport width of the chart. If the `height` attribute is defined for the SVG, that value will be used.
	 * @param {number} options.gap - The gap used to separate datasets within the bar chart, relative to the chart size, ranging from 0 to 1.
	 * @param {number} options.barThickness - The thickness of the bar within the bar chart, relative to the column size, ranging from 0 to 1.
	 * @param {number} options.roundness - The roundness of the bars within the bar chart, ranging from 0 to 1.
	 * @param {number} options.markerSize - The size of the markers within the line chart, relative to the viewport.
	 * @param {boolean} options.showArea - Indicates whether the areas of the lines within the line chart are shown.
	 * @param {boolean} options.showTooltip - Indicates whether a tooltip is shown while a data is hovered within a dataset.
	 * @param {boolean} options.isDonut - Indicates whether the pie chart is displayed as a donut chart.
	 * @param {boolean} options.isGauge - Indicates whether the pie chart is displayed as a gauge chart.
	 * @param {string} options.chartBarClass - The class that is added to the chart when its type is bar.
	 * @param {string} options.chartLineClass - The class that is added to the chart when its type is line.
	 * @param {string} options.chartPieClass - The class that is added to the chart when its type is pie.
	 * @param {string} options.datasetClass - The class that is added to the dataset groups within the chart.
	 * @param {string} options.datasetDataClass - The class that is added to the data within the datasets.
	 * @param {string} options.datasetAreaClass - The class that is added to the areas within the line chart.
	 * @param {string} options.datasetLineClass - The class that is added to the line within the line chart.
	 * @param {string} options.datasetDonutClass - The class that is added to the donut within the pie chart.
	 * @param {string} options.tooltipClass - The class that is added to the tooltip.
	 * @param {string} options.isTooltipVisibleClass - The class that is added to the tooltip while a data is hovered within a dataset.
	 * @param {function(number):string} options.gridLineClass - Function that is called to format the class that defines the grid lines is added to the chart.
	 * @param {function(number):string} options.datasetItemClass - Function that is called to format the index-based custom class for each dataset.
	 * @param {function(number):string} options.datasetDataItemClass - Function that is called to format the index-based custom class for each data within the dataset.
	 * @param {string} options.datasetDataAttribute - The name of the attribute added to each data with its value within the dataset.
	 * @param {function(number):string} options.tooltipFormatter - Function that is called to handle how the value is rendered in the tooltip.
	 * @param {number} options.axisMultiplier - The factor by which the highest data point is multiplied to calculate the X-axis value.
	 * @param {function(Chart):void|null} options.initCallback - Callback function that is called after the chart has been initialized.
	 * @param {function(Chart):void|null} options.updateCallback - Callback function that is called after the chart has been updated.
	 * @returns {Chart}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.type !== "string") {
			throw "Chart \"type\" must be a `string`";
		}
		if (!Chart.types.includes(options.type)) {
			throw "Chart type is not supported";
		}
		if (!(options.wrapper instanceof SVGElement)) {
			throw "Chart \"wrapper\" must be an `SVGElement`";
		}
		if (!(options.datasets instanceof Array)) {
			throw "Chart \"datasets\" must be an `array`";
		}
		options.datasets.forEach((dataset) => {
			if (!(dataset instanceof Array)) {
				throw "Chart \"dataset\" must be an `array`";
			}
			dataset.forEach((data) => {
				if (typeof data !== "number") {
					throw "Chart \"data\" must be a `number`";
				}
			})
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the chart
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#setViewport();
		this.#createTooltip();
		this.#addEvents();
		this.update();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Updates the chart.
	 * 
	 * @returns {void}
	 */
	update() {
		this.wrapper.replaceChildren();
		this.#drawChart();
		if (typeof(this.updateCallback) == "function") this.updateCallback(this);
	}

	/**
	 * Retrieves the size of the first dataset.
	 * 
	 * @returns {number}
	 */
	get datasetSize() {
		if (!this.datasets.length) return 0;
		return this.datasets[0].length;
	}

	/**
	 * Retrieves the highest value from the datasets.
	 * 
	 * @returns {number}
	 */
	get highestData() {
		if (!this.datasets.length) return 0;
		return Math.max(...[].concat(...this.datasets)) * this.axisMultiplier;
	}

	/**
	 * Retrieves the lowest value from the datasets.
	 * 
	 * @returns {number}
	 */
	get lowestData() {
		if (!this.datasets.length) return 0;
		return Math.min(...[].concat(...this.datasets));
	}

	/**
	 * Retrieves the labels between zero and the highest value.
	 * 
	 * @returns {number[]}
	 */
	get labels() {
		let labels = [];
		let highestData = this.highestData;
		let digits = Math.ceil(Math.log10(highestData));
		let factor = Math.pow(10, digits - 1);
		let roundedHighestData = Math.ceil(highestData / factor) * factor;
		while (roundedHighestData / factor < 6) factor = factor / 2;
		for (let val = 0; val <= roundedHighestData; val += factor) {
			labels.push(val);
		}
		return labels.reverse();
	}

	/**
	 * Retrieves whether the chart is a gauge pie chart.
	 * 
	 * @returns {boolean}
	 */
	get isPieGauge() {
		return this.type == "pie" && this.isGauge
	}

	/**
	 * Draws the chart by type.
	 * 
	 * @returns {void}
	 */
	#drawChart() {
		switch(this.type) {
			case "bar":
				this.#drawBarChart();
				break;
			case "line":
				this.#drawLineChart();
				break;
			case "pie":
				this.#drawPieChart();
				break;
		}
	}

	/**
	 * Draws the bar chart.
	 * 
	 * @returns {void}
	 */
	#drawBarChart() {
		const scaledDatasets = this.#getScaledDatasets(this.height);
		const groupGap = this.width * this.gap;
		const groupWidth = this.width / this.datasets.length;
		const colWidth = (groupWidth - groupGap) / this.datasetSize;
		const barWidth = colWidth * this.barThickness;
		this.wrapper.classList.add(this.chartBarClass);
		this.#setChartGridLinesClass();
		scaledDatasets.forEach((scaledDataset, index) => {
			const groupOffset = (groupGap * 0.5) + (index * groupWidth);
			this.#drawBars(scaledDataset, barWidth, colWidth, groupOffset, index);
		})
	}

	/**
	 * Draws the bars within the bar chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @param {number} barWidth - The width of the bar.
	 * @param {number} colWidth - The width of a column.
	 * @param {number} groupOffset - The offset of a group.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {void}
	 */
	#drawBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex) {
		const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const bars = this.#createBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex);
		group.append(...bars);
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		this.wrapper.append(group);
	}

	/**
	 * Creates the bars within the bar chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @param {number} barWidth - The width of the bar.
	 * @param {number} colWidth - The width of a column.
	 * @param {number} groupOffset - The offset of a group.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {SVGRectElement[]} The created bars.
	 */
	#createBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex) {
		const startOffset = ((colWidth - barWidth) * 0.5) - colWidth;
		return scaledDataset.map((scaledData, index) => {
			const colOffset = (index + 1) * colWidth;
			const offset = groupOffset + startOffset + colOffset;
			return this.#createBar(offset, scaledData, barWidth, datasetIndex, index);
		});
	}

	/**
	 * Creates a bar within the bar chart.
	 * 
	 * @param {number} groupOffset - The offset of a group.
	 * @param {number} scaledData - The scaled data.
	 * @param {number} barWidth - The width of the bar.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @param {number} dataIndex - The index of the data.
	 * @returns {SVGRectElement} The created bar.
	 */
	#createBar(groupOffset, scaledData, barWidth, datasetIndex, dataIndex) {
		const roundness = (barWidth * 0.5) * this.roundness;
		let bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		bar.setAttribute("x", groupOffset);
		bar.setAttribute("y", this.height - scaledData);
		bar.setAttribute("height", scaledData);
		bar.setAttribute("width", barWidth);
		if (roundness) {
			bar.setAttribute("ry", roundness);
			bar.setAttribute("rx", roundness);
		}
		bar.classList.add(this.datasetDataClass);
		bar.classList.add(this.datasetDataItemClass(dataIndex));
		bar.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][dataIndex]);
		return bar;
	}

	/**
	 * Draws the line chart.
	 * 
	 * @returns {void}
	 */
	#drawLineChart() {
		const scaledDatasets = this.#getScaledDatasets(this.height);
		this.wrapper.classList.add(this.chartLineClass);
		this.#setChartGridLinesClass();
		scaledDatasets.forEach((scaledDataset, index) => {
			this.#drawLine(scaledDataset, index);
		})
	}

	/**
	 * Draws a line within the line chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {void}
	 */
	#drawLine(scaledDataset, datasetIndex) {
		const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const line = this.#createLine(scaledDataset);
		const area = this.#createLineArea(scaledDataset);
		const markers = this.#createLineMarkers(scaledDataset, datasetIndex);
		if (area) group.append(area);
		group.append(line);
		group.append(...markers);
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		this.wrapper.append(group);
	}

	/**
	 * Creates a line within the line chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @returns {SVGPolylineElement} The created line.
	 */
	#createLine(scaledDataset) {
		let points = this.#getLineChartPoints(scaledDataset);
		let line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		line.setAttribute("points", points.join(" "));
		line.classList.add(this.datasetLineClass);
		return line;
	}

	/**
	 * Creates the area for a line within the line chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @returns {SVGPolylineElement|undefined} The created area, or `undefined` if area is disabled.
	 */
	#createLineArea(scaledDataset) {
		if (!this.showArea) return;
		let points = this.#getLineChartPoints(scaledDataset);
		let area = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		points.push(`${this.width},${this.height}`);
		points.push(`0,${this.height}`);
		area.setAttribute("points", points.join(" "));
		area.classList.add(this.datasetAreaClass);
		return area;
	}

	/**
	 * Creates the markers for a line within the line chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {SVGCircleElement[]} The created markers.
	 */
	#createLineMarkers(scaledDataset, datasetIndex) {
		const points = this.#getLineChartPoints(scaledDataset);
		return points.map((point, index) => {
			const [x, y] = point.split(",");
			let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			marker.setAttribute("cx", x);
			marker.setAttribute("cy", y);
			marker.setAttribute("r", this.markerSize);
			marker.classList.add(this.datasetDataClass);
			marker.classList.add(this.datasetDataItemClass(index));
			marker.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][index]);
			return marker;
		});
	}

	/**
	 * Retrieves the point coordinates for the line chart.
	 * 
	 * @param {number[]} scaledDataset - The scaled dataset.
	 * @returns {string[]} The point coordinates of the line chart.
	 */
	#getLineChartPoints(scaledDataset) {
		const offset = this.width / (this.datasetSize - 1);
		return scaledDataset.map((data, index) => {
			const x = index * offset;
			const y = this.height - data;
			return [x, y].join(",");
		});
	}

	/**
	 * Draws the pie chart.
	 * 
	 * @returns {void}
	 */
	#drawPieChart() {
		const diameter = this.isPieGauge ? this.height * 2 : this.height;
		const offsetStep = this.width / this.datasets.length;
		let offset = (offsetStep - diameter) * 0.5;
		this.wrapper.classList.add(this.chartPieClass);
		this.datasets.forEach((dataset, index) => {
			this.#drawPie(dataset, offset, index);
			offset += offsetStep;
		})	
	}

	/**
	 * Draws a pie within the pie chart.
	 * 
	 * @param {number[]} dataset - The dataset of the pie.
	 * @param {number} offset - The offset of the pie.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {void}
	 */
	#drawPie(dataset, offset, datasetIndex) {
		let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		let slices = this.#createPieSlices(dataset, datasetIndex);
		let donut = this.#createDonut();
		group.append(...slices);
		if (donut) group.append(donut); 
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		group.setAttribute("transform", `translate(${offset} 0)`);
		this.wrapper.append(group);
	}

	/**
	 * Creates the slices of a pie within the pie chart.
	 * 
	 * @param {number[]} dataset - The dataset of the pie.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @returns {SVGPolylineElement[]} The created pie slices.
	 */
	#createPieSlices(dataset, datasetIndex) {
		const angles = this.#getPieSliceAngles(dataset);
		let currentAngle = 0;
		return angles.map((angle, index) => {
			let startAngle = currentAngle;
			currentAngle += angle;
			return this.#createPieSlice(startAngle, currentAngle, datasetIndex, index);
		})
	}

	/**
	 * Creates a slice of a pie within the pie chart.
	 * 
	 * @param {number} startAngle - The start angle of the pie.
	 * @param {number} endAngle - The end angle of the pie.
	 * @param {number} datasetIndex - The index of the dataset.
	 * @param {number} dataIndex - The index of the data.
	 * @returns {SVGPolylineElement} The created pie slice.
	 */
	#createPieSlice(startAngle, endAngle, datasetIndex, dataIndex) {
		const radius = this.isPieGauge ? this.height : this.height / 2;
		const path = this.#getPieSlicePath(radius, startAngle, endAngle);
		let slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
		slice.setAttribute("d", path);
		slice.setAttribute("stroke-linejoin", "bevel");
		slice.classList.add(this.datasetDataClass);
		slice.classList.add(this.datasetDataItemClass(dataIndex));
		slice.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][dataIndex]);
		return slice;
	}

	/**
	 * Retrieves the path of the pie slice.
	 * 
	 * @param {number} radius - The radius of the pie.
	 * @param {number} startAngle - The start angle of the pie.
	 * @param {number} endAngle - The end angle of the pie.
	 * @returns {string} The path of the pie slice.
	 */
	#getPieSlicePath(radius, startAngle, endAngle) {
		const offsetAngle = this.isPieGauge ? 180 : 90;
		const isCircle = (endAngle - startAngle === 360);
		if (isCircle) endAngle--;
		const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
		const startCoords = Chart.polarToCartesian(radius, startAngle, offsetAngle);
		const endCoords = Chart.polarToCartesian(radius, endAngle, offsetAngle);
		return this.#generatePieSlicePathShape(startCoords, endCoords, radius, largeArcFlag, isCircle);
	}

	/**
	 * Retrieves the shape of the pie slice path.
	 * 
	 * @param {{x:number,y:number}} startCoords - The start coordinates of the pie.
	 * @param {{x:number,y:number}} endCoords - The end coordinates of the pie.
	 * @param {number} radius - The radiu of the pie.
	 * @param {0|1} largeArcFlag - Indicates whether the arc is greater than 180 degrees.
	 * @param {boolean} isCircle - Indicates whether the pie is a complete circle.
	 * @returns {string} The shape of the pie slice path.
	 */
	#generatePieSlicePathShape(startCoords, endCoords, radius, largeArcFlag, isCircle) {
		let d = ["M", startCoords.x, startCoords.y, "A", radius, radius, 0, largeArcFlag, 1, endCoords.x, endCoords.y];
		if (isCircle) {
			d.push("Z");
		}
		else {
			d.push("L", radius, radius, "L", startCoords.x, startCoords.y, "Z");
		}
		return d.join(" ");
	}

	/**
	 * Creates the donut for a pie within the pie chart.
	 * 
	 * @returns {SVGCircleElement|undefined} The created donut for a pie, or `undefined` if donut is disabled.
	 */
	#createDonut() {
		if (!this.isDonut) return null;
		const diameter = this.isPieGauge ? this.height : this.height / 2;
		let donut = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		donut.setAttribute("cx", diameter);
		donut.setAttribute("cy", diameter);
		donut.setAttribute("r", diameter * 0.5);
		donut.classList.add(this.datasetDonutClass);
		return donut;
	}

	/**
	 * Sets the SVG viewport.
	 * 
	 * @returns {void}
	 */
	#setViewport() {
		this.width = this.wrapper.attributes.width ? parseInt(this.wrapper.attributes.width.value) : this.width;
		this.height = this.wrapper.attributes.height ? parseInt(this.wrapper.attributes.height.value) : this.height;
		const coords = [0, 0, this.width, this.height].join(" ");
		this.wrapper.setAttribute("viewBox", coords);
	}

	/**
	 * Sets the grid line class based on the number of grid lines.
	 * 
	 * @returns {void}
	 */
	#setChartGridLinesClass() {
		this.wrapper.classList.add(this.gridLineClass(this.labels.length - 1));
	}

	/**
	 * Retrieves the modified datasets where values are scaled to the specified value.
	 * The highest value equals the scale value.
	 * 
	 * @param {number} scale - The highest value to which the dataset is scaled to.
	 * @returns {number[][]} The scaled datasets.
	 */
	#getScaledDatasets(scale) {
		const labels = this.labels;
		const roundedHighestData = labels.length ? labels[0] : 0;
		return this.datasets.map((dataset) => {
			return dataset.map((value) => ((value / roundedHighestData) * scale));
		});
	}

	/**
	 * Retrieves the pie slice angles of the specified dataset.
	 * 
	 * @param {number[]} dataset - The dataset whose pie slice angles to be retrieved.
	 * @returns {number[]} The pie slice angles.
	 */
	#getPieSliceAngles(dataset) {
		let sum = dataset.reduce((total, current) => (total + current), 0);
		return dataset.map((data) => ((data / sum) * (this.isPieGauge ? 180 : 360)));
	}

	/**
	 * Adds event listeners related to the chart.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		if (this.showTooltip) {
			this.wrapper.addEventListener("mousemove", this);
			this.wrapper.addEventListener("mouseleave", this);
		}
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "mousemove":
				if (event.target.hasAttribute(this.datasetDataAttribute)) {
					this.#showTooltip(event.target, event.clientX, event.clientY);
				} else {
					this.#hideTooltip();
				}
				break;
			case "mouseleave":
				this.#hideTooltip();
				break;
		}
	}

	/**
	 * Creates the tooltip.
	 * 
	 * @returns {void}
	 */
	#createTooltip() {
		if (!this.showTooltip) return;
		this.tooltip = document.createElement("span");
		this.tooltip.classList.add(this.tooltipClass);
		this.wrapper.before(this.tooltip);
	}

	/**
	 * Displays the tooltip.
	 * 
	 * @param {SVGElement} target - The target element.
	 * @param {number} clientX - The horizontal coordinate of the mouse.
	 * @param {number} clientY - The vertical coordinate of the mouse.
	 * @returns {void}
	 */
	#showTooltip(target, clientX, clientY) {
		if (!this.tooltip) return;
		const value = Number(target.getAttribute(this.datasetDataAttribute));
		if (!isNaN(value)) {
			const formattedValue = this.tooltipFormatter(value);
			this.tooltip.innerText = formattedValue;
			this.tooltip.classList.add(this.isTooltipVisibleClass);
			this.#setTooltipCoords(target, clientX, clientY);
		}
	}

	/**
	 * Sets the X and Y coordinates of the tooltip.
	 * 
	 * @param {SVGElement} target - The target element.
	 * @param {number} clientX - The horizontal coordinate of the mouse.
	 * @param {number} clientY - The vertical coordinate of the mouse.
	 * @returns {void}
	 */
	#setTooltipCoords(target, clientX, clientY) {
		if (!this.tooltip) return;
		const { x, y } = this.#getTooltipCoords(target, clientX, clientY);
		this.tooltip.style.left = `${x}px`;
		this.tooltip.style.top = `${y}px`;
	}

	/**
	 * Retrieves the X and Y coordinates of the tooltip.
	 * 
	 * @param {SVGElement} target - The target element.
	 * @param {number} clientX - The horizontal coordinate of the mouse.
	 * @param {number} clientY - The vertical coordinate of the mouse.
	 * @returns {{x: number, y: number}} The X and Y coordinates of the tooltip.
	 */
	#getTooltipCoords(target, clientX, clientY) {
		switch(this.type) {
			case "bar":
				return this.#getTooltipStaticCoords(target);
			case "line":
				return this.#getTooltipStaticCoords(target);
			case "pie":
				return this.#getTooltipCursorCoords(target, clientX, clientY);
		}
	}

	/**
	 * Retrieves the X and Y coordinates of the tooltip based on the target position.
	 * 
	 * @param {SVGElement} target - The target element.
	 * @returns {{x: number, y: number}} The X and Y coordinates.
	 */
	#getTooltipStaticCoords(target) {
		if (!this.tooltip) return { x: 0, y: 0 };
		const rootRect = this.wrapper.parentElement.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetLeft = targetRect.left - rootRect.left;
		const targetTop = targetRect.top - rootRect.top;
		const leftOffset = (targetRect.width - this.tooltip.offsetWidth) * 0.5;
		const topOffset = this.tooltip.offsetHeight;
		return {
			x: targetLeft + leftOffset,
			y: targetTop - topOffset
		};
	}

	/**
	 * Retrieves the X and Y coordinates of the tooltip based on the cursor position.
	 * 
	 * @param {SVGElement} target - The target element.
	 * @param {number} clientX - The horizontal coordinate of the mouse.
	 * @param {number} clientY - The vertical coordinate of the mouse.
	 * @returns {{x: number, y: number}} The X and Y coordinates.
	 */
	#getTooltipCursorCoords(target, clientX, clientY) {
		const rootRect = this.wrapper.parentElement.getBoundingClientRect();
		return {
			x: clientX - rootRect.left - (this.tooltip.offsetWidth * 0.5),
			y: clientY - rootRect.top - this.tooltip.offsetHeight
		};
	}

	/**
	 * Hides the tooltip.
	 * 
	 * @returns {void}
	 */
	#hideTooltip() {
		if (!this.tooltip) return;
		this.tooltip.innerText = "";
		this.tooltip.style.left = "";
		this.tooltip.style.top = "";
		this.tooltip.classList.remove(this.isTooltipVisibleClass);
	}

	/**
	 * Converts the specified polar coordinates to cartesian coordinates.
	 * 
	 * @param {number} radius - The radius.
	 * @param {number} angle - The angle.
	 * @param {number} offsetAngle - The offset angle.
	 * @returns {{x:number,y:number}} The cartesian coordinates.
	 */
	static polarToCartesian(radius, angle, offsetAngle = 90) {
		let radians = (angle - offsetAngle) * Math.PI / 180;
		return {
			x: radius + (radius * Math.cos(radians)),
			y: radius + (radius * Math.sin(radians))
		};
	}
}

export { Chart };