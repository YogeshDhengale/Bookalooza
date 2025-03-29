import React from 'react'
import StaticLayout from '@/components/StaticScreenComponents/StaticLayout';
import ShippingAnimation from "@/assets/lotties/shipping-policy.json"

const content = [
    {
        title: <h2>Delivery Timing</h2>,
        description: [
            <p>Usually, your item will be dispatched within 8 to 10 business days after you place it. Once your item has been dispatched, you may use the tracking number on our tracking website to follow it.</p>
        ]
    },
    {
        title: <h2>Delivery Schedule</h2>,
        description: [
            <p>Depending on your location and the shipping option you chose at the time of purchase, delivery timeframes may vary. Your order will typically arrive within 15-21 business days. Bookalooza doesn’t guarantee delivery timings because we rely on the shipping company and any potential delays.</p>
        ]
    },
    {
        title: <h2>Order Tracking</h2>,
        description: [
            <p>You will receive an email confirmation with a tracking number once your item has been sent so you can maintain tabs on your package. Get in touch with us if you have any queries or worries concerning the progress of your order.</p>
        ]
    }
]

function Shipping() {
  return (
    <StaticLayout
        title="Shipping Policy"
        description='Our goal at Bookalooza.com is to give our clients the greatest experience possible while receiving their products and having them shipped and delivered. We collaborate with outside shipping partners as a firm that publishes books on demand to make sure that your order is delivered to you quickly and effectively.'
        animation={ShippingAnimation}
        content={content}
    />
  )
}

export default React.memo(Shipping);