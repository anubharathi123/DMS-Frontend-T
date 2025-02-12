import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./clientpage.css";

const ClientPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const client = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    role: "Client Manager",
  };

  const users = [
    { name: "Alice Johnson", role: "Developer" },
    { name: "Bob Smith", role: "Designer" },
    { name: "Charlie Adams", role: "Manager" },
    { name: "David Clark", role: "Engineer" },
    { name: "Emma Wilson", role: "Analyst" },
    { name: "Frank Thomas", role: "Support" }
  ];

  const data = users.map(user => ({ name: user.name, files: Math.floor(Math.random() * 10) + 1 }));

  const handleActionClick = (index) => {
    setSelectedUser(selectedUser === index ? null : index);
  };

  const handleEdit = (user) => {
    alert(`Editing user: ${user.name}`);
  };

  const handleDelete = (user) => {
    alert(`Deleting user: ${user.name}`);
  };

  return (
    <div className="container">
      {/* Sidebar (Left) */}
      <div className="sidebar">
        <div className="bar-chart-container">
          <h2>File Uploads</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="files" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content (Right) */}
      <div className="main-content">
        {/* Client Card */}
        <div className="client-card-container">
          <div className="client-card-container">
  <div className="welcome-section">
    <h2>👋 Welcome Vdart</h2>
  </div>
  <div className="client-card">
    <h2> Client</h2>
    <p><strong>Name:</strong> {client.name}</p>
    <p><strong>Email:</strong> {client.email}</p>
    <p><strong>Phone:</strong> {client.phone}</p>
    <p><strong>Role:</strong> {client.role}</p>
  </div>
</div>

        </div>

        {/* Users Table */}
        <div className="users-table">
          <h2> Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="action-container">
                      <button className="more-btn" onClick={() => handleActionClick(index)}>
                        <MoreVertical size={18} />
                      </button>
                      {selectedUser === index && (
                        <div className="tablet-menu">
                          <button onClick={() => handleEdit(user)}>Edit</button>
                          <button onClick={() => handleDelete(user)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
