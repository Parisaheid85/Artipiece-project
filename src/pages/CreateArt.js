import React, { Component } from "react";
import { fsDb } from "../services/firebase";
import { getCurrentUser } from "../helpers/auth";
import moment from "moment";
import { Input, Button, message } from "antd";

const { TextArea } = Input;
class CreateArt extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      category: null,
      origin: null,
      description: null,
    };
  }
  ////////////////// create activity and save on db (firestore) //////////////////
  saveArt = (data) => {
    fsDb
      .collection("arts")
      .doc()
      .set({
        title: data.title,
        category: data.category,
        origin: data.origin,
        description: data.description,
        user_id: getCurrentUser().uid,
      })
      .then(() => {
        console.log(
          "Your artwork is now uploaded and visible on Artipiece Gallery!"
        );
      });
  };

  _handleSubmit = () => {
    const { title, category, description } = this.state;
    if (!title || !category || !description) {
      message.error("Please fill in required fields");
      return;
    }
    this.saveArt(this.state);
    this.props.history.push("/Profile"); // redirects to Profile page after creating the activity
  };

  ////////////////// renders all input fields in the state //////////////////
  renderTitle = (event) => {
    this.setState({ title: event.target.value });
  };
  renderCategory = (event) => {
    this.setState({ category: event.target.value });
  };
  renderOrigin = (event) => {
    this.setState({ origin: event.target.value });
  };
  renderDescription = (event) => {
    this.setState({ description: event.target.value });
  };
  ////////////////////////////////// the form //////////////////////////////////
  render() {
    return (
      <div>
        <form
          onSubmit={this._handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "800px",
          }}
        >
          <span>Title:</span>
          <Input
            type="text"
            placeholder="art name"
            style={{ width: "40%" }}
            onChange={this.renderTitle}
            required
          />
          <span style={{ marginTop: "20px" }}>Category:</span>
          <Input
            type="text"
            placeholder="Oil painting, watercolor, ..."
            style={{ width: "40%" }}
            onChange={this.renderCategory}
            required
          />
          <span style={{ marginTop: "20px" }}>Origin:</span>
          <Input
            type="text"
            placeholder="Origin"
            style={{ width: "30%" }}
            onChange={this.renderOrigin}
          />
          <span style={{ marginTop: "20px" }}>Description:</span>
          <TextArea
            type="text"
            placeholder="Please provide a brief info about this art"
            onChange={this.renderDescription}
            required
          />
          <Button
            style={{ marginTop: "20px" }}
            onClick={this._handleSubmit}
            type="primary"
          >
            Create Art
          </Button>
        </form>
      </div>
    );
  }
}
export default CreateArt;
