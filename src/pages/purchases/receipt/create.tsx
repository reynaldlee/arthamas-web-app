import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import TextFieldNumber from "@/components/TextField/TextFieldNumber";

import { useRouter } from "next/router";

import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { pick } from "lodash";
import { DatePicker } from "@mui/x-date-pickers";
import { purchaseReceiptSchema } from "src/server/routers/purchaseReceipt";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type PurchaseReceiptFormValues = z.infer<typeof purchaseReceiptSchema>;

export default function PurchaseReceiptCreate() {
  const router = useRouter();
  const [editReceiptItem, setEditReceiptItem] = useState<undefined | number>();

  const purchaseOrderList = trpc.useQuery(["purchaseOrder.findAllForReceipt"]);
  const warehouseList = trpc.useQuery(["warehouse.findAll"]);

  const { register, watch, control, setValue, reset, handleSubmit } =
    useForm<PurchaseReceiptFormValues>();

  const purchaseReceiptItems = useFieldArray({
    name: "purchaseReceiptItems",
    control: control,
  });

  console.log(purchaseReceiptItems.fields);

  const handleAddItemBatch = (index: number) => {
    setEditReceiptItem(index);
  };

  const createPurchaseReceipt = trpc.useMutation(["purchaseReceipt.create"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/purchases/receipt");
    },
  });

  const selectedPurchaseOrderDocNo = watch("purchaseOrderDocNo");

  const selectedPO = trpc.useQuery(
    ["purchaseOrder.find", selectedPurchaseOrderDocNo],
    {
      enabled: !!selectedPurchaseOrderDocNo,
      onSuccess(data) {
        reset({
          date: new Date(),
          purchaseOrderDocNo: data.data?.docNo,
          warehouseCode: data.data?.warehouseCode,
        });
      },
    }
  );

  const handleAddMoreItem = () => {
    purchaseReceiptItems.append({});
  };

  const handleRemoveProduct = (index: number) => {
    purchaseReceiptItems.remove(index);
  };

  const purchaseOrderItems = useMemo(() => {
    return selectedPO.data?.data?.purchaseOrderItems;
  }, [selectedPO]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: PurchaseReceiptFormValues) => {
    createPurchaseReceipt.mutate(data);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Buat Penerimaan Pembelian</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              options={(purchaseOrderList.data?.data || []).map((item) =>
                pick(item, ["docNo", "supplier"])
              )}
              onChange={(_, value) => {
                setValue("purchaseOrderDocNo", value?.docNo!, {
                  shouldDirty: true,
                });
              }}
              disableClearable
              getOptionLabel={(option) =>
                `${option.docNo} (${option.supplier.name})`
              }
              isOptionEqualToValue={(opt, value) => opt.docNo === value.docNo}
              renderInput={(params) => (
                <TextField {...params} label="Select PO No." />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item md={3}>
          <DatePicker
            onChange={(value) => {
              setValue("date", value!);
            }}
            label="Tanggal Penerimaan"
            value={watch("date")}
            renderInput={(params) => (
              <TextField fullWidth {...params} required />
            )}
          />
        </Grid>

        <Grid item md={3}>
          <TextField
            {...register("deliveryNoteNo")}
            fullWidth
            required
            label="Nomor Surat Jalan"
          ></TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item md={3}>
          <Autocomplete
            options={(warehouseList.data?.data || []).map((item) =>
              pick(item, ["warehouseCode", "name"])
            )}
            value={
              warehouseList.data?.data.find(
                (item) => item.warehouseCode === watch("warehouseCode")
              ) || null
            }
            onChange={(_, value) => {
              setValue("warehouseCode", value?.warehouseCode, {
                shouldDirty: true,
              });
            }}
            disableClearable
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(opt, value) =>
              opt.warehouseCode === value.warehouseCode
            }
            renderInput={(params) => (
              <TextField {...params} label="Warehouse" />
            )}
          ></Autocomplete>
        </Grid>
      </Grid>

      <Typography sx={{ py: 2 }} variant="h3">
        Product List
      </Typography>
      <TableContainer sx={{ width: "100%" }}>
        <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 150 }}>Product</TableCell>
              {/* <TableCell sx={{ width: 50 }}>Packaging</TableCell> */}
              <TableCell sx={{ width: 50 }}>Qty PO</TableCell>
              <TableCell sx={{ width: 50 }}>Received</TableCell>
              <TableCell sx={{ width: 50 }}>Batch No</TableCell>
              <TableCell sx={{ width: 10 }}>Qty Receive</TableCell>
              <TableCell sx={{ width: 25 }}></TableCell>
              <TableCell sx={{ width: 25 }}>Volume Receive</TableCell>
              <TableCell sx={{ width: 25 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseReceiptItems.fields.map((item, index) => {
              const poLineNo = watch(
                `purchaseReceiptItems.${index}.purchaseOrderLineNo`
              );
              const isProductSelected = watch(
                `purchaseReceiptItems.${index}.productCode`
              );

              const qtyPO = selectedPO.data?.receiptSummary.find(
                (item) =>
                  item.productCode ===
                    watch(`purchaseReceiptItems.${index}.productCode`) &&
                  item.packagingCode ===
                    watch(`purchaseReceiptItems.${index}.packagingCode`)
              )?.qtyOrdered;

              const qtyReceived = selectedPO.data?.receiptSummary.find(
                (item) =>
                  item.productCode ===
                    watch(`purchaseReceiptItems.${index}.productCode`) &&
                  item.packagingCode ===
                    watch(`purchaseReceiptItems.${index}.packagingCode`)
              )?.qtyReceived;

              const poItem = purchaseOrderItems?.find(
                (item) => item.lineNo === poLineNo
              );

              return (
                <TableRow key={index}>
                  <TableCell sx={{ padding: 0.5 }}>
                    <Autocomplete
                      fullWidth
                      disableClearable
                      options={purchaseOrderItems || []}
                      isOptionEqualToValue={(opt, value) =>
                        opt.productCode === value.productCode &&
                        opt.lineNo === value.lineNo &&
                        opt.packagingCode === value.packagingCode
                      }
                      value={purchaseOrderItems?.find(
                        (item) =>
                          item.lineNo ===
                          watch(
                            `purchaseReceiptItems.${index}.purchaseOrderLineNo`
                          )
                      )}
                      getOptionLabel={(option) =>
                        `${option.product.name} [${option.packagingCode}]`
                      }
                      onChange={(_, value) => {
                        purchaseReceiptItems.update(index, {
                          packagingCode: value.packagingCode,
                          productCode: value.productCode,
                          purchaseOrderLineNo: value.lineNo,
                          qty: 0,
                          unitCode: value.unitCode,
                          unitQty: value.unitQty,
                          totalUnitQty: 0,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select Product"
                        />
                      )}
                    />
                  </TableCell>

                  {/* <TableCell sx={{ padding: 0.5 }}>
                    <TextField disabled>
                      {watch(`purchaseReceiptItems.${index}.packagingCode`)}
                    </TextField>
                  <Autocomplete
                      fullWidth
                      disableClearable
                      options={
                        purchaseOrderItems
                          ?.filter(
                            (item) =>
                              item.productCode ===
                              watch(`purchaseReceiptItems.${index}.productCode`)
                          )
                          .map((item) => ({
                            packagingCode: item.packagingCode,
                          })) || []
                      }
                      isOptionEqualToValue={(opt, value) =>
                        opt.packagingCode === value.packagingCode
                      }
                      value={{
                        packagingCode: watch(
                          `purchaseReceiptItems.${index}.packagingCode`
                        ),
                      }}
                      getOptionLabel={(option) => option.packagingCode || ""}
                      onChange={(_, value) => {
                        setValue(
                          `purchaseReceiptItems.${index}.packagingCode`,
                          value.packagingCode
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Packaging"
                        />
                      )}
                    /> 
                  </TableCell>*/}

                  <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                    {isProductSelected ? (
                      <Typography>{qtyPO?.toString()}</Typography>
                    ) : null}
                  </TableCell>
                  <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                    {isProductSelected ? (
                      <Typography>{qtyReceived?.toString()}</Typography>
                    ) : null}
                  </TableCell>

                  <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                    <TextField
                      required
                      value={
                        watch(`purchaseReceiptItems.${index}.batchNo`) || null
                      }
                      onChange={(e) => {
                        setValue(
                          `purchaseReceiptItems.${index}.batchNo`,
                          e.target.value
                        );
                      }}
                    ></TextField>
                  </TableCell>

                  <TableCell padding="none">
                    <TextFieldNumber
                      value={watch(`purchaseReceiptItems.${index}.qty`)}
                      onValueChange={(value) => {
                        setValue(`purchaseReceiptItems.${index}.qty`, value);
                        setValue(
                          `purchaseReceiptItems.${index}.totalUnitQty`,
                          value * item.unitQty
                        );
                      }}
                    ></TextFieldNumber>
                  </TableCell>
                  <TableCell>
                    <Typography>{poItem?.packagingCode || ""}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0.5 }}>
                    <Typography>
                      {watch(`purchaseReceiptItems.${index}.totalUnitQty`) +
                        " " +
                        item.unitCode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0.5 }}>
                    <IconButton
                      onClick={() => handleRemoveProduct(index)}
                      color="error"
                      size="medium"
                    >
                      <DeleteIcon fontSize="small"></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container sx={{ pt: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={handleAddMoreItem}>
            Tambah Produk
          </Button>
        </Grid>
      </Grid>

      <Grid container sx={{ py: 3 }} spacing={4}>
        <Grid item md={6} xs={12}>
          <TextField
            label="Memo"
            multiline
            rows={4}
            fullWidth
            {...register("memo")}
          ></TextField>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4, pb: 4 }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            disabled={createPurchaseReceipt.isLoading}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={createPurchaseReceipt.isLoading}
            startIcon={<SaveAltOutlinedIcon />}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      {editReceiptItem !== undefined ? (
        <Dialog open fullWidth>
          <DialogTitle>
            {
              selectedPO.data?.data?.purchaseOrderItems[editReceiptItem].product
                .name
            }
          </DialogTitle>
          <DialogContent>
            <Typography>test</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setEditReceiptItem(undefined);
              }}
            >
              Batal
            </Button>
            <Button variant="contained">Simpan</Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {createPurchaseReceipt.isError ? (
        <FormHelperText error>
          {createPurchaseReceipt.error.message}
        </FormHelperText>
      ) : null}
    </MainLayout>
  );
}
