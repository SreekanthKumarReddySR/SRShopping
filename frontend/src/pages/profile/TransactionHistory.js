import React from 'react';
import './profile.css';

export default function TransactionHistory({
  bookingHistory = [],
  sellingHistory = [],
  isSeller
}) {
  const data = isSeller ? sellingHistory : bookingHistory;

  if (!data.length) {
    return <p>No {isSeller ? 'sales' : 'transactions'} found yet.</p>;
  }

  return (
    <section className="transaction-section">
      <h2>{isSeller ? 'Selling History' : 'Transaction History'}</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            {isSeller ? <th>Buyer</th> : <th>Seller</th>}
            <th>{isSeller ? 'Revenue' : 'Price'}</th>
            <th>Quantity</th>
            <th>{isSeller ? 'Date Sold' : 'Date Booked'}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.product?.title || 'N/A'}</td>
              <td>{item.product?.category || 'N/A'}</td>
              <td>{isSeller ? item.buyer?.name || 'N/A' : item.seller?.name || 'N/A'}</td>
              <td>
                ₹
                {isSeller
                  ? (item.revenue || 0).toFixed(2)
                  : ((item.product?.discountPrice || item.product?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
              </td>
              <td>{item.quantity}</td>
              <td>
                {new Date(isSeller ? item.dateSold : item.dateBooked).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
