import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function HomeDashboard() {
    const [revenue, setRevenue] = useState({});
    const [labels, setLabels] = useState([]);
    const [testData, setTestData] = useState([]);
    const [filterYear, setFilterYear] = useState(2021);
    const [loadData, setLoadData] = useState(true);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: true,
            text: `Monthly Revenue (Done Transaction) - ${filterYear}`,
          },
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: true
                }
            }
        },
      };
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: labels.map((val, index) => parseInt(testData[index])),
            backgroundColor: 'rgba(39, 160, 227, 0.8)',
          }
        ],
      };

    const fetchRevenue = async () => {
        try {
            const res = await axios.get(`${API_URL}/sales/revenue`);
            setRevenue(res.data);
            setLabels(Object.keys(res.data));
            setTestData(Object.values(res.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRevenue();
        setLoadData(false);
    }, []);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const nowMonth = date.toLocaleString('default', { month: 'long' });
    const prevMonth = monthNames[(date.getMonth() - 1)];

    const revenueGrowth = ((revenue[nowMonth] - revenue[prevMonth]) / revenue[nowMonth]) * 100;

    // console.log(revenue);
    // console.log(labels);
    // console.log(testData);

    return (
        <div className="adm-dashboard-main-wrap">
            <div className="adm-dashboard-header-wrap">
                <h4>Dashboard</h4>
                <h4>Filter Year</h4>
            </div>
            <div className="adm-dashboard-contents-wrap">
                <div className="adm-dashboard-contents-1stRow">
                    <div >
                        <Bar options={options} data={data} />
                        {!loadData ?
                            (revenue.November < revenue.December) ? 
                                <span style={{color: "#43936C"}}>+ {revenueGrowth}% Since last month</span>
                                : 
                                <span style={{color: "#CB3A31"}}>- {revenueGrowth}% Since last month</span>
                            :
                            null
                        }
                        {/* <h6>{!revenue ? "Loading" : `Rp ${thousandSeparator(revenue.revenue)}`}</h6> */}
                    </div>
                    <div>
                        Graph Potential Revenue (Ongoing & Paid Transaction)
                    </div>
                    <div>
                        Potential & Loss Revenue (Based on Transaction Status)
                    </div>
                </div>
                <div className="adm-dashboard-contents-2ndRow">
                    <div >
                        Total Products Sold
                    </div>
                    <div>
                        Top 5 Selling Product by Qty
                    </div>
                    <div>
                        Top 5 Selling Product by Value
                    </div>
                    <div>
                        Sales Contribution by Category
                    </div>
                </div>
                <div className="adm-dashboard-contents-3rdRow">
                    <div >
                        Total Users
                    </div>
                    <div>
                        Top 5 Users (By Transaction Value)
                    </div>
                    <div>
                        Average Users Transaction
                    </div>
                </div>
                <div className="adm-dashboard-contents-4thRow">
                    <div >
                        Other Additional Report (if any)
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeDashboard;