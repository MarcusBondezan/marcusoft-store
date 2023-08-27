-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "coupon" (
    "code" TEXT NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,
    "expire_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("code")
);

CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "freight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "item" (
    "id_order" UUID NOT NULL,
    "id_product" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id_order","id_product")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item" ADD CONSTRAINT "item_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
