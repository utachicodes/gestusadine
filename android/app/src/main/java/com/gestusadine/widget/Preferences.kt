package com.gestusadine.widget

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.doublePreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "gestusadine")

object Prefs {
    val LATITUDE = doublePreferencesKey("latitude")
    val LONGITUDE = doublePreferencesKey("longitude")
    val CITY_NAME = stringPreferencesKey("city_name")
    val USER_XP = intPreferencesKey("user_xp")
    val USER_STREAK = intPreferencesKey("user_streak")
    val DAILY_AYAH = stringPreferencesKey("daily_ayah")
    val DAILY_AYAH_SOURCE = stringPreferencesKey("daily_ayah_source")
    val DAILY_AYAH_TRANSLATION = stringPreferencesKey("daily_ayah_translation")

    suspend fun getLatitude(context: Context): Double =
        context.dataStore.data.map { it[LATITUDE] ?: 14.4228 }.first()

    suspend fun getLongitude(context: Context): Double =
        context.dataStore.data.map { it[LONGITUDE] ?: -16.9646 }.first()

    suspend fun getCityName(context: Context): String =
        context.dataStore.data.map { it[CITY_NAME] ?: "Mbour" }.first()

    suspend fun saveLocation(context: Context, lat: Double, lng: Double, city: String) {
        context.dataStore.edit {
            it[LATITUDE] = lat
            it[LONGITUDE] = lng
            it[CITY_NAME] = city
        }
    }

    suspend fun saveDailyContent(context: Context, ayah: String, source: String, translation: String?) {
        context.dataStore.edit {
            it[DAILY_AYAH] = ayah
            it[DAILY_AYAH_SOURCE] = source
            if (translation != null) it[DAILY_AYAH_TRANSLATION] = translation
        }
    }

    suspend fun saveUserStats(context: Context, xp: Int, streak: Int) {
        context.dataStore.edit {
            it[USER_XP] = xp
            it[USER_STREAK] = streak
        }
    }
}
