import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./Monitoring.css";

const Monitoring = () => {
  const [series, setSeries] = useState([
    { name: "CPU Usage", data: [] },
    { name: "RAM Usage", data: [] },
    { name: "GPU Usage", data: [] },
    { name: "GPU Memory Usage", data: [] },
  ]);

  const options = {
    chart: {
      height: 350,
      type: "area",
      animations: {
        enabled: false,
        easing: "easeinout",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (value) => {
          if (value !== undefined && value !== null) {
            return `${value.toFixed(1)}%`;
          }
          return "";
        },
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: "rgba(200, 200, 200, 0.2)",
    },
    tooltip: {
      x: {
        format: "HH:mm:ss",
      },
    },
    legend: {
      labels: {
        colors: "#FFFFFF", 
      },
    },    
    colors: [
      "#8979FF", 
      "#FF928A", 
      "#3CC3DF", 
      "#FFAE4C", 
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.8,
        gradientToColors: [
          "#8979FF", 
          "#FF928A", 
          "#3CC3DF", 
          "#FFAE4C", 
        ],
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },    
  };
  

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/monitor");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const currentTime = new Date().getTime(); 

      setSeries((prevSeries) => [
        {
          ...prevSeries[0],
          data: [...prevSeries[0].data.slice(-20), { x: currentTime, y: data["cpu-usage"] }],
        },
        {
          ...prevSeries[1],
          data: [...prevSeries[1].data.slice(-20), { x: currentTime, y: data["ram-usage"] }],
        },
        {
          ...prevSeries[2],
          data: [...prevSeries[2].data.slice(-20), { x: currentTime, y: data["gpu-usage"] }],
        },
        {
          ...prevSeries[3],
          data: [...prevSeries[3].data.slice(-20), { x: currentTime, y: data["gpu-mem-usage"] * 100 }],
        },
      ]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="monitoring-container dark">
      <h2 className="monitoring-title dark">Monitoring</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default Monitoring;
