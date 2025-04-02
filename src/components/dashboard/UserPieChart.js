import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const UserPieChart = ({ userCount, enquiryCount, msiCount, uploadCount,reviewerCount, viewerCount, isAdminOrDocumentRole }) => {
  const data = isAdminOrDocumentRole
    ? [
        { name: "Uploader", value: uploadCount },
        { name: "Reviewer", value: reviewerCount }, // New cell
        { name: "Viewer", value: viewerCount }, // New cell
      ]
    : [
        { name: "Users", value: userCount },
        { name: "Enquiry", value: enquiryCount }, // New cell
        { name: "MSI", value: msiCount }, // New cell
      ];

      const COLORS = ["#007bff", "#ffc107", "#32a891"]; // Added new colors

  const renderCustomizedLabel = ({
    cx,
    cy,
    cz,
    midAngle,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 13; // slightly smaller for compact look
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const z = cz + radius * Math.sin(-midAngle * RADIAN);
 
    //  const textColors = ["#007bff", "#ffc107", "#32a891"]; // Colors for each count

    return (
      <text
        x={isAdminOrDocumentRole ? x + 9 : x}
        y={isAdminOrDocumentRole ? y + 12 : y}
        z={isAdminOrDocumentRole ? z + 11 : z}
        //  fill={textColors[index % textColors.length]} // Apply color based on index
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="bold"
      >
        {/* {data[index].value} */}
      </text>
    );
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(244, 241, 242) 0%, rgb(245, 245, 245) 100%)",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "220px",
        margin: isAdminOrDocumentRole ? "-185px 130px 20px 40px" : "auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      <h3
        style={{
          marginBottom: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#007bff",
        }}
      >
        {isAdminOrDocumentRole ? "Individual Users" : "Users Overview"}
      </h3>

      <ResponsiveContainer
        width="100%"
        height={isAdminOrDocumentRole ? 90 : 100}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={40}
            innerRadius={28}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "6px",
          gap: "10px",
        }}
      >
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: COLORS[index],
                borderRadius: "50%",
                marginRight: "5px",
              }}
            />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: COLORS[index], // Apply color based on the index
                fontWeight: "bold",
              }}
            >
              {entry.name}
              <span style={{ color: COLORS[index] }}>
                :{data[index].value}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPieChart;
