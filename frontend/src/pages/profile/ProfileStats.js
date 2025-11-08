import React, { useMemo } from 'react';
import './profile.css';

export default function ProfileStats({ bookingHistory = [], sellingHistory = [], isSeller }) {
  const stats = useMemo(() => {
    const now = new Date(); // ✅ moved inside useMemo to avoid dependency warning
    let total = 0, year = 0, month = 0;
    const records = isSeller ? sellingHistory : bookingHistory;

    records.forEach((r) => {
      const amount = isSeller
        ? (r.revenue || 0)
        : ((r.product?.discountPrice || r.product?.price || 0) * r.quantity);
      const date = new Date(isSeller ? r.dateSold : r.dateBooked);

      total += amount;
      if (date.getFullYear() === now.getFullYear()) {
        year += amount;
        if (date.getMonth() === now.getMonth()) {
          month += amount;
        }
      }
    });

    return { total, year, month };
  }, [bookingHistory, sellingHistory, isSeller]); // ✅ removed `now` dependency

  return (
    <section className="profile-stats">
      <h2>{isSeller ? 'Your Sales Summary' : 'Your Spending Summary'}</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{isSeller ? 'Total Revenue' : 'Total Spent'}</h3>
          <p>₹{stats.total.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Past Year</h3>
          <p>₹{stats.year.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p>₹{stats.month.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}
