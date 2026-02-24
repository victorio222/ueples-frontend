import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentTable from "../../components/tables/docx-table/DocumentTable";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import StudentProfileRegistration from "../../components/form/form-elements/StudentRegistration";

export default function RegisterStudentProfile() {
  return (
    <>
      <PageMeta
        title="Register Students"
        description="Student Profile Registration"
      />
      <PageBreadcrumb pageTitle="Register Student" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
            <StudentProfileRegistration />
        </div>
      </div>
    </>
  );
}
