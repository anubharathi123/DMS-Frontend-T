import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { FaSearch } from "react-icons/fa"; // Search icon
import ClipLoader from "react-spinners/ClipLoader";
 
import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaBuildingCircleXmark } from "react-icons/fa6";
import { FaBuildingCircleExclamation } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending, MdCancel, MdMargin } from "react-icons/md";
import apiServices from '../../ApiServices/ApiServices';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { curveCardinal } from 'd3-shape';
import {
  Chart as ChartJS,
 BarElement,
 ArcElement,
 LineElement,
 PointElement,
 CategoryScale,
 LinearScale,
  Legend,
} from 'chart.js';





//CUSTOM TOOLTIP 

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { company, month, document_count } = payload[0].payload; // Extract relevant data
    
    return (
      <div style={{
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "5px",
        fontSize:"10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      }}>
        <>
        <p><strong>📌 Company:</strong> {company}</p>
        <p><strong>📅 Month:</strong> {month}</p>
        <p style={{ color: "red" }}><strong>📑 Documents Uploaded:</strong> {document_count}</p>
      </>
      </div>
    );
  }
  return null;
};
 


ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
   Legend
);

const Dashboard = ({ title }) => (
  <div className="dashboard">
    <h1 className='dashboard-h1'>{title}</h1>
  </div>
);

