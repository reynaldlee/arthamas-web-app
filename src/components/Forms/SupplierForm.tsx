import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

import { supplierSchema } from "src/server/routers/supplier";
import { z } from "zod";

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export type SupplierFormSubmitHandler<T> = SubmitHandler<T>;

type SupplierFormProps = {
  onSubmit: SupplierFormSubmitHandler<SupplierFormValues>;
  defaultValues?: Partial<SupplierFormValues>;
  isEdit?: boolean;
};

export default function SupplierForm({
  onSubmit,
  isEdit,
  defaultValues,
}: SupplierFormProps) {
  // const supplierData = trpc.useQuery(["supplier.findAll"]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<SupplierFormValues>({
    defaultValues: defaultValues,
  });

  const submit: SupplierFormSubmitHandler<SupplierFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof SupplierFormValues],
        ])
      );

      return onSubmit({
        supplierCode: data.supplierCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Typography variant="h4">General Information</Typography>

      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          label="Supplier Code"
          {...register("supplierCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField
          label="Supplier Name"
          {...register("name")}
          required
        ></TextField>

        <TextField label="Phone" {...register("phone")}></TextField>
        <TextField
          label="Address"
          {...register("address")}
          multiline
          rows={4}
        ></TextField>
        <TextField
          label="Contact Email"
          {...register("contactEmail")}
        ></TextField>

        <Box display="flex" alignItems={"center"} gap={2}>
          <TextField
            label="Term of Payment"
            type="number"
            required
            sx={{ width: 200 }}
            {...register("top", {
              valueAsNumber: true,
            })}
          ></TextField>
          <Typography>days</Typography>
        </Box>

        <TextField label="Supplier Type" {...register("type")}></TextField>

        {/* <Autocomplete
          options={(customerGroupData.data?.data || []).map((item) => ({
            customerGroupCode: item.customerGroupCode,
            name: item.name,
          }))}
          defaultValue={selectedCustomerGroup.data?.data}
          getOptionLabel={(option) => `${option.name}`}
          loading={customerGroupData.isLoading}
          onChange={(_, value) => {
            setValue("customerGroupCode", value?.customerGroupCode, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          isOptionEqualToValue={(opt, value) =>
            opt.customerGroupCode === value.customerGroupCode
          }
          renderInput={(params) => (
            <TextField {...params} label="Customer Group" />
          )}
        ></Autocomplete> */}
      </Box>

      <Typography variant="h4" sx={{ mt: 3 }}>
        NPWP Info
      </Typography>
      <Box display="flex" sx={{ mt: 2 }} flexDirection="column" gap={2}>
        <TextField label="NPWP No." {...register("NPWP")}></TextField>
        <TextField
          label="NPWP Address"
          {...register("NPWPAddress")}
          multiline
          rows={4}
        ></TextField>
      </Box>

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isSubmitting || !isDirty}
      >
        {isEdit ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
