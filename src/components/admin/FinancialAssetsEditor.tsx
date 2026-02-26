"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Instrument {
  id?: string;
  nameEn: string;
  nameAr: string;
  symbol: string;
  spread: string;
  leverage: string;
  hours: string;
  sortOrder: number;
  assetId?: string;
}

interface AssetAdvantage {
  id?: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  sortOrder: number;
  assetId?: string;
}

interface AssetFaq {
  id?: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  sortOrder: number;
  assetId?: string;
}

interface FinancialAsset {
  id: string;
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

interface AssetFormValues {
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
  instruments: Omit<Instrument, "id" | "assetId">[];
  advantages: Omit<AssetAdvantage, "id" | "assetId">[];
  faqs: Omit<AssetFaq, "id" | "assetId">[];
}

// ─── Asset Form (used for both create and edit) ──────────────────────────────

interface AssetFormProps {
  initial?: FinancialAsset;
  onSave: (data: AssetFormValues) => Promise<void>;
  onCancel: () => void;
}

function AssetForm({ initial, onSave, onCancel }: AssetFormProps) {
  const [instrumentsOpen, setInstrumentsOpen] = useState(true);
  const [advantagesOpen, setAdvantagesOpen] = useState(true);
  const [faqsOpen, setFaqsOpen] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormValues>({
    defaultValues: initial
      ? {
          slug: initial.slug,
          nameEn: initial.nameEn,
          nameAr: initial.nameAr,
          headlineEn: initial.headlineEn,
          headlineAr: initial.headlineAr,
          descriptionEn: initial.descriptionEn,
          descriptionAr: initial.descriptionAr,
          imageUrl: initial.imageUrl,
          statsEn: initial.statsEn ?? "[]",
          statsAr: initial.statsAr ?? "[]",
          whatIsEn: initial.whatIsEn ?? "[]",
          whatIsAr: initial.whatIsAr ?? "[]",
          sortOrder: initial.sortOrder,
          instruments: initial.instruments.map((inst) => ({
            nameEn: inst.nameEn,
            nameAr: inst.nameAr,
            symbol: inst.symbol,
            spread: inst.spread,
            leverage: inst.leverage,
            hours: inst.hours,
            sortOrder: inst.sortOrder,
          })),
          advantages: initial.advantages.map((adv) => ({
            titleEn: adv.titleEn,
            titleAr: adv.titleAr,
            descEn: adv.descEn,
            descAr: adv.descAr,
            sortOrder: adv.sortOrder,
          })),
          faqs: initial.faqs.map((faq) => ({
            questionEn: faq.questionEn,
            questionAr: faq.questionAr,
            answerEn: faq.answerEn,
            answerAr: faq.answerAr,
            sortOrder: faq.sortOrder,
          })),
        }
      : {
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
        },
  });

  const {
    fields: instrumentFields,
    append: appendInstrument,
    remove: removeInstrument,
    move: moveInstrument,
  } = useFieldArray({ control, name: "instruments" });

  const {
    fields: advantageFields,
    append: appendAdvantage,
    remove: removeAdvantage,
    move: moveAdvantage,
  } = useFieldArray({ control, name: "advantages" });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
    move: moveFaq,
  } = useFieldArray({ control, name: "faqs" });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5">
      {/* ── Basic Fields ─────────────────────────────────────────────────── */}

