import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fsDb } from "../services/firebase";
import moment from "moment";
import { getCurrentUser } from "../helpers/auth";

import { Card, Divider } from "antd";
import "./ArtCard.css";
import EditArt from "./EditArt";
import DeleteArt from "./DeleteArt";

class ArtCard extends Component {
  constructor() {
    super();
    this.state = {
      arts: [],
    };
  }

  componentDidMount() {
    this.fetchArts();
  }

  ///////////////////////////////// fetch arts from database /////////////////
  fetchArts = () => {
    fsDb
      .collection("arts")
      .where("user_id", "==", this.props.userId) // userId is passed into Artcard from parent, which in this case is profile or PublicProfile page
      .get()
      .then((snapshots) => {
        let arts = [];
        snapshots.forEach((art) => {
          const docId = art.id;
          const artObj = art.data();
          arts.push({ ...artObj, docId });
        });
        this.setState({ arts: arts });
      });
  };

  //////////////////////////////////////// renders the page and filter out the deleted page ////////////
  deleteArt = (documentId) => {
    // props from deleteArt component sits in place of documentId
    const newArts = this.state.arts.filter((art) => {
      return art.docId !== documentId;
    });
    this.setState({ arts: newArts });
  };

  //////////////////////////////////////// renders the updated page ////////////
  updateArt = () => {
    this.fetchArts();
  };

  /////////////////////////////////////////// handles activities and Edit and Delete activity buttons ////////////////////////
  renderArts = () => {
    const arts = this.state.arts;
    if (this.props.userId === getCurrentUser().uid) {
      return arts.map((art, index) => {
        return (
          <div key={index} className="site-card-border-less-wrapper">
            <Card title={art.title} bordered={false}>
              <p>{art.description}</p>
              <p>{art.origin}</p>
              <p>{art.category}</p>
            </Card>
            <div style={{ marginTop: "10px" }}>
              <EditArt
                documentId={art.docId}
                documentInfo={art}
                updateArt={this.updateArt}
              />
              <DeleteArt deleteArt={this.deleteArt} documentId={art.docId} />
            </div>
          </div>
        );
      });
    } else {
      return arts.map((art, index) => {
        return (
          <div key={index} className="site-card-border-less-wrapper">
            <Card title={art.title} bordered={false}>
              <p>{art.description}</p>
              <p>{art.origin}</p>
              <p>{art.category}</p>
            </Card>
          </div>
        );
      });
    }
  };
  ////////////////////////////////// renders activities //////////////////////////////
  render() {
    return <div>{this.renderArts()}</div>;
  }
}

export default ArtCard;
