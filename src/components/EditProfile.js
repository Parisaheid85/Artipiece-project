import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import { fsDb, storage } from "../services/firebase";
import { getCurrentUser } from "../helpers/auth";
import { Card, Avatar, Input } from "antd";
const { Meta } = Card;

/////////////////////////// Ant Design//////////  file upload /////////////////
const { TextArea } = Input;

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      showForm: false,
      name: "",
      origin: "",
      aboutme: "",
      photo: "",
      userImage: "",
      userDocId: "",
    };

    this.uploadFile = this.uploadFile.bind(this);

    ///////////////////////////// Ant Upload file action ///////////////////////////
    this.uploadProps = {
      name: "file",
      action: this.uploadFile,
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        }
      },
    };
  }

  // ///////////////////////////  Fetching existing User Info ///////////////////////
  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = () => {
    fsDb
      .collection("user_profiles")
      .where("user_id", "==", getCurrentUser().uid)
      .get()
      .then((snapshots) => {
        snapshots.forEach((f) => {
          this.setState({
            name: f.data().name,
            aboutme: f.data().aboutme,
            origin: f.data().origin,
            userImage: f.data().userImage,
            userDocId: f.id,
          });
        });
      });
  };

  //////////////////////////////////   Upload File  //////////////////////////////
  uploadFile = (file) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    return fileRef.put(file).then(() => {
      fsDb
        .collection("user_profiles")
        .doc(this.state.userDocId)
        .set(
          { photo: `gs://artpiece-gallery.appspot.com/${file.name}` },
          { merge: true }
        )
        .then((firebaseImage) => {
          fileRef.getDownloadURL().then((url) => {
            this.setState({ userImage: url });
          });
        });
    });
  };

  ///////////////////////  Set and update user info to Db ////////////////////////
  saveProfile(data) {
    fsDb
      .collection("user_profiles")
      .where("user_id", "==", getCurrentUser().uid)
      .get()
      .then((snapshots) => {
        snapshots.forEach((userProfile) => {
          fsDb
            .collection("user_profiles")
            .doc(userProfile.id)
            .set(
              {
                name: data.name,
                aboutme: data.aboutme,
                origin: data.origin,
                userImage: data.userImage,
              },
              { merge: true }
            )
            .then(() => {
              this.fetchUserInfo();
            });
        });
      });
  }
  ////////////////////////////  Form  eventHandler ///////////////////////////////
  _handleSubmit = () => {
    this.saveProfile(this.state);
    this.setState({ showForm: false });
  };

  _renderName = (event) => {
    this.setState({ name: event.target.value });
  };
  _renderAboutMe = (event) => {
    this.setState({ aboutme: event.target.value });
  };
  _renderOrigin = (event) => {
    this.setState({ origin: event.target.value });
  };

  /////////////////////////////////  Form Show  //////////////////////////////////
  showForm() {
    return (
      <div>
        <form style={{ maxWidth: "800px" }}>
          <label style={{ marginTop: "20px", display: "block" }}>Name</label>{" "}
          <Input
            type="text"
            onChange={this._renderName}
            value={this.state.name}
            required
          />
          <label style={{ marginTop: "20px", display: "block" }}>Aboutme</label>{" "}
          <TextArea
            type="text"
            onChange={this._renderAboutMe}
            value={this.state.aboutme}
            required
          />
          <label
            style={{
              display: "block",
            }}
          >
            Origin{" "}
          </label>
          <Input
            style={{ marginBottom: "20px" }}
            type="text"
            onChange={this._renderOrigin}
            value={this.state.origin}
          />
          <Upload {...this.uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
          </Upload>
          <br />
          <div style={{ display: "flex", marginTop: "20px" }}>
            <Button
              onClick={this._handleSubmit}
              key="submit"
              style={{
                marginRight: "10px",
                backgroundColor: "darkblue",
                color: "white",
              }}
            >
              Save
            </Button>
            <Button onClick={() => this.setState({ showForm: false })}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  /////////////////////////////////   Render Form  ////////////////////////////////
  render() {
    return (
      <div>
        <Button
          onClick={() => this.setState({ showForm: true })}
          type="primary"
          style={{ marginRight: "10px" }}
        >
          Edit Profile
        </Button>
        <Button>
          <Link to="/CreateArt">New Art</Link>
        </Button>
        {this.state.showForm ? this.showForm() : null}
        <div style={{ marginTop: "20px" }}>
          {" "}
          <UserInfo info={this.state} imgURL={this.state.userImage} />
        </div>
      </div>
    );
  }
}

///////////////////////////  Show existing details of user /////////////////////
class UserInfo extends Component {
  render() {
    const info = this.props.info;
    return (
      <div>
        <Card
          cover={
            <img
              alt="userpic"
              src={
                this.props.imgURL ||
                "https://www.stateoftheartgallery.com.au/account/editart.aspx?artId=11099"
              }
            />
          }
        >
          <Meta
            title={
              <div>
                <h1>
                  <strong> {info.name} </strong>
                </h1>
                <h4>{info.origin ? info.origin : null}</h4>
              </div>
            }
            description={info.aboutme}
          />
        </Card>
      </div>
    );
  }
}

export default EditProfile;
