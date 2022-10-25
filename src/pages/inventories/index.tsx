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
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddRounded";
import { formatDate, formatMoney } from "@/utils/format";
import { useRouter } from "next/router";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { productPackagingSchema } from "src/server/routers/product";
import MUIDataTable from "mui-datatables";

type QueryParams = {
  productCode: string;
};

type ProductPackagingFormValues = z.infer<typeof productPackagingSchema>;

export default function InventoryIndex() {
  const router = useRouter();

  const { data, refetch, isLoading } = trpc.inventory.findAll.useQuery();

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h3">Inventory</Typography>
      </Box>

      <MUIDataTable
        title=""
        options={{
          tableId: useId(),
          isRowSelectable: false,
          print: false,
        }}
        data={data?.data || []}
        columns={[
          {
            label: "Product Code",
            name: "productCode",
          },
          {
            label: "Product Name",
            name: "product",
            options: { customBodyRender: (data) => data.name },
          },
          {
            label: "Grade",
            name: "product",
            options: { customBodyRender: (data) => data.name },
          },
          {
            label: "Packaging",
            name: "packagingCode",
          },
          {
            label: "Warehouse",
            name: "warehouse",
            options: { customBodyRender: (data) => data.name },
          },
          {
            label: "On Hand",
            name: "qtyOnHand",
          },
          {
            label: "Reserved",
            name: "qtyReserved",
          },
          {
            label: "Volume On Hand",
            name: "productPackaging",
            options: {
              customBodyRender: (data, { rowData }) => {
                return (
                  formatMoney(rowData[5] * data.unitQty) + " " + data.unitCode
                );
              },
            },
          },
          {
            label: "Volume Reserved",
            name: "productPackaging",
            options: {
              customBodyRender: (data, { rowData }) => {
                return (
                  formatMoney(rowData[6] * data.unitQty) + " " + data.unitCode
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
