import { useParams } from "react-router"; // Import this to grab the year
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StudentArchiveTable from "../../components/tables/archive-table/ArchiveTable";

export default function ArchiveTables() {
  // Extract the dynamic 'year' parameter from the URL (e.g., /archive/2025-2026)
  const { year } = useParams<{ year: string }>();

  return (
    <>
      <PageMeta
        title={`A.Y. ${year} Archives | UEP Student Archives`}
        description={`Viewing student records for academic year ${year}`}
      />
      
      {/* Dynamic Breadcrumb shows the specific folder name */}
      <PageBreadcrumb pageTitle={`Archives: A.Y. ${year}`} />

      <div className="space-y-6">
        <ComponentCard title={`Form 137 Records for ${year}`}>
          {/* Pro-tip: Pass the 'year' as a prop to your table 
             if you want to filter the data inside StudentArchiveTable 
          */}
          <StudentArchiveTable selectedYear={year} />
        </ComponentCard>
      </div>
    </>
  );
}