import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import CustomerGroupForm, {
  CustomerGroupFormValues,
} from "@/components/Forms/CustomerGroupForm";
import type { CustomerGroupFormSubmitHandler } from "@/components/Forms/CustomerGroupForm";
import { FormHelperText, Typography } from "@mui/material";

export default function CustomerCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.useMutation(["customerGroup.create"], {
    onSuccess: () => {
      router.push("/management/customer-groups");
    },
  });

  const onSave: CustomerGroupFormSubmitHandler<CustomerGroupFormValues> = (
    data
  ) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Customer Group
      </Typography>

      <CustomerGroupForm onSubmit={onSave}></CustomerGroupForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
