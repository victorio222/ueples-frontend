import { useLocation, useParams } from "react-router"; // Import this to grab the year
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StudentArchiveTable from "../../components/tables/archive-table/ArchiveTable";

export default function ArchiveTables() {
  // Extract the dynamic 'year' parameter from the URL (e.g., /archive/2025-2026)
  // const { year } = useParams<{ year: string }>();

  const { year } = useParams<{ year: string }>();
  const location = useLocation();
  
  // Extract ?type=Form%20137 from URL
  const queryParams = new URLSearchParams(location.search);
  const docType = queryParams.get("type");

  return (
    <>
      <PageMeta
        title={`A.Y. ${year} Archives | UEP Student Archives`}
        description={`Viewing student records for academic year ${year}`}
      />
      
      {/* Dynamic Breadcrumb shows the specific folder name */}
      <PageBreadcrumb pageTitle={`Archives: A.Y. ${year}`} />

      <div className="space-y-6">
        <ComponentCard title={`${docType} Records for Batch ${year}`}>
          {/* Pass both Year and Type to the table */}
          <StudentArchiveTable 
            selectedYear={year ?? ""} 
            selectedType={docType ?? ""} 
          />
        </ComponentCard>
      </div>
    </>
  );
}