//COMPONENT START HERE
const DashboardApp = () => {
  const role = localStorage.getItem('role');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [OrgCount,setOrgCount] = useState([]);
  const [count, setCount] = useState([]);
   const [chartData, setChartData] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
const [yearMonth,setYearMonth] = useState([])
  const [month, setMonth] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]); // Store unique years for dropdown
  const [isLoading, setIsLoading] = useState(true);

  const [rowLimit, setRowLimit] = useState('4');
  const username = localStorage.getItem('name') || "User";
  const [data, setData] = useState([]);



  // useEffect(() => {
  //   // Simulate a loading delay (you can replace this with actual API call)
  //   const timer = setTimeout(() => {
  //     fetchData();
  //     fetchData1();
  //     FetchYearMonthCompany();
  //     fetchlineData();
  //     fetchlineData1();
      
      
      
  //     setIsLoading(false);
  //   }, 2000); // Adjust timing as needed

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
  
        // Call all API requests in parallel
        const [
          orgCountResponse,
          companyCountResponse,
          yearMonthCompanyResponse,
          lineDataResponse,
          lineDataResponse1
        ] = await Promise.all([
          apiServices.organizationCount(),
          apiServices.companyCount(),
          apiServices.MonthYearCompany(),
          apiServices.getlinedata(),
          apiServices.getlinedata()
        ]);
  
        // 🔹 Organization Count
        if (orgCountResponse) {
          const dashboard = orgCountResponse.map(db => ({
            org_name: db.organization_name,
            username: db.organization_user,
            doc_count: db.total_files_all,
            doc_size: db.total_file_size_all,
            emp: db.total_employees
          }));
          setCompanyData(dashboard);
        }
  
        // 🔹 Company Count
        if (companyCountResponse) {
          setOrgCount({
            totalCompanies: companyCountResponse.organization_count || 0,
            activeCompanies: companyCountResponse.active_org_count || 0,
            inactiveCompanies: companyCountResponse.deleted_org_count || 0,
            clientAdmins: companyCountResponse.user_count || 0,
            totalDocuments: companyCountResponse.document_count || 0,
            approvedDocuments: companyCountResponse.approved_count || 0,
            pendingDocuments: companyCountResponse.pending_org_count || 0,
            rejectedDocuments: companyCountResponse.rejected_count || 0,
            user_count: companyCountResponse.user_count || 0,
            deleted_org_count: companyCountResponse.deleted_org_count || 0
          });
        }
  
        // 🔹 Year-Month-Company Data Processing
        if (yearMonthCompanyResponse) {
          const extractedYears = [...new Set(yearMonthCompanyResponse.flatMap(company => company.years.map(year => year.year)))];
          setUniqueYears(extractedYears);
          setYearMonth(yearMonthCompanyResponse);
  
          // Map Month Names to Short Names
          const monthShortNames = {
            "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
            "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
            "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
          };
  
          const allMonths = Object.values(monthShortNames);
  
          const formattedData = yearMonthCompanyResponse.flatMap(company =>
            company.years.flatMap(year => {
              const monthDataMap = new Map(year.monthly_document_counts.map(monthData => [
                monthShortNames[monthData.month] || monthData.month,
                monthData.document_count
              ]));
  
              return allMonths.map(shortMonth => ({
                company: company.organization_name,
                year: year.year,
                month: shortMonth,
                document_count: monthDataMap.get(shortMonth) || 0
              }));
            })
          );
  
          setChartData(formattedData);
        }
  
        // 🔹 Line Chart Data Processing
        if (lineDataResponse) {
          const companyTrends = lineDataResponse.map(ct => ({
            count: ct.count,
            month: ct.month,
            year: ct.year
          }));
  
          setData(companyTrends);
          const uniqueYears = [...new Set(companyTrends.map(ct => ct.year))];
          setSelectedYear(uniqueYears[0] || '2023');
  
          const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
          const filteredData = companyTrends.filter(ct => ct.year === selectedYear);
  
          const monthDataMap = filteredData.reduce((acc, curr) => {
            acc[curr.month] = curr.count;
            return acc;
          }, {});
  
          const finalCounts = allMonths.map(month => monthDataMap[month] || 0);
  
          setMonth(allMonths);
          setCount(finalCounts);
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllData();
  }, []);
  

 
  const fetchlineData = async () => {
    try {
      
      const response = await apiServices.getlinedata();
      console.log("Company Trends API Response:", response);

      if (response && response.length > 0) {
        const companyTrends = response.map(ct => ({
          count: ct.count,
          month: ct.month,
          year: ct.year,
        }));

        setData(companyTrends);

        // Extract unique years and set the first one as default
        const uniqueYears = [...new Set(companyTrends.map(ct => ct.year))];
        const defaultYear = uniqueYears[0] || '2023';
        setSelectedYear(defaultYear);

        // Ensure all months are present
        const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const extractedYears = [...new Set(response.flatMap(company => company.years.map(year => year.year)))];
setUniqueYears(extractedYears);
        // 🔹 Filter Data Based on Selected Company
        const filteredData = selectedCompany
        ? chartData.filter((item) => (
          item.company === selectedCompany  
          (!selectedYear || item.year === selectedYear) &&
        (!selectedCompany || item.company === selectedCompany))) // Show only fetched months
        : allMonths.map(month => ({
            month,
            document_count: 0, // Default to 0 if missing
          }));


 
 
        

        // Create a mapping of existing data
        const monthDataMap = filteredData.reduce((acc, curr) => {
          acc[curr.month] = curr.count;
          return acc;
        }, {});
        chartData.forEach(item => {
          const index = filteredData.findIndex(f => f.month === item.month);
          if (index !== -1) {
            filteredData[index].document_count += item.document_count; // Sum document counts
          }
        });
        if (!selectedCompany) {
          chartData.forEach(item => {
            const index = filteredData.findIndex(f => f.month === item.month);
            if (index !== -1) {
              filteredData[index].document_count += item.document_count; // Sum document counts
            }
          });
        }
        // Fill missing months with zero
        const finalCounts = allMonths.map(month => monthDataMap[month] || 0);

        setMonth(allMonths);
        setCount(finalCounts);

        console.log("Processed Company Trends:", finalCounts);
      }
    } catch (error) {
      console.error("Error fetching company trends:", error);
    }
  };

  
 

 




 
    const fetchData = async () => {
      try {
        const response = await apiServices.organizationCount();
        console.log("API Response:", response);
  
        if (response) {
          const dashboard = response.map(db => ({
            org_name: db.organization_name,
            username: db.organization_user,
            doc_count: db.total_files_all,
            doc_size: db.total_file_size_all,
            emp:db.total_employees

          }));
  
          setCompanyData(dashboard);  


        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    





  const openModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };



  // useEffect(() => {
  //   const newFetchData = async () => {
  //     try {
       
  
   
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   newFetchData();
  // }, []); 






  




  const fetchData1 = () => {
    if (!searchTerm.trim()) {
      // Reset to original OrgCount when search is empty
      const fetchData = async () => {
        try {
          const companyResponse = await apiServices.companyCount();
          const orgResponse = await apiServices.organizationCount();
          console.log("orgResponse",orgResponse)
          console.log("companyResponse",companyResponse)
          
  
          if (companyResponse) {
            setOrgCount({
              totalCompanies: companyResponse.organization_count || 0,
              activeCompanies: companyResponse.active_org_count || 0,
              inactiveCompanies: companyResponse.deleted_org_count || 0,
              clientAdmins: companyResponse.user_count || 0,
              totalDocuments: companyResponse.document_count || 0,
              approvedDocuments: companyResponse.approved_count || 0,
              pendingDocuments: companyResponse.pending_org_count  || 0,
              rejectedDocuments: companyResponse.rejected_count || 0,
              user_count: companyResponse.user_count || 0,
              deleted_org_count: companyResponse.deleted_org_count|| 0,
            });
          }
  
          if (orgResponse) {
            const dashboard = orgResponse.map(db => ({
              org_name: db.organization_name,
              username: db.organization_user,
              doc_count: db.total_files_all,
              doc_size: db.total_file_size_all,
              emp: db.total_employees // Assuming `emp > 0` means active
            }));
            setCompanyData(dashboard);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      // 🔹 Filter Company Data based on Search
      const filteredCompanies = companyData.filter(company =>
        company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // 🔹 Ensure `activeCompanies` updates correctly
      const totalCompanies = filteredCompanies.length;
      const activeCompanies = filteredCompanies.filter(c => c.emp > 0).length; // Now counts all active companies
      const inactiveCompanies = totalCompanies - activeCompanies;
  
      setOrgCount(prev => ({
        ...prev,
         activeCompanies,
        inactiveCompanies,
      }));
  
      setCompanyData(filteredCompanies);
    }
  };






  
  
  // Monitor companyData state updates
  
 
 
  // const handleRowLimitChange = (e) => {
  //   const value = e.target.value.trim() === "" ? 1 : parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value > 0) {
  //     setRowLimit(value);
  //   }
  // };
  const handleRowLimitChange = (e) => {
    const value = e.target.value.trim(); 
    if (value === "") {
      setRowLimit(companyData.length); // Show all rows if input is empty
      setRowLimit(""); // Show all rows if input is empty
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setRowLimit(parsedValue);
      }
    }
  };
  

  const sortAscending = () => {
    const sortedData = [...companyData].sort((a, b) => parseFloat(a.doc_size) - parseFloat(b.doc_size));
    setCompanyData(sortedData);
  };
  
  const sortDescending = () => {
    const sortedData = [...companyData].sort((a, b) => parseFloat(b.doc_size) - parseFloat(a.doc_size));
    setCompanyData(sortedData);
  };
  
  // Define titles for each role
  const roleTitles = {
    PRODUCT_OWNER: "Dashboard",
    PRODUCT_ADMIN: "Dashboard",
    ADMIN: "Dashboard",
    UPLOADER: "Uploader Dashboard",
    APPROVER: "Approver Dashboard",
    REVIEWER: "Reviewer Dashboard",
    VIEWER: "Viewer Dashboard",
  };
// // Calculate total documents to get percentages
const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;


ChartJS.register(ArcElement, Legend, ChartDataLabels);

const donutData = ({ OrgCount }) => {
  const totalDocs =
    OrgCount.approvedDocuments +
    OrgCount.pendingDocuments +
    OrgCount.rejectedDocuments;

  const donutData = {
    labels: [
      `Approved (${((OrgCount.approvedDocuments / totalDocs) * 100).toFixed(1)}%)`,
      `Pending (${((OrgCount.pendingDocuments / totalDocs) * 100).toFixed(1)}%)`,
      `Rejected (${((OrgCount.rejectedDocuments / totalDocs) * 100).toFixed(1)}%)`,
    ],
    datasets: [
      {
        data: [
          OrgCount.approvedDocuments,
          OrgCount.pendingDocuments,
          OrgCount.rejectedDocuments,
        ],
        backgroundColor: ["#077E8C", "#F7CB73", "#D9512C"],
        borderWidth: 3,
        cutout: "60%", // Adjust to control thickness
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right", // Keep legend on the right
        align: "center", // Align legend vertically in the middle
     
        labels: {
          usePointStyle: true, // Display legend as small circles
          boxWidth: 8, // Reduce dot size
          padding: 4, // Reduce spacing between legend items
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value, ctx) => {
          let totalDocs = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
          return `${percentage}%`;
        },
      },
    },
    layout: {
      padding: {
        // right: 250, // Adjust this value to bring legend closer
        align: "center", // Align legend vertically in the middle
        
        

       
      },
    },
  };
  
  

  return (
    <div className="w-[300px] mx-auto">
      <Doughnut data={donutData} options={chartOptions} />
    </div>
  );
};


  const fetchlineData1 = async () => {
    try {
      const response = await apiServices.getlinedata();
      console.log("Company Trends API Response:", response);

      if (response && response.length > 0) {
        const companyTrends = response.map(ct => ({
          count: ct.count,
          month: ct.month,
          year: ct.year,
        }));

        setData(companyTrends);
        console.log(companyData,"DDDDDDDDDDD")
        console.log(companyTrends,"TTTTTTTTTTTTT")

        // Extract unique years and set the first one as default
        const uniqueYears = [...new Set(companyTrends.map(ct => ct.year))];
        const defaultYear = uniqueYears[0] || '2023';
        setSelectedYear(defaultYear);

        // Ensure all months are present
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const filteredData = companyTrends.filter(ct => ct.year === defaultYear);

        // Create a mapping of existing data
        const monthDataMap = filteredData.reduce((acc, curr) => {
          acc[curr.month] = curr.count;
          return acc;
        }, {});

        // Fill missing months with zero
        const finalCounts = allMonths.map(month => monthDataMap[month] || 0);

        setMonth(allMonths);
        setCount(finalCounts);

        console.log("Processed Company Trends:", finalCounts);
      }
    } catch (error) {
      console.error("Error fetching company trends:", error);
    }
  };

 




const fileSizeChartData = companyData
  .filter(company => 
    company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.username.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map(company => ({
    name: company.org_name, // X-Axis: Company Name
    fileSize: parseFloat(company.doc_size) || 0, // Y-Axis: File Size (KB)
  }));
  const fileSizeLabels = companyData
  .filter(company => 
    company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.username.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map(company => company.org_name);  


  //currently workingggggggggggggg

  // useEffect(() => {
  //   // Generate data dynamically for all companies
  //   const data = companyData.flatMap((company) => generateRandomData(company));
  //   setChartData(data);
  // }, []);  
  //currenly workingggggggggggggggg
  


// Function to generate random data for months
// const generateRandomData = (company) => {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   return months.map((month) => ({
//     month,
//     fileSize: Math.random() * 5000, // Random doc size up to 5000 KB
//     company: company.org_name,
//     docCount: Math.floor(Math.random() * 20), // Random document count up to 20
//     year: 2025, // Fixed year for now
//   }));
// };


 


  // Check if the role should have the cards displayed
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);
 



    console.log(OrgCount,"HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

    console.log(companyData,"AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    const totalUsers = companyData
    .filter(company => 
      company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reduce((sum, company) => sum + (company.emp || 0), 0); // Summing `emp` values
  



    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",yearMonth)

    //YearMonthComapny

      async function FetchYearMonthCompany() {
        try {
          const response = await apiServices.MonthYearCompany();
          if (!response) {
            console.log("Error Occurred Getting Year Company");
            return;
          }
          console.log("YEARRRRRRRRRRRRRRRRRRRRRR", response);
    
          const extractedYears = [...new Set(response.flatMap(company => company.years.map(year => year.year)))];
          setUniqueYears(extractedYears);
    
          setYearMonth(response); // Store raw API response
    
          // Define mapping of full month names to short names
          const monthShortNames = {
            "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
            "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
            "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
          };
    
          // Define all 12 months in short form
          const allMonths = Object.values(monthShortNames);
    
          // 🔹 Transform API Data for Recharts Format
          const formattedData = response.flatMap(company =>
            company.years.flatMap(year => {
              // Create a mapping for existing month data with short names
              const monthDataMap = new Map(year.monthly_document_counts.map(monthData => [
                monthShortNames[monthData.month] || monthData.month, // Convert to short name if available
                monthData.document_count
              ]));
    
              // Ensure all 12 months are included
              return allMonths.map(shortMonth => ({
                company: company.organization_name,
                year: year.year,
                month: shortMonth,
                document_count: monthDataMap.get(shortMonth) || 0, // Use actual value if available, else 0
              }));
            })
          );
    
          setChartData(formattedData);
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      }
    
     

    
  
  

      const companyNames = [...new Set(companyData.map((item) => item.org_name))];
      // useEffect(() => {
      //   // Generate data dynamically for all companies
      //   const data = companyData.flatMap((company) => generateRandomData(company));
      //   setChartData(data);
      // }, []);
      const filteredCompanies = companyNames.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
        // 🔹 **Filter data based on Search Input**
        const filteredData = selectedCompany
        ? chartData.filter((item) => item.company === selectedCompany)
        : chartData.filter((item) => filteredCompanies.includes(item.company));
          

    
  return (
    <div className='dashboard-body boy bg'>
      <div className='dashboard-container' >
   

       {/* <Dashboard title="Visionboard" />*/}
        <h2 className='dashboard-h2'>Welcome, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} </h2>



    {(role === 'PRODUCT_OWNER' || role === 'PRODUCT_ADMIN') && (
      <>
            <div className="cards-container bg">
              
           
            <Card title="Total Companies" value={OrgCount.totalCompanies} icon={<HiBuildingOffice2 />} />
      <Card title="Active Companies" value={OrgCount.activeCompanies} icon={<HiBuildingOffice2 style={{ color: "green" }} />} />
      <Card title="Inactive Companies" value={OrgCount.inactiveCompanies} icon={<HiBuildingOffice2 style={{ color: "#b22d2d" }} />} />
<Card title="Deleted Companies" value={OrgCount.deletedCompanies} icon={<FaBuildingCircleXmark style={{ color: "red" }} />} />
      <Card title="Pending Documents" value={OrgCount.pending_org_count} icon={<FaBuildingCircleExclamation style={{ color: "yellow" }} />} />
      <Card title="Users" value={OrgCount.user_count} icon={<IoPeople />} />
            </div>








            
              
            <div className="charts-container bg">

            {data.map}
              <div className="chart">
              <p className='dashboard_text'><center>File Size Trends</center></p>
              <center>
 

              <div className="slicer">
  {/* Year Selector Dropdown */}
  <div className="dropdown-container">
     <select 
      className="dashboard-year-select"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="">All Years</option>
      {uniqueYears.map((year, index) => (
        <option key={index} value={year}>{year}</option>
      ))}
    </select>
  </div>

  {/* Company Selector Dropdown */}
  <div className="dropdown-container">
     <select 
      className="company-dropdown"
      value={selectedCompany}
      onChange={(e) => setSelectedCompany(e.target.value)}
    >
      <option value="">All Companies</option>
      {companyData.map((company, index) => (
        <option key={index} value={company.org_name}>
          {company.org_name}
        </option>
      ))}
    </select>
  </div>
</div>





                </center>


 <div className="chart">
  

 {filteredData.length > 0 ? (
  <ResponsiveContainer width="100%" height={250} className="abi">
  <AreaChart data={filteredData}>
    {/* Soft grid lines for better readability */}
    <CartesianGrid stroke="rgba(200, 200, 200, 0.3)" strokeDasharray="4 4" />

    {/* Modernized X & Y Axes */}
    <XAxis
      dataKey="month"
      tick={{
        fontSize: 13,
        fontWeight: "600",
        fill: "#4a4a4a",
      }}
      axisLine={{ stroke: "#ccc" }} // Soft axis line
      tickLine={false} // Hide tick lines for a cleaner look
    />

    <YAxis
      tick={{
        fontSize: 12,
        fontWeight: "600",
        fill: "#4a4a4a",
      }}
      axisLine={{ stroke: "#ccc" }}
      tickLine={false}
    />

    {/* Stylish Tooltip with a shadow effect */}
    <Tooltip
      content={<CustomTooltip />}
      wrapperStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "8px",
      }}
    />

    {/* Smooth and gradient-filled Area */}
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#007bff" stopOpacity={0.6} />
        <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
      </linearGradient>
    </defs>

    <Area
      type="monotone"
      dataKey="document_count"
      stroke="#007bff"
      strokeWidth={2}
      fill="url(#colorUv)"
      fillOpacity={0.7}
    />
  </AreaChart>
</ResponsiveContainer>

    ) : (
      // Show a simple line if no relevant data found
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={[
          { month: "Jan", document_count: 0 },
          { month: "Feb", document_count: 0 },
          { month: "Mar", document_count: 0 },
          { month: "Apr", document_count: 0 },
          { month: "May", document_count: 0 },
          { month: "Jun", document_count: 0 },
          { month: "Jul", document_count: 0 },
          { month: "Aug", document_count: 0 },
          { month: "Sep", document_count: 0 },
          { month: "Oct", document_count: 0 },
          { month: "Nov", document_count: 0 },
          { month: "Dec", document_count: 0 },
        ]}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
          <YAxis tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
          <Tooltip />
          <Area type="monotone" dataKey="document_count" stroke="gray" fill="lightgray" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    )}
      
      </div>
              </div>









              <div className="chart">
                <p className='dashboard_text'><center>Company File Size</center></p>
                <div className='dashboard-btngrp'>
                  
  <button className='dashboard-top' onClick={sortAscending}>
    <FaArrowUp />
  </button>
  <button className='dashboard-bottom' onClick={sortDescending}>
    <FaArrowDown />
  </button>
  <input 
    type='number' 
    value={rowLimit} 
    className='dashboard_num-input' 
    onChange={handleRowLimitChange}
  />
    
</div>

<div className="search-container" style={{ position: "relative", display: "inline-block",zIndex:"999",top:"-55px" }}>
      {!isFocused && !searchTerm ? (
        <FaSearch
          className="search-icon"
          style={{
            fontSize: "18px",
            color: "#888",
            cursor: "pointer",
            position: "absolute",
 
            transform: "translateY(-50%)",
          }}
          onClick={() => setIsFocused(true)}
        />
      ) : (
        <input
        type="text"
        placeholder="Search Company..."
        className="dashboard-search"
        value={searchTerm}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          if (!searchTerm) setIsFocused(false);
        }}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: isFocused ? "180px" : "60px", // Expands when focused
          height: "20px",
          border: "none",
          borderBottom: "1px solid #ccc", // Single-line effect
          background: "transparent",
          outlineColor: "none",
          fontSize: "14px",
          transition: "width 0.3s ease-in-out",
        }}
      />
      )}
    </div>

                
                <div className='dashboard-table-container' style={{ maxHeight: '250px', overflowY: rowLimit > 5 ? 'scroll' : 'auto', position: "relative", bottom: "25px"}}>




                {isLoading ? (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
  </div>
) : (() => {
  // Apply filtering first
  const filteredData = companyData.filter(
    (company) =>
      company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filteredData.length > 0 ? (
    <table className="dashboard_table">
      <thead className="dashboard_thead">
        <tr>
          <th className="dashboard-table-th">Company Name</th>
          <th className="dashboard-table-th">Username</th>
          <th className="dashboard-table-th">Doc Count</th>
          <th className="dashboard-table-th">File Size (KB)</th>
          <th className="dashboard-table-th">Users</th>
        </tr>
      </thead>
      <tbody className="dashboard-tbody">
        {filteredData
          .slice(0, rowLimit === "" ? filteredData.length : rowLimit)
          .map((company, index) => (
            <tr
              key={index}
              className="dashboard-table-row hover:bg-gray-50 cursor-pointer"
              onClick={() => openModal(company)}
            >
              <td className="dashboard-table-td">{company.org_name}</td>
              <td className="dashboard-table-td">{company.username}</td>
              <td className="dashboard-table-td">{company.doc_count}</td>
              <td className="dashboard-table-td">{company.doc_size}</td>
              <td className="dashboard-table-td">{company.emp}</td>
            </tr>
          ))}
      </tbody>
    </table>
  ) : (
    <p style={{ textAlign: "center", fontSize: "16px", color: "red" }}>No data found</p>
  );
})()}








                {isModalOpen && selectedCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Company Details</h2>
            <p><strong>Company Name:</strong> {selectedCompany.org_name}</p>
            <p><strong>Username:</strong> {selectedCompany.username}</p>
            <p><strong>Document Count:</strong> {selectedCompany.doc_count}</p>
            <p><strong>File Size:</strong> {selectedCompany.doc_size} KB</p>
            <p><strong>Users:</strong> {selectedCompany.emp}</p>
            <button className="modal-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

                </div>
</div>

            </div>
            



















          </>
        )}

        {(isAdminOrDocumentRole) && (
          <>
            <div className="cards-container1">
              <Card title="Total Documents" value={OrgCount.totalDocuments} icon={<IoMdCloudUpload />} role={role} bgColor={'#d2eafd'}  />
              <Card title="Approved Documents" value={OrgCount.approvedDocuments} icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} bgColor={'#AFE1AF'}/>
              <Card title="Pending Documents" value={OrgCount.pendingDocuments} icon={<MdPending style={{ color: '#dd651b' }} />} role={role} bgColor={'#fff3d0'}/>
              <Card title="Rejected Documents" value={OrgCount.rejectedDocuments} icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} bgColor={'#ffe5d6'} />
            </div>
            {role === 'ADMIN' && (
              <div className="chart">
                {donutData({ OrgCount })}

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};



const Card = ({ title, value = 1, icon, role, bgColor }) => {
  const cardStyle = {
    backgroundColor: ['ADMIN', 'UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? bgColor : "",
    marginTop: ['UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? "10%" : "",
  };
  
  

  return (
    <div className="card " style={cardStyle}>
      <div className="card-title">
        <div className="card-icon">{icon}</div>
        <div className="card-info">
          <h2>{title}</h2>
          <p>{value ?? 0}</p> {/* Ensures value is always displayed */}
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;


  //   )
  //   .map(company => ({
  //     name: company.org_name, // X-Axis: Company Name
  //     fileSize: parseFloat(company.doc_size) || 0, // Y-Axis: File Size (KB)
  //   }));
  //   const fileSizeLabels = companyData
  //   .filter(company => 
  //     company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //     company.username.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .map(company => company.org_name);  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* {filteredCompanies.map((company) => (
    <Card key={company.id} className="shadow-md">
      <CardContent>
        <h3 className="text-lg font-semibold">{company.name}</h3>
        <p>Status: {company.isActive ? "Active" : "Inactive"}</p>
        <p>File Size: {company.fileSize} MB</p>
      </CardContent>
    </Card>
  ))} */}
</div>
  // const fileSizeChartData = companyData
  //   .filter(company => 
  //     company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //     company.username.toLowerCase().includes(searchTerm.toLowerCase())
    


// import { margin } from '@mui/system';
// import { Bar, Pie } from 'react-chartjs-2';
// import { Chart as  Tooltip, Legend } from "chart.js";
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import donutData from './donutData';

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div style={{
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         borderRadius: "8px",
//         padding: "10px",
//         border: "1px solid #ccc",
//         boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
//         transition: "all 0.3s ease-in-out",
//         fontSize: "14px",
//         fontWeight: "bold",
//         color: "#333",
//       }}>
//         <p>{payload[0].payload.name}</p>
//         <p style={{ color: "#007bff" }}>File Size: {payload[0].value} KB</p>
//       </div>
//     );
//   }
//   return null;
// };


  // const lineData = {
  //   labels: fileSizeLabels, // X-axis labels (company names)
  //   datasets: [
  //     {
  //       label: `File Size (KB)`,
  //       data: fileSizeData,
  //       borderColor: '#007bff', // Modern blue color
  //       borderWidth: 3,
  //       backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue area fill
  //       fill: true, // Adds area shading
  //       tension: 0.4, // Smoother curve
  //       pointBackgroundColor: '#0056b3', // Darker blue points
  //       pointRadius: 6, // Larger points for better visibility
  //       pointHoverRadius: 8, // Bigger points on hover
  //       pointBorderColor: "#fff", // White border for contrast
  //     },
  //   ],
  // };




// const lineData = {
//   labels: month, // Ensures all 12 months are listed
//   datasets: [
//     {
//       label: `Growth Rate (${selectedYear})`,
//       data: count, // Includes counts for all months, missing ones filled with 0
//       borderColor: '#1661a9',
//       borderWidth: 2,
//       tension: 0.4,
//       pointBackgroundColor: '#0d6abf',
//       pointRadius: 3,
//     },
//   ],
// };


// const chartOptions = {
//   responsive: true,
//   scales: {
//     y: {
//       ticks: {
//         callback: function (value) {
//           return Math.round(value); // Ensures only integer values are displayed
//         },
//         precision: 0, // Forces the display of whole numbers only
//       },
//     },
//   },
//   plugins: {
//     legend: { display: false },
//     tooltip: { backgroundColor: '#333', titleColor: '#fff' },
//   },
// };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: { display: false },
  //     tooltip: { backgroundColor: '#333', titleColor: '#fff' },
  //   },
    
  // };
  // const handleYearChange = (e) => {
  //   const year = e.target.value;
  //   setSelectedYear(year);
  
  //   const filteredData = data.filter(ct => ct.year === year);
  
  //   const monthDataMap = filteredData.reduce((acc, curr) => {
  //     acc[curr.month] = curr.count;
  //     return acc;
  //   }, {});
  
  //   const finalCounts = [
  //     "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //   ].map(month => monthDataMap[month] || 0);
  
  //   setMonth([
  //     "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //   ]);
  //   setCount(finalCounts);
  // };
  
  // Extract unique company names for the dropdown

  // Filter data based on the selected company
  // const filteredData = selectedCompany
  //   ? chartData.filter((item) => item.company === selectedCompany)
  //   : chartData;

//   const data1 = [
//   { name: "Jan", fileSize: 100 },
//   { name: "Feb", fileSize: 120 },
//   { name: "Mar", fileSize: 90 },
//   { name: "Apr", fileSize: 110 },
//   { name: "Jan", fileSize: 100 },
//   { name: "Feb", fileSize: 120 },
//   { name: "Mar", fileSize: 90 },
//   { name: "Apr", fileSize: 110 },
//   { name: "Jan", fileSize: 100 },
//   { name: "Feb", fileSize: 120 },
//   { name: "Mar", fileSize: 90 },
//   { name: "Apr", fileSize: 110 },
// ];
     {/* <select className="dashboard-year-select" value={selectedYear} onChange={handleYearChange}>
                    
  {[...new Set(data.map(ct => ct.year))].map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select> */}
                {/* <div className="filter-container">
        <label>Select Company:</label>
        <select className="company-dropdown" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="">All Companies</option>
          {companyNames.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div> */}


      // // Ensure no division by zero
// const approvedPercentage = totalDocs ? ((OrgCount.approvedDocuments / totalDocs) * 100).toFixed(1) : 0;
// const pendingPercentage = totalDocs ? ((OrgCount.pendingDocuments / totalDocs) * 100).toFixed(1) : 0;
// const rejectedPercentage = totalDocs ? ((OrgCount.rejectedDocuments / totalDocs) * 100).toFixed(1) : 0;

// const donutData = {
//   labels: [
//     `Approved (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Pending (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Rejected (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     // `Pending (${pendingPercentage}%)`,
//     // `Rejected (${rejectedPercentage}%)`
//   ],
//   datasets: [
//     {
//       data: [OrgCount.approvedDocuments, OrgCount.pendingDocuments, OrgCount.rejectedDocuments],
//       backgroundColor: ['#077E8C', '#F7CB73', '#D9512C'],
//       borderWidth: 3,
//       cutout: '',
//     },
//   ],
// };
//   // 🟠 Doughnut Chart (Total Uploads)
//   const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;
 


// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: true,
//       position: "top", // Moves legend to top
//       labels: {
//         font: {
//           size: 14,
//           weight: "bold",
//         },
//       },
//     },
//     tooltip: {
//       backgroundColor: "rgba(0,0,0,0.8)",
//       titleFont: { size: 14 },
//       bodyFont: { size: 12 },
//       cornerRadius: 6,
//       padding: 10,
//     },
//   },
//   scales: {
//     x: {
//       grid: {
//         display: false, // Removes extra grid lines
//       },
//       ticks: {
//         color: "#333",
//         font: { size: 12, weight: "bold" },
//       },
//     },
//     y: {
//       grid: {
//         color: "rgba(200, 200, 200, 0.3)", // Softer gridlines
//         borderDash: [5, 5], // Dashed lines for better design
//       },
//       ticks: {
//         color: "#333",
       
//         font: { size: 12, weight: "bold" },
//         callback: (value) => `${value} KB`, // Adds "KB" unit to values
//       },
//     },
//   },
// };

// const donutData = {
  
//   labels: [
//     `Approved (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Pending (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Rejected (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     // `Pending (${pendingPercentage}%)`,
//     // `Rejected (${rejectedPercentage}%)`
//   ],
//   datasets: [
//     {
      
//       data: [OrgCount.approvedDocuments, OrgCount.pendingDocuments, OrgCount.rejectedDocuments],
//       backgroundColor: ['#077E8C', '#F7CB73', '#D9512C'],
//       borderWidth: 3,
//       cutout: '',
//     },
//   ],
// };
// // 🟠 Doughnut Chart (Total Uploads)
// const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;

// const chartOptions = {
  
//   responsive: true,
//   plugins: {
//     legend: { display: true },
//     datalabels: {
//       color: "#fff",
//       font: { weight: "bold", size: 14 },
//       formatter: (value, ctx) => {
//         let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
//         return `${percentage}%`; // Show percentage inside chart
//       },
//     },
//   },
// };

 // 🔵 Line Chart (Growth Rate)
  
//   useEffect(() => {
//   const fetchlineData = async () => {
//     try {
//       const response = await apiServices.getlinedata();
//       console.log("company Trends:", response);
//       if(response) {
//         const companytrends = response.map(ct => ({
//           count: ct.count,
//           month: ct.month,
//           year:  ct.year,
//         }));
//         setData(response)
//         setSelectedYear(companytrends.map(ct =>ct.year));
//         setCount(companytrends.map(ct => ct.count));
//         setMonth(companytrends.map(ct => ct.month));
//         console.log("Company Trends:", companytrends);
//         console.log("selectedYear:", selectedYear);
//         console.log("count:", count);
//         console.log("month:", month);
//         console.log("response:", response);
//       }
//     } 

//     catch {

//     } finally {

//     }

//   };
//   fetchlineData();
// })

  // Filter data based on selected company
  // const filteredData = selectedCompany
  //   ? data.filter((item) => item.company === selectedCompany)
  //   : data;


          // useEffect(() => {
        //   // Generate data dynamically for all companies
        //   const data = companyData.flatMap((company) => generateRandomData(company));
        //   setChartData(data);
        // }, []);  