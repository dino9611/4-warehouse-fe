import React, { useEffect } from "react";
import { API_URL } from "../../constants/api";
import queryString from "query-string";
import axios from "axios";

function VerifyChangeEmail(props) {
  useEffect(() => {
    (async () => {
      try {
        await axios.get(`${API_URL}/profile/auth/change-email`, {
          headers: {
            Authorization: `Bearer ${
              queryString.parse(props.location.search).token
            }`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return <div>Sudah verified</div>;
}

export default VerifyChangeEmail;
