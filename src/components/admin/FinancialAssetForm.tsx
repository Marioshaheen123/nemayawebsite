"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminLang } from "@/context/AdminLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

interface Instrument {
  nameEn: string;
  nameAr: string;
  symbol: string;
  spread: string;
  leverage: string;
  hours: string;
}

interface AssetAdvantage {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

interface AssetFaq {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

interface FinancialAssetData {
  id?: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  headlineEn: string;
  headlineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  statsEn: string;
  statsAr: string;
  whatIsEn: string;
  whatIsAr: string;
  sortOrder: number;
  instruments: Instrument[];
  advantages: AssetAdvantage[];
  faqs: AssetFaq[];
}

interface FinancialAssetFormProps {
  assetId?: string;
}

const emptyAsset: FinancialAssetData = {
  slug: "",
  nameEn: "",
  nameAr: "",
  headlineEn: "",
  headlineAr: "",
  descriptionEn: "",
  descriptionAr: "",
  imageUrl: "",
  statsEn: "[]",
  statsAr: "[]",
  whatIsEn: "[]",
  whatIsAr: "[]",
  sortOrder: 0,
  instruments: [],
  advantages: [],
  faqs: [],
};

export default function FinancialAssetForm({ assetId }: FinancialAssetFormProps) {
  const router = useRouter();
  const { adminLang } = useAdminLang();
  const isEdit = Boolean(assetId);
  const isAr = adminLang === "ar";

  const [asset, setAsset] = useState<FinancialAssetData>(emptyAsset);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    instruments: true,
    advantages: true,
    faqs: true,
  });

