import React, { useEffect } from "react";
import "./style/profilePage.css";

// Helpers

import axios from "axios";
import ProfileRoute from "./ProfileRoute";
import { useDispatch } from "react-redux";
import { API_URL } from "../../constants/api";
import { Route, Switch, useRouteMatch } from "react-router-dom";

// Komponen

import Profile from "./Profile";
import VerifyChangeEmail from "./VerifyChangeEmail";
import ProfileSidebar from "../../components/ProfileSidebar";

function ProfilePage() {
  let { path } = useRouteMatch();
  const dispatch = useDispatch();

  return (
    <div className="container mt-5 profile-page-height">
      <div className="row">
        <div className="profile-col col-12 col-lg-3 pr-0 pr-lg-2 mb-3 mb-lg-0">
          <ProfileSidebar />
        </div>
        <div className="profile-col col-12 col-lg-9 pl-0 pl=lg-4">
          <div className="profile-container pt-4">
            <Switch>
              <Route path="/profile" exact component={Profile} />
              <Route
                path={`${path}/:subProfile`}
                exact
                component={ProfileRoute}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
