"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "@/components/admin/ui/BilingualInput";
import BilingualTextarea from "@/components/admin/ui/BilingualTextarea";
import ArrayEditor from "@/components/admin/ui/ArrayEditor";
import SaveButton from "@/components/admin/ui/SaveButton";

interface LinkItem {
  id: string;
  labelEn: string;
  labelAr: string;
  href: string;
}

interface SocialIconItem {
  id: string;
  src: string;
  alt: string;
  href: string;
}

interface FooterLabels {
  en: { brandDesc: string; quickLinks: string; support: string; contact: string; copyright: string; disclaimer: string };
  ar: { brandDesc: string; quickLinks: string; support: string; contact: string; copyright: string; disclaimer: string };
}

interface FooterData {
  labels: FooterLabels;
  contactInfo: { phone: string; email: string };
  quickLinks: LinkItem[];
  supportLinks: LinkItem[];
  socialIcons: SocialIconItem[];
}

let counter = 0;
function newId() {
  return `new_${Date.now()}_${++counter}`;
}

export default function FooterEditor({ initialData }: { initialData: FooterData }) {
  const [labels, setLabels] = useState(initialData.labels);
  const [contactInfo, setContactInfo] = useState(initialData.contactInfo);
  const [quickLinks, setQuickLinks] = useState(initialData.quickLinks);
  const [supportLinks, setSupportLinks] = useState(initialData.supportLinks);
  const [socialIcons, setSocialIcons] = useState(initialData.socialIcons);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateLabel = (lang: "en" | "ar", field: string, value: string) => {
    setLabels((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/footer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labels, contactInfo, quickLinks, supportLinks, socialIcons }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save footer data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Footer Labels */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Footer Labels</h2>
        <div className="space-y-4">
          <BilingualTextarea
            label="Brand Description"
            valueEn={labels.en.brandDesc}
            valueAr={labels.ar.brandDesc}
            onChangeEn={(v) => updateLabel("en", "brandDesc", v)}
            onChangeAr={(v) => updateLabel("ar", "brandDesc", v)}
          />
          <BilingualInput
            label="Quick Links Heading"
            valueEn={labels.en.quickLinks}
            valueAr={labels.ar.quickLinks}
            onChangeEn={(v) => updateLabel("en", "quickLinks", v)}
            onChangeAr={(v) => updateLabel("ar", "quickLinks", v)}
          />
          <BilingualInput
            label="Support Heading"
            valueEn={labels.en.support}
            valueAr={labels.ar.support}
            onChangeEn={(v) => updateLabel("en", "support", v)}
            onChangeAr={(v) => updateLabel("ar", "support", v)}
          />
          <BilingualInput
            label="Contact Heading"
            valueEn={labels.en.contact}
            valueAr={labels.ar.contact}
            onChangeEn={(v) => updateLabel("en", "contact", v)}
            onChangeAr={(v) => updateLabel("ar", "contact", v)}
          />
          <BilingualInput
            label="Copyright Text"
            valueEn={labels.en.copyright}
            valueAr={labels.ar.copyright}
            onChangeEn={(v) => updateLabel("en", "copyright", v)}
            onChangeAr={(v) => updateLabel("ar", "copyright", v)}
          />
          <BilingualTextarea
            label="Disclaimer"
            valueEn={labels.en.disclaimer || ""}
            valueAr={labels.ar.disclaimer || ""}
            onChangeEn={(v) => updateLabel("en", "disclaimer", v)}
            onChangeAr={(v) => updateLabel("ar", "disclaimer", v)}
          />
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">Phone Number</label>
            <input
              type="text"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+1234567890"
              dir="ltr"
              className="w-full max-w-md px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">Email Address</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo((p) => ({ ...p, email: e.target.value }))}
              placeholder="support@example.com"
              dir="ltr"
              className="w-full max-w-md px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Quick Links</h2>
        <ArrayEditor<LinkItem>
          items={quickLinks}
          onUpdate={setQuickLinks}
          label=""
          addLabel="Add Quick Link"
          createItem={() => ({ id: newId(), labelEn: "", labelAr: "", href: "" })}
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3">
              <BilingualInput
                label="Label"
                valueEn={item.labelEn}
                valueAr={item.labelAr}
                onChangeEn={(v) => onChange({ ...item, labelEn: v })}
                onChangeAr={(v) => onChange({ ...item, labelAr: v })}
              />
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#2e263d]">URL</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => onChange({ ...item, href: e.target.value })}
                  placeholder="/page-path"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
          )}
        />
      </section>

      {/* Support Links */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Support Links</h2>
        <ArrayEditor<LinkItem>
          items={supportLinks}
          onUpdate={setSupportLinks}
          label=""
          addLabel="Add Support Link"
          createItem={() => ({ id: newId(), labelEn: "", labelAr: "", href: "" })}
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3">
              <BilingualInput
                label="Label"
                valueEn={item.labelEn}
                valueAr={item.labelAr}
                onChangeEn={(v) => onChange({ ...item, labelEn: v })}
                onChangeAr={(v) => onChange({ ...item, labelAr: v })}
              />
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#2e263d]">URL</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => onChange({ ...item, href: e.target.value })}
                  placeholder="/page-path"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
          )}
        />
      </section>

      {/* Social Icons */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Social Icons</h2>
        <ArrayEditor<SocialIconItem>
          items={socialIcons}
          onUpdate={setSocialIcons}
          label=""
          addLabel="Add Social Icon"
          createItem={() => ({ id: newId(), src: "", alt: "", href: "" })}
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#2e263d]">Icon Path</label>
                <input
                  type="text"
                  value={item.src}
                  onChange={(e) => onChange({ ...item, src: e.target.value })}
                  placeholder="/images/icon.svg"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#2e263d]">Alt Text</label>
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => onChange({ ...item, alt: e.target.value })}
                  placeholder="e.g. Twitter"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#2e263d]">Link URL</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => onChange({ ...item, href: e.target.value })}
                  placeholder="https://twitter.com/..."
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
          )}
        />
      </section>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
