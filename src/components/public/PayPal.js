import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PayPal (props) {
    const paypal = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (props.totalCost && props.totalCost !== undefined && props.purchase && props.orderRef) {
            let ppbd = document.getElementById('paypalButtonsDiv');
            let wrapper = ppbd.firstElementChild;
            wrapper.innerHTML = '';
            window.paypal.Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: props.orderRef,
                                amount: {
                                    currency_code: "USD",
                                    value: props.totalCost
                                }
                            }
                        ]
                    })
                },
                onApprove: async (data, actions) => {
                    console.log('onApprove');
                    // eslint-disable-next-line
                    const order = await actions.order.capture();
                    sessionStorage.setItem('paidPurchase', props.purchase);
                    navigate('/paymentSuccess',{state:{purchase: props.purchase}});
                },
                onError: (err) => {
                    console.log(err);
                },
            }).render(paypal.current)
        }
        // eslint-disable-next-line
    }, [props.totalCost])

    return (
        <div id='paypalButtonsDiv'>
            <div ref = {paypal}></div>
        </div>
    )
}

export default PayPal 