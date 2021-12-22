import "./styles/HomeDashboard.css";

function HomeDashboard() {


    return (
        <div className="adm-dashboard-main-wrap">
            <div className="adm-dashboard-header-wrap">
                <h4>Dashboard</h4>
                <h4>Filter Year</h4>
            </div>
            <div className="adm-dashboard-contents-wrap">
                <div className="adm-dashboard-contents-1stRow">
                    <div >
                        Graph Sales Revenue (Done Transaction)
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