import { useId } from "react";
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
import ExpiredTodayIcon from "@mui/icons-material/TimerOff";
import Expired7DayIcon from "@mui/icons-material/Timelapse";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function SalesQuoteIndex() {
  const { data, isLoading, refetch } = trpc.salesQuote.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

  const cancelQuotation = trpc.salesQuote.cancel.useMutation();

  const handleCancel = (docNo: string) => {
    if (window.confirm(`Are you sure you want to cancel quotation ${docNo}`)) {
      cancelQuotation.mutate(docNo, {
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
                  <ExpiredTodayIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Expired Today</Typography>
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
                  <Expired7DayIcon fontSize="large" />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Expired In 7 days</Typography>
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
          {
            label: "Doc No",
            name: "docNo",
            options: {
              customBodyRender: (docNo) => (
                <Link href={`/sales/quotes/${docNo}`}>
                  <a>{docNo}</a>
                </Link>
              ),
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
                      disabled={rowData[2] === "Cancelled"}
                      actions={[
                        {
                          label: "Edit",
                          onClick: () =>
                            router.push(`/sales/quotes/${id}/edit`),
                        },
                        {
                          label: "Create Sales Order",
                          onClick: () =>
                            router.push(
                              `/sales/orders/create?salesQuoteDocNo=${id}`
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
