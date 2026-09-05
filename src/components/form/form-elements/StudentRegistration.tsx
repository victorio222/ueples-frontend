import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon } from "../../../icons";
import api from "../../../utils/axiousInstance";
import ReactSelect from "react-select";
import { showAlert } from "../../../utils/toaster";

export default function StudentProfileRegistration() {
  const [loading, setLoading] = useState(false);
  
  // 1. Unified Form State
  const [formData, setFormData] = useState({
    firstname: "", middlename: "", lastname: "", suffixname: "",
    sex: "", birthplace: "", religion: "", address: "",
    father: "", mother: "", fatheroccupation: "", motheroccupation: "",
    contactno: "", ethnic_group: "", citizenship: "",
    birthnumber: "", no_of_siblings: "", messenger_account: "",
    grade_level: ""
  });

  // Options for dropdowns
  const sexOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" }
  ];

  const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
    value: `Grade ${i + 1}`, label: `Grade ${i + 1}`
  }));

  // 2. Dynamic Input Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, selected: any) => {
    setFormData(prev => ({ ...prev, [name]: selected?.value || "" }));
  };

  // 3. Submit Profile
  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.firstname || !formData.lastname) {
      showAlert.error("Missing Info", "Firstname and Lastname are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/students/register", formData);
      showAlert.success("Success!", "Student profile registered successfully.");
      // Optional: Reset form or redirect
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed.";
      showAlert.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  // Shared Styles from your original code
  const selectClassNames = {
    control: ({ isFocused }: any) => `!bg-transparent !border-gray-200 dark:!border-gray-800 !rounded-lg !min-h-[44px] !shadow-none ${isFocused ? '!border-brand-500 !ring-3 !ring-brand-500/10' : ''}`,
    menu: () => "!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-800 !shadow-lg",
    option: ({ isFocused, isSelected }: any) => `${isSelected ? "!bg-brand-500 !text-white" : isFocused ? "!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white" : "!text-gray-700 dark:!text-gray-300"} !cursor-pointer !py-2 !px-3`,
    singleValue: () => "!text-gray-800 dark:!text-white/90",
    input: () => "!text-gray-800 dark:!text-white/90",
    placeholder: () => "!text-gray-400 dark:!text-white/30",
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 outline-none transition-all dark:text-white";

  return (
    <ComponentCard title="Student Demographic Profile">
      <div className="space-y-8">
        
        {/* Section 1: Personal Information */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <Label>First Name</Label>
              <input name="firstname" onChange={handleInputChange} className={inputClass} placeholder="John" />
            </div>
            <div>
              <Label>Middle Name</Label>
              <input name="middlename" onChange={handleInputChange} className={inputClass} placeholder="Quincy" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Last Name</Label>
              <input name="lastname" onChange={handleInputChange} className={inputClass} placeholder="Doe" />
            </div>
            <div>
              <Label>Suffix (Jr/Sr/III)</Label>
              <input name="suffixname" onChange={handleInputChange} className={inputClass} placeholder="N/A" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Sex</Label>
              <ReactSelect 
                options={sexOptions} 
                classNames={selectClassNames} 
                onChange={(val) => handleSelectChange("sex", val)}
              />
            </div>
            <div>
              <Label>Birthplace</Label>
              <input name="birthplace" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>Religion</Label>
              <input name="religion" onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Section 2: Contact & Address */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500 mb-4">Contact & Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Home Address</Label>
              <input name="address" onChange={handleInputChange} className={inputClass} placeholder="House No., Street, Brgy, City" />
            </div>
            <div>
              <Label>Contact No.</Label>
              <input name="contactno" onChange={handleInputChange} className={inputClass} placeholder="09XXXXXXXXX" />
            </div>
            <div>
              <Label>Parent's Active FB / Messenger Account</Label>
              <input name="messenger_account" onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Section 3: Family Details */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500 mb-4">Family Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Father's Full Name</Label>
              <input name="father" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>Occupation</Label>
              <input name="fatheroccupation" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>Mother's Full Name (Maiden)</Label>
              <input name="mother" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>Occupation</Label>
              <input name="motheroccupation" onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Section 4: Academic & Cultural */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Ethnic Group</Label>
              <input name="ethnic_group" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>Citizenship</Label>
              <input name="citizenship" onChange={handleInputChange} className={inputClass} defaultValue="Filipino" />
            </div>
            <div>
              <Label>Grade Level</Label>
              <ReactSelect 
                options={gradeOptions} 
                classNames={selectClassNames}
                onChange={(val) => handleSelectChange("grade_level", val)}
              />
            </div>
            <div>
              <Label>Birth Order (e.g. 1st child)</Label>
              <input name="birthnumber" type="number" onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <Label>No. of Siblings</Label>
              <input name="no_of_siblings" type="number" onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        </section>

        <div className="w-full flex justify-end pt-6">
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full sm:w-auto shadow-lg shadow-brand-500/20 px-10"
          >
            {loading ? "Registering..." : "Complete Registration"}
            {!loading && <PaperPlaneIcon className="ml-2" />}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}