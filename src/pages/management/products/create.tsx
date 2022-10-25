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

  const productGrade = trpc.productGrade.findAll.useQuery();
  const productType = trpc.productType.findAll.useQuery();
  const productCategory = trpc.productCategory.findAll.useQuery();

  const createProductMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      router.push("/management/products");
    },
  });

  const handleSave = (data: ProductFormValues) => {
    createProductMutation.mutate(data);
  };

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
              {...register("productGradeCode")}
              defaultValue=""
              fullWidth
              required
            >
              {(productGrade.data?.data || []).map((item) => (
                <MenuItem
                  key={item.productGradeCode}
                  value={item.productGradeCode}
                >
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Product Type"
              {...register("productTypeCode")}
              defaultValue=""
              fullWidth
              required
            >
              {(productType.data?.data || []).map((item) => (
                <MenuItem
                  key={item.productTypeCode}
                  value={item.productTypeCode}
                >
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Product Category"
              {...register("productCategoryCode")}
              defaultValue=""
              fullWidth
              required
            >
              {(productCategory.data?.data || []).map((item) => (
                <MenuItem
                  key={item.productCategoryCode}
                  value={item.productCategoryCode}
                >
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          NPT Info
        </Typography>

        <Grid container>
          <Grid item md>
            <TextField label="NPT No." {...register("nptNumber")} />
          </Grid>
          <Grid item md>
            <TextField
              type="date"
              label="NPT Date"
              {...register("nptValidFrom", {
                valueAsDate: true,
              })}
            ></TextField>
          </Grid>
          <Grid item md>
            <TextField
              type="date"
              label="NPT Valid Until"
              {...register("nptValidTo", {
                valueAsDate: true,
              })}
            ></TextField>
          </Grid>
        </Grid>
      </Box>

      {/* <Box mt={4}>
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
      </Box> */}

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
