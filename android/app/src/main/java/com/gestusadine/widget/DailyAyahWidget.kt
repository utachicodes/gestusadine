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
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class DailyAyahWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val prefs = Prefs
        val ayah = prefs.dataStore.data.map { it[Prefs.DAILY_AYAH] ?: "" }.first()
        val source = prefs.dataStore.data.map { it[Prefs.DAILY_AYAH_SOURCE] ?: "" }.first()
        val translation = prefs.dataStore.data.map { it[Prefs.DAILY_AYAH_TRANSLATION] ?: "" }.first()

        // Try to fetch fresh content
        val freshContent = withContext(Dispatchers.IO) {
            GestuSaDineApi.fetchDailyContent()
        }

        val displayAyah = freshContent?.content?.takeIf { it.isNotEmpty() } ?: ayah
        val displaySource = freshContent?.source?.takeIf { it.isNotEmpty() } ?: source
        val displayTranslation = freshContent?.translation?.takeIf { it.isNotEmpty() } ?: translation

        if (freshContent != null) {
            Prefs.saveDailyContent(context, displayAyah, displaySource, displayTranslation)
        }

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
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = "Daily Ayah",
                            style = TextStyle(
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = ColorProvider(day = android.graphics.Color.parseColor("#047857")),
                            ),
                        )

                        Spacer(modifier = GlanceModifier.height(8.dp))

                        if (displayAyah.isNotEmpty()) {
                            Text(
                                text = displayAyah,
                                style = TextStyle(
                                    fontSize = 14.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#1C1917")),
                                ),
                                maxLines = 4,
                                modifier = GlanceModifier.fillMaxWidth(),
                            )
                        } else {
                            Text(
                                text = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
                                style = TextStyle(
                                    fontSize = 18.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#1C1917")),
                                ),
                            )
                        }

                        if (displaySource.isNotEmpty()) {
                            Spacer(modifier = GlanceModifier.height(6.dp))
                            Text(
                                text = displaySource,
                                style = TextStyle(
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#78716C")),
                                ),
                                maxLines = 1,
                            )
                        }

                        if (displayTranslation.isNotEmpty() && displayTranslation != displayAyah) {
                            Spacer(modifier = GlanceModifier.height(4.dp))
                            Text(
                                text = displayTranslation,
                                style = TextStyle(
                                    fontSize = 11.sp,
                                    color = ColorProvider(day = android.graphics.Color.parseColor("#A8A29E")),
                                ),
                                maxLines = 3,
                            )
                        }
                    }
                }
            }
        }
    }
}

class DailyAyahWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = DailyAyahWidget()
}
