import {
  LocalNotifications,
  type ScheduleResult,
} from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

// ── Message matrix ───────────────────────────────────────────────────────

type Slot = "morning" | "afternoon" | "evening" | "night";

interface SlotConfig {
  hour: number;
  minute: number;
}

const SLOT_TIMES: Record<Slot, SlotConfig> = {
  morning:   { hour: 8,  minute: 0  },
  afternoon: { hour: 13, minute: 0  },
  evening:   { hour: 18, minute: 30 },
  night:     { hour: 21, minute: 0  },
};

// day = 0 (Sun) … 6 (Sat)
const MESSAGES: Record<Slot, (day: number) => { title: string; body: string }> = {
  morning: (day) => {
    if (day === 0) return { title: "Lazy Sunday morning? 🥞",   body: "Let's sort out a cozy brunch for you." };
    if (day === 1) return { title: "Start the week strong! ⚡",  body: "Fuel your Monday with a great breakfast." };
    if (day === 5) return { title: "Friday morning energy! 🎉", body: "Kick off the weekend with something delicious." };
    if (day === 6) return { title: "Happy Saturday! 🌅",         body: "Treat yourself to a proper weekend breakfast." };
    return               { title: "Good morning! 🌤️",           body: "Ready for today's breakfast suggestions?" };
  },
  afternoon: (day) => {
    if (day === 0) return { title: "Sunday lunch sorted? ☀️",  body: "Here are some light ideas waiting for you." };
    if (day === 5) return { title: "Friday lunch break! 🍕",   body: "You deserve something good today." };
    if (day === 6) return { title: "Weekend lunch time! 🥗",   body: "Keep the good vibes going with a fresh meal." };
    return               { title: "Lunchtime! 🍱",             body: "Let's find you something tasty to make." };
  },
  evening: (day) => {
    if (day === 0) return { title: "Sunday dinner ideas 🌆",   body: "Wind down the weekend with a comforting meal." };
    if (day === 4) return { title: "Thursday dinner! 🔥",      body: "Almost the weekend — celebrate with a great cook." };
    if (day === 5) return { title: "Friday night feast! 🥂",   body: "Treat yourself — you made it to the weekend." };
    if (day === 6) return { title: "Saturday dinner time! 🌙", body: "Make tonight's dinner one to remember." };
    return               { title: "What's for dinner? 🍽️",    body: "We've got personalised ideas from your pantry." };
  },
  night: (day) => {
    if (day === 5 || day === 6) return { title: "Late-night weekend snack? 🌃", body: "Quick bites from what you have at home." };
    return                             { title: "Late-night craving? 🌙",        body: "Here's what you can whip up right now." };
  },
};

// ── Notification IDs ─────────────────────────────────────────────────────
// IDs 1000–1027: 7 days × 4 slots
// ID 999: one-time demo/test notification
function notifId(dayOffset: number, slotIndex: number) {
  return 1000 + dayOffset * 4 + slotIndex;
}

const SLOTS: Slot[] = ["morning", "afternoon", "evening", "night"];


// ── Public API ───────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  const { display } = await LocalNotifications.checkPermissions();
  if (display === "granted") return true;

  const { display: granted } = await LocalNotifications.requestPermissions();
  return granted === "granted";
}

export async function scheduleWeeklyMealNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const permitted = await requestNotificationPermission();
  if (!permitted) return;

  // Cancel previous batch to avoid duplicates
  const pending = await LocalNotifications.getPending();
  const neubiteIds = pending.notifications
    .filter((n: any) => n.id >= 999 && n.id <= 1027)
    .map((n: any) => ({ id: n.id }));
  if (neubiteIds.length) {
    await LocalNotifications.cancel({ notifications: neubiteIds });
  }

  const now = new Date();
  const notifications: Parameters<typeof LocalNotifications.schedule>[0]["notifications"] = [];

  // ── Test notification: fires 8 seconds after app open ──────────────────
  const testAt = new Date(now.getTime() + 8_000);
  notifications.push({
    id: 999,
    title: "Neubite notifications are on! 🎉",
    body: "You'll get meal suggestions 4 times a day.",
    schedule: { at: testAt },
    extra: { route: "/dashboard" },
  });

  // ── 7-day rolling meal notifications ───────────────────────────────────
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const dayOfWeek = date.getDay();

    SLOTS.forEach((slot, slotIndex) => {
      const { hour, minute } = SLOT_TIMES[slot];
      const at = new Date(date);
      at.setHours(hour, minute, 0, 0);

      // Skip times already passed
      if (at <= now) return;

      const { title, body } = MESSAGES[slot](dayOfWeek);

      notifications.push({
        id: notifId(dayOffset, slotIndex),
        title,
        body,
        schedule: { at },
        smallIcon: "ic_stat_neubite",
        channelId: "meal-reminders",
        extra: { route: "/dashboard" },
      });
    });
  }

  const result: ScheduleResult = await LocalNotifications.schedule({ notifications });
  console.debug("[Notifications] scheduled", result.notifications.length, "notifications");
}

export async function cancelAllMealNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  const neubiteIds = pending.notifications
    .filter((n: any) => n.id >= 999 && n.id <= 1027)
    .map((n: any) => ({ id: n.id }));
  if (neubiteIds.length) {
    await LocalNotifications.cancel({ notifications: neubiteIds });
  }
}
