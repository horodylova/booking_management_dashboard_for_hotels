import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";

export default function ExportButton({ data }) {
  let excelExportRef;
  
  const exportToExcel = () => {
    if (excelExportRef) {
      excelExportRef.save();
    }
  };
  
  return (
    <div style={{ marginBottom: "15px" }}>
      <Button
        primary="true"
        onClick={exportToExcel}
        icon="file-excel"
      >
        Export to Excel
      </Button>
      
      <ExcelExport
        data={data}
        fileName="hotel_bookings.xlsx"
        ref={(exporter) => { excelExportRef = exporter; }}
      >
        <ExcelExportColumn field="booking_id" title="ID" />
        <ExcelExportColumn field="guest_name" title="Guest" />
        <ExcelExportColumn field="check_in_date" title="Check In Date" />
        <ExcelExportColumn field="check_out_day" title="Check Out Date" />
        <ExcelExportColumn field="room_number" title="Room" />
        <ExcelExportColumn field="paid" title="Payment Status" />
        <ExcelExportColumn field="booking_source" title="Source" />
        <ExcelExportColumn field="status" title="Status" />
      </ExcelExport>
    </div>
  );
}