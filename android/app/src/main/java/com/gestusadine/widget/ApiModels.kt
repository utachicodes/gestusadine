package com.gestusadine.widget

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit

@Serializable
data class PrayerTimesResponse(
    val data: PrayerData
)

@Serializable
data class PrayerData(
    val timings: PrayerTimings,
    val date: HijriDate
)

@Serializable
data class PrayerTimings(
    val Fajr: String = "",
    val Sunrise: String = "",
    val Dhuhr: String = "",
    val Asr: String = "",
    val Maghrib: String = "",
    val Isha: String = ""
)

@Serializable
data class HijriDate(
    val hijri: HijriDay
)

@Serializable
data class HijriDay(
    val day: String = "",
    val month: HijriMonth = HijriMonth(),
    val year: String = ""
)

@Serializable
data class HijriMonth(
    val en: String = "",
    val ar: String = ""
)

@Serializable
data class DailyContent(
    val contentType: String = "",
    val content: String = "",
    val source: String = "",
    val translation: String? = null
)

@Serializable
data class UserProfile(
    val xp: Int = 0,
    val streak: Int = 0
)

object GestuSaDineApi {
    private const val CONVEX_URL = "https://elegant-schnauzer-786.convex.cloud"
    private val json = Json { ignoreUnknownKeys = true }
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    suspend fun fetchPrayerTimes(latitude: Double, longitude: Double): PrayerData? {
        return try {
            val url = "https://api.aladhan.com/v1/timings/${System.currentTimeMillis() / 1000}" +
                "?latitude=$latitude&longitude=$longitude&method=2"
            val request = Request.Builder().url(url).get().build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: return null
                json.decodeFromString<PrayerTimesResponse>(body).data
            } else null
        } catch (e: Exception) {
            null
        }
    }

    suspend fun fetchDailyContent(): DailyContent? {
        return try {
            val url = "$CONVEX_URL/api/query"
            val body = """
                {"path":"dailyContent:getToday","args":{}}
            """.trimIndent()
            val request = Request.Builder()
                .url(url)
                .post(okhttp3.RequestBody.create(
                    okhttp3.MediaType.parse("application/json"),
                    body
                ))
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val respBody = response.body?.string() ?: return null
                json.decodeFromString(respBody)
            } else null
        } catch (e: Exception) {
            null
        }
    }
}
