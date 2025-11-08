import React, { useEffect, useState } from 'react'; // ✅ removed useContext
import api from '../../api';
import TransactionHistory from './TransactionHistory';
import ProfileStats from './ProfileStats';
import './profile.css';

export default function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]); // bookingHistory or sellingHistory
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const resUser = await api.get('/user/me');
        setUser(resUser.data.user);

        if (resUser.data.user.role === 'seller') {
          const resSales = await api.get('/user/sales/details');
          setRecords(resSales.data.sales || []);
        } else {
          const resBookings = await api.get('/user/bookings/details');
          setRecords(resBookings.data.bookings || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return null;

  const isSeller = user.role === 'seller';

  return (
    <main className="profile-dashboard">
      <h1 className="page-title">Welcome, {user.name}</h1>

      <section className="profile-info">
        <h2>Your Info</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Verified:</strong> {user.isVerified ? '✅ Yes' : '❌ No'}</p>
      </section>

      <ProfileStats
        bookingHistory={isSeller ? [] : records}
        sellingHistory={isSeller ? records : []}
        isSeller={isSeller}
      />

      <TransactionHistory
        bookingHistory={isSeller ? [] : records}
        sellingHistory={isSeller ? records : []}
        isSeller={isSeller}
      />
    </main>
  );
}
