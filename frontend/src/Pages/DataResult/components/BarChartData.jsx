import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChartData = ({ renderData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    checkPassFailStatus(renderData);
  }, [renderData]);

  const checkPassFailStatus = (data) => {
    let pass = 0;
    let fail = 0;
    data.map((x) => {
      if (x.test_result == "pass") {
        pass++;
      }

      if (x.test_result == "fail") {
        fail++;
      }
    });

    setPassCount(pass);
    setFailCount(fail);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Test Result",
      },
      datalabels: {
        formatter: (value) => {
          return value;
        },
        color: "white",
      },
    },
  };

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Pass",
        data: [passCount],
        backgroundColor: "#2b3e50",
      },
      {
        label: "Fail",
        data: [failCount],
        backgroundColor: "#5b7690",
      },
    ],
  };

  return (
    <div>
      <div>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default BarChartData;
