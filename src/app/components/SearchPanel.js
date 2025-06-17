import React, { useState } from "react";
import { DateRangePicker, DateInput } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";

const CustomDateInput = (props) => {
  const { label, ...others } = props;
  
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {label && (
        <span style={{ 
          marginRight: "8px", 
          fontSize: "14px", 
          whiteSpace: "nowrap" 
        }}>
          {label}
        </span>
      )}
      <DateInput {...others} />
    </div>
  );
};

export default function SearchPanel({ onSearch }) {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  
  const statusOptions = ["All", "Confirmed", "Cancelled", "In process"];
  const sourceOptions = ["All", "Booking.com", "Airbnb", "Direct call", "Website booking"];
  
  const handleSearch = () => {
    const searchParams = {
      searchText,
      dateRange,
      status: status === "All" ? null : status,
      source: source === "All" ? null : source
    };
    
    onSearch(searchParams);
    
    window.dispatchEvent(new CustomEvent('notification', {
      detail: {
        message: 'Search filters applied',
        type: 'info',
        duration: 3000
      }
    }));
  };
  
  const handleReset = () => {
    setSearchText("");
    setDateRange({ start: null, end: null });
    setStatus("All");
    setSource("All");
    onSearch({});
    
    window.dispatchEvent(new CustomEvent('notification', {
      detail: {
        message: 'Search filters have been reset',
        type: 'warning',
        duration: 3000
      }
    }));
  };
  
  return (
    <div style={{
      backgroundColor: "#f5f9fc",
      borderRadius: "8px",
      marginBottom: "20px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
        marginBottom: "15px"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Guest Name</label>
          <Input 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            placeholder="Search by guest name"
            style={{ width: "100%" }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Date Range</label>
        
          <DateRangePicker
            value={dateRange}
            onChange={(e) => setDateRange(e.value)}
            format="dd/MM/yyyy"
            style={{ width: "100%" }}
            startDatePlaceholder="day/month/year"
            endDatePlaceholder="day/month/year"
            startDateInput={props => <CustomDateInput {...props} label="Start" />}
            endDateInput={props => <CustomDateInput {...props} label="End" />}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Source</label>
          <DropDownList
            data={sourceOptions}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Status</label>
          <DropDownList
            data={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSearch} type="button" primary="true">Search</Button>
        <Button onClick={handleReset} type="button" style={{ marginLeft: "10px" }}>Reset</Button>
      </div>
    </div>
  );
}