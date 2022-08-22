import { useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { Box, Button, IconButton, Paper } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import Link from "next/link";
import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { LoaderModal } from "@/components/Loader";

export default function OrganizationIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["org.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["org.delete"]);

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
        <Link href="/management/organizations/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Organization
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Organization"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Org. Code", name: "orgCode" },
          { label: "Name", name: "name" },
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
                    <Link href={`/management/organizations/${id}/edit`}>
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
