import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";

function PreviousTrees() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await apiService.getAllTrees();
        setTrees(response);
      } catch (err) {
        setError("Error fetching previous trees. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <hr />
        <Link to="/" className="btn btn-primary">
          Create New Tree
        </Link>
      </div>
    );
  }

  if (trees.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Previous Trees</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info mb-4">
            No trees have been created yet. Create your first binary search tree
            to get started!
          </div>
          <Link to="/" className="btn btn-primary">
            Create New Tree
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="mb-0">Previous Trees</h2>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <Link to="/" className="btn btn-primary mb-4">
            Create New Tree
          </Link>
        </div>

        <div className="list-group">
          {trees.map((tree) => (
            <Link
              key={tree.id}
              to={`/display/${tree.id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Tree #{tree.id}</h5>
                <small>{new Date(tree.createdAt).toLocaleString()}</small>
              </div>
              <p className="mb-1">Numbers: {tree.inputNumbers}</p>
              <div>
                {tree.balanced && (
                  <span className="badge bg-info me-2">Balanced</span>
                )}
                <small className="text-muted">
                  Click to view visualization
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreviousTrees;
