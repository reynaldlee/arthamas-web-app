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
import { formatDate } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function SalesQuoteIndex() {
  const { data, isLoading } = trpc.useQuery(["salesQuote.findAll"]);
  const tableId = useId();
  const router = useRouter();

  // const { mutate: deleteData } = trpc.useMutation(["salesQuote.delete"]);

  // const handleDelete = (id: string) => () => {
  //   deleteData(id, {
  //     onSuccess: () => {
  //       refetch();
  //     },
  //   });
  // };

  return (
    <MainLayout>
      <Box p={2}>
        <Link href="/sales/quotes/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Sales Quote
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Sales Quotes"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Doc No", name: "docNo" },
          {
            label: "Customer",
            name: "customer",
            options: {
              customBodyRender: (customer) => customer.name,
            },
          },
          {
            label: "Status",
            name: "status",
            options: {
              customBodyRender: (status) => (
                <StatusBadge status={status}></StatusBadge>
              ),
            },
          },
          {
            label: "Quotation Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Valid Until",
            name: "validUntil",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            name: "docNo",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (id) => {
                return (
                  <>
                    <MoreMenu
                      actions={[
                        {
                          label: "Edit",
                          onClick: () =>
                            router.push(`/sales/quotes/${id}/edit`),
                        },
                        {
                          label: "Print Quotation",
                          onClick: () =>
                            router.push(`/sales/quotes/${id}/print`),
                        },
                        {
                          label: "Create Sales Order",
                          onClick: () =>
                            router.push(
                              `/sales/orders/create?salesQuoteDocNo=${id}`
                            ),
                        },
                      ]}
                    ></MoreMenu>
                    {/* <Link href={`/sales/quotes/${id}/edit`}>
                      <IconButton>
                        Nore
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Link> */}
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
