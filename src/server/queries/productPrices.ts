import { Prisma } from "@prisma/client";

type Params = {
  orgCode: string;
};

const getProductPriceListQuery = ({ orgCode }: Params) => {
  return Prisma.sql`
    `;
};
