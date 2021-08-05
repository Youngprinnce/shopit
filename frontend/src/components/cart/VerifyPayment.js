import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {paymentVerify} from '../../utils/paymentVerify';
import { createOrder, clearErrors } from '../../actions/orderActions'

const VerifyPayment = ({location, history}) => {

    const search = location.search;
    const reference = new URLSearchParams(search).get('reference');

    const dispatch = useDispatch()

    const {cartItems, shippingInfo} = useSelector(state => state.cart);

    const userId = JSON.parse(sessionStorage.getItem('userId'));
    const order = {
        orderItems:cartItems,
        shippingInfo,
        user: userId
    }
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    useEffect(() => {
        const checkPayment = async (ref) => {
           const data = await paymentVerify(ref)
           console.log(data)
           if (data.status === 'success'){
                order.paymentInfo = {
                    id: data.reference,
                    status: data.status
                }
                dispatch(createOrder(order))
                history.push('/success')
           }
        }

        checkPayment(reference)
    })

    return (
        <div>
            
        </div>
    )
}

export default VerifyPayment
