import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon } from "../../../icons";
import { DocumentService } from "../../../api/services/documentService";
import api from "../../../utils/axiousInstance";
import { toast } from "react-hot-toast";
import ReactSelect from "react-select";

export default function DefaultInputs() {
  const [lrn, setStudentLrn] = useState("");
  const [docType, setDocType] = useState("Form 137");
  const [yearId, setYearId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [studentOptions, setStudentOptions] = useState<{ value: string; label: string }[]>([]);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([]);

  const docOptions = [
    { value: "Form 137", label: "Form 137" },
    { value: "Good Moral", label: "Good Moral" },
    { value: "Birth Certificate", label: "Birth Certificate" }
  ];

  // Fetch logic remains the same...
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [resStudents, resYears] = await Promise.all([
          api.get("/students"),
          api.get("/academic-years"),
        ]);
        const rawStudents = resStudents.data.data || resStudents.data.students || [];
        const rawYears = resYears.data.data || resYears.data.years || resYears.data;

        setStudentOptions(rawStudents.map((s: any) => ({
          value: s.lrn.toString(),
          label: `${s.lrn} - ${s.first_name} ${s.last_name}`,
        })));

        setYearOptions(Array.isArray(rawYears) ? rawYears.map((y: any) => ({
          value: y.year_id.toString(),
          label: y.academic_year || y.label,
        })) : []);
      } catch (error) {
        toast.error("Failed to load options");
      }
    };
    fetchFormData();
  }, []);

  // TAILWIND CLASS NAMES (Applying Header principles)
  const selectClassNames = {
    control: ({ isFocused }: any) => 
      `!bg-transparent !border-gray-200 dark:!border-gray-800 !rounded-lg !min-h-[44px] !shadow-none ${
        isFocused ? '!border-brand-500 !ring-3 !ring-brand-500/10' : ''
      }`,
    menu: () => 
      "!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-800 !shadow-lg",
    option: ({ isFocused, isSelected }: any) => 
      `${
        isSelected 
          ? "!bg-brand-500 !text-white" 
          : isFocused 
            ? "!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white" 
            : "!text-gray-700 dark:!text-gray-300"
      } !cursor-pointer !py-2 !px-3`,
    singleValue: () => "!text-gray-800 dark:!text-white/90",
    input: () => "!text-gray-800 dark:!text-white/90",
    placeholder: () => "!text-gray-400 dark:!text-white/30",
  };

  // Necessary style resets for grid-alignment and focus
  const selectStyles = {
    input: (base: any) => ({ ...base, "grid-area": "1/1/2/3" }),
    control: (base: any) => ({ ...base, boxShadow: 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  const handleSubmit = async () => {
    if (!lrn || !yearId || !file) {
      toast.error("Required fields missing.");
      return;
    }
    const formData = new FormData();
    formData.append("lrn", lrn);
    formData.append("year_id", yearId);
    formData.append("type", docType);
    formData.append("attachment", file);

    try {
      setLoading(true);
      await DocumentService.upload(formData);
      toast.success("Document archived!");
      window.dispatchEvent(new Event("documentUploaded"));
      setFile(null); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Archive Student Document">
      <div className="space-y-6">
        <div>
          <Label>Student LRN / Name</Label>
          <ReactSelect
            options={studentOptions}
            classNames={selectClassNames}
            styles={selectStyles}
            placeholder="Search student..."
            onChange={(selected: any) => setStudentLrn(selected?.value || "")}
          />
        </div>

        <div>
          <Label>Document Type</Label>
          <ReactSelect
            options={docOptions}
            defaultValue={docOptions[0]}
            classNames={selectClassNames}
            styles={selectStyles}
            onChange={(selected: any) => setDocType(selected?.value || "")}
          />
        </div>

        <div>
          <Label>Academic Year</Label>
          <ReactSelect
            options={yearOptions}
            classNames={selectClassNames}
            styles={selectStyles}
            placeholder="Search year..."
            onChange={(selected: any) => setYearId(selected?.value || "")}
          />
        </div>

        {/* File display and Button logic remains same */}
        <div>
          <Label>Upload Attachment</Label>
          <DropzoneComponent onFileChange={setFile} />
          {file && (
            <div className="mt-4 p-3 border border-dashed border-blue-500 rounded-lg bg-blue-500/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="text-blue-500">
                   <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <p className="text-sm dark:text-white/90">{file.name}</p>
               </div>
               <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
          )}
        </div>

        <div className="w-full flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || !file} className="w-full sm:w-auto">
            {loading ? "Archiving..." : "Submit Archive"}
            {!loading && <PaperPlaneIcon className="ml-2" />}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}