import React, { Component } from "react";
import { fsDb } from "../services/firebase";
import SearchBar from "../components/SearchBar";
import CardsContainer from "../components/CardsContainer";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      allArts: [],
    };
  }

  componentDidMount() {
    this.fetchAllArts();
  }

  fetchAllArts = () => {
    const fetchArts = fsDb
      .collection("arts")
      .get()
      .then((snapshot) => {
        let arts = [];
        snapshot.forEach((art) => {
          arts.push(art.data());
        });
        this.setState({ allArts: arts });
      });
  };

  onSearch = (searchedArts) => {
    this.setState({ allArts: searchedArts });
  };

  render() {
    return (
      <div>
        <SearchBar onSearch={this.onSearch} clearSearch={this.fetchAllArts} />
        <CardsContainer arts={this.state.allArts} />
      </div>
    );
  }
}
export default Home;
