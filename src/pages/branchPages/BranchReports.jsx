import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Printer } from "lucide-react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";

const ReportTable = ({ data, columns }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className="font-semibold">
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {row[column.toLowerCase().replace(/ /g, "_")]}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const ReportCard = ({ title, children, onPrint }) => (
  <Card className="w-full shadow-md mt-10">
    <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
      <Button onClick={onPrint} variant="outline" size="sm">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
    </CardHeader>
    <CardContent className="p-6">{children}</CardContent>
  </Card>
);

const useReport = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${endpoint}`);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

const ReportComponent = ({ title, endpoint, columns }) => {
  const { data, loading, error } = useReport(endpoint);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [data, searchTerm]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report - ${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; font-size: 18px }
            tr { font-size: 10px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>
                ${columns.map(column => `<th>${column}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(row => `
                <tr>
                  ${columns.map(column => `<td>${row[column.toLowerCase().replace(/ /g, "_")]}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) {
    return (
      <ReportCard title={title} onPrint={() => {}}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ReportCard>
    );
  }

  if (error) {
    return (
      <ReportCard title={title} onPrint={() => {}}>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </ReportCard>
    );
  }

  return (
    <ReportCard title={title} onPrint={handlePrint}>
      <div className="mb-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ReportTable data={filteredData} columns={columns} />
    </ReportCard>
  );
};

const DailyReport = () => {
  const { data, loading, error } = useReport("/branch/reports/daily/");

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report - Daily Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1, h2 { text-align: center; font-size: 18px; }
            tr { text-align: center; font-size: 10px;}
          </style>
        </head>
        <body>
          <h1>Daily Report</h1>
          <h2>Inflows</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Received</th>
              </tr>
            </thead>
            <tbody>
              ${data.inflows.map(row => `
                <tr>
                  <td>${row.product_name}</td>
                  <td>${row.quantity_received}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ReportCard title="Daily Report" onPrint={handlePrint}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Inflows</h3>
          <ReportTable
            data={data.inflows}
            columns={["Product Name", "Quantity"]}
          />
        </div>
      </div>
    </ReportCard>
  );
};

const reportConfigs = [
  {
    id: "product-details",
    title: "Product Details Report",
    endpoint: "/branch/reports/product-details/",
    columns: ["Name", "SKU", "Quantity", "Status"],
  },
  {
    id: "expired",
    title: "Expired Product Report",
    endpoint: "/branch/reports/expired-products/",
    columns: ["Product Name", "Expiry Date", "Quantity"],
  },
];

const BranchReports = () => {
  const [activeTab, setActiveTab] = useState("product-details");

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Branch Reports</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            {reportConfigs.map((config) => (
              <TabsTrigger
                key={config.id}
                value={config.id}
                className="px-4 py-2"
              >
                {config.title.split(" ")[0]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="daily" className="px-4 py-2">
              Daily
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {reportConfigs.map((config) => (
              <TabsContent key={config.id} value={config.id}>
                <ReportComponent
                  title={config.title}
                  endpoint={config.endpoint}
                  columns={config.columns}
                />
              </TabsContent>
            ))}
            <TabsContent value="daily">
              <DailyReport />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default BranchReports;
