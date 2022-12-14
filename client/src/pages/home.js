import React from "react";
import JoinGame from "../components/JoinGame";
import Rules from "../components/rules";
import NewGame from "../components/newGame";
import "bootstrap/dist/css/bootstrap.min.css";

export const Home = () => {

  return (
    <div>
      <Rules />
      <div className="container-fluid">
        <div className="gameCard row">
          <NewGame />
          <JoinGame />
        </div>
      </div>

    </div>
  );
};

export default Home;
