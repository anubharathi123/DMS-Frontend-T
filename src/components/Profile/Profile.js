import React from "react";
import "./Profile.css";
import avatar from "../../assets/images/candidate-profile.png";

function ProfileCard(props) {
	return (
		<div className="card-container">
			<header className="profile-header">
				<img className="profile_img" src={avatar} alt={props.name} />
			</header>
			<h1 className="bold-text">
				{props.name}
			</h1>
			<h2 className="normal-text">Role: Compiler</h2>
			<h2 className="normal-text">Mail ID: rita.correia1233@gmail.com</h2>
			<h2 className="normal-text">Mobile: 9877685436</h2>
			</div>
	);
}

export default ProfileCard;