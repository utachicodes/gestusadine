package com.gestusadine.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.actionStartActivity
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.updateAll
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class PrayerTimesWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val prefs = Prefs
        val lat = prefs.getLatitude(context)
        val lng = prefs.getLongitude(context)
        val city = prefs.getCityName(context)

        val prayerData = withContext(Dispatchers.IO) {
            GestuSaDineApi.fetchPrayerTimes(lat, lng)
        }

        val timings = prayerData?.timings
        val hijri = prayerData?.date?.hijri

        val now = Calendar.getInstance()
        val currentHour = now.get(Calendar.HOUR_OF_DAY)
        val currentMin = now.get(Calendar.MINUTE)
        val nowMinutes = currentHour * 60 + currentMin

        data class PrayerInfo(val name: String, val time: String, val minutes: Int)

        fun parseTime(timeStr: String): Int {
            val clean = timeStr.replace(Regex("\\s*\\(.*\\)"), "").trim()
            val parts = clean.split(":")
            return if (parts.size == 2) {
                val h = parts[0].toIntOrNull() ?: 0
                val m = parts[1].toIntOrNull() ?: 0
                h * 60 + m
            } else 0
        }

        val prayers = listOf(
            PrayerInfo("Fajr", timings?.Fajr ?: "--:--", parseTime(timings?.Fajr ?: "0:0")),
            PrayerInfo("Sunrise", timings?.Sunrise ?: "--:--", parseTime(timings?.Sunrise ?: "0:0")),
            PrayerInfo("Dhuhr", timings?.Dhuhr ?: "--:--", parseTime(timings?.Dhuhr ?: "0:0")),
            PrayerInfo("Asr", timings?.Asr ?: "--:--", parseTime(timings?.Asr ?: "0:0")),
            PrayerInfo("Maghrib", timings?.Maghrib ?: "--:--", parseTime(timings?.Maghrib ?: "0:0")),
            PrayerInfo("Isha", timings?.Isha ?: "--:--", parseTime(timings?.Isha ?: "0:0")),
        )

        val nextPrayer = prayers.firstOrNull { it.minutes > nowMinutes && it.name != "Sunrise" }

        provideContent {
            GlanceTheme {
                Box(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .cornerRadius(20.dp)
                        .background(ColorProvider(day = android.graphics.Color.parseColor("#FAF7F0")))
                        .padding(16.dp),
                ) {
                    Column(modifier = GlanceModifier.fillMaxSize()) {
                        Row(
                            modifier = GlanceModifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                text = "Prayer Times",
                                style = TextStyle(
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#1C1917")),
                                ),
                            )
                            Spacer(modifier = GlanceModifier.defaultWeight())
                            Text(
                                text = city,
                                style = TextStyle(
                                    fontSize = 11.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#78716C")),
                                ),
                            )
                        }

                        if (hijri != null) {
                            Text(
                                text = "${hijri.day} ${hijri.month.en} ${hijri.year} AH",
                                style = TextStyle(
                                    fontSize = 11.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#A8A29E")),
                                ),
                            )
                        }

                        Spacer(modifier = GlanceModifier.height(8.dp))

                        if (nextPrayer != null) {
                            Row(
                                modifier = GlanceModifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    text = "Next: ${nextPrayer.name}",
                                    style = TextStyle(
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = ColorProvider(day = android.graphics.Color.parseColor("#047857")),
                                    ),
                                )
                                Spacer(modifier = GlanceModifier.defaultWeight())
                                Text(
                                    text = nextPrayer.time,
                                    style = TextStyle(
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = ColorProvider(day = android.graphics.Color.parseColor("#047857")),
                                    ),
                                )
                            }
                            Spacer(modifier = GlanceModifier.height(6.dp))
                        }

                        prayers.filter { it.name != "Sunrise" }.forEach { prayer ->
                            val isNext = prayer.name == nextPrayer?.name
                            Row(
                                modifier = GlanceModifier
                                    .fillMaxWidth()
                                    .padding(vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    text = prayer.name,
                                    style = TextStyle(
                                        fontSize = 12.sp,
                                        fontWeight = if (isNext) FontWeight.Bold else FontWeight.Normal,
                                        color = ColorProvider(day = if (isNext) android.graphics.Color.parseColor("#047857") else android.graphics.Color.parseColor("#57534E")),
                                    ),
                                )
                                Spacer(modifier = GlanceModifier.defaultWeight())
                                Text(
                                    text = prayer.time,
                                    style = TextStyle(
                                        fontSize = 12.sp,
                                        fontWeight = if (isNext) FontWeight.Bold else FontWeight.Normal,
                                        color = ColorProvider(day = if (isNext) android.graphics.Color.parseColor("#047857") else android.graphics.Color.parseColor("#57534E")),
                                    ),
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

class GestuSaDineWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = PrayerTimesWidget()
}
