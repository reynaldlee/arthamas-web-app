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

import PaymentIcon from "@mui/icons-material/Payment";
import DueTodayIcon from "@mui/icons-material/CalendarToday";
import DeliveryIn7Days from "@mui/icons-material/LocalShipping";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function SalesInvoiceIndex() {
  const { data, isLoading, refetch } = trpc.salesInvoice.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

  const { mutate: cancelInvoice } = trpc.salesInvoice.cancel.useMutation();

  return (
    <MainLayout>
      {/* <Box>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <Paper sx={{ p: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <PaymentIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Total Outstanding</Typography>
                  <Box>
                    <Typography variant="h5">IDR 1,324,199.00 </Typography>
                    <Typography variant="h5">USD 12,291.00 </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={4}>
            <Paper sx={{ p: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <DueTodayIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Due Today</Typography>
                  <Box>
                    <Typography variant="h5">IDR 324,400.00 </Typography>
                    <Typography variant="h5">USD 0 </Typography>
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
                  <Typography variant="overline">Due 1 - 30 days</Typography>
                  <Box>
                    <Typography variant="h5">IDR 900,245.00 </Typography>
                    <Typography variant="h5">USD 200 </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box> */}

      <Box p={2}>
        <Link href="/sales/invoices/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Sales Invoice
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Sales Invoices"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        data={data?.data || []}
        columns={[
          { label: "Doc No", name: "docNo" },
          {
            label: "Delivery No",
            name: "salesDelivery",
            options: {
              customBodyRender: (salesDelivery) => salesDelivery.docNo,
            },
          },
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
            label: "Inv. Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Due Date",
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
            label: "Paid",
            name: "paidAmount",
            options: {
              customBodyRender: (value) => formatMoney(value),
            },
          },
          {
            label: "Outstanding",
            name: "unpaidAmount",
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
                            router.push(`/sales/invoices/${id}/edit`),
                          disabled: rowData[3] === "Cancelled",
                        },
                        {
                          label: "Print Invoice",
                          onClick: () =>
                            router.push(`/sales/invoices/${id}/print`),
                          disabled: rowData[3] === "Cancelled",
                        },
                        {
                          label: "Create Payment",
                          onClick: () =>
                            router.push(
                              `/sales/payments/create?salesInvoiceDocNo=${id}`
                            ),
                          disabled:
                            rowData[3] === "Cancelled" || rowData[3] === "Paid",
                        },
                        {
                          label: "Cancel",
                          danger: true,
                          disabled: rowData[3] === "Cancelled",
                          onClick: () => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel invoice ${id}`
                              )
                            ) {
                              cancelInvoice(id, {
                                onSuccess: () => {
                                  refetch();
                                },
                              });
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
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
