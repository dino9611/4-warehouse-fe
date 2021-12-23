import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import VerticalBarChart from '../../components/admin/VerticalBarChart';
import GroupBarChart from '../../components/admin/GroupBarChart';
import DonutChart from '../../components/admin/DonutChart';
import HorizontalBarChart from '../../components/admin/HorizontalBarChart';

function HomeDashboard() {
    const [loadData, setLoadData] = useState(true);
    
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [monthRevLabels, setMonthRevLabels] = useState([]);
    const [monthRevData, setMonthRevData] = useState([]);

    const [potentialRevenue, setPotentialRevenue] = useState({});
    const [potentRevLabels, setPotentRevLabels] = useState([]);
    const [potentRevData, setPotentRevData] = useState([]);

    const [statusContribution, setStatusContribution] = useState({});
    const [statusContLabels, setStatusContLabels] = useState([]);
    const [statusContData, setStatusContData] = useState([]);

    const [topProdQty, setTopProdQty] = useState({});
    const [prodQtyLabels, setProdQtyLabels] = useState([]);
    const [prodQtyData, setProdQtyData] = useState([]);

    const [topProdValue, setTopProdValue] = useState({});
    const [prodValLabels, setProdValLabels] = useState([]);
    const [prodValData, setProdValData] = useState([]);

    const [topUsers, setTopUsers] = useState({});

    const [filterYear, setFilterYear] = useState(2021);

    const fetchRevenue = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/monthly-revenue`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/potential-revenue`, {headers: {filter_year: filterYear}});
            const res03 = await axios.get(`${API_URL}/sales/status-contribution`, {headers: {filter_year: filterYear}});
            setMonthlyRevenue(res01.data);
            setMonthRevLabels(Object.keys(res01.data));
            setMonthRevData(Object.values(res01.data));
            setPotentialRevenue(res02.data);
            setPotentRevLabels(Object.keys(res02.data));
            setPotentRevData(Object.values(res02.data));
            setStatusContribution(res03.data);
            res03.data.forEach((val, index) => {
                setStatusContLabels((prevState) => {
                    let newArray = prevState;
                    newArray[index] = val.status;
                    return [...newArray];
                });
            });
            res03.data.forEach((val, index) => {
                setStatusContData((prevState) => {
                    let newArray = prevState;
                    newArray[index] = parseFloat(val.contribution);
                    return [...newArray];
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProdPerformance = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-prod-qty`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/top-prod-val`, {headers: {filter_year: filterYear}});
            setTopProdQty(res01.data);
            res01.data.forEach((val, index) => {
                setProdQtyLabels((prevState) => {
                    let newArray = prevState;
                    newArray[index] = val.name;
                    return [...newArray];
                });
            });
            res01.data.forEach((val, index) => {
                setProdQtyData((prevState) => {
                    let newArray = prevState;
                    newArray[index] = parseInt(val.qty_sold);
                    return [...newArray];
                });
            });
            setTopProdValue(res02.data);
            res02.data.forEach((val, index) => {
                setProdValLabels((prevState) => {
                    let newArray = prevState;
                    newArray[index] = val.name;
                    return [...newArray];
                });
            });
            res02.data.forEach((val, index) => {
                setProdValData((prevState) => {
                    let newArray = prevState;
                    newArray[index] = parseInt(val.sales_value);
                    return [...newArray];
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsersInsight = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-users`, {headers: {filter_year: filterYear}});
            setTopUsers(res01.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRevenue();
        fetchProdPerformance();
        fetchUsersInsight();
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
    // console.log(statusContribution);
    // console.log(statusContLabels)
    // console.log(statusContData);
    // console.log(topProdQty);
    // console.log(prodQtyLabels);
    // console.log(prodQtyData);
    // console.log(topProdValue);
    // console.log(prodValLabels);
    // console.log(prodValData);
    // console.log(topUsers);

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
                                    titleText={`Monthly Achieved Revenue (Ongoing & Paid - ${filterYear})`} 
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
                </div>
                <div className="adm-dashboard-contents-2ndRow">
                    <div>
                        Transaction Contribution by Status - {filterYear} (%)
                        {!loadData ? 
                            <>
                                <DonutChart 
                                    labelsData={statusContLabels}
                                    labelDesc={"Transaction Contribution by Status"}
                                    chartData={statusContData}
                                    bgColorArray={[
                                        "rgba(39, 160, 227, 0.8)", 
                                        "rgba(67,147,108, 0.8)", 
                                        "rgba(205, 58, 49, 0.8)",
                                        "rgba(239,137,67, 0.8)"
                                    ]}
                                    bordColorArray={[
                                        "rgba(39, 160, 227, 0.8)", 
                                        "rgba(67,147,108, 0.8)", 
                                        "rgba(205, 58, 49, 0.8)",
                                        "rgba(239,137,67, 0.8)"
                                    ]}
                                />
                            </>
                            :
                            <h1>Loading Data</h1>
                        }
                    </div>
                    <div >
                        Total Products Sold
                    </div>
                </div>
                <div className="adm-dashboard-contents-3rdRow">
                    <div>
                        {!loadData ? 
                            <>
                                <HorizontalBarChart
                                    legendDisplay={false}
                                    titleText={"Top 5 Selling Product by Qty"}
                                    labelsData={prodQtyLabels}
                                    chartData={prodQtyData}
                                    barLabel={"Qty"}
                                />
                            </>
                            :
                            <h1>Loading Data</h1>
                        }
                    </div>
                    <div>
                        {!loadData ? 
                            <>
                                <HorizontalBarChart
                                    legendDisplay={false}
                                    titleText={"Top 5 Selling Product by Value"}
                                    labelsData={prodValLabels}
                                    chartData={prodValData}
                                    barLabel={"Value"}
                                    barColor={"rgba(67,147,108, 0.8)"}
                                    bordColor={"rgba(67,147,108, 0.8)"}
                                />
                            </>
                            :
                            <h1>Loading Data</h1>
                        }
                    </div>
                    <div>
                        Sales Contribution by Category
                    </div>
                </div>
                <div className="adm-dashboard-contents-4thRow">
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