import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import InputForm from "./components/InputForm";
import DisplayTree from "./components/DisplayTree";
import PreviousTrees from "./components/PreviousTrees";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/display/:treeId" element={<DisplayTree />} />
            <Route path="/previous" element={<PreviousTrees />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
