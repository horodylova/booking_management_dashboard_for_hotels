'use client';

import React from "react";
import { Loader } from "@progress/kendo-react-indicators";

export default function LoaderComponent() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <Loader 
        type="infinite-spinner" 
        size="large" 
        themeColor="error" 
      />
      <span style={{ 
        fontSize: "1rem", 
        color: "var(--accent)", 
        fontWeight: 500 
      }}>
        Loading data...
      </span>
    </div>
  );
}