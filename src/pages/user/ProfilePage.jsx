import React from "react";
import "./style/profilePage.css";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ProfileSidebar from "../../components/ProfileSidebar";
import ProfileRoute from "./ProfileRoute";
import Profile from "./Profile";

function ProfilePage() {
  let { path } = useRouteMatch();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-3">
          <ProfileSidebar />
        </div>
        <div className="col-9">
          <div className="profile-container">
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
