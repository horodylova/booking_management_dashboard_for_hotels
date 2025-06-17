
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
import SearchPanel from "./components/SearchPanel";
import ExportButton from "./components/ExportButton";
import LoaderComponent from "./components/LoaderComponent";

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
  
  useEffect(() => {
    setLoading(true);
    fetch('/bookings.json')
      .then(response => response.json())
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
    
    const handleNotification = (event) => {
      showNotification(event.detail.message, event.detail.type, event.detail.duration);
    };
    
    window.addEventListener('notification', handleNotification);
    
    return () => {
      window.removeEventListener('notification', handleNotification);
    };
  }, []);
  
  const onDataStateChange = (e) => {
    setDataState(e.dataState);
    let processedData = process(filteredBookings, e.dataState);
    setResult({
      data: processedData.data,
      total: processedData.total
    });
  };

  const handleCellChange = (e) => {
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
  };
  
  const handleCellError = (message) => {
    showNotification(message, 'error');
  };
  
  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      duration
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, duration);
    }
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
      filtered = filtered.filter(booking => {
        const bookingStatus = booking.status ? booking.status.trim() : "";
        const searchStatus = searchParams.status.trim();
        return bookingStatus.toLowerCase() === searchStatus.toLowerCase();
      });
    }
    
    if (searchParams.source) {
      filtered = filtered.filter(booking => {
        const bookingSource = booking.booking_source ? booking.booking_source.trim() : "";
        const searchSource = searchParams.source.trim();
        return bookingSource.toLowerCase() === searchSource.toLowerCase();
      });
    }
    
    setFilteredBookings(filtered);
    
    const newDataState = {
      skip: 0,
      take: dataState.take,
      sort: dataState.sort,
      filter: {
        logic: "and",
        filters: []
      }
    };
    
    setDataState(newDataState);
    
    const processedData = process(filtered, newDataState);
    setResult({
      data: processedData.data,
      total: processedData.total
    });
  };

  return (
    <div>
      <AppBar className="header" style={{
        background: 'rgba(231, 76, 60, 0.1)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '0.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <AppBarSection>
          <h1 className="title" style={{
            fontSize: '1.8rem',
            fontWeight: '500',
            margin: 0,
            padding: '0.5rem 0',
            letterSpacing: '0.5px',
            color: '#333'
          }}>Booking Management</h1>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection>
          <span className="hotel-name" style={{
            fontSize: '1.2rem',
            padding: '0.5rem 0',
            opacity: '0.9',
            fontWeight: '300',
            color: '#555'
          }}>Hotel Dashboard</span>
        </AppBarSection>
      </AppBar>
      
      <main>
        <NotificationManager 
          notifications={notifications} 
          setNotifications={setNotifications} 
        />
        
        {!loading && !error && (
          <>
            <SearchPanel onSearch={handleSearch} />
            <ExportButton data={filteredBookings} />
          </>
        )}
        
        <div>
          {loading ? (
            <LoaderComponent />
          ) : error ? (
            <p>{error}</p>
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
              onItemChange={handleCellChange}
              {...dataState}
            >
              <GridColumn field="room_number" title="Room" width="150px" cells={{
                data: (props) => <RoomCell {...props} onError={handleCellError} />
              }} media="(min-width: 768px)" />
              <GridColumn field="guest_name" title="Guest" />
              <GridColumn field="check_in_date" title="Check In Date" cells={{ data: DateCell }} media="(min-width: 992px)" />
              <GridColumn field="check_out_day" title="Check Out Date" cells={{ data: DateCell }} media="(min-width: 992px)" />
              <GridColumn field="check_in_time" title="Check In Time" cells={{ data: TimeCell }} media="(min-width: 1200px)" />
              <GridColumn field="paid" title="Payment Status" cells={{ data: BooleanCell }} media="(min-width: 768px)" />
              <GridColumn field="booking_source" title="Source" media="(min-width: 1200px)" />
              <GridColumn field="status" title="Status" cells={{ data: StatusCell }} />
            </Grid>
          )}
        </div>
      </main>
    </div>
  );
}
