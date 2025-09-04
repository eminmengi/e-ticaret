import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import Gravatar from "react-gravatar";
import CircularProgress from "@mui/material/CircularProgress";
import { Lock, Mail, Eye, EyeOff, Info  } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { fetchAddresses } from "../store/thunks/addressThunk";
import { fetchCards } from "../store/thunks/cardThunks";
import { fetchOrders } from "../store/thunks/orderHistoryThunks";
import { logoutUser } from "../store/actions/userActions";
import { FAV_REMOVE } from "../store/actionTypes";

// Icons
import { ShoppingCart, Heart, Package } from "lucide-react";

const maskCard = (no = "") => (no || "").replace(/\d(?=\d{4})/g, "*");

export default function ProfilePage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [tab, setTab] = useState("overview");

  const user = useSelector((s) => s.user?.user);
  const token = useSelector((s) => s.user?.token) || localStorage.getItem("token");
  const addr = useSelector((s) => s.address);
  const cards = useSelector((s) => s.card);
  const orders = useSelector((s) => s.orderHistory);
  const favorites = useSelector((s) => s.favorites?.items || []);
  const cartCount = useSelector((s) => (s.cart?.items || []).reduce((sum, it) => sum + it.count, 0));
  const favCount = favorites.length;

  const isAuthed = Boolean(user || token);
  const email = user?.email || "eminmengi@gmail.com";
  const name = user?.name || email.split("@")[0];

  useEffect(() => {
    if (addr?.fetchState === "NOT_FETCHED") dispatch(fetchAddresses());
    if (cards?.fetchState === "NOT_FETCHED") dispatch(fetchCards());
    if (orders?.fetchState === "NOT_FETCHED") dispatch(fetchOrders());
  }, [dispatch, addr?.fetchState, cards?.fetchState, orders?.fetchState]);

  if (!isAuthed) return <Redirect to="/login" />;

  const loading =
    addr?.fetchState === "FETCHING" ||
    cards?.fetchState === "FETCHING" ||
    orders?.fetchState === "FETCHING";

  const handleLogout = () => {
    dispatch(logoutUser());
    history.replace("/");
  };

  const tabs = [
    ["overview", "Overview"],
    ["addresses", "Addresses"],
    ["payments", "Payment Methods"],
    ["orders", "Orders"],
    ["security", "Security"],
    ["favorites", "Favorites"],
  ];

  return (
    <main className="w-[95vw] max-w-[1200px] mx-auto py-10 font-[Montserrat] text-gray-800 flex flex-col sm:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <div className="flex flex-col items-center mb-6">
          <Gravatar email={email} size={64} default="identicon" className="rounded-full border-2 border-blue-400 shadow-md" />
          <h1 className="mt-2 text-xl font-bold text-center">{name}</h1>
          <p className="text-sm text-gray-500 text-center">{email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full bg-blue-400 py-2 rounded-lg  font-semibold bg-gradient-to-r from-pink-400 to-rose-800 text-white shadow"
          >
            Logout
          </button>
        </div>

        <nav className="flex flex-row sm:flex-col flex-wrap sm:flex-nowrap gap-2 justify-center sm:justify-start">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-center sm:text-left px-4 py-2 rounded-lg font-semibold transition ${
                tab === key
                  ? "bg-gradient-to-r from-blue-300 to-blue-700 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <section className="flex-1 mt-6 sm:mt-0">
        {loading ? (
          <div className="py-16 flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <Overview
                cartCount={cartCount}
                favCount={favCount}
                orders={orders}
                setTab={setTab}
              />
            )}
            {tab === "addresses" && (
              <Addresses
                items={addr?.items || []}
                onManageNew={() => history.push("/checkout/address/new")}
                onManageList={() => history.push("/checkout")}
              />
            )}
            {tab === "payments" && <Payments items={cards?.items || []} onManage={() => history.push("/checkout/payment")} />}
            {tab === "orders" && <OrdersPreview items={orders?.items || []} onAll={() => history.push("/orders")} />}
            {tab === "security" && <Security email={email} />}
            {tab === "favorites" && <Favorites items={favorites} />}
          </>
        )}
      </section>
    </main>
  );
}

/* ------------------ Subcomponents ------------------ */

function Overview({ cartCount, favCount, orders, setTab }) {
  const lastOrder = (orders?.items || [])[0];
  const history = useHistory();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <CardStat
        label="Cart Items"
        value={cartCount}
        icon={<ShoppingCart size={24} />}
        color="bg-gradient-to-r from-blue-400 to-blue-600"
        onClick={() => history.push("/cart")}
      />
      <CardStat
        label="Favorites"
        value={favCount}
        icon={<Heart size={24} />}
        color="bg-gradient-to-r from-pink-400 to-pink-600"
        onClick={() => setTab("favorites")}
      />
      <CardStat
        label="Orders"
        value={(orders?.items || []).length}
        extra={lastOrder ? `Last: #${lastOrder.id || lastOrder.order_id}` : undefined}
        icon={<Package size={24} />}
        color="bg-gradient-to-r from-green-400 to-green-600"
        onClick={() => setTab("orders")}
      />
    </div>
  );
}

