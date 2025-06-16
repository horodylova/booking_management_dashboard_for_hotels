
'use client';

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import "@progress/kendo-theme-material/dist/all.css";

const BooleanCell = (props) => {
  return (
    <td>{props.dataItem[props.field] ? '✅' : '❌'}</td>
  )
};

const StatusCell = (props) => {
  const status = props.dataItem[props.field];
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
  
  return (
    <td>
      <span className={`${styles.statusBadge} ${statusClass}`}>
        {statusIcon} {status}
      </span>
    </td>
  );
};

const DateCell = (props) => {
  return (
    <td>
      {props.dataItem[props.field]}
    </td>
  );
};

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 10,
    sort: [
      { field: "booking_id", dir: "asc" }
    ],
    filter: {
      logic: "and",
      filters: []
    }
  });
  const [result, setResult] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/bookings.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBookings(data);
        setResult(process(data, dataState));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setError('Error loading data');
        setLoading(false);
      });
  }, []);
  
  const onDataStateChange = (e) => {
    setDataState(e.dataState);
    setResult(process(bookings, e.dataState));
  };

  return (
    <div>
      <main>
        <h1>Booking Management</h1>
        
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : result.data.length === 0 ? (
            <p>No records available</p>
          ) : (
            <Grid
              data={result}
              filterable={true}
              sortable={true}
              pageable={{
                buttonCount: 5,
                info: true,
                type: 'numeric',
                pageSizes: [5, 10, 15, 20],
                previousNext: true
              }}
              onDataStateChange={onDataStateChange}
              {...dataState}
            >
              <GridColumn field="booking_id" title="ID" width="70px" filterable={true} />
              <GridColumn field="guest_name" title="Guest" filterable={true} />
              <GridColumn field="check_in_date" title="Check In" cell={DateCell} filterable={true} />
              <GridColumn field="check_out_date" title="Check Out" cell={DateCell} filterable={true} />
              <GridColumn field="room_number" title="Room" width="100px" filterable={true} />
              <GridColumn field="paid" title="Payment Status" cell={BooleanCell} filterable={true} />
              <GridColumn field="booking_source" title="Source" filterable={true} />
              <GridColumn field="status" title="Status" cell={StatusCell} filterable={true} />
            </Grid>
          )}
        </div>
      </main>
    </div>
  );
}
