import "./styles/AdminTransactionDetail.css";
import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";

function AdminTransactionDetail() {
    const transactionFromParent = useLocation();

    const {id: parentId, status_id: parentStatusId, status: parentStatus} = transactionFromParent.state;

    return (
        <div className="adm-products-main-wrap">
            <div className="adm-products-header-wrap">
                <h4>Order #{parentId} Details</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="adm-products-contents-wrap">
                Test
            </div>
        </div>
    )
}

export default AdminTransactionDetail;