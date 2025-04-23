import React from "react";

const Input = ({ label, value, onChange, type = "text", min }) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      required
    />
  </div>
);

export default Input;
