import React, { Component } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { fsDb, storage } from "../services/firebase";
import { getCurrentUser } from "../helpers/auth";
import { Upload, Input, Button, message } from "antd";

const { TextArea } = Input;

class CreateArt extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      category: null,
      price: null,
      description: null,
      artImage: null,
      artDocId: null,
      userDocId: null,
    };

    this.uploadFile = this.uploadFile.bind(this);

    this.uploadProps = {
      name: "file",
      action: this.uploadFile,
      headers: {
        authorization: "authorization-text",
      },
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = () => {
    fsDb
      .collection("user_profiles")
      .where("user_id", "==", getCurrentUser().uid)
      .get()
      .then((snapshots) => {
        console.log(snapshots);
        snapshots.forEach((f) => {
          this.setState({
            title: f.data().title,
            category: f.data().category,
            description: f.data().description,
            price: f.data().price,
            artImage: f.data().artImage,
            userDocId: f.id,
          });
        });
      });
  };

  uploadFile = (file) => {
    console.log("file", file);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    return fileRef.put(file).then(() => {
      fsDb
        .collection("arts")
        .doc(this.state.user_id)
        .set(
          { photo: `gs://artpiece-gallery.appspot.com/${file.name}` },
          { merge: true }
        )
        .then((firebaseImage) => {
          fileRef.getDownloadURL().then((url) => {
            this.setState({ artImage: url });
          });
        });
    });
  };
  ////////////////// create art and save on db (firestore) //////////////////
  saveArt = (data) => {
    fsDb
      .collection("arts")
      .doc()
      .set({
        title: data.title,
        category: data.category,
        price: data.price,
        description: data.description,
        artImage: data.artImage,
        user_id: getCurrentUser().uid,
      })
      .then(() => {
        console.log("uploaded!");
      });
  };

  _handleSubmit = () => {
    const { title, category, description, artImage } = this.state;
    if (!title || !category || !description || !artImage) {
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
  renderPrice = (event) => {
    this.setState({ price: event.target.value });
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
            placeholder="Art name"
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
          <span style={{ marginTop: "20px" }}>Price:</span>
          <Input
            type="text"
            placeholder="$$$"
            style={{ width: "30%" }}
            onChange={this.renderPrice}
          />
          <span style={{ marginTop: "20px" }}>Description:</span>
          <TextArea
            type="text"
            placeholder="Please provide a brief info about this art"
            onChange={this.renderDescription}
            required
          />
          <Upload {...this.uploadProps}>
            <Button style={{ marginTop: "20px" }} icon={<UploadOutlined />}>
              Upload new Artwork
            </Button>
          </Upload>
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
