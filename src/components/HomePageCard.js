import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fsDb } from "../services/firebase";
import { Card } from "antd";
import moment from "moment";
const { Meta } = Card;

class HomePageCard extends React.Component {
  state = {
    user: "",
  };

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = () => {
    const userArtInfo = this.props.art.user_id;
    const nameAndAge = fsDb
      .collection("user_profiles")
      .where("user_id", "==", userArtInfo)
      .get()
      .then((info) => {
        this.setState({ user: info.docs[0] ? info.docs[0].data() : null });
      });
  };

  renderCard = () => {
    const art = this.props.art;
    if (!this.state.user?.user_id) return null;
    const dob = this.state?.user?.DOB;
    return (
      <Link
        to={{
          pathname: "/PublicProfile",
          state: {
            userId: this.state.user?.user_id,
            name: this.state.user?.name,
            aboutme: this.state.user?.aboutme,
            // DOB: this.state.user?.DOB,
            userImage: this.state.user?.userImage,
          },
        }}
      >
        <Card
          hoverable
          style={{ width: 400 }}
          title={
            this.state.user.name +
            " | " +
            moment(this.state.user?.DOB?.toDate()).toNow("Y")
          }
          cover={
            <img
              alt="example"
              src={
                this.state.user?.userImage ||
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              }
            />
          }
        >
          <Meta title={art.title} description="" /> <br />
          {/* <h5>
            {art.location.street_number +
              ", " +
              art.location.street +
              ", " +
              art.location.suburb +
              " | " +
              moment(art.time?.toDate()).format("MMMM Do YYYY")}
          </h5> */}
        </Card>
      </Link>
    );
  };

  render() {
    return <div style={{ marginBottom: "20px" }}>{this.renderCard()}</div>;
  }
}
export default HomePageCard;
