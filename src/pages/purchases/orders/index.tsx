import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import ActiveIcon from "@mui/icons-material/AllOutSharp";
import DeliveryToday from "@mui/icons-material/Today";
import DeliveryIn7Days from "@mui/icons-material/LocalShipping";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function PurchaseOrderIndex() {
  const { data, isLoading } = trpc.purchaseOrder.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

  const { mutate: cancelOrder } = trpc.purchaseOrder.cancel.useMutation();

  return (
    <MainLayout>
      {/* <Box>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <Paper sx={{ p: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <ActiveIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Active</Typography>
                  <Box>
                    <Typography variant="h2">4</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
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
      </Box> */}

      <Box p={2}>
        <Link href="/purchases/orders/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Purchase Order
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Sales Orders"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "PO No", name: "docNo" },
          {
            label: "Supplier",
            name: "supplier",
            options: {
              customBodyRender: (supplier) => supplier.name,
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
            label: "Trans. Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Delivery Date",
            name: "dueDate",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Currency",
            name: "currencyCode",
          },
          {
            label: "Amount",
            name: "totalAmount",
            options: {
              customBodyRender: (value) => formatMoney(value),
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
                      actions={[
                        {
                          label: "Edit",
                          onClick: () =>
                            router.push(`/purchases/orders/${id}/edit`),
                        },
                        {
                          label: "Cancel",
                          danger: true,
                          disabled: rowData[2] !== "Open",
                          onClick: () => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel ${id}`
                              )
                            ) {
                              cancelOrder(id);
                              router.reload();
                            }
                          },
                        },
                      ]}
                    ></MoreMenu>
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
