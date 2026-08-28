import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCode2, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  BedDouble
} from 'lucide-react';

export const SpecDocViewer: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'all' | 'spec' | 'confirmation' | 'sql' | 'lovable'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const supabaseSqlSchema = `-- =========================================================================
-- BISHKEK HOTEL: PRODUCTION SUPABASE POSTGRESQL SCHEMA (CLEAN SPEC)
-- Address: Sadovaya 82, Bishkek, Kyrgyzstan (Intersection with Budennogo)
-- Phones: 0880 334 335 | 0503 334 335 | WhatsApp: +996 503 334 335
-- Core Rules:
-- 1. No fixed 12:00 checkout. Stays are relative: Check-in + 12h or Check-in + 24h.
-- 2. 11 Rooms: Rooms 1-2 (12h: 2500 KGS), Rooms 3-7 (12h: 2800 KGS), Rooms 8-11 (12h: NULL/TBD)
-- 3. 24h stays: 5,000 KGS for all rooms (Breakfast status: TBD / "Маалымат такталууда")
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE stay_duration_enum AS ENUM ('12h', '24h');
CREATE TYPE booking_status_enum AS ENUM ('confirmed', 'checked_in', 'completed', 'cancelled');

-- 2. HOTEL_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.hotel_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL DEFAULT 'Bishkek Hotel',
    address JSONB NOT NULL DEFAULT '{"ru": "ул. Садовая 82, г. Бишкек, Кыргызстан", "ky": "Садовая көчөсү 82, Бишкек ш., Кыргызстан", "en": "Sadovaya 82, Bishkek, Kyrgyzstan"}',
    intersection_note JSONB NOT NULL DEFAULT '{"ru": "пересечение с ул. Будённого", "ky": "Будённый көчөсү менен кесилиште", "en": "intersection with Budennogo Street"}',
    phones TEXT[] NOT NULL DEFAULT ARRAY['0880 334 335', '0503 334 335'],
    whatsapp VARCHAR(50) NOT NULL DEFAULT '+996503334335',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Sadovaya+82+Bishkek+Kyrgyzstan',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROOMS TABLE (11 Rooms)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number INT NOT NULL UNIQUE,
    name JSONB NOT NULL,
    price_12h NUMERIC(10,2) NULL, -- NULL indicates "Маалымат такталууда" for Rooms 8-11
    price_24h_without_breakfast NUMERIC(10,2) NOT NULL DEFAULT 5000.00,
    price_24h_with_breakfast NUMERIC(10,2) NOT NULL DEFAULT 5000.00,
    description JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BOOKINGS TABLE (With Anti-Collision Overlap Trigger)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code VARCHAR(20) NOT NULL UNIQUE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    check_in_datetime TIMESTAMPTZ NOT NULL,
    duration stay_duration_enum NOT NULL,
    check_out_datetime TIMESTAMPTZ NOT NULL,
    has_breakfast BOOLEAN NOT NULL DEFAULT false,
    total_price_kgs NUMERIC(10,2) NOT NULL,
    status booking_status_enum NOT NULL DEFAULT 'confirmed',
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FUNCTION & TRIGGER: Prevent Overlapping Bookings for the Same Room
CREATE OR REPLACE FUNCTION public.check_booking_collision()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.bookings
        WHERE room_id = NEW.room_id
          AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
          AND status IN ('confirmed', 'checked_in')
          AND (
              (NEW.check_in_datetime < check_out_datetime) AND
              (NEW.check_out_datetime > check_in_datetime)
          )
    ) THEN
        RAISE EXCEPTION 'Room % is already occupied during the requested time window.', NEW.room_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_prevent_booking_collision
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.check_booking_collision();
`;

  const lovablePrompt = `### BISHKEK HOTEL: PRODUCTION SPECIFICATION FOR LOVABLE & SUPABASE

Build the production web app and booking platform for "Bishkek Hotel" in Bishkek, Kyrgyzstan.

FACTUAL HOTEL INFORMATION:
1. Address: Sadovaya 82, Bishkek (Intersection with Budennogo Street).
2. Contact Phones: 0880 334 335, 0503 334 335.
3. WhatsApp: +996 503 334 335.
4. Total Rooms: 11 Rooms (Rooms 1 through 11).

BUSINESS RULES:
1. NO FIXED 12:00 CHECKOUT. Stays are relative to arrival time:
   - 12-hour stay: Checkout = Check-in + 12 Hours.
   - 24-hour stay: Checkout = Check-in + 24 Hours.
2. PRICING:
   - Rooms 1–2 (12 Hours): 2,500 KGS
   - Rooms 3–7 (12 Hours): 2,800 KGS
   - Rooms 8–11 (12 Hours): Price to be determined ("Маалымат такталууда" / editable in Admin Panel)
   - 24-Hour Stay (All 11 Rooms): 5,000 KGS (Breakfast status: "Маалымат такталууда").
3. PUBLIC NAVIGATION:
   - Home, Rooms, Booking, About, Contact, Language switcher (KG / RU / EN).
   - No Admin or Technical portals in public navigation.
4. DATA ACCURACY:
   - Do NOT invent unverified amenities, room sizes, or fake ratings. Use neutral placeholders for pending data.`;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] pb-24">
      {/* Top Banner */}
      <div className="bg-[#14161C] border-b border-[#252936] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/30 font-sans">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Technical & Data Specification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-tight font-display">
              Bishkek Hotel Specification & Data Accuracy
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-sans">
              Clean, verified technical specification, Supabase schema, and list of items requiring owner confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl text-xs font-semibold gold-gradient-btn transition-all shadow flex items-center gap-1.5 font-sans"
            >
              <ShieldCheck className="w-4 h-4 text-[#0F1115]" />
              <span>Open Admin Panel</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] border border-[#252936] transition-colors font-sans"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#252936] pb-4 mb-8">
          {[
            { id: 'all', label: 'Complete Overview' },
            { id: 'confirmation', label: '⚠️ Items Requiring Owner Confirmation' },
            { id: 'spec', label: '10 Core Architecture Rules' },
            { id: 'sql', label: 'Supabase SQL Schema' },
            { id: 'lovable', label: 'Lovable Prompt Plan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all font-sans ${
                activeSection === tab.id
                  ? 'bg-[#C5A059] text-[#0F1115] shadow-md'
                  : 'bg-[#14161C] text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#1F222A] border border-[#252936]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION: ITEMS REQUIRING CONFIRMATION */}
        {(activeSection === 'all' || activeSection === 'confirmation') && (
          <div className="bg-[#14161C] border border-amber-500/30 rounded-2xl p-6 mb-12 shadow-xl">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#FAF8F5] font-display">
                  Тастыктоону талап кылган маалыматтар (Information Requiring Owner Confirmation)
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5 font-sans">
                  The following items have neutral placeholders in the system and await official input from the hotel owner or administrator:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="bg-[#0F1115] p-4 rounded-xl border border-[#252936] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                  <BedDouble className="w-4 h-4" />
                  <span>1. 12-Hour Rates for Rooms 8–11</span>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Currently displayed as <strong className="text-amber-400">"Маалымат такталууда"</strong>. Administrator can set these values in the Admin Panel without code changes once confirmed.
                </p>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-xl border border-[#252936] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>2. Room Sizes & Specific Amenities</span>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Exact square meters, bed types, and specific furniture lists are kept neutral to avoid inventing unverified claims.
                </p>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-xl border border-[#252936] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                  <Phone className="w-4 h-4" />
                  <span>3. Accepted Payment Methods</span>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Payment questions instruct guests to consult the 24/7 reception via 0880 334 335 / 0503 334 335 until exact payment integrations are specified.
                </p>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-xl border border-[#252936] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>4. Official Hotel Photos & Real Guest Reviews</span>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  All current reviews are explicitly marked as <strong className="text-amber-400">"Демо пикир"</strong>. Real guest reviews will populate via the admin moderation system.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: 10 CORE ARCHITECTURE RULES */}
        {(activeSection === 'all' || activeSection === 'spec') && (
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-2 text-[#C5A059]">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl font-bold text-[#FAF8F5] font-display">10 Core Architectural & Business Rules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1. Relative Checkout Calculation</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Strictly no fixed 12:00 checkout hour. Check-out is calculated purely relative to the guest's check-in time: Check-in + 12 Hours or Check-in + 24 Hours.
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2. 11 Rooms Total & Tiered Pricing</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Rooms 1–2 (2,500 KGS), Rooms 3–7 (2,800 KGS), Rooms 8–11 (TBD). 24-hour rate is 5,000 KGS for all rooms (breakfast is TBD).
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3. Clean Minimal Public Navigation</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Public header contains only Home, Rooms, Booking, About, Contact, and Language switcher. No admin or spec portals in public navigation.
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>4. Verified Contact Info</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Address: Sadovaya 82 (Corner of Budennogo). Phones: 0880 334 335 and 0503 334 335. WhatsApp: +996 503 334 335.
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5. Multilingual Localization</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Complete Kyrgyz (ky), Russian (ru), and English (en) support with instant context-driven switching.
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>6. Anti-Collision Booking Logic</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Prevents overlapping bookings for the same room using time-interval logic: (reqStart &lt; existEnd) && (reqEnd &gt; existStart).
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>7. Safe AI Concierge Fallback</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  The chatbot only answers verified facts (checkout calculation, rates, location, contact) and routes unknown questions to 0880 334 335.
                </p>
              </div>

              <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>8. Password-Protected Admin Panel</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                  Accessible via #admin or hidden footer control. Allows editing room prices (especially rooms 8–11), walk-in bookings, and settings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SUPABASE SQL DATABASE DDL */}
        {(activeSection === 'all' || activeSection === 'sql') && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <Database className="w-5 h-5" />
                <h2 className="text-xl font-bold text-[#FAF8F5] font-display">Supabase PostgreSQL Schema</h2>
              </div>
              <button
                onClick={() => handleCopy(supabaseSqlSchema, 'sql')}
                className="px-3.5 py-1.5 rounded-lg bg-[#1F222A] hover:bg-[#252936] text-xs font-semibold text-[#FAF8F5] border border-[#252936] flex items-center gap-1.5 transition-colors font-sans"
              >
                {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'sql' ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <div className="bg-[#0B0C0E] border border-[#252936] rounded-2xl p-4 overflow-x-auto shadow-2xl">
              <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                {supabaseSqlSchema}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION: LOVABLE PROMPT */}
        {(activeSection === 'all' || activeSection === 'lovable') && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <Zap className="w-5 h-5" />
                <h2 className="text-xl font-bold text-[#FAF8F5] font-display">Lovable Implementation Plan</h2>
              </div>
              <button
                onClick={() => handleCopy(lovablePrompt, 'lovable')}
                className="px-3.5 py-1.5 rounded-xl font-semibold gold-gradient-btn text-xs flex items-center gap-1.5 transition-colors shadow font-sans"
              >
                {copiedCode === 'lovable' ? <Check className="w-3.5 h-3.5 text-[#0F1115]" /> : <Copy className="w-3.5 h-3.5 text-[#0F1115]" />}
                <span>{copiedCode === 'lovable' ? 'Copied Prompt!' : 'Copy Lovable Prompt'}</span>
              </button>
            </div>

            <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="bg-[#0B0C0E] p-4 rounded-xl border border-[#252936] text-xs text-[#C5A059] font-mono whitespace-pre-wrap leading-relaxed">
                {lovablePrompt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
