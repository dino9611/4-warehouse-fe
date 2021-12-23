import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import VerticalBarChart from '../../components/admin/VerticalBarChart';
import GroupBarChart from '../../components/admin/GroupBarChart';
import DonutChart from '../../components/admin/DonutChart';
import HorizontalBarChart from '../../components/admin/HorizontalBarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
    
    const [yearlyRevenue, setYearlyRevenue] = useState(0);

    const [topProdQty, setTopProdQty] = useState({});
    const [prodQtyLabels, setProdQtyLabels] = useState([]);
    const [prodQtyData, setProdQtyData] = useState([]);

    const [topProdValue, setTopProdValue] = useState({});
    const [prodValLabels, setProdValLabels] = useState([]);
    const [prodValData, setProdValData] = useState([]);

    const [categoryContribution, setCategoryContribution] = useState({});
    const [categoryContLabels, setCategoryContLabels] = useState([]);
    const [categoryContData, setCategoryContData] = useState([]);

    const [totalProdSold, setTotalProdSold] = useState(0);

    const [topUsers, setTopUsers] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);

    const [filterYear, setFilterYear] = useState(2021);

    const fetchRevenue = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/monthly-revenue`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/potential-revenue`, {headers: {filter_year: filterYear}});
            const res03 = await axios.get(`${API_URL}/sales/status-contribution`, {headers: {filter_year: filterYear}});
            const res04 = await axios.get(`${API_URL}/sales/yearly-revenue`, {headers: {filter_year: filterYear}});
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
            setYearlyRevenue(res04.data.total_yearly);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProdPerformance = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-prod-qty`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/top-prod-val`, {headers: {filter_year: filterYear}});
            const res03 = await axios.get(`${API_URL}/sales/category-contribution`, {headers: {filter_year: filterYear}});
            const res04 = await axios.get(`${API_URL}/sales/prod-sold`, {headers: {filter_year: filterYear}});
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
            setCategoryContribution(res03.data);
            setTotalProdSold(res04.data.total_qty_sold);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsersInsight = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-users`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/total-users`);
            setTopUsers(res01.data);
            setTotalUsers(res02.data.total_users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const test = async () => {
            await fetchRevenue();
            await fetchProdPerformance();
            await fetchUsersInsight();
            await setLoadData(false);
        }
        test();
    }, []);

    // Bisa coba react lazy loading & suspense
    // react query & useSwr

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
    // console.log(totalUsers);
    // console.log(categoryContribution);

    return (
        <div className="adm-dashboard-main-wrap">
            <div className="adm-dashboard-header-wrap">
                <h4>Dashboard</h4>
                <h4>Filter Year {filterYear}</h4>
            </div>
            <div className="adm-dashboard-contents-wrap">
                <div className="adm-dashboard-contents-1stRow">
                    <div className="adm-dashboard-1stR-left">
                        <div>
                            <h6>Total Users</h6>
                            <h4>{totalUsers}</h4>
                        </div>
                        <div>
                            <h6>Avg. User Transaction</h6>
                            
                        </div>
                        <div>
                            <h6>Yearly Revenue</h6>
                            <h4>{`Rp ${thousandSeparator(yearlyRevenue)}`}</h4>
                        </div>
                        <div>
                            <h6>Products Sold {filterYear}</h6>
                            <h4>{totalProdSold}</h4>
                        </div>
                    </div>
                    <div className="adm-dashboard-1stR-right">
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
                </div>
                {/* <div className="adm-dashboard-contents-1stRow">
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
                </div> */}
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
                <div>
                    <TableContainer component={Paper} style={{borderRadius: "12px"}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{width: "80px"}}>Rank</TableCell>
                                    <TableCell align="left">Username</TableCell>
                                    <TableCell align="left">Total Transaction Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!loadData ?
                                    topUsers.map((val, index) => (
                                        <TableRow
                                        key={`0${val.index}-${val.user_id}`}
                                        >
                                            <TableCell align="left" component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">
                                                {val.username}
                                            </TableCell>
                                            <TableCell align="left" className="txt-capitalize">{`Rp ${thousandSeparator(val.total_transaction_value)}`}</TableCell>
                                        </TableRow>
                                    ))
                                    :
                                    <h1>Loading Data</h1>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
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