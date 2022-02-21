import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fsDb } from "../services/firebase";
import { Card } from "antd";
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
    console.log("this.props", this.props);
    console.log("userArtInfo", userArtInfo);
    const nameAndAge = fsDb
      .collection("user_profiles")
      .where("user_id", "==", userArtInfo)
      .get()
      .then((info) => {
        this.setState({ user: info.docs[0] ? info.docs[0].data() : null });
      });
    console.log("paris");
  };

  renderCard = () => {
    const art = this.props.art;
    if (!this.state.user?.user_id) return null;
    // const dob = this.state?.user?.DOB;
    return (
      <Link
        to={{
          pathname: "/PublicProfile",
          state: {
            userId: this.state.user?.user_id,
            name: this.state.user?.name,
            aboutme: this.state.user?.aboutme,
            userImage: this.state.user?.userImage,
          },
        }}
      >
        <Card
          hoverable
          style={{ width: 400 }}
          title={this.state.user.name}
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
        </Card>
      </Link>
    );
  };

  render() {
    return <div style={{ marginBottom: "20px" }}>{this.renderCard()}</div>;
  }
}
export default HomePageCard;
