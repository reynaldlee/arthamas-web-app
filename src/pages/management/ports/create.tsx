import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import PortForm, { PortFormValues } from "@/components/Forms/PortForm";
import type { PortFormSubmitHandler } from "@/components/Forms/PortForm";
import { FormHelperText, Typography } from "@mui/material";

export default function PortCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.port.create.useMutation({
    onSuccess: () => {
      router.push("/management/ports");
    },
  });

  const onSave: PortFormSubmitHandler<PortFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Port
      </Typography>

      <PortForm onSubmit={onSave}></PortForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
