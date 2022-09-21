import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import PaymentIcon from "@mui/icons-material/Payment";
import DueTodayIcon from "@mui/icons-material/CalendarToday";
import DeliveryIn7Days from "@mui/icons-material/LocalShipping";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import StatusBadge from "@/components/Badges/StatusBadge";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function PurchasePaymentIndex() {
  const { data, isLoading } = trpc.useQuery(["salesPayment.findAll"]);
  const tableId = useId();
  const router = useRouter();

  const { mutate: cancelInvoice } = trpc.useMutation(["salesInvoice.cancel"]);

  return (
    <MainLayout>
      <MUIDataTable
        title="Sales Payments"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        data={data?.data || []}
        columns={[
          { label: "Payment No", name: "docNo" },
          {
            label: "Paid Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Customer",
            name: "customer",
            options: {
              customBodyRender: (customer) => customer.name,
            },
          },
          {
            label: "Status",
            name: "status",
            options: {
              customBodyRender: (status) => (
                <StatusBadge status={status}></StatusBadge>
              ),
            },
          },

          {
            label: "Currency",
            name: "currencyCode",
          },
          {
            label: "Amount",
            name: "totalAmount",
            options: {
              customBodyRender: (value) => formatMoney(value),
            },
          },
          {
            name: "docNo",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (id) => {
                return (
                  <>
                    <MoreMenu
                      actions={[
                        {
                          label: "Edit",
                          onClick: () =>
                            router.push(`/sales/invoices/${id}/edit`),
                        },
                        {
                          label: "Print Invoice",
                          onClick: () =>
                            router.push(`/sales/invoices/${id}/print`),
                        },
                        {
                          label: "Create Payment",
                          onClick: () =>
                            router.push(
                              `/sales/payments/create?salesDeliveryDocNo=${id}`
                            ),
                        },
                        {
                          label: "Cancel",
                          danger: true,
                          onClick: () => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel ${id}`
                              )
                            ) {
                              cancelOrder(id);
                              router.reload();
                            }
                          },
                        },
                      ]}
                    ></MoreMenu>
                  </>
                );
              },
            },
          },
        ]}
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
