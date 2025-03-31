import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

function InputForm() {
  const [numbers, setNumbers] = useState("");
  const [balanced, setBalanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Parse the input string to an array of numbers
      const numbersArray = numbers
        .split(/[,\s]+/)
        .map((num) => num.trim())
        .filter((num) => num !== "")
        .map((num) => parseInt(num, 10));

      // Validate that we have valid numbers
      if (numbersArray.length === 0) {
        throw new Error("Please enter at least one number");
      }

      if (numbersArray.some(isNaN)) {
        throw new Error("Please enter valid numbers");
      }

      // Make API call to create the tree
      const response = await apiService.createTree(numbersArray, balanced);

      // Navigate to the display page with the created tree ID
      navigate(`/display/${response.id}`);
    } catch (err) {
      setError(err.message || "An error occurred while creating the tree");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="mb-0">Create Binary Search Tree</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="numbers" className="form-label">
              Enter a series of numbers (comma or space separated):
            </label>
            <input
              type="text"
              className="form-control"
              id="numbers"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="e.g., 10, 5, 15, 3, 7, 12, 20"
              required
              autoFocus
            />
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="balanced"
              checked={balanced}
              onChange={(e) => setBalanced(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="balanced">
              Create a balanced BST
            </label>
            <small className="d-block text-muted mt-1">
              A balanced tree ensures optimal search performance with heights
              differing by at most one level.
            </small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              "Create Tree"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;
