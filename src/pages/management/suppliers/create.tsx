import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import SupplierForm, {
  SupplierFormValues,
} from "@/components/Forms/SupplierForm";
import type { SupplierFormSubmitHandler } from "@/components/Forms/SupplierForm";
import { FormHelperText, Typography } from "@mui/material";

export default function SupplierCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.supplier.create.useMutation({
    onSuccess: () => {
      router.push("/management/suppliers");
    },
  });

  const onSave: SupplierFormSubmitHandler<SupplierFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Supplier
      </Typography>

      <SupplierForm onSubmit={onSave}></SupplierForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
