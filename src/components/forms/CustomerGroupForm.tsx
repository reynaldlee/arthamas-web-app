import { trpc } from "@/utils/trpc";
import { Box, Button, TextField } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";
import { customerGroupSchema } from "src/server/routers/customerGroup";
import { z } from "zod";

export type CustomerGroupFormValues = z.infer<typeof customerGroupSchema>;

export type CustomerGroupFormSubmitHandler<T> = SubmitHandler<T>;

type CustomerGroupFormProps = {
  onSubmit: CustomerGroupFormSubmitHandler<CustomerGroupFormValues>;
  defaultValues?: Partial<CustomerGroupFormValues>;
  isEdit?: boolean;
};

export default function CustomerGroupForm({
  onSubmit,
  isEdit,
  defaultValues,
}: CustomerGroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<CustomerGroupFormValues>({
    defaultValues: defaultValues,
  });

  const submit: CustomerGroupFormSubmitHandler<CustomerGroupFormValues> = (
    data
  ) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof CustomerGroupFormValues],
        ])
      );

      return onSubmit({
        customerGroupCode: data.customerGroupCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Customer Group Code"
          {...register("customerGroupCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField label="Phone" {...register("phone")}></TextField>
        <TextField
          label="Address"
          {...register("address")}
          multiline
          rows={4}
        ></TextField>
        <TextField label="Type" {...register("type")}></TextField>
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
