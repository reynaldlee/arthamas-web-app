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
  const { data, refetch, isLoading } = trpc.useQuery(["customerGroup.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["customerGroup.delete"]);

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
        <Link href="/management/customer-groups/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Customer Group
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Customer Groups"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Customer Group Code", name: "customerGroupCode" },
          { label: "Customer Group Name", name: "name" },
          { label: "Phone", name: "phone" },
          { label: "Type", name: "type" },
          { label: "Address", name: "address", options: { filter: false } },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/customer-groups/${id}/edit`}>
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
