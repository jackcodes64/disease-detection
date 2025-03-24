import { useState } from "react";
import "./App.css";
import Market from "./market.jsx";
import DiseasePrevalenceData from "./prevelance.jsx";
import Action from "./Action.jsx";
import Deadlines from "./Deadline.jsx";
import Progress from "./Progress.jsx"
import { Notification } from "@progress/kendo-react-notification";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Input } from "@progress/kendo-react-inputs";
import { Form, Field } from "@progress/kendo-react-form";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import { useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { askGPT } from "./gptAPI";
import "@progress/kendo-theme-default/dist/all.css";

const handleAskGPT = async () => {
  const response = await askGPT("What is the best remedy for maize rust?");
  console.log(response);
};
handleAskGPT();

const SignUpIcon = () => <span role="img" aria-label="sign-up"> 👤  </span>;
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Diagnose");
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState("Market");

  return (

    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
      <h2 className="sidebar-title"> 🌿 Farmers' Stethoscope</h2>
        <nav>
          <ul>
            <li onClick={() => setActiveTab("Diagnose")}>Diagnose</li>
            <li onClick={() => setActiveTab("Profile")}>Profile</li>
            
          <li onClick={() => setIsStatsOpen(!isStatsOpen)} className="dropdown">
            Statistics {isStatsOpen ? <FaAngleUp /> : <FaAngleDown />}
          </li>
          {isStatsOpen && (
            <ul className="sub-menu">
              <li onClick={(e) => { e.stopPropagation();
                              setSelectedStat("Market");
                              
                              setActiveTab("Market");}}>📈 Market</li>
              <li onClick={(e) => {e.stopPropagation()
                               setSelectedStat("Disease Prevalence");
                              setActiveTab("Disease Prevalence");}}>🦠 Disease Prevalence</li>
            </ul>
          )} 
            <li  onClick={() => setActiveTab("Progress")} >Progress</li>

                  {/* Insight Dropdown */}
          <li onClick={() => setIsInsightOpen(!isInsightOpen)} className="dropdown">
            Insight {isInsightOpen ? <FaAngleUp /> : <FaAngleDown />}
          </li>
          {isInsightOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveTab("Action")}> Action</li>
              <li onClick={() => setActiveTab("Deadlines")}>Deadlines</li>               
            </ul>
          )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        <header className="top-bar">
        <Button className="signup-button">
            <SignUpIcon className="signup-icon" /> Sign Up
          </Button>
           <ThemeToggle></ThemeToggle>
        </header>
      
        <section>
          {activeTab === "Diagnose" && <Diagnose />}
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Market" && <Market />}
          {activeTab === "Disease Prevalence" && <DiseasePrevalenceData />}
          {activeTab === "Progress" && <Progress />}
          {activeTab === "Action" && <Action />}
          {activeTab === "Deadlines" && <Deadlines />}        
        </section>
      </main>
    </div>
  );
};

function ImageUploadNotification() {
  const [showNotification, setShowNotification] = useState(false);

  const handleUploadReminder = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Auto-dismiss after 3 seconds
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Button themeColor="primary" onClick={handleUploadReminder}>
        Upload Image
      </Button>

      {showNotification && (
        <Notification
          type={{ style: "warning", icon: true }}
          closable={true}
          onClose={() => setShowNotification(false)}
        >
          Please upload an image for AI analysis!
        </Notification>
      )}
    </div>
  );
}

/* Diagnosis Component */
const Diagnose = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return ImageUploadNotification();
    
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      setLoading(true);

      try {
        const response = await fetch("https://susya.onrender.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="diagnosis-container">
      <div className="diagnosis-card">
        <h1>Farmers' Lab</h1>

        <Label className="upload-box">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          <span>Upload Image</span>
        </Label>

        {preview && <img src={preview} alt="Preview" className="diagnosis-image" />}

        <div className="button-group">
          <Button className="scan-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Diagnosing..." : " Diagnose"}
          </Button>
        </div>

        {result && (
          <div className="result-box">
            <p><strong>🌱 Crop:</strong> {result.plant}</p>
            <p><strong>⚠️ Disease:</strong> {result.disease}</p>
            <p><strong>💡 Remedy:</strong> {result.remedy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* Profile Component */
const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    country: "",
    acreage: "",
    crops: "",
    soilType: "",
    experience: "",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  return (
    <div className="profile-container">
      <h2 className="profileh2">🌾 Profile</h2>
      <form className="profile-form">
        <Input name="name" value={profile.name} onChange={handleChange} placeholder="👤 Full Name" />
        <Input name="country" value={profile.country} onChange={handleChange} placeholder="🌍 Country" />
        <Input name="acreage" value={profile.acreage} onChange={handleChange} placeholder="📏 Farm Size (acres)" />
        <Input name="crops" value={profile.crops} onChange={handleChange} placeholder="🌱 Crops Grown" />

        <DropDownList
          name="soilType"
          data={["Loamy", "Clay", "Sandy", "Silty", "Peaty", "Chalky"]}
          defaultValue={profile.soilType || ""}
          onChange={handleChange}
          placeholder="🛤 Soil Type"
        />

        <DropDownList
          name="experience"
          data={["Beginner", "Intermediate", "Advanced"]}
          defaultValue={profile.experience|| ""}
          onChange={handleChange}
          placeholder="⏳ Farming Experience"
        />
        <Button> Save Profile </Button>
      </form>
      
    </div>
  );
};

const Statistics = () => {
  const [selectedStat, setSelectedStat] = useState("Market");

  return (
    <div className="statistics-container">
      <h2>Statistics</h2>
      <DropDownList
        data={["Market", "Disease Prevalence"]}
        value={selectedStat}
        onChange={(e) => setSelectedStat(e.value)}
        placeholder="📊 Select Data"
      />

      <div className="statistics-content">
        {selectedStat === "Market" && <MarketData />}
        {selectedStat === "Disease Prevalence" && <DiseasePrevalenceData />}
      </div>
    </div>
  );
};

localStorage.setItem("diseases", JSON.stringify([
  { name: "Blight", prevalence: 40 },
  { name: "Rust", prevalence: 25 },
  { name: "Mosaic Virus", prevalence: 10 }
]));

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <Button onClick={toggleTheme}>
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
}


export default Dashboard;
