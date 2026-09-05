import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon, PlusIcon } from "../../../icons";
import api from "../../../utils/axiousInstance";
// import ReactSelect from "react-select";
import { showAlert } from "../../../utils/toaster";

export default function FacultyProfileRegistration() {
  const [loading, setLoading] = useState(false);

  // 1. Faculty Specific Form State
  const [formData, setFormData] = useState({
    firstname: "", middlename: "", lastname: "", suffixname: "",
    sex: "", birthdate: "", birthplace: "", religion: "",
    email: "", address: "", contactno: "",
    special_skills: "",
    researches: "", creative_works: "", ims_produced: ""
  });

  // 2. Education State (Array of objects)
  const [education, setEducation] = useState({
    elem: { school: "", year: "", honors: "" },
    highschool: { school: "", year: "", honors: "" },
    tertiary: { school: "", year: "", honors: "" },
    post_baccalaureate: { school: "", year: "", honors: "" },
    graduate: { school: "", year: "", honors: "" },
    post_graduate: { school: "", year: "", honors: "" },
  });

  // 3. Dynamic Trainings State
  const [trainings, setTrainings] = useState([
    { title: "", duration_venue: "", agency: "", participation: "" }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEduChange = (level: string, field: string, value: string) => {
    setEducation(prev => ({
      ...prev,
      [level]: { ...prev[level as keyof typeof education], [field]: value }
    }));
  };

  const addTraining = () => setTrainings([...trainings, { title: "", duration_venue: "", agency: "", participation: "" }]);
  
  const handleTrainingChange = (index: number, field: string, value: string) => {
    const updated = [...trainings];
    updated[index] = { ...updated[index], [field]: value };
    setTrainings(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, education, trainings };
      await api.post("/faculty/register", payload);
      showAlert.success("Success", "Faculty profile saved successfully.");
    } catch (error: any) {
      showAlert.error("Error", error.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:border-brand-500 outline-none dark:text-white text-sm";
  const sectionTitle = "text-sm font-bold uppercase tracking-wider text-brand-500 mb-4 flex items-center gap-2";

  return (
    <ComponentCard title="Faculty Professional Profile">
      <div className="space-y-10">
        
        {/* PERSONAL INFORMATION */}
        <section>
          <h3 className={sectionTitle}>I. Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><Label>First Name</Label><input name="firstname" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Middle Name</Label><input name="middlename" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Last Name</Label><input name="lastname" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Suffix</Label><input name="suffixname" onChange={handleInputChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div><Label>Birthdate</Label><input type="date" name="birthdate" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Birthplace</Label><input name="birthplace" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Religion</Label><input name="religion" onChange={handleInputChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div><Label>Email Address</Label><input name="email" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Contact No.</Label><input name="contactno" onChange={handleInputChange} className={inputClass} /></div>
            <div><Label>Home Address</Label><input name="address" onChange={handleInputChange} className={inputClass} /></div>
          </div>
        </section>

        {/* EDUCATIONAL BACKGROUND */}
        <section>
          <h3 className={sectionTitle}>II. Educational Background</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 border-b dark:border-gray-800">
                  <th className="py-2">Level</th>
                  <th className="py-2">School Attended</th>
                  <th className="py-2">Year Graduated</th>
                  <th className="py-2">Honors Received</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {Object.entries(education).map(([key]) => (
                  <tr key={key}>
                    <td className="py-3 text-sm capitalize font-medium">{key.replace('_', ' ')}</td>
                    <td><input onChange={(e) => handleEduChange(key, 'school', e.target.value)} className={`${inputClass} border-none`} placeholder="School Name" /></td>
                    <td><input onChange={(e) => handleEduChange(key, 'year', e.target.value)} className={`${inputClass} border-none`} placeholder="YYYY" /></td>
                    <td><input onChange={(e) => handleEduChange(key, 'honors', e.target.value)} className={`${inputClass} border-none`} placeholder="e.g. Cum Laude" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TRAINING ATTENDED */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className={sectionTitle}>III. Training Attended</h3>
            <Button onClick={addTraining} className="!p-2 h-8 w-8 !rounded-full"><PlusIcon /></Button>
          </div>
          <div className="overflow-x-auto border dark:border-gray-800 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="p-3 border-r dark:border-gray-800">Title of Training</th>
                  <th className="p-3 border-r dark:border-gray-800">Duration and Venue</th>
                  <th className="p-3 border-r dark:border-gray-800">Sponsoring Agency</th>
                  <th className="p-3">Participation</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((_, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-800">
                    <td className="p-1"><input onChange={(e) => handleTrainingChange(idx, 'title', e.target.value)} className="w-full bg-transparent p-2 outline-none" /></td>
                    <td className="p-1"><input onChange={(e) => handleTrainingChange(idx, 'duration_venue', e.target.value)} className="w-full bg-transparent p-2 outline-none" /></td>
                    <td className="p-1"><input onChange={(e) => handleTrainingChange(idx, 'agency', e.target.value)} className="w-full bg-transparent p-2 outline-none" /></td>
                    <td className="p-1"><input onChange={(e) => handleTrainingChange(idx, 'participation', e.target.value)} className="w-full bg-transparent p-2 outline-none" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SCHOLARLY WORKS & SKILLS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className={sectionTitle}>IV. Scholarly Works</h3>
            <div className="space-y-4">
              <div><Label>Researches</Label><textarea name="researches" onChange={handleInputChange} className={`${inputClass} min-h-[80px]`} /></div>
              <div><Label>Creative Works</Label><textarea name="creative_works" onChange={handleInputChange} className={`${inputClass} min-h-[80px]`} /></div>
              <div><Label>IMS Produced</Label><textarea name="ims_produced" onChange={handleInputChange} className={`${inputClass} min-h-[80px]`} /></div>
            </div>
          </div>
          <div>
            <h3 className={sectionTitle}>V. Additional Info</h3>
            <Label>Special Skills</Label>
            <textarea name="special_skills" onChange={handleInputChange} className={`${inputClass} min-h-[250px]`} placeholder="List technical skills, certifications, etc." />
          </div>
        </section>

        <div className="flex justify-end border-t dark:border-gray-800 pt-6">
          <Button onClick={handleSubmit} disabled={loading} className="px-12">
            {loading ? "Saving..." : "Save Faculty Profile"}
            {!loading && <PaperPlaneIcon className="ml-2" />}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}