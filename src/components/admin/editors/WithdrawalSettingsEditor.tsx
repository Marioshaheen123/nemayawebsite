"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "@/components/admin/ui/BilingualInput";
import BilingualTextarea from "@/components/admin/ui/BilingualTextarea";
import SaveButton from "@/components/admin/ui/SaveButton";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimeSlot {
  from: string;
  to: string;
}

interface DaySchedule {
  day: number;
  slots: TimeSlot[];
}

interface TradingHoursConfig {
  enabled: boolean;
  timezone: string;
  schedule: DaySchedule[];
  popupTitle: { en: string; ar: string };
  popupMessage: { en: string; ar: string };
}

function migrateConfig(data: any): TradingHoursConfig {
  // Handle old format: { days: number[], from, to } → new { schedule }
  if (data.schedule && Array.isArray(data.schedule)) return data;
  const days: number[] = data.days || [];
  const from: string = data.from || "09:00";
  const to: string = data.to || "17:00";
  return {
    enabled: data.enabled ?? true,
    timezone: data.timezone || "Asia/Riyadh",
    schedule: days.map((d: number) => ({ day: d, slots: [{ from, to }] })),
    popupTitle: data.popupTitle || { en: "", ar: "" },
    popupMessage: data.popupMessage || { en: "", ar: "" },
  };
}

export default function WithdrawalSettingsEditor({ initialData }: { initialData: TradingHoursConfig }) {
  const [config, setConfig] = useState<TradingHoursConfig>(() => migrateConfig(initialData));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<TradingHoursConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const activeDays = new Set(config.schedule.map((s) => s.day));

  const toggleDay = (day: number) => {
    if (activeDays.has(day)) {
      update({ schedule: config.schedule.filter((s) => s.day !== day) });
    } else {
      update({
        schedule: [...config.schedule, { day, slots: [{ from: "09:00", to: "17:00" }] }].sort(
          (a, b) => a.day - b.day
        ),
      });
    }
  };

  const updateSlot = (day: number, slotIdx: number, field: "from" | "to", value: string) => {
    update({
      schedule: config.schedule.map((s) =>
        s.day === day
          ? { ...s, slots: s.slots.map((sl, i) => (i === slotIdx ? { ...sl, [field]: value } : sl)) }
          : s
      ),
    });
  };

  const addSlot = (day: number) => {
    update({
      schedule: config.schedule.map((s) =>
        s.day === day ? { ...s, slots: [...s.slots, { from: "18:00", to: "21:00" }] } : s
      ),
    });
  };

  const removeSlot = (day: number, slotIdx: number) => {
    update({
      schedule: config.schedule.map((s) =>
        s.day === day ? { ...s, slots: s.slots.filter((_, i) => i !== slotIdx) } : s
      ).filter((s) => s.slots.length > 0),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/withdrawal-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save withdrawal settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enable/Disable */}
      <section>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="w-5 h-5 accent-accent cursor-pointer"
          />
          <div>
            <span className="text-[14px] font-semibold text-[#2e263d]">
              Enable Trading Hours Restriction
            </span>
            <p className="text-[12px] text-[#6b7280]">
              When enabled, withdrawals are only allowed during the configured trading hours
            </p>
          </div>
        </label>
      </section>

      {config.enabled && (
        <>
          {/* Timezone */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Timezone</h2>
            <input
              type="text"
              value={config.timezone}
              onChange={(e) => update({ timezone: e.target.value })}
              placeholder="Asia/Riyadh"
              className="w-full max-w-[300px] px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
            <p className="text-[11px] text-[#a0a5af] mt-1">
              IANA timezone (e.g. Asia/Riyadh, Europe/London, America/New_York)
            </p>
          </section>

          {/* Schedule per day */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#2e263d] mb-2">Trading Schedule</h2>
            <p className="text-[12px] text-[#6b7280] mb-4">
              Select active trading days and configure one or more time slots per day
            </p>

            <div className="space-y-3">
              {DAY_LABELS.map((label, dayIdx) => {
                const isActive = activeDays.has(dayIdx);
                const daySchedule = config.schedule.find((s) => s.day === dayIdx);

                return (
                  <div
                    key={dayIdx}
                    className={`border rounded-lg overflow-hidden transition-colors ${
                      isActive ? "border-accent/30 bg-accent/[0.02]" : "border-[#e8ecf1]"
                    }`}
                  >
                    {/* Day header */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleDay(dayIdx)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      <span
                        className={`text-[13px] font-medium ${
                          isActive ? "text-[#2e263d]" : "text-[#a0a5af]"
                        }`}
                      >
                        {label}
                      </span>
                      {!isActive && (
                        <span className="text-[11px] text-[#a0a5af] italic">Closed</span>
                      )}
                    </div>

                    {/* Time slots */}
                    {isActive && daySchedule && (
                      <div className="px-4 pb-3 space-y-2">
                        {daySchedule.slots.map((slot, slotIdx) => (
                          <div key={slotIdx} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.from}
                              onChange={(e) => updateSlot(dayIdx, slotIdx, "from", e.target.value)}
                              className="px-2.5 py-1.5 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                            <span className="text-[12px] text-[#6b7280]">to</span>
                            <input
                              type="time"
                              value={slot.to}
                              onChange={(e) => updateSlot(dayIdx, slotIdx, "to", e.target.value)}
                              className="px-2.5 py-1.5 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                            {daySchedule.slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(dayIdx, slotIdx)}
                                className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                                title="Remove slot"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSlot(dayIdx)}
                          className="flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer pt-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Add time slot
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Popup Content */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Popup Content</h2>
            <div className="space-y-4">
              <BilingualInput
                label="Popup Title"
                valueEn={config.popupTitle.en}
                valueAr={config.popupTitle.ar}
                onChangeEn={(v) => update({ popupTitle: { ...config.popupTitle, en: v } })}
                onChangeAr={(v) => update({ popupTitle: { ...config.popupTitle, ar: v } })}
              />
              <BilingualTextarea
                label="Popup Message"
                valueEn={config.popupMessage.en}
                valueAr={config.popupMessage.ar}
                onChangeEn={(v) => update({ popupMessage: { ...config.popupMessage, en: v } })}
                onChangeAr={(v) => update({ popupMessage: { ...config.popupMessage, ar: v } })}
                rows={4}
              />
            </div>
          </section>
        </>
      )}

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
