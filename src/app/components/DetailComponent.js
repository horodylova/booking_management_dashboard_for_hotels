import React from "react";

export default function DetailComponent(props) {
  const dataItem = props.dataItem;
  
  return (
    <div style={{
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      margin: "10px"
    }}>
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Guest</h4>
        <p>{dataItem.guest_name}</p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Room</h4>
        <p>{dataItem.room_number}</p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Check In</h4>
        <p>{dataItem.check_in_date} at {dataItem.check_in_time}</p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Check Out</h4>
        <p>{dataItem.check_out_day}</p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Payment</h4>
        <p style={{ 
          color: dataItem.paid ? "#22c55e" : "#ef4444",
          fontWeight: "600"
        }}>
          {dataItem.paid ? "Paid" : "Unpaid"}
        </p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Source</h4>
        <p>{dataItem.booking_source}</p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "8px", color: "#3498db" }}>Status</h4>
        <p style={{
          display: "inline-block",
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: dataItem.status === "Confirmed" ? "#e6f7e6" : 
                          dataItem.status === "Cancelled" ? "#ffebee" : 
                          dataItem.status === "In process" ? "#fff8e6" : "#ffffff",
          color: dataItem.status === "Confirmed" ? "#2e7d32" : 
                 dataItem.status === "Cancelled" ? "#c62828" : 
                 dataItem.status === "In process" ? "#1565c0" : "#000000"
        }}>
          {dataItem.status}
        </p>
      </div>
    </div>
  );
}