  const fetchAsset = useCallback(async () => {
    if (!assetId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/financial-assets/${assetId}`);
      if (!res.ok) throw new Error("Failed to fetch asset");
      const data = await res.json();
      setAsset({
        ...data,
        instruments: data.instruments ?? [],
        advantages: data.advantages ?? [],
        faqs: data.faqs ?? [],
      });
    } catch (err) {
      setError("Failed to load asset.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function setField(field: keyof FinancialAssetData, value: string | number) {
    setAsset((prev) => ({ ...prev, [field]: value }));
  }

  // Instruments
  function addInstrument() {
    setAsset((prev) => ({
      ...prev,
      instruments: [
        ...prev.instruments,
        { nameEn: "", nameAr: "", symbol: "", spread: "", leverage: "", hours: "" },
      ],
    }));
  }

  function updateInstrument(index: number, field: keyof Instrument, value: string) {
    setAsset((prev) => ({
      ...prev,
      instruments: prev.instruments.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      ),
    }));
  }

  function removeInstrument(index: number) {
    setAsset((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index),
    }));
  }

  // Advantages
  function addAdvantage() {
    setAsset((prev) => ({
      ...prev,
      advantages: [...prev.advantages, { titleEn: "", titleAr: "", descEn: "", descAr: "" }],
    }));
  }

  function updateAdvantage(index: number, field: keyof AssetAdvantage, value: string) {
    setAsset((prev) => ({
      ...prev,
      advantages: prev.advantages.map((adv, i) =>
        i === index ? { ...adv, [field]: value } : adv
      ),
    }));
  }

  function removeAdvantage(index: number) {
    setAsset((prev) => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
    }));
  }

  // FAQs
  function addFaq() {
    setAsset((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { questionEn: "", questionAr: "", answerEn: "", answerAr: "" }],
    }));
  }

  function updateFaq(index: number, field: keyof AssetFaq, value: string) {
    setAsset((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    }));
  }

  function removeFaq(index: number) {
    setAsset((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...asset,
        instruments: asset.instruments.map((inst, idx) => ({ ...inst, sortOrder: idx })),
        advantages: asset.advantages.map((adv, idx) => ({ ...adv, sortOrder: idx })),
        faqs: asset.faqs.map((faq, idx) => ({ ...faq, sortOrder: idx })),
      };

      let res: Response;
      if (isEdit && assetId) {
        res = await fetch(`/api/admin/financial-assets/${assetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/financial-assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }

      const saved = await res.json();
      showSuccess(isEdit ? "Asset updated successfully!" : "Asset created successfully!");

      if (!isEdit) {
        router.push(`/admin/financial-assets/${saved.id}`);
      } else {
        fetchAsset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save asset.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading asset...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/financial-assets")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? `Edit: ${asset.nameEn || asset.slug}` : "New Financial Asset"}
            </h1>
            {isEdit && (
              <p className="text-gray-500 text-sm mt-0.5">
                {asset.instruments.length} instruments &middot; {asset.advantages.length} advantages &middot; {asset.faqs.length} FAQs
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEdit ? "Save Changes" : "Create Asset"}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {successMsg}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={asset.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="e.g. forex, commodities"
              />
            </div>
            {isAr ? (
              <div className="space-y-2">
                <Label>Name (Arabic)</Label>
                <Input
                  value={asset.nameAr}
                  onChange={(e) => setField("nameAr", e.target.value)}
                  placeholder="اسم الأصل بالعربية"
                  dir="rtl"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input
                  value={asset.nameEn}
                  onChange={(e) => setField("nameEn", e.target.value)}
                  placeholder="Asset name in English"
                />
              </div>
            )}
          </div>

          {isAr ? (
            <div className="space-y-2">
              <Label>Headline (Arabic)</Label>
              <Input
                value={asset.headlineAr}
                onChange={(e) => setField("headlineAr", e.target.value)}
                placeholder="العنوان الرئيسي بالعربية"
                dir="rtl"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Headline (English)</Label>
              <Input
                value={asset.headlineEn}
                onChange={(e) => setField("headlineEn", e.target.value)}
                placeholder="Page headline in English"
              />
            </div>
          )}

          {isAr ? (
            <div className="space-y-2">
              <Label>Description (Arabic)</Label>
              <Textarea
                value={asset.descriptionAr}
                onChange={(e) => setField("descriptionAr", e.target.value)}
                placeholder="وصف الأصل بالعربية"
                dir="rtl"
                className="min-h-[100px] resize-y"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Description (English)</Label>
              <Textarea
                value={asset.descriptionEn}
                onChange={(e) => setField("descriptionEn", e.target.value)}
                placeholder="Asset description in English"
                className="min-h-[100px] resize-y"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={asset.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                placeholder="/images/asset-image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={asset.sortOrder}
                onChange={(e) => setField("sortOrder", Number(e.target.value))}
              />
            </div>
          </div>

          {isAr ? (
            <div className="space-y-2">
              <Label>Stats (Arabic) — JSON array or one per line</Label>
              <Textarea
                value={parseJsonToLines(asset.statsAr)}
                onChange={(e) =>
                  setField("statsAr", JSON.stringify(e.target.value.split("\n").filter(Boolean)))
                }
                placeholder="إحصائية 1&#10;إحصائية 2"
                dir="rtl"
                className="min-h-[80px] resize-y"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Stats (English) — JSON array or one per line</Label>
              <Textarea
                value={parseJsonToLines(asset.statsEn)}
                onChange={(e) =>
                  setField("statsEn", JSON.stringify(e.target.value.split("\n").filter(Boolean)))
                }
                placeholder="Stat 1&#10;Stat 2&#10;Stat 3"
                className="min-h-[80px] resize-y"
              />
            </div>
          )}

          {isAr ? (
            <div className="space-y-2">
              <Label>What Is (Arabic) — one paragraph per line</Label>
              <Textarea
                value={parseJsonToLines(asset.whatIsAr)}
                onChange={(e) =>
                  setField("whatIsAr", JSON.stringify(e.target.value.split("\n").filter(Boolean)))
                }
                placeholder="فقرة ما هو بالعربية..."
                dir="rtl"
                className="min-h-[100px] resize-y"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>What Is (English) — one paragraph per line</Label>
              <Textarea
                value={parseJsonToLines(asset.whatIsEn)}
                onChange={(e) =>
                  setField("whatIsEn", JSON.stringify(e.target.value.split("\n").filter(Boolean)))
                }
                placeholder="What is section paragraph in English..."
                className="min-h-[100px] resize-y"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection("instruments")}
            >
              {openSections.instruments ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <CardTitle className="text-base">
                Instruments ({asset.instruments.length})
              </CardTitle>
            </button>
            <Button size="sm" variant="outline" onClick={addInstrument}>
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        {openSections.instruments && (
          <CardContent className="space-y-4">
            {asset.instruments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No instruments yet.</p>
            ) : (
              asset.instruments.map((inst, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Instrument {idx + 1}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 h-7 w-7 p-0"
                      onClick={() => removeInstrument(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {isAr ? (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name (AR)</Label>
                        <Input
                          value={inst.nameAr}
                          onChange={(e) => updateInstrument(idx, "nameAr", e.target.value)}
                          placeholder="الاسم"
                          dir="rtl"
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name (EN)</Label>
                        <Input
                          value={inst.nameEn}
                          onChange={(e) => updateInstrument(idx, "nameEn", e.target.value)}
                          placeholder="Name EN"
                          className="text-sm"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Symbol</Label>
                      <Input
                        value={inst.symbol}
                        onChange={(e) => updateInstrument(idx, "symbol", e.target.value)}
                        placeholder="EUR/USD"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Spread</Label>
                      <Input
                        value={inst.spread}
                        onChange={(e) => updateInstrument(idx, "spread", e.target.value)}
                        placeholder="0.1 pips"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Leverage</Label>
                      <Input
                        value={inst.leverage}
                        onChange={(e) => updateInstrument(idx, "leverage", e.target.value)}
                        placeholder="1:500"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Trading Hours</Label>
                      <Input
                        value={inst.hours}
                        onChange={(e) => updateInstrument(idx, "hours", e.target.value)}
                        placeholder="24/5"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Advantages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection("advantages")}
            >
              {openSections.advantages ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <CardTitle className="text-base">
                Advantages ({asset.advantages.length})
              </CardTitle>
            </button>
            <Button size="sm" variant="outline" onClick={addAdvantage}>
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        {openSections.advantages && (
          <CardContent className="space-y-4">
            {asset.advantages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No advantages yet.</p>
            ) : (
              asset.advantages.map((adv, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Advantage {idx + 1}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 h-7 w-7 p-0"
                      onClick={() => removeAdvantage(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {isAr ? (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title (AR)</Label>
                          <Input
                            value={adv.titleAr}
                            onChange={(e) => updateAdvantage(idx, "titleAr", e.target.value)}
                            placeholder="عنوان الميزة"
                            dir="rtl"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description (AR)</Label>
                          <Textarea
                            value={adv.descAr}
                            onChange={(e) => updateAdvantage(idx, "descAr", e.target.value)}
                            placeholder="الوصف بالعربية"
                            dir="rtl"
                            className="text-sm min-h-[72px] resize-y"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title (EN)</Label>
                          <Input
                            value={adv.titleEn}
                            onChange={(e) => updateAdvantage(idx, "titleEn", e.target.value)}
                            placeholder="Advantage title in English"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description (EN)</Label>
                          <Textarea
                            value={adv.descEn}
                            onChange={(e) => updateAdvantage(idx, "descEn", e.target.value)}
                            placeholder="Description in English"
                            className="text-sm min-h-[72px] resize-y"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection("faqs")}
            >
              {openSections.faqs ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <CardTitle className="text-base">
                FAQs ({asset.faqs.length})
              </CardTitle>
            </button>
            <Button size="sm" variant="outline" onClick={addFaq}>
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        {openSections.faqs && (
          <CardContent className="space-y-4">
            {asset.faqs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No FAQs yet.</p>
            ) : (
              asset.faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">FAQ {idx + 1}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 h-7 w-7 p-0"
                      onClick={() => removeFaq(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {isAr ? (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Question (AR)</Label>
                          <Textarea
                            value={faq.questionAr}
                            onChange={(e) => updateFaq(idx, "questionAr", e.target.value)}
                            placeholder="السؤال بالعربية"
                            dir="rtl"
                            className="text-sm min-h-[60px] resize-y"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Answer (AR)</Label>
                          <Textarea
                            value={faq.answerAr}
                            onChange={(e) => updateFaq(idx, "answerAr", e.target.value)}
                            placeholder="الجواب بالعربية"
                            dir="rtl"
                            className="text-sm min-h-[80px] resize-y"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Question (EN)</Label>
                          <Textarea
                            value={faq.questionEn}
                            onChange={(e) => updateFaq(idx, "questionEn", e.target.value)}
                            placeholder="Question in English"
                            className="text-sm min-h-[60px] resize-y"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Answer (EN)</Label>
                          <Textarea
                            value={faq.answerEn}
                            onChange={(e) => updateFaq(idx, "answerEn", e.target.value)}
                            placeholder="Answer in English"
                            className="text-sm min-h-[80px] resize-y"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEdit ? "Save Changes" : "Create Asset"}
        </Button>
      </div>
    </div>
  );
}

function parseJsonToLines(json: string): string {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed.join("\n");
    return json;
  } catch {
    return json;
  }
}
