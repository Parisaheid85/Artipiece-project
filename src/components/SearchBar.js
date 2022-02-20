import React, { Component } from "react";
import { fsDb } from "../services/firebase";
import { Button } from "antd";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const artTypes = [
  { type: "Oil Painting" },
  { type: "Watercolor" },
  { type: "Acrylic" },
  { type: "Prints" },
  { type: "Photography" },
];

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
    };
  }

  handleChange = (event, value) => {
    this.setState({ searchInput: value });
  };

  handleSearch = (event) => {
    event.preventDefault();
    if (!this.state.searchInput?.type) return;
    fsDb
      .collection("arts")
      .where("type", "==", this.state.searchInput.type)
      .get()
      .then((snapshots) => {
        let arts = [];
        snapshots.forEach((doc) => {
          arts.push(doc.data());
        });
        this.props.onSearch(arts);
      });
  };

  clearSearch = (event) => {
    event.preventDefault();
    this.props.clearSearch();
  };

  render() {
    return (
      <div>
        <form style={{ display: "flex", marginBottom: "20px" }}>
          <Autocomplete
            onChange={this.handleChange}
            id="combo-box-demo"
            options={artTypes}
            getOptionLabel={(option) => option.type}
            style={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Artworks"
                variant="outlined"
              />
            )}
          />
          <Button
            onClick={this.handleSearch}
            type="primary"
            style={{ height: "auto" }}
          >
            Search
          </Button>
          <button onClick={this.clearSearch}>Clear</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
