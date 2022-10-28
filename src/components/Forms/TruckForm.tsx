import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";
import { truckSchema } from "src/server/routers/truck";
import { z } from "zod";

export type TruckFormValues = z.infer<typeof truckSchema>;
export type TruckFormSubmitHandler<T> = SubmitHandler<T>;

type TruckFormProps = {
  onSubmit: TruckFormSubmitHandler<TruckFormValues>;
  defaultValues?: Partial<TruckFormValues>;
  isEdit?: boolean;
};

export default function TruckForm({
  onSubmit,
  isEdit,
  defaultValues,
}: TruckFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<TruckFormValues>({
    defaultValues: defaultValues,
  });

  const submit: TruckFormSubmitHandler<TruckFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof TruckFormValues],
        ])
      );

      return onSubmit({
        truckCode: data.truckCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Truck Code"
          {...register("truckCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField
          label="Nopol"
          {...register("policeNumber")}
          required
        ></TextField>
        <TextField label="Tipe Truck" {...register("type")}></TextField>
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
