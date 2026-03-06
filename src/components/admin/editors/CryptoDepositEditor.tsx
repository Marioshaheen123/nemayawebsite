"use client";

import { useState } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";
import SaveButton from "@/components/admin/ui/SaveButton";

interface Platform {
  name: string;
  logo: string;
}

interface CryptoDepositConfig {
  enabled: boolean;
  walletAddress: string;
  currency: string;
  network: string;
  qrImage: string;
  recommendedPlatforms: Platform[];
}

const DEFAULT: CryptoDepositConfig = {
  enabled: true,
  walletAddress: "",
  currency: "USDT  TetherUS",
  network: "TRX  Tron (TRC20)",
  qrImage: "",
  recommendedPlatforms: [],
};

export default function CryptoDepositEditor({
  initialData,
}: {
  initialData: CryptoDepositConfig | undefined;
}) {
  const [config, setConfig] = useState<CryptoDepositConfig>({
    ...DEFAULT,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPlatform, setUploadingPlatform] = useState<number | null>(null);

  const update = (patch: Partial<CryptoDepositConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        update({ qrImage: json.url });
      } else {
        alert(json.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePlatformLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPlatform(index);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        const platforms = [...config.recommendedPlatforms];
        platforms[index] = { ...platforms[index], logo: json.url };
        update({ recommendedPlatforms: platforms });
      } else {
        alert(json.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploadingPlatform(null);
    }
  };

  const addPlatform = () => {
    update({
      recommendedPlatforms: [
        ...config.recommendedPlatforms,
        { name: "", logo: "" },
      ],
    });
  };

  const removePlatform = (index: number) => {
    update({
      recommendedPlatforms: config.recommendedPlatforms.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updatePlatform = (index: number, patch: Partial<Platform>) => {
    const platforms = [...config.recommendedPlatforms];
    platforms[index] = { ...platforms[index], ...patch };
    update({ recommendedPlatforms: platforms });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/crypto-deposit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save crypto deposit settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#2e263d]">
          Crypto Deposit Settings
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="w-4 h-4 accent-accent cursor-pointer"
          />
          <span className="text-[13px] font-medium text-[#2e263d]">
            Enabled
          </span>
        </label>
      </div>

      {/* Wallet Address */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">
          Wallet Address
        </label>
        <input
          type="text"
          value={config.walletAddress}
          onChange={(e) => update({ walletAddress: e.target.value })}
          placeholder="e.g. TBgDkELwenLnx33TpEAMsvfNgzeHfxD7Tb"
          dir="ltr"
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono"
        />
      </div>

      {/* Currency & Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Currency
          </label>
          <input
            type="text"
            value={config.currency}
            onChange={(e) => update({ currency: e.target.value })}
            placeholder="USDT  TetherUS"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Network
          </label>
          <input
            type="text"
            value={config.network}
            onChange={(e) => update({ network: e.target.value })}
            placeholder="TRX  Tron (TRC20)"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {/* QR Code Image */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">
          QR Code Image
        </label>
        <div className="flex items-start gap-4">
          <div className="w-[120px] h-[120px] bg-[#f9fafb] border border-[#e0e3e8] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {config.qrImage ? (
              <Image
                src={config.qrImage}
                alt="QR Code"
                width={120}
                height={120}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <span className="text-[11px] text-[#a0a5af] text-center px-2">
                No QR uploaded
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-accent hover:border-accent transition-colors cursor-pointer">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {uploading ? "Uploading..." : "Upload QR Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQrUpload}
                disabled={uploading}
              />
            </label>
            {config.qrImage && (
              <button
                type="button"
                onClick={() => update({ qrImage: "" })}
                className="text-[12px] text-red-500 hover:text-red-600 transition-colors cursor-pointer text-left"
              >
                Remove QR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Platforms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Recommended Platforms
          </label>
          <button
            type="button"
            onClick={addPlatform}
            className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Platform
          </button>
        </div>

        {config.recommendedPlatforms.length === 0 && (
          <p className="text-[12px] text-[#a0a5af]">
            No platforms added yet. Click &quot;Add Platform&quot; above.
          </p>
        )}

        {config.recommendedPlatforms.map((platform, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-3"
          >
            {/* Logo preview */}
            <div className="w-[40px] h-[40px] bg-white border border-[#e0e3e8] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {platform.logo ? (
                <Image
                  src={platform.logo}
                  alt={platform.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c0c4cc"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </div>

            {/* Name */}
            <input
              type="text"
              value={platform.name}
              onChange={(e) => updatePlatform(idx, { name: e.target.value })}
              placeholder="Platform name"
              className="flex-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />

            {/* Upload logo */}
            <label className="shrink-0 px-2.5 py-2 border border-[#e0e3e8] rounded-lg text-[12px] text-accent hover:border-accent transition-colors cursor-pointer">
              {uploadingPlatform === idx ? "..." : "Logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePlatformLogoUpload(e, idx)}
                disabled={uploadingPlatform === idx}
              />
            </label>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removePlatform(idx)}
              className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer shrink-0"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
