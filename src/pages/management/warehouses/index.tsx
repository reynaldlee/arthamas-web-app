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

export default function WarehouseIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["warehouse.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["warehouse.delete"]);

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
        <Link href="/management/warehouses/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Warehouse
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Warehouses"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Warehouse Code", name: "warehouseCode" },
          { label: "Name", name: "name" },
          { label: "Address", name: "address", options: { filter: false } },
          {
            label: "Area",
            name: "area",
            options: {
              customBodyRender(value) {
                return `${value.areaCode} - ${value.areaName}`;
              },
            },
          },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/warehouses/${id}/edit`}>
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
