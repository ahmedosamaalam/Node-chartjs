var express = require("express");
const jsdom = require("jsdom");
const { Canvas, loadImage } = require("canvas");
const { CanvasRenderService } = require("chartjs-node-canvas");

var router = express.Router();

async function initChartData() {
  const img = await loadImage("https://i.imgur.com/yDYW1I7.png");
  const canvas = new Canvas(img.width, img.height);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height / 4);
  console.log('<img src="' + canvas.toDataURL() + '" />');

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tokyo",
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointRadius: 5,
        pointStyle: '<img src="' + canvas.toDataURL() + '" />', // or ['',img,'','','','']
        data: [0, 7, 8, 14, 18, 22],
      },
    ],
  };

  const configuration = {
    type: "line",
    data: data,
    options: {
      responsive: false,
      animation: false,
      maintainAspectRatio: false,

      plugins: {
        legend: { display: false },

        tooltips: {
          display: false,
        },
        title: {
          display: false,
        },
        scales: {
          y: {
            ticks: {
              // padding: 10,
              fontSize: 15,
              max: 100,
              min: 0,
              stepSize: 20,

              callback: (value, index, values) => {
                return "";
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              padding: 20,
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              color: "#4CAF50",
            },
          },
        },
      },
    },
  };
  return configuration;
}

const mkChart = async (params) => {
  const conf = await initChartData();
  const canvasRenderService = new CanvasRenderService(400, 400);
  return await canvasRenderService.renderToBuffer(conf);
};

router.get("/", async function (req, res, next) {
  var image = await mkChart(req.query);
  res.type("image/png");
  res.send(image);
});

module.exports = router;
