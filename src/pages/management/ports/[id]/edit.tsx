import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import PortForm from "@/components/Forms/PortForm";
import type {
  PortFormSubmitHandler,
  PortFormValues,
} from "@/components/Forms/PortForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function PortEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.port.find.useQuery(id);

  const updateMutatation = trpc.port.update.useMutation({
    onSuccess: () => {
      router.push("/management/ports");
    },
  });

  const onSubmit: PortFormSubmitHandler<PortFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Port
      </Typography>

      {data?.data ? (
        <PortForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            portCode: id,
            address: data?.data.address,
            area: data?.data.area,
            name: data?.data.name,
            lat: data?.data.lat as number | null,
            lng: data?.data.lng as number | null,
          }}
        ></PortForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
