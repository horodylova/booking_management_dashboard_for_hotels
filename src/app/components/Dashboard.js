import React from "react";
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartTitle, ChartLegend } from "@progress/kendo-react-charts";
import { Card, CardHeader, CardTitle, CardBody } from "@progress/kendo-react-layout";

export default function Dashboard({ bookings }) {
  const getStatusCounts = () => {
    const counts = {
      Confirmed: 0,
      Cancelled: 0,
      "In process": 0
    };
    
    bookings.forEach(booking => {
      if (counts[booking.status] !== undefined) {
        counts[booking.status]++;
      }
    });
    
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  };
  
  const getMonthlyBookings = () => {
    const months = {};
    
    bookings.forEach(booking => {
      const date = booking.check_in_date.split("/");
      const month = date[1];
      const year = date[2];
      const key = `${month}/${year}`;
      
      if (!months[key]) {
        months[key] = 0;
      }
      
      months[key]++;
    });
    
    return Object.entries(months)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/");
        const [bMonth, bYear] = b.month.split("/");
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
  };
  
  const statusData = getStatusCounts();
  const monthlyData = getMonthlyBookings();
  
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
      <Card style={{ flex: "1 1 300px" }}>
        <CardHeader>
          <CardTitle>Booking Status Overview</CardTitle>
        </CardHeader>
        <CardBody>
          <Chart>
            <ChartTitle text="Bookings by Status" />
            <ChartLegend position="bottom" />
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                data={statusData}
                field="count"
                categoryField="status"
                labels={{
                  visible: true,
                  content: (e) => `${e.category}: ${e.value}`
                }}
              />
            </ChartSeries>
          </Chart>
        </CardBody>
      </Card>
      
      <Card style={{ flex: "1 1 500px" }}>
        <CardHeader>
          <CardTitle>Monthly Bookings</CardTitle>
        </CardHeader>
        <CardBody>
          <Chart>
            <ChartTitle text="Bookings by Month" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem categories={monthlyData.map(item => item.month)} />
            </ChartCategoryAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={monthlyData.map(item => item.count)}
                color="#3498db"
              />
            </ChartSeries>
          </Chart>
        </CardBody>
      </Card>
    </div>
  );
}