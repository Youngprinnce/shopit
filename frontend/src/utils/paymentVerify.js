import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../backend/config/config.env' })

const getHeaders = () => ({
  Authorization: 'Bearer sk_test_089018cd3a15fb488e0edb78563bdd314c1c8f58',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
});

const axiosInstance = axios.create({
  baseURL: 'https://api.paystack.co/transaction',
  headers: getHeaders(),
});

export const paymentVerify = async (ref) => {

    const response = await axiosInstance.get('/verify/'+ encodeURIComponent(ref), getHeaders());

    const { reference, amount, status, metadata, paidAt, gateway_response } = response.data.data;

    return {
      metadata: metadata ? metadata: {},
      amount,
      reference,
      status,
      message: gateway_response,
      paymentDate: paidAt
    };
}