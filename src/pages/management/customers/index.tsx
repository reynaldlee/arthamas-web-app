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

export default function CustomerIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["customer.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["customer.delete"]);

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
        <Link href="/management/customers/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Customer
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Customers"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Customer Code", name: "customerCode" },
          { label: "Name", name: "name" },
          { label: "Address", name: "address", options: { filter: false } },
          { label: "Contact Email", name: "contactEmail" },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/customers/${id}/edit`}>
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
