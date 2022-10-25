import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";

import type {
  VesselFormSubmitHandler,
  VesselFormValues,
} from "@/components/Forms/VesselForm";
import { FormHelperText, Typography } from "@mui/material";
import VesselForm from "@/components/Forms/VesselForm";

export default function VesselCreate() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.useMutation(["vessel.create"], {
    onSuccess: () => {
      router.push("/management/vessels");
    },
  });

  const onSave: VesselFormSubmitHandler<VesselFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Vessel
      </Typography>

      <VesselForm onSubmit={onSave}></VesselForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
