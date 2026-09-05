import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
// import DocumentTable from "../../components/tables/docx-table/DocumentTable";
// import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
// import StudentProfileRegistration from "../../components/form/form-elements/StudentRegistration";
import FacultyProfileRegistration from "../../components/form/form-elements/FacultyRegistration";

export default function RegisterFacultyProfile() {
  return (
    <>
      <PageMeta
        title="Register Faculty"
        description="Faculty Profile Registration"
      />
      <PageBreadcrumb pageTitle="Register Faculty" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
            <FacultyProfileRegistration />
        </div>
      </div>
    </>
  );
}
