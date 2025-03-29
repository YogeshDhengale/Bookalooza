import React from "react";
import StaticLayout from "@/components/StaticScreenComponents/StaticLayout";
import RefundAnimation from "@/assets/lotties/refund-and-cancellation.json";

const content = [
    {
        title: <h2></h2>,
        description: [
            <p>Authors who are under the age of 18 may register on the site through their parents or legal guardians. The Company retains the right, in its sole discretion, to reject a book or deactivate a user account. It is also deserving of the right to return the book copy(s) that were ordered</p>
        ]
    },
    {
        title: <h2>In case of any of the below, the User shall be refunded 100% of the payment.</h2>,
        description: [
            <ul className="static-list">
                <li>The portal is continually down for more than 3 days without any scheduled notice.</li>
                <li>User access to the portal is cancelled without prior notification.</li>
                <li>The company is unable to provide the hard copy of the books requested by the user in 45 days after completion and publication of the book on the portal.</li>
            </ul>,
            <p>For any queries, the User can write to <a className="underline text-app" href="mailto:info@bookalooza.com">info@bookalooza.com</a></p>
        ]
    }
]

function Refund() {
  return (
    <StaticLayout
      title="Refund And Cancellations"
      description={
        <>"For children of grade1 to 12, Orange Vtech Pvt Ltd. offers a platform, named Bookalooza at <a href="https://www.bookalooza.com" target='blank' className="underline text-app font-medium">https://www.bookalooza.com</a></>
      }
      animation={RefundAnimation}
      content={content}
    />
  );
}

export default React.memo(Refund);
