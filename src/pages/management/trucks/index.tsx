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

export default function TruckIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["truck.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["truck.delete"]);

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
        <Link href="/management/trucks/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Truck
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Trucks"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Truck Code", name: "truckCode" },
          { label: "Nopol", name: "policeNumber" },
          { label: "Name", name: "name" },
          { label: "Tipe", name: "type" },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/trucks/${id}/edit`}>
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
