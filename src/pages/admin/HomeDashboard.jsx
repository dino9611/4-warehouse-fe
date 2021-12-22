import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';

function HomeDashboard() {
    const [loadData, setLoadData] = useState(true);
    
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [monthRevLabels, setMonthRevLabels] = useState([]);
    const [monthRevData, setMonthRevData] = useState([]);

    const [filterYear, setFilterYear] = useState(2021);

    const fetchRevenue = async () => {
        try {
            const res = await axios.get(`${API_URL}/sales/monthly-revenue`, {headers: {filter_year: filterYear}});
            setMonthlyRevenue(res.data);
            setMonthRevLabels(Object.keys(res.data));
            setMonthRevData(Object.values(res.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRevenue();
        setLoadData(false);
    }, []);

    // CALCULATE GROWTH SECTION
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const nowMonth = date.toLocaleString('default', { month: 'long' });
    const prevMonth = monthNames[(date.getMonth() - 1)];
    const lastMontRevGrow = ((monthlyRevenue[nowMonth] - monthlyRevenue[prevMonth]) / monthlyRevenue[nowMonth]) * 100;

    // console.log(monthlyRevenue);
    // console.log(labels);
    // console.log(monthRevData);

    return (
        <div className="adm-dashboard-main-wrap">
            <div className="adm-dashboard-header-wrap">
                <h4>Dashboard</h4>
                <h4>Filter Year</h4>
            </div>
            <div className="adm-dashboard-contents-wrap">
                <div className="adm-dashboard-contents-1stRow">
                    <div >
                        {!loadData ? 
                            <>
                                <VerticalBarChart 
                                    legendDisplay={false} 
                                    titleText={`Monthly Revenue (Done Transaction - ${filterYear})`} 
                                    yGridDisplay={true}
                                    labelsData={monthRevLabels}
                                    chartData={monthRevData}
                                    barLabel={"Revenue"}
                                />
                                {(monthlyRevenue.November < monthlyRevenue.December) ? 
                                    <span style={{color: "#43936C"}}>+ {lastMontRevGrow}% Since last month</span>
                                    : 
                                    <span style={{color: "#CB3A31"}}>- {lastMontRevGrow}% Since last month</span>
                                }
                            </>
                            :
                            <h1>Loading Data</h1>
                        }
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