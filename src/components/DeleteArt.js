import React, { Component } from "react";
import { fsDb } from "../services/firebase";
import { getCurrentUser } from "../helpers/auth";

/////////////////////////////////////// Delete Popconfirm message from Antdesign ///////////////////////
import { Popconfirm, message, Button } from "antd";

function confirm(e) {
  console.log(e);
  message.success("Click on Yes");
}

function cancel(e) {
  console.log(e);
  message.error("Click on No");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////

class DeleteArt extends Component {
  ///////////////////////  Delete user info from Db ////////////////////////
  deleteArt = () => {
    fsDb
      .collection("arts")
      .doc(this.props.documentId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  _handleDelete = () => {
    this.deleteArt();
    this.props.deleteArt(this.props.documentId);
  };

  /////////////////////////////////   Render Form ////////////////////////////////
  render() {
    return (
      <div>
        <Popconfirm
          title="Are you sure you want to delete this art?"
          okText="Yes"
          cancelText="No"
          onConfirm={this._handleDelete}
        >
          <Button type="ghost" danger>
            Delete Art
          </Button>
        </Popconfirm>
      </div>
    );
  }
}

export default DeleteArt;
