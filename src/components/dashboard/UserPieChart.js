import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const UserPieChart = ({ userCount, isAdminOrDocumentRole }) => {
  const data = isAdminOrDocumentRole
    ? [
        { name: "Users", value: userCount },
        { name: "Others", value: 4 },
      ]
    : [
        { name: "Users", value: userCount },
        { name: "Others", value: 100 },
      ];

  const COLORS = ["#007bff", "#ffc107"]; // Blue, Yellow

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10; // slightly smaller for compact look
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
  <text
  x={isAdminOrDocumentRole ? x + 13 : x}
  y={isAdminOrDocumentRole ? y + 11 : y}
  fill="#000"
  textAnchor="middle"
  dominantBaseline="central"
  fontSize="11"
  fontWeight="bold"
>
  {data[index].value}
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
>        <PieChart>
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
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {entry.name}
              {entry.name === "Users" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>↑</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>↓</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPieChart;
