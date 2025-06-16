'use client';

import React, { useState } from "react";

const BooleanCell = props => {
  const field = props.field || "";
  const dataItem = props.dataItem || {};
  const [value, setValue] = useState(dataItem[field]);
  
  const handleChange = (e) => {
    const newValue = e.target.value === "true";
    setValue(newValue);
    
    if (props.onChange) {
      props.onChange({
        dataItem: dataItem,
        field: field,
        value: newValue
      });
    }
  };
  
  return (
    <td>
      <select 
        value={value.toString()} 
        onChange={handleChange}
        style={{
          padding: '4px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: value ? '#e6f7e6' : '#ffebeb'
        }}
      >
        <option value="true">✅ Paid</option>
        <option value="false">❌ Not Paid</option>
      </select>
    </td>
  );
};

export default BooleanCell;