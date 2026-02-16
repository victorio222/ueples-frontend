import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentTable from "../../components/tables/docx-table/DocumentTable";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";

export default function UploadAttachment() {
  return (
    <>
      <PageMeta
        title="Upload Documents | UEP Student Archives"
        description="Upload Document of Form 137 for Student Archives"
      />
      <PageBreadcrumb pageTitle="Upload Documents" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-4">
          <DefaultInputs />
          <ComponentCard title="Recent Upload">
            <DocumentTable />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
