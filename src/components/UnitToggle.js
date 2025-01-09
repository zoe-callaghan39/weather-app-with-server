import React from "react";

const UnitToggle = ({ unit, toggleUnit }) => (
  <div className="unit-toggle">
    <button onClick={toggleUnit}>Show in °{unit === "C" ? "F" : "C"}</button>
  </div>
);

export default UnitToggle;
