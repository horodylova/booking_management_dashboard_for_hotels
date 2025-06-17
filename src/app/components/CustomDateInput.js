import React, { useState, useEffect } from "react";
import { DateInput } from "@progress/kendo-react-dateinputs";

const CustomDateInput = (props) => {
  const { label, ...others } = props;
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div style={{
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center"
    }}>
      {label && (
        <span style={{ 
          marginRight: isMobile ? "0" : "8px", 
          marginBottom: isMobile ? "4px" : "0",
          fontSize: "14px", 
          whiteSpace: "nowrap" 
        }}>
          {label}
        </span>
      )}
      <DateInput {...others} style={{ width: "100%" }} />
    </div>
  );
};

export default CustomDateInput;