import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentTable from "../../components/tables/docx-table/DocumentTable";

export default function UploadAttachment() {
  return (
    <>
      <PageMeta
        title="Upload Documents | UEP Student Archives"
        description="Upload Document of Form 137 for Student Archives"
      />
      <PageBreadcrumb pageTitle="Upload Documents" />
      <div className="space-y-6">
        <div className="grid grid-cols-[400px_1fr] gap-4">
          <ComponentCard title="Basic Information">
            <DocumentTable />
          </ComponentCard>
          <ComponentCard title="Recent Upload">
            <DocumentTable />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
