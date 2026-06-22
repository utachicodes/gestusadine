package com.gestusadine.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
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
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

private data class RankInfo(val name: String, val minXp: Int, val emoji: String)

private val RANKS = listOf(
    RankInfo("Talib", 0, "📖"),
    RankInfo("Murid", 100, "🕌"),
    RankInfo("Bahith", 500, "🔍"),
    RankInfo("Alim", 1000, "🎓"),
    RankInfo("Faqih", 2500, "⭐"),
)

private fun computeRank(xp: Int): RankInfo {
    var current = RANKS.first()
    for (rank in RANKS) {
        if (xp >= rank.minXp) current = rank
    }
    return current
}

private fun nextRank(xp: Int): RankInfo? {
    for (rank in RANKS) {
        if (xp < rank.minXp) return rank
    }
    return null
}

class RankWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val prefs = Prefs
        val xp = prefs.dataStore.data.map { it[Prefs.USER_XP] ?: 0 }.first()
        val streak = prefs.dataStore.data.map { it[Prefs.USER_STREAK] ?: 0 }.first()

        val rank = computeRank(xp)
        val next = nextRank(xp)
        val progress = if (next != null) {
            ((xp - rank.minXp).toFloat() / (next.minXp - rank.minXp).toFloat()).coerceIn(0f, 1f)
        } else 1f

        provideContent {
            GlanceTheme {
                Box(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .cornerRadius(20.dp)
                        .background(ColorProvider(day = android.graphics.Color.parseColor("#FAF7F0")))
                        .padding(16.dp),
                ) {
                    Column(
                        modifier = GlanceModifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = rank.emoji,
                            style = TextStyle(fontSize = 28.sp),
                        )

                        Text(
                            text = rank.name,
                            style = TextStyle(
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = ColorProvider(day = android.graphics.Color.parseColor("#047857")),
                            ),
                        )

                        Spacer(modifier = GlanceModifier.height(4.dp))

                        Text(
                            text = "${xp} XP",
                            style = TextStyle(
                                fontSize = 12.sp,
                                color = ColorProvider(day = android.graphics.Color.parseColor("#78716C")),
                            ),
                        )

                        if (streak > 0) {
                            Text(
                                text = "${streak} day streak 🔥",
                                style = TextStyle(
                                    fontSize = 11.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#B45309")),
                                ),
                            )
                        }
                    }
                }
            }
        }
    }
}

class RankWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = RankWidget()
}
