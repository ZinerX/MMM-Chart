/* global Chart Log Module */

/* MagicMirror²
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/evghenix/
 * MIT Licensed.
 */

Module.register("MMM-Chart", {
    defaults: {
        width       : 200,
        height      : 200,
        chartConfig : {
            type: 'line',
            data: {
                labels: [], // Time labels will be populated dynamically
                datasets: [{
                    label: 'Temperature',
                    data: [], // Temperature data points
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        }
    },

    getScripts () {
        return [
            `modules/${this.name}/node_modules/chart.js/dist/chart.umd.js`,
            `modules/${this.name}/node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.js`
        ];
    },

    start () {
        Log.info(`Starting module: ${this.name}`);
    },

    getDom () {
    // Create wrapper element
        const wrapperEl = document.createElement("div");
        wrapperEl.setAttribute("style", "position: relative; display: inline-block;");

        // Create chart canvas
        const chartEl = document.createElement("canvas");

        // Init chart.js
        this.chart = new Chart(chartEl.getContext("2d"), this.config.chartConfig);

        // Set the size
        chartEl.width  = this.config.width;
        chartEl.height = this.config.height;
        chartEl.setAttribute("style", "display: block;");

        // Append chart
        wrapperEl.appendChild(chartEl);

        return wrapperEl;
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === 'DATA') {
            // Get current time as ISO string for the label
            const now = new Date().toISOString();
    
            // Push new time label and temperature value
            this.config.chartConfig.data.labels.push(now);
            this.config.chartConfig.data.datasets[0].data.push(payload.temp);
    
            // Optionally, limit the number of points (e.g., last 50)
            const maxPoints = 50;
            if (this.config.chartConfig.data.labels.length > maxPoints) {
                this.config.chartConfig.data.labels.shift();
                this.config.chartConfig.data.datasets[0].data.shift();
            }
    
            this.updateDom();
        }
    },
});