      {/* Slug + Sort Order */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Slug</Label>
          <Input
            placeholder="forex, indices, commodities..."
            {...register("slug", { required: "Slug is required" })}
          />
          {errors.slug && (
            <p className="text-red-500 text-xs">{errors.slug.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Name (EN)</Label>
          <Input
            placeholder="Forex"
            {...register("nameEn", { required: "Required" })}
          />
          {errors.nameEn && (
            <p className="text-red-500 text-xs">{errors.nameEn.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Name (AR)</Label>
          <Input
            dir="rtl"
            placeholder="فوركس"
            {...register("nameAr", { required: "Required" })}
          />
          {errors.nameAr && (
            <p className="text-red-500 text-xs">{errors.nameAr.message}</p>
          )}
        </div>
      </div>

      {/* Headline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Headline (EN)</Label>
          <Input
            placeholder="Trade the world's largest market"
            {...register("headlineEn")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Headline (AR)</Label>
          <Input
            dir="rtl"
            placeholder="تداول في أكبر سوق في العالم"
            {...register("headlineAr")}
          />
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Description (EN)</Label>
          <Textarea
            rows={3}
            placeholder="Asset description in English..."
            {...register("descriptionEn")}
            className="resize-y"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Description (AR)</Label>
          <Textarea
            rows={3}
            dir="rtl"
            placeholder="وصف الأصل بالعربية..."
            {...register("descriptionAr")}
            className="resize-y"
          />
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-1.5">
        <Label>Image URL</Label>
        <Input
          placeholder="/images/assets/forex.png"
          {...register("imageUrl")}
        />
      </div>

      {/* Stats EN / AR (JSON) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Stats (EN) &mdash; JSON</Label>
          <Textarea
            rows={3}
            placeholder='[{"label":"Spreads from","value":"0.0 pips"}]'
            {...register("statsEn")}
            className="resize-y font-mono text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Stats (AR) &mdash; JSON</Label>
          <Textarea
            rows={3}
            dir="rtl"
            placeholder='[{"label":"سبريد يبدأ من","value":"0.0 نقطة"}]'
            {...register("statsAr")}
            className="resize-y font-mono text-xs"
          />
        </div>
      </div>

      {/* WhatIs EN / AR (JSON) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>What Is (EN) &mdash; JSON</Label>
          <Textarea
            rows={3}
            placeholder='[{"heading":"What is Forex?","body":"..."}]'
            {...register("whatIsEn")}
            className="resize-y font-mono text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label>What Is (AR) &mdash; JSON</Label>
          <Textarea
            rows={3}
            dir="rtl"
            placeholder='[{"heading":"ما هو الفوركس؟","body":"..."}]'
            {...register("whatIsAr")}
            className="resize-y font-mono text-xs"
          />
        </div>
      </div>

      {/* ── Instruments Section ──────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => setInstrumentsOpen(!instrumentsOpen)}
        >
          {instrumentsOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <span className="text-sm font-semibold text-gray-700">Instruments</span>
          <Badge variant="secondary" className="ml-1">
            {instrumentFields.length}
          </Badge>
        </button>

        {instrumentsOpen && (
          <div className="p-4 space-y-3">
            {instrumentFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-3">
                No instruments yet.
              </p>
            )}

            {instrumentFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Instrument #{index + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => index > 0 && moveInstrument(index, index - 1)}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        index < instrumentFields.length - 1 &&
                        moveInstrument(index, index + 1)
                      }
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === instrumentFields.length - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-1.5"
                      onClick={() => removeInstrument(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {/* Name EN / AR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Name (EN)</Label>
                    <Input
                      placeholder="EUR/USD"
                      className="text-sm"
                      {...register(`instruments.${index}.nameEn`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Name (AR)</Label>
                    <Input
                      dir="rtl"
                      placeholder="يورو/دولار"
                      className="text-sm"
                      {...register(`instruments.${index}.nameAr`)}
                    />
                  </div>
                </div>
                {/* Symbol, Spread, Leverage, Hours */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Symbol</Label>
                    <Input
                      placeholder="EURUSD"
                      className="text-sm"
                      {...register(`instruments.${index}.symbol`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Spread</Label>
                    <Input
                      placeholder="0.1"
                      className="text-sm"
                      {...register(`instruments.${index}.spread`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Leverage</Label>
                    <Input
                      placeholder="1:500"
                      className="text-sm"
                      {...register(`instruments.${index}.leverage`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hours</Label>
                    <Input
                      placeholder="24/5"
                      className="text-sm"
                      {...register(`instruments.${index}.hours`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                appendInstrument({
                  nameEn: "",
                  nameAr: "",
                  symbol: "",
                  spread: "",
                  leverage: "",
                  hours: "",
                  sortOrder: instrumentFields.length,
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Instrument
            </Button>
          </div>
        )}
      </div>

      {/* ── Advantages Section ───────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => setAdvantagesOpen(!advantagesOpen)}
        >
          {advantagesOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <span className="text-sm font-semibold text-gray-700">Advantages</span>
          <Badge variant="secondary" className="ml-1">
            {advantageFields.length}
          </Badge>
        </button>

        {advantagesOpen && (
          <div className="p-4 space-y-3">
            {advantageFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-3">
                No advantages yet.
              </p>
            )}

            {advantageFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Advantage #{index + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => index > 0 && moveAdvantage(index, index - 1)}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        index < advantageFields.length - 1 &&
                        moveAdvantage(index, index + 1)
                      }
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === advantageFields.length - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-1.5"
                      onClick={() => removeAdvantage(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {/* Title EN / AR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Title (EN)</Label>
                    <Input
                      placeholder="Low Spreads"
                      className="text-sm"
                      {...register(`advantages.${index}.titleEn`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Title (AR)</Label>
                    <Input
                      dir="rtl"
                      placeholder="سبريد منخفض"
                      className="text-sm"
                      {...register(`advantages.${index}.titleAr`)}
                    />
                  </div>
                </div>
                {/* Description EN / AR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Description (EN)</Label>
                    <Textarea
                      rows={2}
                      placeholder="Advantage description..."
                      className="text-sm resize-y"
                      {...register(`advantages.${index}.descEn`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description (AR)</Label>
                    <Textarea
                      rows={2}
                      dir="rtl"
                      placeholder="وصف الميزة..."
                      className="text-sm resize-y"
                      {...register(`advantages.${index}.descAr`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                appendAdvantage({
                  titleEn: "",
                  titleAr: "",
                  descEn: "",
                  descAr: "",
                  sortOrder: advantageFields.length,
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Advantage
            </Button>
          </div>
        )}
      </div>

      {/* ── FAQs Section ─────────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => setFaqsOpen(!faqsOpen)}
        >
          {faqsOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <span className="text-sm font-semibold text-gray-700">FAQs</span>
          <Badge variant="secondary" className="ml-1">
            {faqFields.length}
          </Badge>
        </button>

        {faqsOpen && (
          <div className="p-4 space-y-3">
            {faqFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-3">
                No FAQs yet.
              </p>
            )}

            {faqFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    FAQ #{index + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => index > 0 && moveFaq(index, index - 1)}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        index < faqFields.length - 1 && moveFaq(index, index + 1)
                      }
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      disabled={index === faqFields.length - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-1.5"
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {/* Question EN / AR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Question (EN)</Label>
                    <Input
                      placeholder="What is Forex trading?"
                      className="text-sm"
                      {...register(`faqs.${index}.questionEn`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Question (AR)</Label>
                    <Input
                      dir="rtl"
                      placeholder="ما هو تداول الفوركس؟"
                      className="text-sm"
                      {...register(`faqs.${index}.questionAr`)}
                    />
                  </div>
                </div>
                {/* Answer EN / AR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Answer (EN)</Label>
                    <Textarea
                      rows={3}
                      placeholder="Forex trading is..."
                      className="text-sm resize-y"
                      {...register(`faqs.${index}.answerEn`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Answer (AR)</Label>
                    <Textarea
                      rows={3}
                      dir="rtl"
                      placeholder="تداول الفوركس هو..."
                      className="text-sm resize-y"
                      {...register(`faqs.${index}.answerAr`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                appendFaq({
                  questionEn: "",
                  questionAr: "",
                  answerEn: "",
                  answerAr: "",
                  sortOrder: faqFields.length,
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add FAQ
            </Button>
          </div>
        )}
      </div>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Check className="w-4 h-4 mr-1" />
          )}
          Save Asset
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main FinancialAssetsEditor ──────────────────────────────────────────────

interface FinancialAssetsEditorProps {
  initialAssets: FinancialAsset[];
}

export default function FinancialAssetsEditor({
  initialAssets,
}: FinancialAssetsEditorProps) {
  const [assets, setAssets] = useState<FinancialAsset[]>(initialAssets);
  const [addingAsset, setAddingAsset] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reloadAssets = async () => {
    const res = await fetch("/api/admin/financial-assets");
    if (!res.ok) return;
    // The list endpoint returns a lightweight payload; we need full includes.
    // Re-fetch each asset individually for full data.
    const list = await res.json();
    const full = await Promise.all(
      list.map(async (a: { id: string }) => {
        const r = await fetch(`/api/admin/financial-assets/${a.id}`);
        return r.ok ? r.json() : null;
      })
    );
    setAssets(full.filter(Boolean));
  };

  const handleAddAsset = async (data: AssetFormValues) => {
    // POST creates the base asset
    const res = await fetch("/api/admin/financial-assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      alert(errData.error || "Failed to create asset");
      return;
    }

    const created = await res.json();

    // If there are nested items, PUT them onto the newly created asset
    const hasNested =
      data.instruments.length > 0 ||
      data.advantages.length > 0 ||
      data.faqs.length > 0;

    if (hasNested) {
      const putRes = await fetch(
        `/api/admin/financial-assets/${created.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instruments: data.instruments.map((inst, i) => ({
              ...inst,
              sortOrder: i,
            })),
            advantages: data.advantages.map((adv, i) => ({
              ...adv,
              sortOrder: i,
            })),
            faqs: data.faqs.map((faq, i) => ({ ...faq, sortOrder: i })),
          }),
        }
      );

      if (!putRes.ok) {
        console.error("Failed to save nested items after creation");
      }
    }

    await reloadAssets();
    setAddingAsset(false);
  };

  const handleUpdateAsset = async (
    id: string,
    data: AssetFormValues
  ) => {
    const body = {
      ...data,
      instruments: data.instruments.map((inst, i) => ({
        ...inst,
        sortOrder: i,
      })),
      advantages: data.advantages.map((adv, i) => ({
        ...adv,
        sortOrder: i,
      })),
      faqs: data.faqs.map((faq, i) => ({ ...faq, sortOrder: i })),
    };

    const res = await fetch(`/api/admin/financial-assets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      alert(errData.error || "Failed to update asset");
      return;
    }

    await reloadAssets();
    setEditingAssetId(null);
  };

  const handleDeleteAsset = async (id: string) => {
    if (
      !confirm(
        "Delete this financial asset and all its instruments, advantages, and FAQs? This cannot be undone."
      )
    )
      return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/financial-assets/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await reloadAssets();
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Assets
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage financial asset pages with instruments, advantages, and FAQs.
          </p>
        </div>
        <Button onClick={() => setAddingAsset(true)} disabled={addingAsset}>
          <Plus className="w-4 h-4 mr-1" />
          Add Asset
        </Button>
      </div>

      {/* Add Asset Form */}
      {addingAsset && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Financial Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetForm
              onSave={handleAddAsset}
              onCancel={() => setAddingAsset(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {assets.length === 0 && !addingAsset && (
        <div className="text-center py-16">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            No financial assets yet. Click &quot;Add Asset&quot; to get started.
          </p>
        </div>
      )}

      {/* Assets Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assets.map((asset) => {
          const isEditing = editingAssetId === asset.id;

          return (
            <Card key={asset.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">
                      {asset.nameEn}
                    </CardTitle>
                    <p
                      className="text-gray-500 text-sm mt-0.5 truncate"
                      dir="rtl"
                    >
                      {asset.nameAr}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="secondary">#{asset.sortOrder}</Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-mono"
                    >
                      /{asset.slug}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() =>
                        setEditingAssetId(isEditing ? null : asset.id)
                      }
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAsset(asset.id)}
                      disabled={deletingId === asset.id}
                    >
                      {deletingId === asset.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Summary when not editing */}
              {!isEditing && (
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {asset.headlineEn && (
                      <p className="text-gray-600 line-clamp-2">
                        {asset.headlineEn}
                      </p>
                    )}
                    <div className="flex gap-3 text-xs text-gray-400 pt-1">
                      <span>{asset.instruments?.length ?? 0} instruments</span>
                      <span>{asset.advantages?.length ?? 0} advantages</span>
                      <span>{asset.faqs?.length ?? 0} FAQs</span>
                    </div>
                    {asset.imageUrl && (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 mt-2">
                        <img
                          src={asset.imageUrl}
                          alt={asset.nameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              )}

              {/* Edit Form */}
              {isEditing && (
                <CardContent className="pt-0 border-t">
                  <div className="pt-4">
                    <AssetForm
                      initial={asset}
                      onSave={(data) => handleUpdateAsset(asset.id, data)}
                      onCancel={() => setEditingAssetId(null)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
