import React, { useEffect, useState } from 'react';
import "./styles/HomeDashboard.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";
import VerticalBarChart from '../../components/admin/VerticalBarChart';
import LineChart from '../../components/admin/LineChart';
import DonutChart from '../../components/admin/DonutChart';
import HorizontalBarChart from '../../components/admin/HorizontalBarChart';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@mui/material/CircularProgress';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import { useSelector } from "react-redux";
import { errorToast } from "../../redux/actions/ToastAction";
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";

const useStyles = makeStyles({
    TableContainer: {
      borderRadius: 0,
      height: "100%"
    }
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      border: 0,
      fontSize: "clamp(0.625rem, 1vw, 0.8125rem)",
      fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        border: 0,
        color: "#5A5A5A",
        fontSize: "clamp(0.625rem, 1vw, 0.8125rem)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
      fontSize: "clamp(0.625rem, 1vw, 0.8125rem)",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#F4F4F4",
      fontSize: "clamp(0.625rem, 1vw, 0.8125rem)",
    },
    // Show last border
    '&:last-child td, &:last-child th': {
      borderBottom: "1px solid #CACACA"
    },
}));

function HomeDashboard() {
    const classes = useStyles();
    
    const [filterYear, setFilterYear] = useState(2021);

    const [loadData, setLoadData] = useState(true);

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [toggleDropdown, setToggleDropwdown] = useState(false);
    
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

    const [yearNetSales, setYearNetSales] = useState(0);

    const [netSales, setNetSales] = useState({});
    const [netSalesLabels, setNetSalesLabels] = useState([]);
    const [netSalesData, setNetSalesData] = useState([]);

    const [topProdQty, setTopProdQty] = useState({});
    const [prodQtyLabels, setProdQtyLabels] = useState([]);
    const [prodQtyData, setProdQtyData] = useState([]);

    const [topProdValue, setTopProdValue] = useState({});
    const [prodValLabels, setProdValLabels] = useState([]);
    const [prodValData, setProdValData] = useState([]);

    const [categoryContribution, setCategoryContribution] = useState({});

    const [totalProdSold, setTotalProdSold] = useState(0);

    const [topUsers, setTopUsers] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);

    const [userAvgTransaction, setUserAvgTransaction] = useState(0);

    const [totalOrders, setTotalOrders] = useState(0);

    const resetArray = () => { //! Utk reset array ketika pilih filter tahun
        setMonthRevLabels([]);
        setMonthRevData([]);
        setPotentRevLabels([]);
        setPotentRevData([]);
        setStatusContLabels([]);
        setStatusContData([]);
        setNetSalesLabels([]);
        setNetSalesData([]);
        setProdQtyLabels([]);
        setProdQtyData([]);
        setProdValLabels([]);
        setProdValData([]);
        setTopUsers([]);
    };

    // FETCH & useEFFECT SECTION
    const getAuthData = useSelector((state) => state.auth);

    const {role_id, warehouse_id, warehouse_name} = getAuthData;

    const fetchRevenue = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/monthly-revenue?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res02 = await axios.get(`${API_URL}/sales/potential-revenue?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res03 = await axios.get(`${API_URL}/sales/status-contribution?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res04 = await axios.get(`${API_URL}/sales/yearly-revenue?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res05 = await axios.get(`${API_URL}/sales/net-sales?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res06 = await axios.get(`${API_URL}/sales/year-net-sales?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
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
            setYearNetSales(res06.data.total_yearly);
        } catch (error) {
            errorToast("Server Error, from Dashboard - Rev");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchProdPerformance = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-prod-qty?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res02 = await axios.get(`${API_URL}/sales/top-prod-val?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res03 = await axios.get(`${API_URL}/sales/category-contribution?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res04 = await axios.get(`${API_URL}/sales/prod-sold?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
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
            errorToast("Server Error, from Dashboard - Prod perform");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchUsersInsight = async () => {
        try {
            const res01 = await axios.get(`${API_URL}/sales/top-users?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res02 = await axios.get(`${API_URL}/sales/total-users`);
            const res03 = await axios.get(`${API_URL}/sales/average-transaction?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            const res04 = await axios.get(`${API_URL}/sales/total-orders?filterYear=${filterYear}&roleId=${role_id}&whId=${warehouse_id}`);
            setTopUsers(res01.data);
            setTotalUsers(res02.data.total_users);
            setUserAvgTransaction(res03.data.avg_transaction);
            setTotalOrders(res04.data.total_orders)
        } catch (error) {
            errorToast("Server Error, from Dashboard - Insight");
            console.log(error);
            setErrorFetch(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchRevenue();
            await fetchProdPerformance();
            await fetchUsersInsight();
            await setLoadData(false);
        }
        fetchData();
    }, [filterYear]);

    // CALCULATE GROWTH SECTION
    const date = new Date();

    //? Perlu benerin logic
    // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // const nowMonth = date.toLocaleString('default', { month: 'long' });
    // const prevMonth = monthNames[(date.getMonth() - 1)];
    // const lastMonthRevGrow = (((monthlyRevenue[nowMonth] - monthlyRevenue[prevMonth]) / monthlyRevenue[prevMonth]) * 100).toFixed(1);

    // RENDER DROPDOWN FILTER YEAR
    const filterYearLimit = 4;

    const nowYear = date.getFullYear();

    let yearRange = Array(filterYearLimit).fill(null).map((val, index) => nowYear - index); //* Itung range filter year yang bisa dipilih

    const dropdownClick = () => {
        setToggleDropwdown(!toggleDropdown);
    };

    const dropdownBlur = () => {
        setToggleDropwdown(false)
    };

    const selectFilterYear = (yearValue) => {
        setFilterYear(yearValue);
        setToggleDropwdown(false);
        resetArray(); //! Klo ga gini, nnti setiap ganti filter year, array lama terbawah alhasil salah data
        setLoadData(true);
    };

    // CHECK CONDITION FOR DATA AVAILABILITY
    const isAllNull = (value) => value === null;

    const isSomeTrue = (value) => value;

    return (
        <div className="adm-dashboard-main-wrap">
            { (!loadData && errorFetch) ?
                <AdminFetchFailed />
                :
                <>
                    <div className="adm-dashboard-header-wrap">
                        {(role_id === 1) ? <h4>Dashboard</h4> : <h4>Dashboard {warehouse_name}</h4>}
                        <div className="adm-dashboard-header-right">
                            <h4>Filter by Year</h4>
                            <div className="adm-dashboard-dropdown-wrap">
                                <button 
                                    className="adm-dashboard-dropdown-btn" 
                                    onClick={dropdownClick}
                                    onBlur={dropdownBlur}
                                >
                                    {filterYear}
                                    <img 
                                        src={chevronDown} 
                                        style={{
                                            transform: toggleDropdown ? "rotate(-180deg)" : "rotate(0deg)"
                                        }}
                                        alt="Dropdown-Arrow"
                                    />
                                </button>
                                <ul 
                                    className="adm-dashboard-dropdown-menu" 
                                    style={{
                                        transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                        opacity: toggleDropdown ? 1 : 0,
                                        zIndex: toggleDropdown ? 100 : -10,
                                    }}
                                >
                                    {yearRange.map((val, index) => (
                                        val === filterYear ? 
                                        <li className="adm-dashboard-dropdown-selected" key={index}>{val}</li> 
                                        : 
                                        <li onClick={() => selectFilterYear(val)} key={index}>{val}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
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
                                                <h6>Product Solds {filterYear}</h6>
                                                <h4>{totalProdSold}</h4>
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
                                        {!(Object.values(netSales).every(isAllNull)) ?
                                            <>
                                                <div className="dashboard-1stRow-right-heading">
                                                    <h6>{`Monthly Net Sales (Delivered Transaction - ${filterYear})`}</h6>
                                                    <h6 style={{color: "#43936C"}}>{`Total: Rp ${thousandSeparator(yearNetSales)}`}</h6>
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
                                            <div className="empty-state-center">
                                                <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                            </div>
                                        }
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
                                        {!(Object.values(potentialRevenue).every(isAllNull)) || !(Object.values(monthlyRevenue).every(isAllNull)) ?
                                            <>
                                                <div className="dashboard-2ndRow-left-heading">
                                                    <h6>{`Monthly Actual vs Potential Revenue ${filterYear}`}</h6>
                                                    {/* {(monthlyRevenue[prevMonth] < monthlyRevenue[nowMonth]) ? 
                                                        <h6 style={{color: "#43936C"}}>+ {lastMonthRevGrow}% Actual rev. vs last month</h6>
                                                        : 
                                                        <h6 style={{color: "#CB3A31"}}>- {lastMonthRevGrow}% Actual rev. vs last month</h6>
                                                    } */}
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
                                            <div className="empty-state-center">
                                                <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                            </div>
                                        }
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
                                        {(statusContribution.length) ?
                                            <>
                                                <div className="dashboard-2ndRow-right-heading">
                                                    <h6>Transaction by Status From <span style={{color: "#43936C"}}>Total {totalOrders} Orders</span> - {filterYear} (%)</h6>
                                                </div>
                                                <div className="dashboard-2ndRow-right-chart">
                                                    <DonutChart 
                                                        labelsData={statusContLabels}
                                                        labelDesc={"Transaction Contribution by Status"}
                                                        chartData={statusContData}
                                                        bgColorArray={[
                                                            "rgba(202,202,202, 0.8)", 
                                                            "rgba(90,90,90, 0.8)", 
                                                            "rgba(252, 179, 87, 0.8)",
                                                            "rgba(39, 160, 227, 0.8)",
                                                            "rgba(67,147,108, 0.8)", 
                                                            "rgba(205, 58, 49, 0.8)", 
                                                            "rgba(239,137,67, 0.8)",
                                                        ]}
                                                        bordColorArray={[
                                                            "rgba(202,202,202, 0.8)", 
                                                            "rgba(90,90,90, 0.8)", 
                                                            "rgba(252, 179, 87, 0.8)",
                                                            "rgba(39, 160, 227, 0.8)",
                                                            "rgba(67,147,108, 0.8)", 
                                                            "rgba(205, 58, 49, 0.8)", 
                                                            "rgba(239,137,67, 0.8)",
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <div className="empty-state-center">
                                                <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                            </div>               
                                        }
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="adm-dashboard-contents-3rdRow">
                            <div className="adm-dashboard-3rdRow">
                                <div>
                                    {!loadData ? 
                                        <>
                                            {(topProdQty.length) ?
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
                                                <div className="empty-state-center">
                                                    <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                                </div>  
                                            }
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
                                            {(topProdValue.length) ?
                                                <>
                                                    <div className="dashboard-3rdRow-right-heading">
                                                        <h6>{`Top 5 Selling Product by Value`}</h6>
                                                    </div>
                                                    <div className="dashboard-3rdRow-right-chart">
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
                                                <div className="empty-state-center">
                                                    <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                                </div>  
                                            }
                                        </>
                                        :
                                        <div className="dashboard-spinner-wrap">
                                            <CircularProgress />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="adm-dashboard-contents-4thRow">
                            <div className="adm-dashboard-4thRow-left">
                                {!loadData ? 
                                    <>
                                        {(categoryContribution.length) ?
                                            <>
                                                <div className="dashboard-4thRow-left-heading">
                                                    <h6>{`Sales Contribution by Category`}</h6>
                                                </div>
                                                <TableContainer sx={{boxShadow: 0}} component={Paper} className={classes.TableContainer}>
                                                    <Table sx={{ height: "100%" }} aria-label="sales contribution by category table">
                                                        <TableHead>
                                                            <TableRow style={{backgroundColor: "#FCB537", height: "80px"}}>
                                                                <StyledTableCell align="left">Rank</StyledTableCell>
                                                                <StyledTableCell align="left">Category</StyledTableCell>
                                                                <StyledTableCell align="left">Total Sales</StyledTableCell>
                                                                <StyledTableCell align="left">Contribution</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {categoryContribution.map((val, index) => (
                                                                <StyledTableRow key={`0${val.index}-${val.category}`}>
                                                                    <StyledTableCell align="left" component="th" scope="row">
                                                                        {index + 1}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="left">
                                                                        {val.category}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="left" className="txt-capitalize">{`Rp ${thousandSeparator(val.amount)}`}</StyledTableCell>
                                                                    <StyledTableCell align="left" className="txt-capitalize">{val.contribution}%</StyledTableCell>
                                                                </StyledTableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                            :
                                            <div className="empty-state-center">
                                                <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                            </div>                                                          
                                        }
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                            <div className="adm-dashboard-4thRow-right">
                                {!loadData ? 
                                    <>
                                        {(topUsers.length) ?
                                            <>
                                                <div className="dashboard-4thRow-right-heading">
                                                    <h6>{`Top 5 Users by Transaction`}</h6>
                                                </div>
                                                <TableContainer sx={{boxShadow: 0}} component={Paper} className={classes.TableContainer}>
                                                    <Table sx={{ height: "100%" }} aria-label="top users table">
                                                        <TableHead>
                                                            <TableRow style={{backgroundColor: "#FCB537", height: "80px"}}>
                                                                <StyledTableCell align="left">Rank</StyledTableCell>
                                                                <StyledTableCell align="left">Username</StyledTableCell>
                                                                <StyledTableCell align="left">Total Transaction Value</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {topUsers.map((val, index) => (
                                                                <StyledTableRow key={`0${val.index}-${val.user_id}`}>
                                                                    <StyledTableCell align="left" component="th" scope="row">
                                                                        {index + 1}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="left">
                                                                        {val.username}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="left" className="txt-capitalize">{`Rp ${thousandSeparator(val.total_transaction_value)}`}</StyledTableCell>
                                                                </StyledTableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                            :
                                            <div className="empty-state-center">
                                                <h2 style={{color: "#5A5A5A", margin: 0}}>Data Not Available</h2>
                                            </div>                                                          
                                        }
                                    </>
                                    :
                                    <div className="dashboard-spinner-wrap">
                                        <CircularProgress />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default HomeDashboard;

// TESTING PURPOSE
// const [categoryContLabels, setCategoryContLabels] = useState([]);
// const [categoryContData, setCategoryContData] = useState([]);
// console.log(nowMonth);
// console.log(prevMonth);
// console.log(netSales[nowMonth]);
// console.log(netSales[prevMonth]);
// console.log(totalUsers);
// console.log(totalProdSold);
// console.log(yearlyRevenue);
// console.log(userAvgTransaction);
// console.log(Object.values(netSales).every(isAllNull));
// console.log(potentialRevenue);
// console.log(monthlyRevenue);
// console.log("line 205", statusContribution);
// console.log(topProdQty);
// console.log(topProdValue);
// console.log(categoryContribution);
// console.log(topUsers);
// Bisa coba react lazy loading & suspense
// react query & useSwr