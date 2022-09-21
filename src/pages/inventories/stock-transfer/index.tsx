import React, { useId, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";

import {
  Box,
  Grid,
  Paper,
  Tab,
  Table,
  TableHead,
  TableCell,
  Typography,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";

import DeliveryToday from "@mui/icons-material/Today";
import DeliveryIn7Days from "@mui/icons-material/LocalShipping";

import AddIcon from "@mui/icons-material/AddRounded";
import { formatDate, formatMoney } from "@/utils/format";
import { useRouter } from "next/router";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { productPackagingSchema } from "src/server/routers/product";
import MUIDataTable from "mui-datatables";
import StatusBadge from "@/components/Badges/StatusBadge";
import Link from "next/link";
import { Add } from "@mui/icons-material";
import MoreMenu from "@/components/Menu/MoreMenu";

type QueryParams = {
  productCode: string;
};

type ProductPackagingFormValues = z.infer<typeof productPackagingSchema>;

export default function StockTransferIndex() {
  const router = useRouter();

  const { data, refetch, isLoading } = trpc.useQuery(["stockTransfer.findAll"]);

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h3">Stock Transfer</Typography>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item md={4}>
          <Paper sx={{ p: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <DeliveryToday fontSize="large" />
              </Grid>
              <Grid item>
                <Typography variant="overline">Not Received</Typography>
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
                <Typography variant="overline">Upcoming Transfer</Typography>
                <Box>
                  <Typography variant="h2">0</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box p={2}>
        <Link href="/inventories/stock-transfer/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Stock Transfer
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Transfer List"
        options={{
          tableId: useId(),
          print: false,
        }}
        data={data?.data || []}
        columns={[
          {
            label: "Transfer Doc No",
            name: "docNo",
          },
          {
            label: "Transfer Date",
            name: "date",
            options: { customBodyRender: formatDate },
          },
          {
            label: "From",
            name: "warehouseFrom",
            options: { customBodyRender: (data) => data.name },
          },
          {
            label: "To",
            name: "warehouseTo",
            options: { customBodyRender: (data) => data.name },
          },
          {
            label: "Status",
            name: "status",
            options: {
              customBodyRender: (data) => (
                <StatusBadge status={data}></StatusBadge>
              ),
            },
          },
          {
            label: "Driver Name",
            name: "driverName",
          },
          {
            label: "Truck",
            name: "truck",
            options: {
              customBodyRender: (data) => data.policeNumber,
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
                            router.push(
                              `/inventories/stock-transfer/${id}/edit`
                            ),
                        },
                        {
                          label: "Print",
                          onClick: () =>
                            router.push(
                              `/inventories/stock-transfer/${id}/print`
                            ),
                        },
                        {
                          label: "Receive Stock",
                          onClick: () =>
                            router.push(
                              `/inventories/stock-transfer/receive?docNo=${id}`
                            ),
                        },
                        {
                          label: "Cancel",
                          danger: true,
                          onClick: () => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel stock transfer ${id}`
                              )
                            ) {
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
      ></MUIDataTable>

      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
