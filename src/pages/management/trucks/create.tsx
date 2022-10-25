import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import TruckForm, { TruckFormValues } from "@/components/Forms/TruckForm";
import type { TruckFormSubmitHandler } from "@/components/Forms/TruckForm";
import { FormHelperText, Typography } from "@mui/material";

export default function PortCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.truck.create.useMutation({
    onSuccess: () => {
      router.push("/management/trucks");
    },
  });

  const onSave: TruckFormSubmitHandler<TruckFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Port
      </Typography>

      <TruckForm onSubmit={onSave}></TruckForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
