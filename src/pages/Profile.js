import React, { Component } from "react";
import ArtCard from "../components/ArtCard";
import CreateArt from "./CreateArt";
import EditProfile from "../components/EditProfile";
import { getCurrentUser } from "../helpers/auth";

class Profile extends Component {
  render() {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <EditProfile />
        <ArtCard userId={getCurrentUser().uid} />
      </div>
    );
  }
}
export default Profile;
