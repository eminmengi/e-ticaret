import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Gravatar from "react-gravatar";
import { updateUserProfile, updateUserPassword } from "../store/actions/userActions";
import { fetchAddresses } from "../store/thunks/addressThunk";
import { fetchFavorites } from "../store/thunks/favThunks";
import { fetchOrders } from "../store/thunks/orderThunk";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);
  const token = useSelector((s) => s.user.token) || localStorage.getItem("token");
  const addresses = useSelector((s) => s.address.items);
  const favorites = useSelector((s) => s.favorites.items);
  const orders = useSelector((s) => s.orders?.items || []);

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
    dispatch(fetchAddresses());
    dispatch(fetchFavorites());
    dispatch(fetchOrders());
  }, [user, dispatch]);

  if (!user && !token) return null;

  const avatarUrl = user?.avatar || null;
  const useGravatar = !avatarUrl;

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await dispatch(updateUserProfile({ name, email }));
    alert("Profile updated successfully!");
  } catch (err) {
    // err bazen string, bazen Error objesi olabilir
    const message = err?.response?.data?.message || err?.message || err || "Error updating profile";
    alert(message);
  }
  setLoading(false);
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  setLoading(true);
  try {
    await dispatch(updateUserPassword({ password }));
    alert("Password changed successfully!");
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || err || "Error changing password";
    alert(message);
  }
  setLoading(false);
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-5 md:p-10 gap-6">
      {/* Sidebar */}
      <aside className="md:w-1/4 bg-white rounded-xl shadow p-4 sticky top-5 h-max">
        <h2 className="text-xl font-bold mb-4">My Account</h2>
        <ul className="flex flex-col gap-2">
          {["profile", "addresses", "favorites", "orders"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-3 py-2 rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {tab === "profile" && "Profile Info"}
              {tab === "addresses" && "Addresses"}
              {tab === "favorites" && "Favorites"}
              {tab === "orders" && "Orders"}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-xl shadow p-6">
        {activeTab === "profile" && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              {useGravatar ? (
                <Gravatar
                  email={email || "someone@example.com"}
                  size={120}
                  default="identicon"
                  className="rounded-full border-4 border-blue-400"
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="rounded-full border-4 border-blue-400 w-32 h-32"
                />
              )}
              <p className="text-gray-700 font-semibold">{email}</p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-3 mt-4">
                <label className="font-semibold">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <label className="font-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600"
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border p-4 rounded shadow relative">
                <p className="font-semibold">{addr.title}</p>
                <p>{addr.addressLine}</p>
                {addr.isShipping && <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Shipping</span>}
                {addr.isBilling && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Billing</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((p) => (
              <div key={p.id} className="border rounded shadow p-3">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded mb-2" />
                <p className="font-semibold">{p.name}</p>
                <p className="text-gray-600">${p.price}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="flex flex-col gap-4">
            {orders.map((o) => (
              <div key={o.id} className="border rounded shadow p-4">
                <p className="font-semibold mb-1">Order #{o.id}</p>
                <p>Date: {new Date(o.date).toLocaleDateString()}</p>
                <p>Total: ${o.total}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {o.items.map((i) => (
                    <span key={i.id} className="bg-gray-200 px-2 py-1 rounded text-sm">{i.name} x{i.qty}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
