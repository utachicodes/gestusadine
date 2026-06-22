# GëstuSaDine — Android Widgets

Native Android companion app providing home screen widgets powered by [Jetpack Glance](https://developer.android.com/develop/ui/compose/glance).

## Widgets

| Widget | Description | Update |
|--------|-------------|--------|
| **Prayer Times** | Next prayer, daily schedule, Hijri date, city name | Every 30 min |
| **Daily Ayah** | Today's ayah with source and translation | Every hour |
| **Rank** | Current rank (Talib → Faqih), XP, and streak | Every hour |

## Requirements

- Android 8.0+ (API 26)
- Android Studio Ladybug+
- Kotlin 2.0+

## Setup

```bash
# Open the android/ directory in Android Studio
# Or build from command line:
cd android
./gradlew assembleDebug
```

## Architecture

```
android/app/src/main/java/com/gestusadine/widget/
├── ApiModels.kt          # Data models + Convex/AlAdhan API client
├── Preferences.kt         # DataStore for location, daily content, user stats
├── PrayerTimesWidget.kt   # Glance widget — prayer times + next prayer
├── DailyAyahWidget.kt     # Glance widget — daily ayah + translation
└── RankWidget.kt          # Glance widget — rank, XP, streak
```

## Data Flow

1. **Prayer Times** — fetched from [AlAdhan API](https://aladhan.com/prayer-times-api) (free, no key required)
2. **Daily Ayah** — fetched from the Convex backend (`dailyContent` table, same as the web app)
3. **Rank/XP** — stored locally in DataStore, synced from the web app

## Adding Widgets

Long-press the home screen → Widgets → GëstuSaDine → drag a widget to your home screen.

## Notes

- Prayer times use the Adhan calculation method (method=2 = Muslim World League)
- Default location: Mbour, Senegal (set via the web app)
- Widget updates are periodic (Android throttles to save battery)
- For real-time updates, tap the widget to open the full app
