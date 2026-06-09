import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileModal({ isOpen, onClose, currentName, onUpdateSuccess }) {
    const [profileForm, setProfileForm] = useState({ name: '', currentPassword: '', newPassword: '', confirmPassword: '', newEmail: '' });
    const [otpCode, setOtpCode] = useState('');

    // UI Flow Control Flags
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // --- AUTOMATIC 5-SECOND ALERT CLEAR ENGINE ---
    const triggerError = (msg) => {
        setProfileError(msg);
        setProfileSuccess(''); // Clear any remaining success prompts
        setTimeout(() => {
            setProfileError('');
        }, 5000);
    };

    const triggerSuccess = (msg) => {
        setProfileSuccess(msg);
        setProfileError(''); // Clear any remaining error alerts
        setTimeout(() => {
            setProfileSuccess('');
        }, 5000);
    };

    useEffect(() => {
        if (isOpen) {
            setProfileForm({ name: currentName || '', currentPassword: '', newPassword: '', confirmPassword: '', newEmail: '' });
            setOtpCode('');
            setIsOtpSent(false);
            setProfileError('');
            setProfileSuccess('');
        }
    }, [isOpen, currentName]);

    if (!isOpen) return null;

    // STEP A: REQUEST EMAIL OTP CODE
    const handleRequestEmailChange = async () => {
        if (!profileForm.newEmail || !profileForm.newEmail.includes('@')) {
            triggerError("Please enter a valid email address.");
            return;
        }
        setSendingOtp(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/otp/send-email-otp`, {
                newEmail: profileForm.newEmail
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (res.data.success) {
                setIsOtpSent(true);
                triggerSuccess("A 6-digit passcode has been sent to your new email.");
            }
        } catch (err) {
            triggerError(err.response?.data?.error || "Failed to submit verification request.");
        } finally {
            setSendingOtp(false);
        }
    };

    // STEP B: CONFIRM EMAIL OTP CODE
    const handleVerifyEmailOtp = async () => {
        if (otpCode.length !== 6) {
            triggerError("Please enter a valid 6-digit passcode.");
            return;
        }
        setVerifyingOtp(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/otp/verify-email-otp`, {
                otp: otpCode
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            if (res.data.success) {
                setProfileForm(prev => ({ ...prev, newEmail: '' }));
                setIsOtpSent(false);
                setOtpCode('');
                triggerSuccess("Your email address has been changed successfully!");
            }
        } catch (err) {
            triggerError(err.response?.data?.error || "Verification code failed.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    // BASE SUBMISSION: HANDLES NAME AND PASSWORDS
    const handleProfileUpdateSubmit = async (e) => {
        e.preventDefault();

        if (profileForm.newPassword || profileForm.confirmPassword) {
            if (profileForm.newPassword !== profileForm.confirmPassword) {
                triggerError("The new passwords you entered do not match.");
                return;
            }
        }

        setUpdatingProfile(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/users/update-profile`, {
                name: profileForm.name,
                currentPassword: profileForm.currentPassword,
                newPassword: profileForm.newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (res.data.success) {
                triggerSuccess('Your identity changes have been saved.');
                if (onUpdateSuccess) onUpdateSuccess(res.data.user.name);
                setTimeout(() => onClose(), 100);
            }
        } catch (err) {
            triggerError(err.response?.data?.error || 'Unable to update your profile preferences.');
        } finally {
            setUpdatingProfile(false);
        }
    };

    
       return (
    <div className="fixed inset-0 bg-[#1A1F1C]/50 backdrop-blur-sm z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(44,62,53,0.12)] border border-[#E9EFEA] relative flex flex-col gap-5 overflow-hidden max-h-[95vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">

        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sage/20 via-sage to-sage-dark" />

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2.5 text-[#4A6B55]">
            <span className="text-xl">⚙️</span>
            <h2 className="font-serif text-2xl text-ink font-medium tracking-tight">Edit Profile</h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-8">
            Update your public display profile name or change your account security password below.
          </p>
        </div>

        {/* --- SECTION 1: EMAIL VARIATION PANEL --- */}
        <div className="flex flex-col gap-3 pl-1 border-b border-gray-100 pb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-ink-soft opacity-70 px-0.5">
              Update Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                disabled={isOtpSent}
                value={profileForm.newEmail}
                onChange={(e) => setProfileForm({ ...profileForm, newEmail: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-paper-warm/20 border border-sage-light/40 text-sm text-ink focus:outline-none focus:border-[#4A6B55] focus:bg-white focus:ring-4 focus:ring-sage-pale/40 rounded-xl transition-all placeholder-gray-400/70 disabled:opacity-50"
                placeholder="Enter new email address"
              />
              {!isOtpSent && (
                <button
                  type="button"
                  disabled={sendingOtp}
                  onClick={handleRequestEmailChange}
                  className="px-4 bg-[#F4F8F5] text-[#4A6B55] hover:bg-[#EAF1EC] text-xs font-bold rounded-xl transition-colors shrink-0 disabled:opacity-50"
                >
                  {sendingOtp ? 'Sending...' : 'Verify'}
                </button>
              )}
            </div>
          </div>

          {/* OTP Input Fields sliding window hooks */}
          {isOtpSent && (
            <div className="bg-[#FAFDFB] border border-sage-light/30 p-4 rounded-xl flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-300">
              <span className="text-[10px] font-black uppercase tracking-widest text-sage-dark">Enter 6-Digit Passcode</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-2 bg-white border border-sage-light/60 font-mono font-bold text-center text-base tracking-[6px] focus:outline-none focus:border-[#4A6B55] rounded-xl"
                  placeholder="000000"
                />
                <button
                  type="button"
                  disabled={verifyingOtp}
                  onClick={handleVerifyEmailOtp}
                  className="px-5 bg-[#4A6B55] text-white hover:bg-[#3D5946] text-xs font-bold rounded-xl transition-colors"
                >
                  {verifyingOtp ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-[10px] text-gray-400 underline hover:text-ink self-start"
              >
                Change email address
              </button>
            </div>
          )}

          {/* 🎯 LOGICAL POSITION A: Email-specific feedback messages render inside this container block */}
          {profileSuccess && profileSuccess.includes("email") && (
            <div className="p-3.5 bg-[#F4F8F5] text-[#4A6B55] border border-sage/20 rounded-xl text-xs font-semibold mt-1 animate-in fade-in slide-in-from-top-1">
              ✨ {profileSuccess}
            </div>
          )}
          {profileError && profileError.includes("email") && (
            <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
              ⚠️ {profileError}
            </div>
          )}
        </div>


        {/* --- SECTION 2: NAME & SECURITY CREDENTIALS FORM --- */}
        <form onSubmit={handleProfileUpdateSubmit} className="flex flex-col gap-4 pl-1">

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-ink-soft opacity-70 px-0.5">
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-paper-warm/20 border border-sage-light/40 text-sm text-ink font-medium focus:outline-none focus:border-[#4A6B55] focus:bg-white focus:ring-4 focus:ring-sage-pale/40 rounded-xl transition-all placeholder-gray-400/70"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex items-center my-0.5 gap-3">
            <div className="h-[1px] bg-sage-light/20 flex-1" />
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest shrink-0">Security Passcode</span>
            <div className="h-[1px] bg-sage-light/20 flex-1" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-ink-soft opacity-70 px-0.5">
              Current Password
            </label>
            <input
              type="password"
              value={profileForm.currentPassword}
              onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 bg-paper-warm/20 border border-sage-light/40 text-sm text-ink focus:outline-none focus:border-[#4A6B55] focus:bg-white focus:ring-4 focus:ring-sage-pale/40 rounded-xl transition-all"
              placeholder="••••••••"
                        />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-ink-soft opacity-70 px-0.5">
                New Password
              </label>
              <input
                type="password"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-paper-warm/20 border border-sage-light/40 text-sm text-ink focus:outline-none focus:border-[#4A6B55] focus:bg-white focus:ring-4 focus:ring-sage-pale/40 rounded-xl transition-all"
                placeholder="New password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-ink-soft opacity-70 px-0.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={profileForm.confirmPassword}
                onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-paper-warm/20 border border-sage-light/40 text-sm text-ink focus:outline-none focus:border-[#4A6B55] focus:bg-white focus:ring-4 focus:ring-sage-pale/40 rounded-xl transition-all"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* 🎯 LOGICAL POSITION B: Master Profile changes feedback alerts stay grouped cleanly down here */}
          {profileError && !profileError.includes("email") && (
            <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium transition-all duration-300 transform animate-in fade-in slide-in-from-top-2">
              ⚠️ {profileError}
            </div>
          )}
          {profileSuccess && !profileSuccess.includes("email") && (
            <div className="p-3.5 bg-[#F4F8F5] text-[#4A6B55] border border-sage/20 rounded-xl text-xs font-semibold transition-all duration-300 transform animate-in fade-in slide-in-from-top-2">
              ✨ {profileSuccess}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-1 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-ink-soft rounded-xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-2.5 bg-[#4A6B55] hover:bg-[#3D5946] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              {updatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
    
}