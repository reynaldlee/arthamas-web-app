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

export default function VesselIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["vessel.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["vessel.delete"]);

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
        <Link href="/management/vessels/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Vessel
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Vessels"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          {
            label: "Vessel Code",
            name: "vesselCode",
            options: {
              customBodyRender: (id) => {
                return (
                  <Link href={`/management/vessels/${id}`}>
                    <a>{id}</a>
                  </Link>
                );
              },
            },
          },
          {
            label: "Vessel Name",
            name: "name",
          },
          { label: "IMO No", name: "imoNumber" },
          {
            label: "Customer",
            name: "customer",
            options: {
              customBodyRender: (value) => {
                return value.name;
              },
            },
          },
          { label: "Tipe", name: "vesselType" },
          {
            label: "Action",
            name: "vesselCode",
            options: {
              filter: false,
              customBodyRender: (id) => {
                return (
                  <>
                    <Link href={`/management/vessels/${id}/edit`}>
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
