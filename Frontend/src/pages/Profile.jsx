import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Shield,
  ArrowLeft,
  Phone,
  MapPin,
  Camera,
  Save,
  X,
  Crown
} from "lucide-react";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "Nagpur, Maharashtra, India",
    image: user?.image || "",
  });

  const avatarPresets = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  ];

  if (!user) {
    return (
      <div className="bg-[#FAFAF8] min-h-[80vh] flex flex-col items-center justify-center py-12 px-6 sm:px-12 text-[#4B5563] font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-[#F2F4F3] border border-[#E5E7EB] rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 bg-[#2F5D50]/15 text-[#2F5D50] rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F2937] font-heading">Access Restricted</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Please sign in to view your enterprise profile and manage your account details.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-3 px-4 rounded-xl shadow-xs text-xs"
            >
              Sign In to Your Account
            </Link>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-[#2F5D50] hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      image: formData.image,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    if (setUser) {
      setUser(updatedUser);
    }

    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "Profile Updated!",
      text: "Your profile has been saved successfully.",
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#2F5D50",
      customClass: {
        popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
      }
    });
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-xs space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E5E7EB]">
          <div className="relative">
            {formData.image ? (
              <img
                src={formData.image}
                alt={formData.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#2F5D50]"
              />
            ) : (
              <div className="w-24 h-24 bg-[#2F5D50]/15 text-[#2F5D50] rounded-2xl flex items-center justify-center font-bold text-3xl">
                {formData.name?.[0]?.toUpperCase()}
              </div>
            )}
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-[#2F5D50] hover:bg-[#244A40] text-white p-2 rounded-xl border border-white cursor-pointer shadow-xs">
                <Camera className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-bold text-[#1F2937] font-heading">{formData.name}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-[#D4A64A]/20 text-[#1F2937]' : 'bg-[#2F5D50]/10 text-[#2F5D50]'
              }`}>
                {user.role === 'admin' ? <Crown className="w-3 h-3 text-[#D4A64A]" /> : <User className="w-3 h-3 text-[#2F5D50]" />}
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-[#8FAE9D]" /> {formData.email}
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2 px-5 rounded-xl text-xs transition duration-300 shadow-xs cursor-pointer"
            >
              Modify Profile
            </button>
          )}
        </div>

        {/* Preset Avatars Selector (Editing Mode) */}
        {isEditing && (
          <div className="space-y-3 bg-[#F2F4F3] border border-[#E5E7EB] rounded-2xl p-4">
            <p className="text-[10px] font-bold text-[#1F2937] uppercase tracking-wider">Choose Profile Avatar</p>
            <div className="flex gap-3">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset })}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    formData.image === preset ? "border-[#2F5D50] scale-105" : "border-[#E5E7EB] hover:border-[#8FAE9D]"
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2.5 text-[#1F2937] focus:outline-none transition ${
                  isEditing 
                    ? "bg-white border-[#E5E7EB] focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20" 
                    : "bg-[#F2F4F3] border-[#E5E7EB] cursor-not-allowed text-[#4B5563]"
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]/60" />
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#1F2937] focus:outline-none transition ${
                    isEditing 
                      ? "bg-white border-[#E5E7EB] focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20" 
                      : "bg-[#F2F4F3] border-[#E5E7EB] cursor-not-allowed text-[#4B5563]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Shipping Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-[#4B5563]/60" />
              <textarea
                name="address"
                disabled={!isEditing}
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#1F2937] focus:outline-none transition-all ${
                  isEditing 
                    ? "bg-white border-[#E5E7EB] focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20" 
                    : "bg-[#F2F4F3] border-[#E5E7EB] cursor-not-allowed text-[#4B5563]"
                }`}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2.5 px-6 rounded-xl transition duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" /> Save Modification
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "+91 98765 43210",
                    address: user.address || "Nagpur, Maharashtra, India",
                    image: user.image || "",
                  });
                  setIsEditing(false);
                }}
                className="bg-[#8FAE9D] hover:bg-[#2F5D50] hover:text-white text-[#1F2937] font-bold py-2.5 px-6 rounded-xl transition duration-300 flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
