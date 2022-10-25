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
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function PurchaseReceiptIndex() {
  const { data, isLoading } = trpc.purchaseReceipt.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

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
        <Link href="/purchases/receipt/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Purchase Receipt
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Penerimaan Pembelian"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          {
            label: "PO No",
            name: "docNo",
            options: {
              customBodyRender: (docNo) => (
                <Link href={`/purchases/receipt/${docNo}`}>
                  <a>{docNo}</a>
                </Link>
              ),
            },
          },
          {
            label: "DO No",
            name: "deliveryNoteNo",
          },
          {
            label: "Tgl Penerimaan",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Supplier",
            name: "purchaseOrder",
            options: {
              customBodyRender: (purchaseOrder) => purchaseOrder.supplier.name,
            },
          },
          {
            label: "Warehouse",
            name: "warehouse",
            options: {
              customBodyRender: (wh) => wh.name,
            },
          },

          {
            name: "docNo",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (docNo, { rowData }) => {
                return (
                  <>
                    <MoreMenu
                      actions={[
                        {
                          label: "Detail",
                          onClick: () => {
                            router.push(`/purchases/receipt/${docNo}`);
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
