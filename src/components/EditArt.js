import React, { Component } from "react";
import { fsDb } from "../services/firebase";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { Upload, Button, Input, Typography } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

class EditArt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      // states below get their values from EditArt props defined in ArtCard component
      // this has been done to show the previous info in any fields (e.g. description content)
      title: props?.documentInfo?.title,
      category: props?.documentInfo?.category,
      price: props?.documentInfo?.price,
      description: props?.documentInfo?.description,
    };
  }

  ///////////////////////  Set and update user info to Db ////////////////////////
  updateArt = (data) => {
    return fsDb
      .collection("arts")
      .doc(this.props.documentId)
      .set(
        {
          title: data.title,
          category: data.category,
          price: data.price,
          description: data.description,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Art successfully created!");
      });
  };

  _handleSubmit = () => {
    this.setState({ showForm: false });
    this.updateArt(this.state).then(() => {
      this.props.updateArt();
    });
  };

  ///////////////////////////////  Form  eventHandler ///////////////////////////////
  renderTitle = (event) => {
    this.setState({ title: event.target.value });
  };
  renderCategory = (event) => {
    this.setState({ category: event.target.value });
  };
  renderPrice = (event) => {
    this.setState({ price: event.target.value });
  };
  renderDescription = (event) => {
    this.setState({ description: event.target.value });
  };

  ////////////////////////////////////  Form Show  //////////////////////////////////
  showForm = () => {
    return (
      <div style={{ marginTop: "20px" }}>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <Text>Title:</Text>
          <Input
            type="text"
            placeholder="5k morning run"
            style={{ width: "40%", marginBottom: "20px" }}
            onChange={this.renderTitle}
            value={this.state.title}
            required
          />
          <Text>Category:</Text>
          <Input
            type="text"
            placeholder="Oil painting..."
            style={{ width: "40%", marginBottom: "20px" }}
            onChange={this.renderCategory}
            value={this.state.type}
            required
          />
          <Text>Price:</Text>
          <Input
            type="number"
            style={{ width: "40%", marginBottom: "20px" }}
            onChange={this.renderPrice}
            required
          />
          <Text>Description:</Text>
          <TextArea
            type="text"
            placeholder="Please provide a brief info about this art"
            onChange={this.renderDescription}
            value={this.state.description}
            required
            style={{ marginBottom: "20px" }}
          />
          <Upload {...this.uploadProps}>
            <Button icon={<UploadOutlined />}>Upload new Artwork</Button>
          </Upload>
          <br />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{ marginRight: "10px" }}
              type="primary"
              onClick={this._handleSubmit}
            >
              Update
            </Button>
            <Button onClick={() => this.setState({ showForm: false })}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  };

  /////////////////////////////////   Render Form ////////////////////////////////
  render() {
    return (
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={() => this.setState({ showForm: true })}>
          Edit Art
        </Button>
        {this.state.showForm ? this.showForm() : null}
      </div>
    );
  }
}

export default EditArt;
