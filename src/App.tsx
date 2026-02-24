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
import UploadAttachment from "./pages/UploadDocuments/Attachment";
import FormFolder from "./pages/Form137/FormFolder";
import ArchiveTables from "./pages/Archive/ArchiveForm";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGateway from "./components/common/RoleGateway";
import PublicRoute from "./components/common/PublicRoute";
import Import from "./pages/ImportData/Import";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import api from "./utils/axiousInstance";
import DocTypeFolder from "./pages/DocumentType/DocType";
import StudentList from "./pages/StudentsProfile/StudentList";
import RegisterStudentProfile from "./pages/StudentsProfile/RegisterProfile";
import FacultyList from "./pages/FacultyProfile/FacultyList";
import RegisterFacultyProfile from "./pages/FacultyProfile/RegisterProfile";

export default function App() {
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      // Check if localStorage thinks we are logged in
      const localRole = localStorage.getItem("user_role");
      
      if (localRole) {
        try {
          // Verify with the server using the HttpOnly cookie
          await api.get("/auth/me");
          // If this succeeds, the cookie is still there (browser wasn't closed)
        } catch (err) {
          // If this fails (401), the browser was closed and cookie is gone
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_id");
        }
      }
      setIsVerifying(false);
    };

    verifySession();
  }, []);

  // Prevent "flicker" while checking the session
  if (isVerifying) {
    return <div className="flex h-screen items-center justify-center">Loading Session...</div>;
  }
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />
      <Router>
        <Helmet
          defaultTitle="UEP - Student Records"
          titleTemplate="%s | UEP - Student Records"
        />
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                element={
                  <RoleGateway
                    allowedRoles={["Admin", "Secretary", "Principal"]}
                  />
                }
              >
                <Route path="/users" element={<UserTables />} />
              </Route>

              <Route index path="/" element={<Home />} />
              <Route path="/upload-documents" element={<UploadAttachment />} />
              <Route path="/documents" element={<FormFolder />} />
              <Route path="/document-types" element={<DocTypeFolder />} />
              <Route path="/archive/:year" element={<ArchiveTables />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/import-data" element={<Import />} />
              
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/register" element={<RegisterStudentProfile />} />
              
              <Route path="/faculty" element={<FacultyList />} />
              <Route path="/faculty/register" element={<RegisterFacultyProfile />} />

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
