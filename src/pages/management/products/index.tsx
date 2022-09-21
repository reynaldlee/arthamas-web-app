import { useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import { Box, Button, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate } from "@/utils/format";

export default function ProductIndex() {
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
          // selectableRowsHideCheckboxes: true,
        }}
        columns={[
          {
            label: "Product Code",
            name: "productCode",
            options: {
              customBodyRender: (productCode) => {
                return (
                  <Link href={`/management/products/${productCode}`}>
                    <a>{productCode}</a>
                  </Link>
                );
              },
            },
          },
          { label: "Product Name", name: "name" },
          { label: "NPT No", name: "nptNumber" },
          {
            label: "NPT s/d",
            name: "nptValidTo",
            options: {
              customBodyRender(value) {
                return formatDate(value);
              },
            },
          },
          {
            label: "Grade",
            name: "productGrade",
            options: {
              customBodyRender(value) {
                return value?.name;
              },
            },
          },
          {
            label: "Type",
            name: "productType",
            options: {
              customBodyRender(value) {
                return value?.name;
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
                    {/* <Link href={`/management/products/${id}/edit`}>
                      <IconButton>
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Link> */}

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
