import React, { useState } from "react";
import "./AnnouncementCreation.css";

const AnnouncementCreation = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    content: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Announcement Created:", formData);
    alert("Announcement Created Successfully!");
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      date: "",
      content: "",
      endTime: "",
    });
  };

  return (
    <div className="announcement-creation-container-body">
    <div className="announcement-creation-container">
      <h2 className="announcement-creation-announcement_title">Create Announcement</h2>
      <form className="announcement-creation-form" onSubmit={handleSubmit}>
        <label className="announcement-creation-announcement_title-label">Title:</label>
        <input
          type="text"
          name="title"
          className="AnnouncementCreation-title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Date:</label>
        <input
          type="date"
          name="date"
          className="AnnouncementCreation-Date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <label>Content:</label>
        <textarea
          name="content"
          className="AnnouncementCreation-content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <label>End Time:</label>
        <input
          type="date"
          name="endTime"
          className="AnnouncementCreation-EndTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
        <div>
          <button type="submit">Create Announcement</button>
          <button className="anouncement-cancelbtn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AnnouncementCreation;