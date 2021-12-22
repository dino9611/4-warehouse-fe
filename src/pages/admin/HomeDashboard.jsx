import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import VerticalBarChart from '../../components/admin/VerticalBarChart';
import GroupBarChart from '../../components/admin/GroupBarChart';

function HomeDashboard() {
    const [loadData, setLoadData] = useState(true);
    
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [monthRevLabels, setMonthRevLabels] = useState([]);
    const [monthRevData, setMonthRevData] = useState([]);

    const [potentialRevenue, setPotentialRevenue] = useState({});
    const [potentRevLabels, setPotentRevLabels] = useState([]);
    const [potentRevData, setPotentRevData] = useState([]);

    const [filterYear, setFilterYear] = useState(2021);

    const fetchRevenue = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/monthly-revenue`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/potential-revenue`, {headers: {filter_year: filterYear}});
            setMonthlyRevenue(res01.data);
            setMonthRevLabels(Object.keys(res01.data));
            setMonthRevData(Object.values(res01.data));
            setPotentialRevenue(res02.data);
            setPotentRevLabels(Object.keys(res02.data));
            setPotentRevData(Object.values(res02.data));
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
                <h4>Filter Year {filterYear}</h4>
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
                        {!loadData ? 
                            <>
                                <GroupBarChart 
                                    titleText={`Potential Revenue (Ongoing & Paid - ${filterYear})`} 
                                    yGridDisplay={true}
                                    labelsData={potentRevLabels}
                                    chartData01={monthRevData}
                                    chartData02={potentRevData}
                                    barLabel01={"Actual Revenue"}
                                    barLabel02={"Potential"}
                                />
                            </>
                            :
                            <h1>Loading Data</h1>
                        }
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
                {/* <div className="adm-dashboard-contents-4thRow">
                    <div >
                        Other Additional Report (if any)
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default HomeDashboard;