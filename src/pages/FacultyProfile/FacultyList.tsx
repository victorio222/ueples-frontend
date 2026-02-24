import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/user-table/UserTable";
import StudentManagement from "../../components/tables/students-table/StudentsTable";

export default function FacultyList() {
  return (
    <>
      <PageMeta
        title="Faculty Management"
        description="Faculty Management for Profiling System"
      />
      <PageBreadcrumb pageTitle="Faculty Management" />
      <div className="space-y-6">
        <ComponentCard title="">
          <StudentManagement />
        </ComponentCard>
      </div>
    </>
  );
}
