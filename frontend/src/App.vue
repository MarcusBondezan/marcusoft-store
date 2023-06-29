<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
  import CheckoutGateway from './gateway/CheckoutGateway';
  import Order from './entity/Order';

  const products: any = ref([]);
  const order: any = ref(new Order(uuidv4(), '685.830.780-09'));
  const success: any = ref({});

  const checkoutGateway = inject("checkoutGateway") as CheckoutGateway;

  async function checkout() {
    success.value = await checkoutGateway.checkout(order.value);
  }

  onMounted(async () => {
    products.value = await checkoutGateway.getProducts();
  })
</script>

<template>
  <div class="module-name">Checkout</div>
  <div v-for="product in products">
    <div class="product-description">{{ product.description }}</div>
    <div class="product-price">{{ product.price }}</div>
    <button class="product-add-button" @click="order.addItem(product)">Add</button>
  </div>
  <div class="total">{{ order.getTotal() }}</div>
  <div v-for="item in order.items">
    <div class="order-item">{{ item.id }} {{ item.quantity }}</div>
  </div>
  <button class="checkout-button" @click="checkout()">Checkout</button>
  <div class="success">{{ success.total }}</div>
</template>

<style scoped>
</style>