function CardStat({ label, value, extra, icon, color = "bg-gray-400", onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div
        className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${color} hover:brightness-110`}
      >
        {icon}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {extra && <div className="text-xs text-gray-400 mt-1">{extra}</div>}
    </div>
  );
}

function Favorites({ items }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-xl p-6 shadow mt-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Saved Favorites</h2>
        <p className="text-gray-500 text-sm mt-4">You can review your favorite items here.</p>
      </div>

      {(!items || items.length === 0) ? (
        <p className="text-gray-500">You have no favorite items yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6 mt-4 justify-center sm:justify-start">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer w-60 sm:w-60"
            >
              <div className="relative w-full h-64 mb-4">
                <img
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  className="absolute top-2 right-2 bg-white text-black font-bold rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-gray-100 transition"
                  title="Remove"
                  onClick={() => dispatch({ type: FAV_REMOVE, payload: p.id })}
                >
                  ×
                </button>
              </div>
              <h3 className="text-sm font-semibold text-center line-clamp-2">{p.name}</h3>
              <div className="text-gray-500 text-sm mt-2">
                ${Number(p.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function Addresses({ items, onManageNew }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-4 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Saved Addresses</h2>
        <div className="flex gap-2">
          <button onClick={onManageNew} className="px-4 py-2 rounded-lg transition bg-gradient-to-r from-blue-300 to-blue-700 text-white shadow">+ Add New</button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500">No address saved yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((a) => (
            <li key={a.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-gray-500">{a.name} {a.surname} • {a.phone}</div>
              <div className="text-sm text-gray-500">{a.neighborhood}, {a.district}/{a.city}</div>
              <div className="text-sm text-gray-500">{a.address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Payments({ items, onManage }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Saved Cards</h2>
        <button onClick={onManage} className="px-4 py-2 rounded-lg transition bg-gradient-to-r from-blue-300 to-blue-700 text-white shadow">Manage</button>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500">No saved card.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <li key={c.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
              <div className="font-semibold">{maskCard(c.card_no)}</div>
              <div className="text-sm text-gray-500">{String(c.expire_month).padStart(2,"0")}/{c.expire_year} • {c.name_on_card}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrdersPreview({ items, onAll }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <button onClick={onAll} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">View all</button>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500">You don’t have any orders yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.slice(0,5).map((o) => (
            <li key={o.id || o.order_id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <div>
                <div className="font-semibold">Order #{o.id || o.order_id}</div>
                <div className="text-xs text-gray-400">{o.order_date ? new Date(o.order_date).toLocaleString() : "-"}</div>
              </div>
              <div className="font-bold">${Number(o.price || o.total || 0).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Security({ email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Şifre politikası
  const passwordPolicy = {
    minLength: 8,
    uppercase: true,
    number: true,
    specialChar: true
  };

  const checkPolicy = (pw) => {
    return {
      minLength: pw.length >= passwordPolicy.minLength,
      uppercase: passwordPolicy.uppercase ? /[A-Z]/.test(pw) : true,
      number: passwordPolicy.number ? /[0-9]/.test(pw) : true,
      specialChar: passwordPolicy.specialChar ? /[!@#$%^&*]/.test(pw) : true,
    };
  };

  const policy = checkPolicy(newPassword);

  const strength = Object.values(policy).filter(Boolean).length; // 0-4
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const strengthColor = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const canSubmit = currentPassword && newPassword && confirmPassword && passwordsMatch && strength >= 3;

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Simulate update
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b pb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Login & Security</h2>
        </div>
        <p className="text-gray-500 text-sm mt-1 sm:mt-0">
          Update your password and manage account security
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-500" /> Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            readOnly
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Current Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-600">Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* New Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            New Password
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" title="Password must meet all policy requirements" />
          </label>
          <input
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {/* Şifre politikası */}
          <ul className="mt-2 text-xs space-y-1">
            <li className={policy.minLength ? "text-green-500" : "text-gray-400"}>• Minimum 8 characters</li>
            <li className={policy.uppercase ? "text-green-500" : "text-gray-400"}>• At least one uppercase letter</li>
            <li className={policy.number ? "text-green-500" : "text-gray-400"}>• At least one number</li>
            <li className={policy.specialChar ? "text-green-500" : "text-gray-400"}>• At least one special character (!@#$%^&*)</li>
          </ul>

          {/* Güç göstergesi */}
          {newPassword && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className={`h-2 rounded-full ${strengthColor[strength]} transition-all`} style={{ width: `${(strength / 4) * 100}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{strengthText[strength]}</p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {!passwordsMatch && confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Save & Update
        </button>
      </div>
    </div>
  );
}