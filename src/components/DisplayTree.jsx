import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import * as d3 from "d3";
import apiService from "../services/apiService";

function DisplayTree() {
  const { treeId } = useParams();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const svgRef = useRef();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await apiService.getTreeById(treeId);
        setTree(response);
      } catch (err) {
        setError("Error fetching tree data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [treeId]);

  useEffect(() => {
    if (tree && svgRef.current) {
      // Clear any existing visualization
      d3.select(svgRef.current).selectAll("*").remove();

      // Create the visualization
      const treeStructure = JSON.parse(tree.treeStructure);
      visualizeTree(treeStructure);
    }
  }, [tree]);

  const visualizeTree = (treeData) => {
    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Create hierarchical data for D3
    const createHierarchy = (node) => {
      if (!node) return null;

      const result = { name: node.value };
      const children = [];

      if (node.left) {
        children.push(createHierarchy(node.left));
      }

      if (node.right) {
        children.push(createHierarchy(node.right));
      }

      if (children.length > 0) {
        result.children = children;
      }

      return result;
    };

    const hierarchyData = createHierarchy(treeData);

    // Create SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tree layout
    const treeLayout = d3
      .tree()
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ]);

    // Create hierarchy
    const root = d3.hierarchy(hierarchyData);

    // Generate tree data
    const treeData2 = treeLayout(root);

    // Add links
    g.selectAll(".link")
      .data(treeData2.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // Add nodes
    const nodes = g
      .selectAll(".node")
      .data(treeData2.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", 20)
      .attr("fill", "white")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3);

    // Add text to nodes
    nodes
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px");
  };

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
        <div className="d-flex">
          <Link to="/" className="btn btn-primary me-2">
            Create New Tree
          </Link>
          <Link to="/previous" className="btn btn-secondary">
            View Previous Trees
          </Link>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="alert alert-warning">
        <h4 className="alert-heading">Tree Not Found</h4>
        <p>
          The requested tree could not be found. It may have been deleted or
          there was an error with the ID.
        </p>
        <hr />
        <div className="d-flex">
          <Link to="/" className="btn btn-primary me-2">
            Create New Tree
          </Link>
          <Link to="/previous" className="btn btn-secondary">
            View Previous Trees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Binary Search Tree Visualization</h2>
        {tree.balanced && <span className="badge bg-info">Balanced Tree</span>}
      </div>
      <div className="card-body">
        <p className="mb-3">
          <strong>Input Numbers:</strong> {tree.inputNumbers}
        </p>

        <div
          className="tree-container border rounded p-3 mb-4"
          style={{ overflow: "auto" }}
        >
          <svg ref={svgRef} width="800" height="500"></svg>
        </div>

        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-primary">
            Create New Tree
          </Link>
          <Link to="/previous" className="btn btn-secondary">
            View All Trees
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DisplayTree;
