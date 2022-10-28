import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

export type AreaFormValues = {
  areaCode: string;
  areaName: string;
};
export type AreaFormSubmitHandler<T> = SubmitHandler<T>;

type AreaFormProps = {
  onSubmit: AreaFormSubmitHandler<AreaFormValues>;
  defaultValues?: Partial<AreaFormValues>;
  isEdit?: boolean;
};

export default function AreaForm({
  onSubmit,
  isEdit,
  defaultValues,
}: AreaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<AreaFormValues>({
    defaultValues: defaultValues,
  });

  const submit: AreaFormSubmitHandler<AreaFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof AreaFormValues],
        ])
      );

      return onSubmit({
        areaCode: data.areaCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Area Code"
          {...register("areaCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField label="Name" {...register("areaName")} required></TextField>
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
