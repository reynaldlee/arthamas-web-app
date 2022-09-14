import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import ProductForm from "@/components/Forms/ProductForm";
import type {
  ProductFormSubmitHandler,
  ProductFormValues,
} from "@/components/Forms/ProductForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function PortEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.useQuery(["product.find", id]);

  const updateMutatation = trpc.useMutation(["product.update"], {
    onSuccess: () => {
      router.push("/management/products");
    },
  });

  const onSubmit: ProductFormSubmitHandler<ProductFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Customer
      </Typography>

      {data?.data ? (
        <ProductForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            ...data.data,
          }}
        ></ProductForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
