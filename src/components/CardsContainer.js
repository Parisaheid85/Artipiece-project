import React, { Component } from "react";
import HomePageCard from "./HomePageCard";

class CardsContainer extends Component {
  renderArts = () => {
    return this.props.arts.map((art, index) => {
      return <HomePageCard key={index} art={art} />;
    });
  };

  render() {
    return (
      <div
        className="thumbnail"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {this.renderArts()}
      </div>
    );
  }
}
export default CardsContainer;
