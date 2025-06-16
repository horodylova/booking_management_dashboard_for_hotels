'use client';

import React, { useState } from "react";

const RoomCell = props => {
  const field = props.field || "";
  const dataItem = props.dataItem || {};
  const [value, setValue] = useState(dataItem[field] || "");
  const [error, setError] = useState(false);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (!/^\d+$/.test(newValue) && newValue !== "") {
      setError(true);
      if (props.onError) {
        props.onError("Room number must contain only digits");
      }
      return;
    }
    
    setError(false);
    
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
      <input 
        type="text" 
        value={value} 
        onChange={handleChange}
        readOnly={true}
        style={{
          width: '100%',
          minWidth: '80px',
          padding: '4px',
          borderRadius: '4px',
          border: error ? '1px solid #f44336' : '1px solid #ccc',
          fontSize: '14px',
          backgroundColor: error ? '#ffebee' : '#f5f5f5'
        }}
      />
    </td>
  );
};

export default RoomCell;