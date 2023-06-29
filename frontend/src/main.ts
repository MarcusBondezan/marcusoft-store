import { createApp } from 'vue';
import App from './App.vue';
import HttpCheckoutGateway from './gateway/HttpCheckoutGateway';
import HttpClient from './http/HttpClient';
import AxiosAdapter from './http/AxiosAdapter';

const app = createApp(App);
const httpClient: HttpClient = new AxiosAdapter();
app.provide("checkoutGateway", new HttpCheckoutGateway(httpClient))
app.mount('#app');
