CREATE TABLE "product" (
    "id"            SERIAL          NOT NULL,
    "description"   TEXT            NOT NULL,
    "price"         DECIMAL(65,30)  NOT NULL,
    "width"         INTEGER         NOT NULL,
    "height"        INTEGER         NOT NULL,
    "length"        INTEGER         NOT NULL,
    "weight"        DECIMAL(65,30)  NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

INSERT INTO public.product (id,description, price, width, height, length, weight) VALUES(1, 'A', 1000, 100, 30, 10, 3);
INSERT INTO public.product (id,description, price, width, height, length, weight) VALUES(2, 'B', 5000, 50, 50, 50, 22);
INSERT INTO public.product (id,description, price, width, height, length, weight) VALUES(3, 'C', 30, 10, 10, 10, 0.9);


CREATE TABLE "coupon" (
    "code"          TEXT            NOT NULL,
    "percentage"    DECIMAL(65,30)  NOT NULL,
    "expire_date"   TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("code")
);

INSERT INTO public.coupon (code, percentage, expire_date) VALUES('VALE20', 20, '2023-10-01T10:00:00');
INSERT INTO public.coupon (code, percentage, expire_date) VALUES('VALE10', 10, '2022-10-01T10:00:00');

CREATE TABLE "order" (
    "id"        UUID            NOT NULL,
    "code"      TEXT            NOT NULL,
    "cpf"       TEXT            NOT NULL,
    "total"     DECIMAL(65,30)  NOT NULL,
    "freight"   DECIMAL(65,30)  NOT NULL,
    "sequence"  INTEGER         NOT NULL,
    "date"      TIMESTAMP       NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "item" (
    "id_order"      UUID            NOT NULL,
    "id_product"    INTEGER         NOT NULL,
    "price"         DECIMAL(65,30)  NOT NULL,
    "quantity"      INTEGER         NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id_order","id_product")
);

ALTER TABLE "item" ADD CONSTRAINT "item_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item" ADD CONSTRAINT "item_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "zipcode" (
    "code"  TEXT        NOT NULL,
    "lat"   NUMERIC     NOT NULL,
    "long"  NUMERIC     NOT NULL
);

INSERT INTO public.zipcode (code, lat, long) VALUES('22060030', -27.5945, -48.5477);
INSERT INTO public.zipcode (code, lat, long) VALUES('88015600', -22.9129, -43.2003);
