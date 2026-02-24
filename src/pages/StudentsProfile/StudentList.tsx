import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/user-table/UserTable";
import StudentManagement from "../../components/tables/students-table/StudentsTable";

export default function StudentList() {
  return (
    <>
      <PageMeta
        title="Student Management"
        description="Student Management for Profiling System"
      />
      <PageBreadcrumb pageTitle="Student Management" />
      <div className="space-y-6">
        <ComponentCard title="">
          <StudentManagement />
        </ComponentCard>
      </div>
    </>
  );
}
