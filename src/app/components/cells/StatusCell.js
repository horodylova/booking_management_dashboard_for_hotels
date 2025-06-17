'use client';

import React from "react";
import styles from "../../page.module.css";

const StatusCell = props => {
  const field = props.field || "";
  const dataItem = props.dataItem || {};
  const status = dataItem[field] || "";
  
  let statusClass = '';
  let statusIcon = '';
  
  switch(status) {
    case 'Confirmed':
      statusClass = styles.statusConfirmed;
      statusIcon = '✓';
      break;
    case 'Cancelled':
      statusClass = styles.statusCancelled;
      statusIcon = '✗';
      break;
    case 'In process':
      statusClass = styles.statusInProcess;
      statusIcon = '⟳';
      break;
    default:
      statusClass = '';
      statusIcon = '';
  }
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
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
        value={status}
        onChange={handleChange}
        style={{
          padding: '4px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: status === 'Confirmed' ? '#e6f7e6' : 
                          status === 'Cancelled' ? '#ffebeb' : 
                          status === 'In process' ? '#fff8e6' : '#ffffff'
        }}
      >
        <option value="Confirmed">✓ Confirmed</option>
        <option value="Cancelled">✗ Cancelled</option>
        <option value="In process">⟳ In process</option>
      </select>
    </td>
  );
};

export default StatusCell;