import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import VerticalBarChart from '../../components/admin/VerticalBarChart';
import GroupBarChart from '../../components/admin/GroupBarChart';
import LineChart from '../../components/admin/LineChart';
import DonutChart from '../../components/admin/DonutChart';
import HorizontalBarChart from '../../components/admin/HorizontalBarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
    TableContainer: {
      height: "100%"
    }
});

function HomeDashboard() {
    const classes = useStyles();
    
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

    const [netSales, setNetSales] = useState({});
    const [netSalesLabels, setNetSalesLabels] = useState([]);
    const [netSalesData, setNetSalesData] = useState([]);
    // const [netSales, setNetSales] = useState(0);

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

    const [userAvgTransaction, setUserAvgTransaction] = useState(0);

    const [totalOrders, setTotalOrders] = useState(0);

    const [filterYear, setFilterYear] = useState(2021);

    const fetchRevenue = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/monthly-revenue`, {headers: {filter_year: filterYear}});
            const res02 = await axios.get(`${API_URL}/sales/potential-revenue`, {headers: {filter_year: filterYear}});
            const res03 = await axios.get(`${API_URL}/sales/status-contribution`, {headers: {filter_year: filterYear}});
            const res04 = await axios.get(`${API_URL}/sales/yearly-revenue`, {headers: {filter_year: filterYear}});
            const res05 = await axios.get(`${API_URL}/sales/net-sales`, {headers: {filter_year: filterYear}});
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
            setNetSales(res05.data);
            setNetSalesLabels(Object.keys(res05.data));
            setNetSalesData(Object.values(res05.data));
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
            const res03 = await axios.get(`${API_URL}/sales/average-transaction`, {headers: {filter_year: filterYear}});
            const res04 = await axios.get(`${API_URL}/sales/total-orders`, {headers: {filter_year: filterYear}});
            setTopUsers(res01.data);
            setTotalUsers(res02.data.total_users);
            setUserAvgTransaction(res03.data.avg_transaction);
            setTotalOrders(res04.data.total_orders)
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
    const lastMonthRevGrow = (((monthlyRevenue[nowMonth] - monthlyRevenue[prevMonth]) / monthlyRevenue[nowMonth]) * 100).toFixed(1);
    // console.log(nowMonth);
    // console.log(prevMonth);
    // console.log(netSales[nowMonth]);
    // console.log(netSales[prevMonth]);

    // console.log(netSales);
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
    // console.log(potentialRevenue);
    // console.log(statusContribution);

    return (
        <div className="adm-dashboard-main-wrap">
            <div className="adm-dashboard-header-wrap">
                <h4>Dashboard</h4>
                <h4>Filter Year {filterYear}</h4>
            </div>
            <div className="adm-dashboard-contents-wrap">
                <div className="adm-dashboard-contents-1stRow">
                    <div className="adm-dashboard-1stRow-left">
                        <div className="dashboard-1stRow-left-top">
                            <div>
                                {!loadData ? 
                                    <>
                                        <h6>All Time Total Users</h6>
                                        <h4>{totalUsers}</h4>
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                            <div>
                                {!loadData ? 
                                    <>
                                        <h6>Total Orders {filterYear}</h6>
                                        <h4>{totalOrders}</h4>
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="dashboard-1stRow-left-bottom">
                            <div>
                                {!loadData ? 
                                    <>
                                        <h6>Total Revenue {filterYear}</h6>
                                        <h4>{`Rp ${thousandSeparator(yearlyRevenue)}`}</h4>
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                            <div>
                                {!loadData ? 
                                    <>
                                        <h6>Avg. User Transaction</h6>
                                        <h4>{`Rp ${thousandSeparator(userAvgTransaction)}`}</h4>
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="adm-dashboard-1stRow-right">
                        {!loadData ? 
                            <>
                                <div className="dashboard-1stRow-right-heading">
                                    <h6>{`Monthly Net Sales (Delivered Transaction - ${filterYear})`}</h6>
                                </div>
                                <div className="dashboard-1stRow-right-chart">
                                    <VerticalBarChart 
                                        legendDisplay={false} 
                                        titleDisplay={false}
                                        labelsData={netSalesLabels}
                                        chartData={netSalesData}
                                        barLabel={"Net Sales"}
                                    />
                                </div>
                            </>
                            :
                            <div className="dashboard-spinner-wrap">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                </div>
                <div className="adm-dashboard-contents-2ndRow">
                    <div className="adm-dashboard-2ndRow-left">
                        {!loadData ? 
                            <>
                                <div className="dashboard-2ndRow-left-heading">
                                    <h6>{`Monthly Actual vs Potential Revenue ${filterYear}`}</h6>
                                    {(monthlyRevenue[prevMonth] < monthlyRevenue[nowMonth]) ? 
                                        <h6 style={{color: "#43936C"}}>+ {lastMonthRevGrow}% Actual rev. vs last month</h6>
                                        : 
                                        <h6 style={{color: "#CB3A31"}}>- {lastMonthRevGrow}% Actual rev. vs last month</h6>
                                    }
                                </div>
                                <div className="dashboard-2ndRow-left-chart">
                                    <LineChart 
                                        titleDisplay={false}
                                        yGridDisplay={false}
                                        labelsData={potentRevLabels}
                                        chartData01={monthRevData}
                                        chartData02={potentRevData}
                                        barLabel01={"Actual Revenue"}
                                        barLabel02={"Potential"}
                                    />
                                </div>
                            </>
                            :
                            <div className="dashboard-spinner-wrap">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                    <div className="adm-dashboard-2ndRow-right">
                        {!loadData ? 
                            <>
                                <div className="dashboard-2ndRow-right-heading">
                                    <h6>{`Transaction Contribution by Status - ${filterYear} (%)`}</h6>
                                </div>
                                <div className="dashboard-2ndRow-right-chart">
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
                                </div>
                            </>
                            :
                            <div className="dashboard-spinner-wrap">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                </div>
                <div className="adm-dashboard-contents-3rdRow">
                    <div className="adm-dashboard-3rdRow-left">
                        <div>
                            {!loadData ? 
                                <>
                                    <div className="dashboard-3rdRow-left-heading">
                                        <h6>{`Top 5 Selling Product by Qty`}</h6>
                                    </div>
                                    <div className="dashboard-3rdRow-left-chart">
                                        <HorizontalBarChart
                                            legendDisplay={false}
                                            titleDisplay={false}
                                            labelsData={prodQtyLabels}
                                            chartData={prodQtyData}
                                            barLabel={"Qty"}
                                        />
                                    </div>
                                </>
                                :
                                <div className="dashboard-spinner-wrap">
                                    <CircularProgress />
                                </div>
                            }
                        </div>
                        <div>
                            {!loadData ? 
                                <>
                                    <div className="dashboard-3rdRow-left-heading">
                                        <h6>{`Top 5 Selling Product by Value`}</h6>
                                    </div>
                                    <div className="dashboard-3rdRow-left-chart">
                                        <HorizontalBarChart
                                            legendDisplay={false}
                                            titleDisplay={false}
                                            labelsData={prodValLabels}
                                            chartData={prodValData}
                                            barLabel={"Value"}
                                            barColor={"rgba(67,147,108, 0.8)"}
                                            bordColor={"rgba(67,147,108, 0.8)"}
                                        />
                                    </div>
                                </>
                                :
                                <div className="dashboard-spinner-wrap">
                                    <CircularProgress />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="adm-dashboard-3rdRow-mid">
                        {!loadData ? 
                            <>
                                <div className="dashboard-3rdRow-mid-heading">
                                    <h6>{`Sales Contribution by Category`}</h6>
                                </div>
                                <TableContainer sx={{boxShadow: 0}} component={Paper} className={classes.TableContainer}>
                                    <Table sx={{ minWidth: 160, height: "100%" }} aria-label="top users table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" style={{color: "#5A5A5A", width: "56px"}}>Rank</TableCell>
                                                <TableCell align="left" style={{color: "#5A5A5A"}}>Category</TableCell>
                                                <TableCell align="left" style={{color: "#5A5A5A"}}>Total Sales</TableCell>
                                                <TableCell align="left" style={{color: "#5A5A5A"}}>Contribution</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categoryContribution.map((val, index) => (
                                                <TableRow
                                                key={`0${val.index}-${val.category}`}
                                                >
                                                    <TableCell align="left" component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="left" style={{width: "80px"}}>
                                                        {val.category}
                                                    </TableCell>
                                                    <TableCell align="left" className="txt-capitalize">{`Rp ${thousandSeparator(val.amount)}`}</TableCell>
                                                    <TableCell align="left" className="txt-capitalize">{val.contribution}%</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                            :
                            <div className="dashboard-spinner-wrap">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                    <div className="adm-dashboard-3rdRow-right">
                    {!loadData ? 
                            <>
                                <div className="dashboard-3rdRow-right-heading">
                                    <h6>{`Top 5 Users by Transaction`}</h6>
                                </div>
                                <TableContainer sx={{boxShadow: 0}} component={Paper} className={classes.TableContainer}>
                                    <Table sx={{ minWidth: 160, height: "100%" }} aria-label="top users table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" style={{color: "#5A5A5A", width: "80px"}}>Rank</TableCell>
                                                <TableCell align="left" style={{color: "#5A5A5A"}}>Username</TableCell>
                                                <TableCell align="left" style={{color: "#5A5A5A"}}>Total Transaction Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topUsers.map((val, index) => (
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
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                            :
                            <div className="dashboard-spinner-wrap">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeDashboard;