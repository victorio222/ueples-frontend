import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/user-table/UserTable";

export default function UserTables() {
  return (
    <>
      <PageMeta
        title="User Management | UEP Student Archives"
        description="User Management for Student Archives"
      />
      <PageBreadcrumb pageTitle="User Management" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <UserTable />
        </ComponentCard>
      </div>
    </>
  );
}
