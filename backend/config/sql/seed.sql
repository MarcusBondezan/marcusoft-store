-- Products
INSERT INTO public.product
(id,description, price, width, height, length, weight)
VALUES(1, 'A', 1000, 100, 30, 10, 3);

INSERT INTO public.product
(id,description, price, width, height, length, weight)
VALUES(2, 'B', 5000, 50, 50, 50, 22);

INSERT INTO public.product
(id,description, price, width, height, length, weight)
VALUES(3, 'C', 30, 10, 10, 10, 0.9);

-- Coupons
INSERT INTO public.coupon
(code, percentage, expire_date)
VALUES('VALE20', 20, '2023-10-01T10:00:00');

INSERT INTO public.coupon
(code, percentage, expire_date)
VALUES('VALE10', 10, '2022-10-01T10:00:00');