import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Time slot detection ─────────────────────────────────────────────────

type TimeSlot = "morning" | "afternoon" | "evening" | "night";

function getTimeSlot(hour: number): TimeSlot | null {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  if (hour >= 21 && hour < 24) return "night";
  return null; // midnight–6am: no notification
}

// ── Message matrix: slot × day ──────────────────────────────────────────

const MESSAGES: Record<
  TimeSlot,
  (day: number) => { title: string; body: string; emoji: string }
> = {
  morning: (day) => {
    if (day === 0)
      return {
        emoji: "🥞",
        title: "Lazy Sunday morning?",
        body: "Let's sort out a cozy brunch for you.",
      };
    if (day === 1)
      return {
        emoji: "⚡",
        title: "Start the week strong!",
        body: "Fuel your Monday with a great breakfast.",
      };
    if (day === 5)
      return {
        emoji: "🎉",
        title: "Friday morning energy!",
        body: "Kick off the weekend with something delicious.",
      };
    if (day === 6)
      return {
        emoji: "🌅",
        title: "Happy Saturday!",
        body: "Treat yourself to a proper weekend breakfast.",
      };
    return {
      emoji: "🌤️",
      title: "Good morning!",
      body: "Ready for today's breakfast suggestions?",
    };
  },
  afternoon: (day) => {
    if (day === 0)
      return {
        emoji: "☀️",
        title: "Sunday afternoon sorted?",
        body: "Here are some light lunch ideas for you.",
      };
    if (day === 5)
      return {
        emoji: "🍕",
        title: "Friday lunch break!",
        body: "You deserve something good today.",
      };
    if (day === 6)
      return {
        emoji: "🥗",
        title: "Weekend lunch time!",
        body: "Keep the good vibes going with a fresh meal.",
      };
    return {
      emoji: "🍱",
      title: "Lunchtime!",
      body: "Let's find you something tasty to make.",
    };
  },
  evening: (day) => {
    if (day === 0)
      return {
        emoji: "🌆",
        title: "Sunday dinner ideas",
        body: "Wind down the weekend with a comforting meal.",
      };
    if (day === 4)
      return {
        emoji: "🔥",
        title: "Thursday dinner!",
        body: "Almost the weekend — celebrate with a great cook.",
      };
    if (day === 5)
      return {
        emoji: "🥂",
        title: "Friday night feast!",
        body: "Treat yourself — you made it to the weekend.",
      };
    if (day === 6)
      return {
        emoji: "🌙",
        title: "Saturday dinner time!",
        body: "Make tonight's dinner one to remember.",
      };
    return {
      emoji: "🍽️",
      title: "What's for dinner?",
      body: "We've got personalised ideas from your pantry.",
    };
  },
  night: (day) => {
    if (day === 5 || day === 6)
      return {
        emoji: "🌃",
        title: "Late-night weekend snack?",
        body: "Quick bites from what you have at home.",
      };
    return {
      emoji: "🌙",
      title: "Late-night craving?",
      body: "Here's what you can whip up right now.",
    };
  },
};

// ── Persistence key (one notification per slot per calendar date) ────────

function storageKey(date: Date, slot: TimeSlot) {
  const d = date.toISOString().slice(0, 10); // yyyy-mm-dd
  return `neubite-notif-${d}-${slot}`;
}

// ── Component ────────────────────────────────────────────────────────────

export const MealTimeNotification: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const [leaving, setLeavng] = useState(false);
  const [content, setContent] = useState<{
    title: string;
    body: string;
    emoji: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const slot = getTimeSlot(now.getHours());
    if (!slot) return;

    const key = storageKey(now, slot);
    if (localStorage.getItem(key)) return; // already shown today for this slot

    const msg = MESSAGES[slot](now.getDay());
    setContent(msg);

    // Small delay so it doesn't fire the instant the app loads
    const showTimer = setTimeout(() => {
      localStorage.setItem(key, "1");
      setVisible(true);
      // Trigger enter animation on next tick
      requestAnimationFrame(() => setEntering(true));
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const autoClose = setTimeout(() => dismiss(), 8000);
    return () => clearTimeout(autoClose);
  }, [visible]);

  const dismiss = () => {
    setLeavng(true);
    setTimeout(() => {
      setVisible(false);
      setEntering(false);
      setLeavng(false);
    }, 350);
  };

  const handleCta = () => {
    dismiss();
    navigate("/dashboard");
  };

  if (!visible || !content) return null;

  return (
    <div
      className={`
        fixed z-50 bottom-24 md:bottom-auto md:top-5 right-4 md:right-5
        w-[calc(100vw-2rem)] max-w-sm
        bg-bg-primary rounded-2xl shadow-2xl border border-bg-secondary
        transition-all duration-350 ease-out
        ${entering && !leaving ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
      `}
      style={{ transitionProperty: "opacity, transform" }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-0.5 w-full rounded-t-2xl overflow-hidden">
        <div
          className="h-full bg-accent-primary rounded-full"
          style={{ animation: "shrink-bar 8s linear forwards" }}
        />
      </div>

      <div className="p-4 flex gap-3 items-start">
        {/* Emoji bubble */}
        <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-xl shrink-0">
          {content.emoji}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary leading-tight">
            {content.title}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 leading-snug">
            {content.body}
          </p>

          <button
            onClick={handleCta}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all"
          >
            Suggest recipes
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
