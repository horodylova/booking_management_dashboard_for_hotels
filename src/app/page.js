
'use client';

import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import "@progress/kendo-theme-default/dist/all.css";
import BooleanCell from "./components/cells/BooleanCell";
import StatusCell from "./components/cells/StatusCell";
import DateCell from "./components/cells/DateCell";
import TimeCell from "./components/cells/TimeCell";
import RoomCell from "./components/cells/RoomCell";

import NotificationManager from "./components/notifications/NotificationManager";
import { AppBar, AppBarSection, AppBarSpacer } from "@progress/kendo-react-layout";
import Dashboard from "./components/Dashboard";
import SearchPanel from "./components/SearchPanel";
import ExportButton from "./components/ExportButton";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
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
  const [notifications, setNotifications] = useState([]);
  
  const filterOperators = {
    text: [
      { text: "Is equal to", operator: "eq" },
      { text: "Contains", operator: "contains" },
      { text: "Starts with", operator: "startswith" },
      { text: "Ends with", operator: "endswith" }
    ],
    numeric: [
      { text: "Is equal to", operator: "eq" }
    ]
  };
  
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
        const processedData = data.map(item => ({
          ...item,
          room_number: parseInt(item.room_number, 10)
        }));
        setBookings(processedData);
        setFilteredBookings(processedData);
        setResult(process(processedData, dataState));
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
    setResult(process(filteredBookings, e.dataState));
  };

  const handleCellChange = (e) => {
    try {
      const newData = bookings.map(item => {
        if (item === e.dataItem) {
          return { ...item, [e.field]: e.value };
        }
        return item;
      });
      
      setBookings(newData);
      setFilteredBookings(newData);
      setResult(process(newData, dataState));
      showNotification('Data updated successfully', 'success');
    } catch (err) {
      showNotification('Please try again. Invalid input.', 'error');
    }
  };
  
  const handleCellError = (message) => {
    showNotification(message, 'error');
  };
  
  const showNotification = (message, type = 'error') => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };
  
  const handleSearch = (searchParams) => {
    let filtered = [...bookings];
    
    if (searchParams.searchText) {
      filtered = filtered.filter(booking => 
        booking.guest_name.toLowerCase().includes(searchParams.searchText.toLowerCase())
      );
    }
    
    if (searchParams.dateRange && searchParams.dateRange.start && searchParams.dateRange.end) {
      const start = searchParams.dateRange.start;
      const end = searchParams.dateRange.end;
      
      filtered = filtered.filter(booking => {
        const parts = booking.check_in_date.split('/');
        const bookingDate = new Date(parts[2], parts[1] - 1, parts[0]);
        return bookingDate >= start && bookingDate <= end;
      });
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(booking => booking.status === searchParams.status);
    }
    
    if (searchParams.source) {
      filtered = filtered.filter(booking => booking.booking_source === searchParams.source);
    }
    
    setFilteredBookings(filtered);
    setResult(process(filtered, dataState));
  };

  return (
    <div>
      <AppBar className="header">
        <AppBarSection>
          <h1 className="title">Booking Management</h1>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection>
          <span className="hotel-name">Hotel Dashboard</span>
        </AppBarSection>
      </AppBar>
      
      <main>
        <NotificationManager 
          notifications={notifications} 
          setNotifications={setNotifications} 
        />
        
        {!loading && !error && (
          <>
            <Dashboard bookings={bookings} />
            <SearchPanel onSearch={handleSearch} />
            <ExportButton data={filteredBookings} />
          </>
        )}
        
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Grid
              data={result}
              filterable={{
                operators: filterOperators
              }}
              sortable={true}
              pageable={{
                buttonCount: 5,
                info: true,
                type: 'numeric',
                pageSizes: [5, 10, 15, 20],
                previousNext: true
              }}
              onDataStateChange={onDataStateChange}
              onItemChange={handleCellChange}
              {...dataState}
            >
              <GridColumn field="booking_id" title="ID" width="80px" filterable={{
                ui: false,
                filter: 'numeric'
              }} />
              <GridColumn field="room_number" title="Room" width="100px" cells={{
                data: (props) => <RoomCell {...props} onError={handleCellError} />
              }} filterable={{
                ui: false,
                filter: 'numeric'
              }} />
              <GridColumn field="guest_name" title="Guest" filterable={{
                ui: false
              }} />
              <GridColumn field="check_in_date" title="Check In Date" cells={{ data: DateCell }} filterable={{
                ui: false
              }} />
              <GridColumn field="check_out_day" title="Check Out Date" cells={{ data: DateCell }} filterable={{
                ui: false
              }} />
              <GridColumn field="check_in_time" title="Check In Time" cells={{ data: TimeCell }} filterable={{
                ui: false
              }} />
              <GridColumn field="paid" title="Payment Status" cells={{ data: BooleanCell }} filterable={{
                ui: false
              }} />
              <GridColumn field="booking_source" title="Source" filterable={{
                ui: false
              }} />
              <GridColumn field="status" title="Status" cells={{ data: StatusCell }} filterable={{
                ui: false
              }} />
            </Grid>
          )}
        </div>
      </main>
    </div>
  );
}
