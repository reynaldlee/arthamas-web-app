import { useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";

import MUIDataTable from "mui-datatables";
import { formatDate } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";
import { Box, Grid, Paper, Typography } from "@mui/material";

import ActiveIcon from "@mui/icons-material/AllOutSharp";
import DeliveryToday from "@mui/icons-material/Today";
import DeliveryIn7Days from "@mui/icons-material/LocalShipping";

export default function SalesDeliveryIndex() {
  const { data, isLoading, refetch } = trpc.salesDelivery.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

  const cancelSalesDelivery = trpc.salesDelivery.cancel.useMutation();

  const handleCancel = (docNo: string) => {
    if (window.confirm(`Are you sure you want to cancel delivery ${docNo}`)) {
      cancelSalesDelivery.mutate(docNo, {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <Paper sx={{ p: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <DeliveryToday fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Delivery Today</Typography>
                  <Box>
                    <Typography variant="h2">1</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item md={4}>
            <Paper sx={{ p: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <DeliveryIn7Days fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Delivery In 7 days</Typography>
                  <Box>
                    <Typography variant="h2">5</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <MUIDataTable
        title="List Delivery"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "Delivery No", name: "docNo" },
          {
            label: "SP2B No",
            name: "goodsReleaseOrderDocNo",
          },
          {
            label: "Delivery Date",
            name: "deliveryDate",
            options: {
              customBodyRender: formatDate,
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
            label: "Customer",
            name: "salesOrder",
            options: {
              customBodyRender: (data) => {
                return data.customer.name;
              },
            },
          },
          {
            label: "Warehouse",
            name: "warehouse",
            options: {
              customBodyRender: (data) => {
                return data.name;
              },
            },
          },
          {
            name: "docNo",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (id, { rowData }) => {
                return (
                  <>
                    <MoreMenu
                      disabled={rowData[2] === "Cancelled"}
                      actions={[
                        {
                          label: "Edit",
                          onClick: () =>
                            router.push(`/sales/deliveries/${id}/edit`),
                        },
                        {
                          label: "Print Surat Jalan",
                          onClick: () =>
                            router.push(`/sales/deliveries/${id}/print`),
                        },
                        {
                          label: "Create Invoice",
                          onClick: () =>
                            router.push(
                              `/sales/invoices/create?salesDeliveryDocNo=${id}`
                            ),
                        },
                        {
                          label: "Cancel",
                          danger: true,
                          onClick: () => {
                            handleCancel(id);
                          },
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
