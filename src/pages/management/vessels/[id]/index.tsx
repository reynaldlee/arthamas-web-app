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
import { register } from "numeral";

type QueryParams = {
  id: string;
};

type ProductPackagingFormValues = z.infer<typeof productPackagingSchema>;

export default function VesselDetail() {
  const router = useRouter();
  const { id } = router.query as QueryParams;
  const [tabIndex, setTabIndex] = useState("1");

  const { data, refetch, isLoading } = trpc.useQuery(["vessel.find", id]);
  const vesselProduct = trpc.useQuery(["vessel.getVesselProducts", id]);
  const productList = trpc.useQuery(["product.findAll"]);

  const vesselProductForm = useForm();

  const addVesselProduct = trpc.useMutation(["vessel.addProducts"], {
    onSuccess: () => {
      //   refetch();
      vesselProduct.refetch();
    },
  });

  //   const handleAddPackaging: SubmitHandler<ProductPackagingFormValues> = (
  //     data
  //   ) => {
  //     addProductPackaging.mutate({ ...data, productCode });
  //   };

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h3">Vessel Detail</Typography>
        {/* <Typography>{productCode}</Typography> */}
      </Box>

      <Paper>
        <Box p={4}>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h2">General Info</Typography>

              <Grid container spacing={2} mt={4}>
                <Grid item md={3}>
                  <Typography variant="h4">Vessel Name</Typography>
                  <Typography>{data?.data?.name}</Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="h4">IMO</Typography>
                  <Typography>{data?.data?.imoNumber}</Typography>
                </Grid>

                <Grid item md={3}>
                  <Typography variant="h4">Registration No.</Typography>
                  <Typography>{data?.data?.regNo}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={4}>
                <Grid item md={3}>
                  <Typography variant="h4">Teus</Typography>
                  <Typography>{data?.data?.teus}</Typography>
                </Grid>

                {/* <Grid item md={3}>
                  <Typography variant="h4">NPT From</Typography>
                  <Typography>
                    {formatDate(data?.data?.nptValidFrom)}
                  </Typography>
                </Grid>

                <Grid item md={4}>
                  <Typography variant="h4">NPT Valid until</Typography>
                  <Typography>{formatDate(data?.data?.nptValidTo)}</Typography>
                </Grid> */}
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
            <Tab label="Product Charts" value={"1"} />
            <Tab label="Other Information" value={"2"} />
          </TabList>

          <TabPanel value={"1"}>
            <Box maxWidth={800}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Product Grade</TableCell>
                        <TableCell>Product Type</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <>
                        {vesselProduct.data?.data?.map((item) => {
                          return (
                            <TableRow key={item.productCode}>
                              <TableCell>{item.product.productCode}</TableCell>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>
                                {item.product.productGradeCode}
                              </TableCell>
                              <TableCell>
                                {item.product.productTypeCode}
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>
                            <TextField
                              select
                              fullWidth
                              variant="outlined"
                              {...vesselProductForm.register("productCode")}
                            >
                              {productList.data?.data.map((item) => {
                                return (
                                  <MenuItem
                                    key={item.productCode}
                                    value={item.productCode}
                                  >
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={vesselProductForm.handleSubmit(
                                (data) => {
                                  addVesselProduct.mutate({
                                    ...data,
                                    vesselCode: id,
                                  });
                                }
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
          <TabPanel value={"2"}></TabPanel>
        </TabContext>
      </Box>

      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
