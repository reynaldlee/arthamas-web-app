import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import CustomerForm, {
  CustomerFormValues,
} from "@/components/Forms/CustomerForm";
import type { CustomerFormSubmitHandler } from "@/components/Forms/CustomerForm";
import { FormHelperText, Typography } from "@mui/material";

export default function CustomerCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.useMutation(["customer.create"], {
    onSuccess: () => {
      router.push("/management/customers");
    },
  });

  const onSave: CustomerFormSubmitHandler<CustomerFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Customer
      </Typography>

      <CustomerForm onSubmit={onSave}></CustomerForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
