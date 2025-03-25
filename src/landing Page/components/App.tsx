import React, { useEffect } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Leadership from "./leadership";
import FAQ from "./FAQ";
import Footer from "./Footer";
import AppAppBar from "./AppAppBar";

const App = () => {
  useEffect(() => {
    console.log("Sections Rendered!"); // Debugging
  }, []);

  return (
    <div>
      <AppAppBar /> {/* Navbar Component */}

      {/* Add top padding so that sections are not hidden under fixed navbar */}
      <div style={{ paddingTop: "100px" }} id="home"><Hero /></div>
<div style={{ paddingTop: "100px" }} id="know"><Features /></div>
<div style={{ paddingTop: "100px" }} id="test"><Testimonials /></div>
<div style={{ paddingTop: "100px" }} id="leader"><Leadership /></div>
<div style={{ paddingTop: "100px" }} id="faq"><FAQ /></div>
<div style={{ paddingTop: "100px" }} id="contact"><Footer /></div>

    </div>
  );
};

export default App;
