import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import WarehouseForm, {
  WarehouseFormValues,
} from "@/components/Forms/WarehouseForm";
import type { WarehouseFormSubmitHandler } from "@/components/Forms/WarehouseForm";
import { FormHelperText, Typography } from "@mui/material";

export default function WarehouseCreatePage() {
  const router = useRouter();

  const {
    mutate: create,
    error,
    isError,
  } = trpc.useMutation(["warehouse.create"], {
    onSuccess: () => {
      router.push("/management/warehouses");
    },
  });

  const onSave: WarehouseFormSubmitHandler<WarehouseFormValues> = (data) => {
    create({
      ...data,
      areaCode: data.area?.areaCode!,
    });
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Warehouse
      </Typography>

      <WarehouseForm onSubmit={onSave}></WarehouseForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
