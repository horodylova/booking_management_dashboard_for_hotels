'use client';

import React from "react";

const BooleanCell = props => {
  const field = props.field || "";
  const dataItem = props.dataItem || {};
  const value = dataItem[field];
  
  if (props.filterCell) {
    return (
      <td>
        <select
          className="k-dropdown"
          value={props.value || ''}
          onChange={(e) => {
            let filterValue = e.target.value;
            if (filterValue === 'true') filterValue = true;
            if (filterValue === 'false') filterValue = false;
            
            props.onChange({
              value: filterValue,
              operator: 'eq',
              syntheticEvent: e.syntheticEvent
            });
          }}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">All</option>
          <option value="true">Paid</option>
          <option value="false">Not Paid</option>
        </select>
      </td>
    );
  }
  
  const handleChange = (e) => {
    const newValue = e.target.value === "true";
    
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