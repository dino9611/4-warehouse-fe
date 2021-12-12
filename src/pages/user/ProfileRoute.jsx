import React from "react";
import { useParams } from "react-router";
import Address from "./Address";
import HistoryOrder from "./HistoryOrder";
import VerifyChangeEmail from "./VerifyChangeEmail";

function ProfileRoute(props) {
  const { subProfile } = useParams();

  if (subProfile === "history") {
    return <HistoryOrder />;
  } else if (subProfile === "address") {
    return <Address />;
  }
  // else if (subProfile === "accept") {
  //   return <VerifyChangeEmail />;
  // }
}

export default ProfileRoute;
