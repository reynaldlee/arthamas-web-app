import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import { Box, Button, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";

export default function SuppliersIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["supplier.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["supplier.delete"]);

  const handleDelete = (id: string) => () => {
    deleteData(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <MainLayout>
      <Box p={2}>
        <Link href="/management/suppliers/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Supplier
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Suppliers"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Supplier Code", name: "supplierCode" },
          { label: "Name", name: "name" },
          { label: "Address", name: "address" },
          { label: "Email", name: "contactEmail" },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/suppliers/${id}/edit`}>
                      <IconButton>
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Link>

                    <IconButton onClick={handleDelete(id)} disabled>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </>
                );
              },
            },
          },
        ]}
        data={data?.data || []}
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
