import { formatMoney } from "@/utils/format";
import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";

const CustomTextField = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      inputProps={{
        style: {
          textAlign: "right",
        },
      }}
    ></TextField>
  );
};

type TextFieldNumberProps = {
  label?: string;
  value: string | number | null | undefined;
  onValueChange?: (value: number) => void;
  disabled?: NumericFormatProps["disabled"];
  readOnly?: NumericFormatProps["readOnly"];
} & TextFieldProps;

export default function TextFieldNumber({
  label,
  value,
  size,
  disabled,
  onValueChange,
  readOnly = false,
}: TextFieldNumberProps) {
  return (
    <NumericFormat
      value={value}
      label={label}
      disabled={disabled}
      inputMode="decimal"
      thousandSeparator
      size={size}
      allowNegative={false}
      decimalScale={2}
      InputProps={{
        color: "primary",
      }}
      renderText={(value) => {
        console.log(formatMoney(parseFloat(value)));
        return formatMoney(parseFloat(value));
      }}
      readOnly={readOnly}
      onValueChange={(value) =>
        onValueChange && onValueChange(value?.floatValue || 0)
      }
      customInput={CustomTextField}
    />
  );
}
