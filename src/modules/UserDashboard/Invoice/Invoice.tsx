import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import Consts from "@/lib/consts";
import { RUPEE, SocialMedia } from "@/lib/constantsValue";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchOrderById } from "@/actions/OrdersAction/OrdersAction";
import { getFormattedDate } from "@/lib/utils";

function Invoice() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { order } = useAppSelector((state) => state.orders);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    bodyClass: "p-4",
  });

  useEffect(() => {
    if (id && user?.id) {
      fetchOrderById(dispatch, id);
    }
  }, [id, user?.id, dispatch]);

  // Optimized calculations
  const { subtotal, proofreading, listing } = order?.items.reduce(
    (acc, book) => {
      acc.subtotal += book.totalAmount;
      acc.proofreading += book.isProofReadingService
        ? book.totalPages <= 64
          ? 100
          : book.totalPages <= 120
          ? 200
          : 350
        : 0;
      acc.listing += book.isListingService ? 100 : 0;
      return acc;
    },
    { subtotal: 0, proofreading: 0, listing: 0 }
  ) || { subtotal: 0, proofreading: 0, listing: 0 };

  return (
    <DashboardLayout
      title="Invoice Details"
      subtitle="Get your order details."
      btnCTA="Print / Download Invoice"
      onClick={reactToPrintFn}
    >
      <div
        className="bg-white rounded-xl overflow-hidden shadow-lg"
        ref={contentRef}
      >
        <div className="h-4 bg-[linear-gradient(90deg,#9028df_0,#f3189e)]"></div>

        {/* Logo and Title */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="relative w-24">
              <img
                src={Consts.branWithTagline}
                alt="Bookalooza Logo"
                width={90}
                height={90}
                className="mx-auto w-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            Thanks for your order!
          </h2>
        </div>

        {/* Invoice Details */}
        <div className="p-3 md:px-8 md:py-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <p className="flex gap-2">
                <span className="font-bold">Invoice #</span>
                <span className="text-purple-600">{order?.orderNo}</span>
              </p>
              <p className="font-bold">Expected Delivery Date</p>
              <p>{getFormattedDate(order?.deliveryDate)}</p>
            </div>

            <div className="mt-4 md:mt-0 md:max-w-xs">
              <p className="font-bold">Shipping Details</p>
              <p>{order?.customerName}</p>
              <p>
                {[order?.address, order?.addressLine2, order?.landmark]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>{[order?.city, order?.state, order?.pincode].join(", ")}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((item) => (
                  <tr key={item.bookId} className="border-b border-gray-200">
                    <td className="py-4">{item.title}</td>
                    <td className="text-right">₹ {item.price.toFixed(2)}</td>
                    <td className="text-center">x {item.quantity}</td>
                    <td className="text-right">
                      <div>₹ {(item.price * item.quantity).toFixed(2)}</div>
                      {item.authorDiscount > 0 && (
                        <div className="text-sm italic text-gray-500">
                          Author Disc.: -{item.authorDiscount.toFixed(2)}
                        </div>
                      )}
                      {item.quantityDiscount > 0 && (
                        <div className="text-sm italic text-gray-500">
                          Quantity Disc.: -{item.quantityDiscount.toFixed(2)}
                        </div>
                      )}
                      <div className="font-bold">
                        ₹ {item.totalAmount.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mt-6">
            <div className="w-full md:w-1/2">
              {[
                ["Subtotal", subtotal.toFixed(2)],
                ["Shipping", order?.shippingCharge.toFixed(2)],
                ["Proofreading Charges", proofreading.toFixed(2)],
                ["Amazon & Flipkart Listing Charges", listing.toFixed(2)],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between py-1">
                  <span>{label}:</span>
                  <span>
                    {RUPEE} {amount}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2">
                <span>TOTAL:</span>
                <span className="text-app">
                  {RUPEE} {order?.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[linear-gradient(90deg,#9028df_0,#f3189e)] py-6 px-4 text-white text-center">
          <div className="flex justify-center flex-wrap space-x-4 mb-4">
            {SocialMedia.map(({ link, icon: Icon }) => (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                key={link}
              >
                <span className="flex size-8 items-center justify-center rounded-full transition-colors hover:text-primary">
                  <Icon color="#ffd536" />
                </span>
              </a>
            ))}
          </div>
          <p className="text-sm">
            Orange Vtech Pvt Ltd, 9 Daryaganj, New Delhi-110002 (India)
          </p>
          <p className="text-sm mt-1">+91 8799721408</p>
          <p className="text-sm mt-1">
            <a href="mailto:info@bookalooza.com" className="hover:underline">
              info@bookalooza.com
            </a>{" "}
            -
            <a
              href="https://www.bookalooza.com"
              className="hover:underline ml-1"
            >
              www.bookalooza.com
            </a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Invoice;
