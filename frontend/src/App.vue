<script setup lang="ts">
  import axios from 'axios';
  import { onMounted, ref } from 'vue';

  const products: any = ref([]);
  const total = ref(0);
  const order: any = ref({
    idOrder: '08c71152-c552-42e7-b094-f510ff44e9cb',
    cpf: '685.830.780-09',
    items: []
  });
  const success: any = ref({});

  function addItem(product: any) {
    const existingItem = order.value.items.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      order.value.items.push({ id: product.id, quantity: 1 });
    }
    total.value += product.price;
  }

  async function checkout() {
    const response = await axios.post("http://localhost:3001/checkout", order.value);
    success.value = response.data;
  }

  onMounted(async () => {
    const response = await axios.get("http://localhost:3001/products");
    products.value = response.data;
  })
</script>

<template>
  <div class="module-name">Checkout</div>
  <div v-for="product in products">
    <div class="product-description">{{ product.description }}</div>
    <div class="product-price">{{ product.price }}</div>
    <button class="product-add-button" @click="addItem(product)">Add</button>
  </div>
  <div class="total">{{ total }}</div>
  <div v-for="item in order.items">
    <div class="order-item">{{ item.id }} {{ item.quantity }}</div>
  </div>
  <button class="checkout-button" @click="checkout()">Checkout</button>
  <div class="success">{{ success.total }}</div>
</template>

<style scoped>
</style>
