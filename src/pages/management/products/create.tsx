import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
// import ProductForm, { ProductFormValues } from "@/components/Forms/ProductForm";
// import type { ProductFormSubmitHandler } from "@/components/Forms/ProductForm";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
  MenuItem,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "src/server/routers/product";

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductCreatePage() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<ProductFormValues>();

  const productGrade = trpc.useQuery(["productGrade.findAll"]);
  const productCategory = trpc.useQuery(["productCategory.findAll"]);

  const createProductMutation = trpc.useMutation(["product.create"], {
    onSuccess: () => {
      router.push("/management/products");
    },
  });

  const handleSave = (data: ProductFormValues) => {};

  // const onSave: ProductFormSubmitHandler<ProductFormValues> = (data) => {
  //   submit(data);
  // };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Product
      </Typography>

      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          General Info
        </Typography>

        <Grid container mt={2} gap={2}>
          <Grid item xs={12}>
            <TextField
              label="Product Code"
              {...register("productCode", {
                required: true,
              })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              {...register("name", {
                required: true,
              })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              {...register("desc")}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField label="SKU" {...register("sku")} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Product Grade"
              {...register("sku")}
              fullWidth
              required
            >
              {productGrade.data?.data?.map((item) => (
                <MenuItem key={item.gradeCode}>{item.gradeName}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel control={<Switch />} label="Syntetic" />
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Packaging
        </Typography>
        <Typography variant="caption">
          Please select available packaging for this product{" "}
        </Typography>

        <Grid container>
          <Grid item xs>
            <TextField></TextField>
          </Grid>
        </Grid>
      </Box>

      <FormHelperText error={createProductMutation.isError}>
        {createProductMutation.error?.message}
      </FormHelperText>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit(handleSave)}
      >
        Submit
      </Button>
    </MainLayout>
  );
}
