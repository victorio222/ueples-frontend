import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserTables from "./pages/UserManagement/Users";
import UploadAttachment from "./pages/UploadDocuments/Attachments";
import FormFolder from "./pages/Form137/FormFolder";
import ArchiveTables from "./pages/Archive/ArchiveForm";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGateway from "./components/common/RoleGateway";
import PublicRoute from "./components/common/PublicRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<RoleGateway allowedRoles={["Admin", "Secretary", "Principal"]} />}>
                <Route path="/users" element={<UserTables />} />
              </Route>

              <Route index path="/" element={<Home />} />
              <Route path="/upload-documents" element={<UploadAttachment />} />
              <Route path="/form-137" element={<FormFolder />} />
              <Route path="/archive/:year" element={<ArchiveTables />} />
              <Route path="/profile" element={<UserProfiles />} />

              {/* Others Page */}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          {/* <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}

          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

// <Routes>
//   <Route element={<ProtectedRoute />}>
//     <Route element={<AppLayout />}>
//       {/* Routes accessible by ANY logged-in user */}
//       <Route index path="/" element={<Home />} />
//       <Route path="/profile" element={<UserProfiles />} />

//       {/* ADMIN ONLY ROUTES */}
//       <Route element={<RoleGateway allowedRoles={["Admin"]} />}>
//         <Route path="/users" element={<UserTables />} />
//         <Route path="/archive/:year" element={<ArchiveTables />} />
//       </Route>

//       {/* STAFF & ADMIN ROUTES */}
//       <Route element={<RoleGateway allowedRoles={["Admin", "Staff"]} />}>
//         <Route path="/upload-documents" element={<UploadAttachment />} />
//       </Route>

//       {/* Common UI Elements */}
//       <Route path="/buttons" element={<Buttons />} />
//     </Route>
//   </Route>

//   <Route path="/signin" element={<SignIn />} />
// </Routes>

// // Inside Sidebar.tsx
// const userRole = localStorage.getItem("user_role");

// return (
//   <nav>
//     <Link to="/">Dashboard</Link>

//     {userRole === "Admin" && (
//       <Link to="/users">User Management</Link>
//     )}
//   </nav>
// )
