import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { UserService } from "../../api/services/userService"; 
import { showAlert } from "../../utils/toaster"; 

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // const [internRoleId, setInternRoleId] = useState<number | null>(null);

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
          // setInternRoleId(internRole.role_id);
          // setFormData((prev) => ({ ...prev, role_id: internRole.role_id }));
          setFormData((prev) => ({
          ...prev,
          role_id: String(internRole.role_id),
        }));
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