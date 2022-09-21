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

export default function ProductDetail() {
  const router = useRouter();
  const { productCode } = router.query as QueryParams;
  const [tabIndex, setTabIndex] = useState("1");

  const { data, refetch, isLoading } = trpc.useQuery([
    "product.find",
    productCode,
  ]);

  const productPrices = trpc.useQuery(
    ["product.findProductPrices", productCode],
    { enabled: !!productCode }
  );

  const inventory = trpc.useQuery(["inventory.findAllByProduct", productCode], {
    enabled: !!productCode,
  });

  const productPackagingForm = useForm<ProductPackagingFormValues>({
    defaultValues: { productCode },
  });

  const addProductPackaging = trpc.useMutation(["product.addPackaging"], {
    onSuccess: () => {
      refetch();
      productPackagingForm.reset();
    },
  });

  const handleAddPackaging: SubmitHandler<ProductPackagingFormValues> = (
    data
  ) => {
    addProductPackaging.mutate({ ...data, productCode });
  };

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h3">Product Detail</Typography>
        <Typography>{productCode}</Typography>
      </Box>

      <Paper>
        <Box p={4}>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h2">General Info</Typography>

              <Grid container spacing={2} mt={4}>
                <Grid item md={3}>
                  <Typography variant="h4">Product Name</Typography>
                  <Typography>{data?.data?.name}</Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="h4">Grade</Typography>
                  <Typography>{data?.data?.productGrade.name}</Typography>
                </Grid>

                <Grid item md={3}>
                  <Typography variant="h4">Type</Typography>
                  <Typography>{data?.data?.productType?.name}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={4}>
                <Grid item md={3}>
                  <Typography variant="h4">NPT Number</Typography>
                  <Typography>{data?.data?.nptNumber}</Typography>
                </Grid>

                <Grid item md={3}>
                  <Typography variant="h4">NPT From</Typography>
                  <Typography>
                    {formatDate(data?.data?.nptValidFrom)}
                  </Typography>
                </Grid>

                <Grid item md={4}>
                  <Typography variant="h4">NPT Valid until</Typography>
                  <Typography>{formatDate(data?.data?.nptValidTo)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box mt={4}>
        <TabContext value={tabIndex}>
          <TabList
            onChange={(_, index) => {
              setTabIndex(index);
            }}
          >
            <Tab label="Packaging" value={"1"} />
            <Tab label="Price Book" value={"2"} />
            <Tab label="Inventory" value={"3"} />
          </TabList>

          <TabPanel value={"1"}>
            <Box maxWidth={400}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Packaging</TableCell>
                        <TableCell>Unit Qty</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <>
                        {data?.data?.packagings.map((item) => {
                          return (
                            <TableRow key={item.packagingCode}>
                              <TableCell>{item.packagingCode}</TableCell>
                              <TableCell>{item.unitQty}</TableCell>
                              <TableCell>{item.unitCode}</TableCell>
                            </TableRow>
                          );
                        })}

                        <TableRow>
                          <TableCell>
                            <TextField
                              variant="standard"
                              fullWidth
                              select
                              {...productPackagingForm.register(
                                "packagingCode"
                              )}
                            >
                              <MenuItem value="DRUM">DRUM</MenuItem>
                              <MenuItem value="TANK">TANK</MenuItem>
                              <MenuItem value="BULK">BULK</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              fullWidth
                              type="number"
                              {...productPackagingForm.register("unitQty", {
                                valueAsNumber: true,
                              })}
                            ></TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              fullWidth
                              select
                              {...productPackagingForm.register("unitCode")}
                            >
                              <MenuItem value="LTR">LTR</MenuItem>
                              <MenuItem value="KG">KG</MenuItem>
                              <MenuItem value="PCS">PCS</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={productPackagingForm.handleSubmit(
                                handleAddPackaging
                              )}
                            >
                              <AddIcon></AddIcon>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </TabPanel>
          <TabPanel value={"2"}>
            <MUIDataTable
              title=""
              options={{
                tableId: useId(),
              }}
              data={productPrices.data?.data || []}
              columns={[
                {
                  label: "Customer",
                  name: "customer",
                  options: {
                    customBodyRender: (data) => data.name,
                  },
                },
                {
                  label: "Port",
                  name: "port",
                  options: {
                    customBodyRender: (data) => data.name,
                  },
                },
                {
                  label: "Currency",
                  name: "currencyCode",
                },
                {
                  label: "unitPrice",
                  name: "unitPrice",
                  options: {
                    customBodyRender: formatMoney,
                  },
                },
              ]}
            ></MUIDataTable>
          </TabPanel>
          <TabPanel value={"3"}>
            <MUIDataTable
              title=""
              options={{
                tableId: useId(),
                isRowSelectable: false,
                print: false,
              }}
              data={inventory.data?.data || []}
              columns={[
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
                  label: "Packaging",
                  name: "packagingCode",
                },

                {
                  label: "Unit",
                  name: "productPackaging",
                  options: { customBodyRender: (data) => data.unitCode },
                },
              ]}
            ></MUIDataTable>
          </TabPanel>
        </TabContext>
      </Box>

      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
