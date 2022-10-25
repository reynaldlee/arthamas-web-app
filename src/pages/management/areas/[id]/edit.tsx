import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import AreaForm from "@/components/Forms/AreaForm";
import type {
  AreaFormSubmitHandler,
  AreaFormValues,
} from "@/components/Forms/AreaForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function PortEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

    const { data } = trpc.area.find.useQuery(id, {
        staleTime: 0,
        trpc: {}
    });

  const updateMutatation = trpc.area.update.useMutation({
    onSuccess: () => {
      router.push("/management/areas");
    },
  });

  const onSubmit: AreaFormSubmitHandler<AreaFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Area
      </Typography>

      {data?.data ? (
        <AreaForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            areaCode: data?.data.areaCode,
            areaName: data?.data.areaName,
          }}
        ></AreaForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
