// // import { useState } from "react";
// // import { Link } from "react-router";
// // import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// // import Label from "../form/Label";
// // import Input from "../form/input/InputField";
// // import Checkbox from "../form/input/Checkbox";

// // export default function SignUpForm() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [isChecked, setIsChecked] = useState(false);
// //   return (
// //     <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
// //       <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
// //         <Link
// //           to="/"
// //           className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
// //         >
// //           <ChevronLeftIcon className="size-5" />
// //           Back to dashboard
// //         </Link>
// //       </div>
// //       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
// //         <div>
// //           <div className="mb-5 sm:mb-8">
// //             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
// //               Registration
// //             </h1>
// //             <p className="text-sm text-gray-500 dark:text-gray-400">
// //               Enter your email and password to sign up!
// //             </p>
// //           </div>
// //           <div>
// //             <div className="relative py-3 sm:py-5">
// //               <div className="absolute inset-0 flex items-center">
// //                 <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
// //               </div>
// //             </div>
// //             <form>
// //               <div className="space-y-5">
// //                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
// //                   {/* <!-- First Name --> */}
// //                   <div className="sm:col-span-1">
// //                     <Label>
// //                       First Name<span className="text-error-500">*</span>
// //                     </Label>
// //                     <Input
// //                       type="text"
// //                       id="fname"
// //                       name="fname"
// //                       placeholder="Enter your first name"
// //                     />
// //                   </div>
// //                   {/* <!-- Last Name --> */}
// //                   <div className="sm:col-span-1">
// //                     <Label>
// //                       Last Name<span className="text-error-500">*</span>
// //                     </Label>
// //                     <Input
// //                       type="text"
// //                       id="lname"
// //                       name="lname"
// //                       placeholder="Enter your last name"
// //                     />
// //                   </div>
// //                 </div>
// //                 {/* <!-- Email --> */}
// //                 <div>
// //                   <Label>
// //                     Email<span className="text-error-500">*</span>
// //                   </Label>
// //                   <Input
// //                     type="email"
// //                     id="email"
// //                     name="email"
// //                     placeholder="Enter your email"
// //                   />
// //                 </div>
// //                 {/* <!-- Password --> */}
// //                 <div>
// //                   <Label>
// //                     Password<span className="text-error-500">*</span>
// //                   </Label>
// //                   <div className="relative">
// //                     <Input
// //                       placeholder="Enter your password"
// //                       type={showPassword ? "text" : "password"}
// //                     />
// //                     <span
// //                       onClick={() => setShowPassword(!showPassword)}
// //                       className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
// //                     >
// //                       {showPassword ? (
// //                         <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
// //                       ) : (
// //                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
// //                       )}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 {/* <!-- Checkbox --> */}
// //                 {/* <div className="flex items-center gap-3">
// //                   <Checkbox
// //                     className="w-5 h-5"
// //                     checked={isChecked}
// //                     onChange={setIsChecked}
// //                   />
// //                   <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
// //                     By creating an account means you agree to the{" "}
// //                     <span className="text-gray-800 dark:text-white/90">
// //                       Terms and Conditions,
// //                     </span>{" "}
// //                     and our{" "}
// //                     <span className="text-gray-800 dark:text-white">
// //                       Privacy Policy
// //                     </span>
// //                   </p>
// //                 </div> */}
// //                 {/* <!-- Button --> */}
// //                 <div>
// //                   <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
// //                     Register Account
// //                   </button>
// //                 </div>
// //               </div>
// //             </form>

// //             <div className="mt-5">
// //               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
// //                 Already have an account? {""}
// //                 <Link
// //                   to="/signin"
// //                   className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
// //                 >
// //                   Sign In
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// import { useState } from "react";
// import { Link, useNavigate } from "react-router"; // Added useNavigate for redirection
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import { UserService } from "../../api/services/userService"; // Import your service
// import { showAlert } from "../../utils/toaster"; // Import your utility

// export default function SignUpForm() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Initialize form data to match your API structure
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     middle_name: "", // Optional/Default
//     suffix_name: "", // Optional/Default
//     status: "Active",
//     role_id: "Intern", // Value is "Intern" as requested
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     showAlert.loading("Creating your account...");

//     try {
//       // Using the same service as your Table component
//       await UserService.register(formData);
      
//       await showAlert.success(
//         "Registration Successful", 
//         "Your intern account has been created."
//       );
      
//       navigate("/signin"); // Redirect to login
//     } catch (error: any) {
//       const msg = error.response?.data?.errors?.[0]?.msg || "Registration failed";
//       showAlert.error("Error", msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
//       <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
//         <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
//           <ChevronLeftIcon className="size-5" />
//           Back to dashboard
//         </Link>
//       </div>

//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div className="mb-5 sm:mb-8">
//           <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//             Registration
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Student Intern Enrollment
//           </p>
//         </div>

//         <form onSubmit={handleRegister} className="space-y-5">
//           {/* Hidden Intern Field */}
//           <input type="hidden" name="role_id" value="Intern" />

//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             <div>
//               <Label>First Name<span className="text-error-500">*</span></Label>
//               <Input
//                 type="text"
//                 name="first_name"
//                 placeholder="Enter first name"
//                 value={formData.first_name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <Label>Last Name<span className="text-error-500">*</span></Label>
//               <Input
//                 type="text"
//                 name="last_name"
//                 placeholder="Enter last name"
//                 value={formData.last_name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <Label>Email<span className="text-error-500">*</span></Label>
//             <Input
//               type="email"
//               name="email"
//               placeholder="Enter email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <Label>Password<span className="text-error-500">*</span></Label>
//             <div className="relative">
//               <Input
//                 name="password"
//                 placeholder="Enter password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//               >
//                 {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
//               </span>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
//           >
//             {loading ? "Processing..." : "Register Account"}
//           </button>
//         </form>

//         <div className="mt-5">
//           <p className="text-sm text-gray-700 dark:text-gray-400">
//             Already have an account?{" "}
//             <Link to="/signin" className="text-brand-500 hover:text-brand-600">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }













import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { UserService } from "../../api/services/userService"; 
import { showAlert } from "../../utils/toaster"; 

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [internRoleId, setInternRoleId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    middle_name: "", 
    suffix_name: "", 
    status: "Active",
    role_id: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await UserService.getRoles();
        const roleData = res.data.data || [];
        
        const internRole = roleData.find(
          (r: any) => r.role_name.toLowerCase() === "intern"
        );

        if (internRole) {
          setInternRoleId(internRole.role_id);
          setFormData((prev) => ({ ...prev, role_id: internRole.role_id }));
        } else {
          console.warn("Intern role not found in system roles.");
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if role_id hasn't loaded yet
    if (!formData.role_id) {
      showAlert.error("Error", "System roles are still loading. Please wait.");
      return;
    }

    setLoading(true);
    showAlert.loading("Creating your account...");

    try {
      await UserService.register(formData);
      
      await showAlert.success(
        "Registration Successful", 
        "Your account has been created."
      );
      
      navigate("/signin"); 
    } catch (error: any) {
      const msg = error.response?.data?.errors?.[0]?.msg || "Registration failed";
      showAlert.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Registration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Student Intern Registration
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input type="hidden" name="role_id" value={formData.role_id} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>First Name<span className="text-error-500">*</span></Label>
              <Input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Last Name<span className="text-error-500">*</span></Label>
              <Input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label>Email<span className="text-error-500">*</span></Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Password<span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                name="password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.role_id}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Register Account"}
          </button>
        </form>

        <div className="mt-5">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-brand-500 hover:text-brand-600">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}