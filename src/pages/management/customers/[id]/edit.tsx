import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import CustomerForm from "@/components/Forms/CustomerForm";
import type {
  CustomerFormSubmitHandler,
  CustomerFormValues,
} from "@/components/Forms/CustomerForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function PortEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.customer.find.useQuery(id);

  const updateMutatation = trpc.customer.update.useMutation({
    onSuccess: () => {
      router.push("/management/customers");
    },
  });

  const onSubmit: CustomerFormSubmitHandler<CustomerFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Customer
      </Typography>

      {data?.data ? (
        <CustomerForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            ...data.data,
          }}
        ></CustomerForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
