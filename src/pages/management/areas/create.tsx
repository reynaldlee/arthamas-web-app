import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import AreaForm, { AreaFormValues } from "@/components/Forms/AreaForm";
import type { AreaFormSubmitHandler } from "@/components/Forms/AreaForm";
import { FormHelperText, Typography } from "@mui/material";

export default function PortCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.useMutation(["area.create"], {
    onSuccess: () => {
      router.push("/management/areas");
    },
  });

  const onSave: AreaFormSubmitHandler<AreaFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Port
      </Typography>

      <AreaForm onSubmit={onSave}></AreaForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
