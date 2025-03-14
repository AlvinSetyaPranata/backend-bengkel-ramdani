import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Table } from "../components/ui/table";
import DataTable from "./Tables/DataTable";


const Vehicles: React.FC = () => {
  

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Data Kendaraan" />
      <DataTable />
    </>
  );
};

export default Vehicles;
