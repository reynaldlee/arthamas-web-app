import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

type ChangePasswordSubmitHandler = SubmitHandler<ChangePasswordFormValues>;

export default function ProfilePage() {
  const { data } = trpc.profile.me.useQuery();

  const changePassword = trpc.profile.changePassword.useMutation();

  const { handleSubmit, register, reset } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleChangePassword: ChangePasswordSubmitHandler = async (data) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        alert("Password berhasil diubah");
        reset();
      },
    });
  };

  return (
    <MainLayout>
      <Typography variant="h4">My Profile</Typography>
      <Grid container mt={2} gap={2}>
        <TextField
          disabled
          value={data?.data?.name}
          label="Nama"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          disabled
          value={data?.data?.email}
          label="Email"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          disabled
          value={data?.data?.username}
          label="Username"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Change Password
      </Typography>
      <Grid container gap={2} mt={2}>
        <TextField
          {...register("oldPassword")}
          label="Password Lama"
          type="password"
          required
        />

        <TextField
          {...register("newPassword", {
            min: {
              value: 6,
              message: "Harus minimal 6 karakter",
            },
          })}
          label="Password Baru"
          type="password"
          required
        />
      </Grid>
      <FormHelperText error={changePassword.isError}>
        {changePassword.error?.message}
      </FormHelperText>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit(handleChangePassword)}
        disabled={changePassword.isLoading}
      >
        Update Password
      </Button>
    </MainLayout>
  );
}
