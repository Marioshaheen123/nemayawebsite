"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SettingsForm() {
  const [form, setForm] = useState<PasswordForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function setField(field: keyof PasswordForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  // Client-side validation
  const passwordsMatch =
    form.newPassword && form.confirmPassword
      ? form.newPassword === form.confirmPassword
      : null;
  const passwordLengthOk = form.newPassword ? form.newPassword.length >= 8 : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccess("Password updated successfully! Please use your new password next time you log in.");
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin account settings</p>
      </div>

      {/* Password Change Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-gray-500" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Alerts */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => setField("currentPassword", e.target.value)}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setField("newPassword", e.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  className={
                    form.newPassword
                      ? passwordLengthOk
                        ? "border-green-400 pr-10"
                        : "border-red-400 pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.newPassword && passwordLengthOk === false && (
                <p className="text-xs text-red-500">Password must be at least 8 characters.</p>
              )}
              {form.newPassword && passwordLengthOk === true && (
                <p className="text-xs text-green-600">Password length is good.</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  className={
                    form.confirmPassword
                      ? passwordsMatch
                        ? "border-green-400 pr-10"
                        : "border-red-400 pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && passwordsMatch === false && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
              {form.confirmPassword && passwordsMatch === true && (
                <p className="text-xs text-green-600">Passwords match.</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Info Card (read-only) */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm font-medium text-gray-800 bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                Admin
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Platform</span>
              <span className="text-sm text-gray-800">Nemaya Backoffice v1.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
