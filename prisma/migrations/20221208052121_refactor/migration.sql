/*
  Warnings:

  - You are about to alter the column `taxRate` on the `PurchaseInvoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `withholdingTaxRate` on the `PurchaseInvoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to drop the column `purchaseOrderItemDocNo` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseOrderItemLineNo` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseOrderItemOrgCode` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseReceiptLineNo` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.
  - You are about to alter the column `taxRate` on the `PurchaseOrder` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `taxRate` on the `PurchasePayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `withholdingTaxRate` on the `PurchasePayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - The primary key for the `PurchasePaymentDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lineNo` on the `PurchasePaymentDetail` table. All the data in the column will be lost.
  - The primary key for the `SalesDeliveryItemDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lineNo` on the `SalesDeliveryItemDetail` table. All the data in the column will be lost.
  - You are about to alter the column `taxRate` on the `SalesInvoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `withholdingTaxRate` on the `SalesInvoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to drop the column `cancelledBy` on the `SalesPayment` table. All the data in the column will be lost.
  - You are about to alter the column `taxRate` on the `SalesPayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `withholdingTaxRate` on the `SalesPayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - The primary key for the `SalesPaymentDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lineNo` on the `SalesPaymentDetail` table. All the data in the column will be lost.
  - You are about to alter the column `taxRate` on the `SalesReturn` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `withholdingTaxRate` on the `SalesReturn` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to drop the column `isWithholding` on the `Tax` table. All the data in the column will be lost.
  - You are about to alter the column `taxRate` on the `Tax` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - Added the required column `totalUnitQty` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCode` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitQty` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierCode` to the `PurchasePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `SalesDeliveryItemDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goodsReleaseOrderDocNo` to the `SalesDeliveryItemDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SalesDeliveryItemDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `SalesDeliveryItemDetail` table without a default value. This is not possible if the table is not empty.
  - Made the column `taxRate` on table `SalesOrder` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `customerCode` to the `SalesPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `SalesPayment` table without a default value. This is not possible if the table is not empty.
  - Made the column `taxRate` on table `SalesQuote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PurchaseInvoiceItem` DROP FOREIGN KEY `PurchaseInvoiceItem_purchaseOrderItemDocNo_purchaseOrderIte_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseInvoiceItem` DROP FOREIGN KEY `PurchaseInvoiceItem_purchaseReceiptDocNo_purchaseReceiptLin_fkey`;

-- DropForeignKey
ALTER TABLE `SalesDeliveryItemDetail` DROP FOREIGN KEY `SalesDeliveryItemDetail_docNo_lineNo_orgCode_fkey`;

-- AlterTable
ALTER TABLE `PurchaseInvoice` ADD COLUMN `memo` TEXT NULL,
    ADD COLUMN `otherFees` DECIMAL(15, 2) NULL DEFAULT 0,
    ADD COLUMN `paidAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `supplierCode` VARCHAR(20) NULL,
    ADD COLUMN `unpaidAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    MODIFY `taxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    MODIFY `withholdingTaxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `cancelledBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PurchaseInvoiceItem` DROP COLUMN `purchaseOrderItemDocNo`,
    DROP COLUMN `purchaseOrderItemLineNo`,
    DROP COLUMN `purchaseOrderItemOrgCode`,
    DROP COLUMN `purchaseReceiptLineNo`,
    ADD COLUMN `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `unitCode` VARCHAR(10) NOT NULL,
    ADD COLUMN `unitQty` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `PurchaseOrder` MODIFY `taxRate` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PurchasePayment` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `supplierCode` VARCHAR(20) NOT NULL,
    MODIFY `taxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `withholdingTaxRate` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PurchasePaymentDetail` DROP PRIMARY KEY,
    DROP COLUMN `lineNo`,
    ADD PRIMARY KEY (`docNo`, `purchaseInvoiceDocNo`);

-- AlterTable
ALTER TABLE `PurchaseReceipt` ADD COLUMN `status` ENUM('Open', 'OnProgress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Open';

-- AlterTable
ALTER TABLE `SalesDelivery` ADD COLUMN `printDate` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `SalesDeliveryItemDetail` DROP PRIMARY KEY,
    DROP COLUMN `lineNo`,
    ADD COLUMN `batchNo` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` VARCHAR(20) NOT NULL,
    ADD COLUMN `goodsReleaseOrderDocNo` VARCHAR(40) NOT NULL,
    ADD COLUMN `packagingCode` VARCHAR(10) NULL,
    ADD COLUMN `productCode` VARCHAR(191) NULL,
    ADD COLUMN `salesDeliveryItemDocNo` VARCHAR(40) NULL,
    ADD COLUMN `salesDeliveryItemLineNo` INTEGER NULL,
    ADD COLUMN `salesDeliveryItemOrgCode` VARCHAR(20) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedBy` VARCHAR(20) NOT NULL,
    MODIFY `docNo` VARCHAR(40) NULL,
    ADD PRIMARY KEY (`barcode`, `goodsReleaseOrderDocNo`, `orgCode`);

-- AlterTable
ALTER TABLE `SalesInvoice` MODIFY `taxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `withholdingTaxRate` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SalesOrder` MODIFY `taxRate` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `SalesPayment` DROP COLUMN `cancelledBy`,
    ADD COLUMN `customerCode` VARCHAR(40) NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL,
    MODIFY `taxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `withholdingTaxRate` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SalesPaymentDetail` DROP PRIMARY KEY,
    DROP COLUMN `lineNo`,
    ADD PRIMARY KEY (`docNo`, `salesInvoiceDocNo`, `orgCode`);

-- AlterTable
ALTER TABLE `SalesQuote` MODIFY `taxRate` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `SalesReturn` MODIFY `taxRate` DOUBLE NULL DEFAULT 0,
    MODIFY `withholdingTaxRate` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Tax` DROP COLUMN `isWithholding`,
    MODIFY `taxRate` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItemDetail` ADD CONSTRAINT `SalesDeliveryItemDetail_salesDeliveryItemDocNo_salesDeliver_fkey` FOREIGN KEY (`salesDeliveryItemDocNo`, `salesDeliveryItemLineNo`, `salesDeliveryItemOrgCode`) REFERENCES `SalesDeliveryItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPayment` ADD CONSTRAINT `SalesPayment_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoice` ADD CONSTRAINT `PurchaseInvoice_supplierCode_orgCode_fkey` FOREIGN KEY (`supplierCode`, `orgCode`) REFERENCES `Supplier`(`supplierCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_purchaseReceiptDocNo_lineNo_orgCode_fkey` FOREIGN KEY (`purchaseReceiptDocNo`, `lineNo`, `orgCode`) REFERENCES `PurchaseReceiptItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_supplierCode_orgCode_fkey` FOREIGN KEY (`supplierCode`, `orgCode`) REFERENCES `Supplier`(`supplierCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePaymentDetail` ADD CONSTRAINT `PurchasePaymentDetail_purchaseInvoiceDocNo_orgCode_fkey` FOREIGN KEY (`purchaseInvoiceDocNo`, `orgCode`) REFERENCES `PurchaseInvoice`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
