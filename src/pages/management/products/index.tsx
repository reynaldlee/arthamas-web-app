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
  const { data, refetch, isLoading } = trpc.useQuery(["product.findAll"]);
  const tableId = useId();

  const { mutate: deleteData } = trpc.useMutation(["product.delete"]);

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
        <Link href="/management/products/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New Product
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Products"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Product Code", name: "productCode" },
          { label: "Product Name", name: "name" },
          { label: "NPT No", name: "nptNumber" },
          { label: "NPT s/d", name: "nptValidTo" },
          { label: "Grade", name: "grade.name" },
          { label: "Syntethic", name: "isSyntetic" },
          {
            name: "",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (_, data) => {
                const id = data.rowData[0];
                return (
                  <>
                    <Link href={`/management/products/${id}/edit`}>
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
