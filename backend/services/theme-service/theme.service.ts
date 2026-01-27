import { db } from '../api-gateway/src/lib/firebase-admin.js';

export interface UserTheme {
    id?: string;
    user_id: string;
    primary_color: string;
    accent_color: string;
    background_light?: string;
    background_dark?: string;
    font_family?: string;
    border_radius?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ThemeWithAccess {
    theme_id: string | null;
    primary_color: string;
    accent_color: string;
    background_light: string;
    background_dark: string;
    font_family: string;
    border_radius: string;
    has_access: boolean;
}

/**
 * Theme Service
 * Manages custom color themes for subscribers
 */
export class ThemeService {
    /**
     * Get user's theme with subscription access check
     */
    static async getUserTheme(userId: string): Promise<ThemeWithAccess> {
        try {
            // 1. Check Access
            const hasAccess = await this.hasThemeAccess(userId);

            // 2. Get Theme
            const snapshot = await db.collection('user_themes')
                .where('user_id', '==', userId)
                .limit(1)
                .get();

            let themeData: any = null;
            if (!snapshot.empty) {
                themeData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            }

            // Default values
            const defaults = {
                primary_color: '#8B7355',
                accent_color: '#D4AF37',
                background_light: '#FFFFFF',
                background_dark: '#1A1A1A',
                font_family: 'Inter',
                border_radius: '0.5rem',
            };

            if (themeData) {
                return {
                    theme_id: themeData.id,
                    primary_color: themeData.primary_color ?? defaults.primary_color,
                    accent_color: themeData.accent_color ?? defaults.accent_color,
                    background_light: themeData.background_light ?? defaults.background_light,
                    background_dark: themeData.background_dark ?? defaults.background_dark,
                    font_family: themeData.font_family ?? defaults.font_family,
                    border_radius: themeData.border_radius ?? defaults.border_radius,
                    has_access: hasAccess,
                };
            }

            return {
                theme_id: null,
                ...defaults,
                has_access: hasAccess,
            };

        } catch (error) {
            console.error('[ThemeService] Error fetching user theme:', error);
            // Return defaults on error
            return {
                theme_id: null,
                primary_color: '#8B7355',
                accent_color: '#D4AF37',
                background_light: '#FFFFFF',
                background_dark: '#1A1A1A',
                font_family: 'Inter',
                border_radius: '0.5rem',
                has_access: false,
            };
        }
    }

    /**
     * Update user's theme (requires personalized_themes feature)
     */
    static async updateUserTheme(userId: string, theme: Partial<UserTheme>): Promise<UserTheme | null> {
        try {
            // Check if theme exists
            const snapshot = await db.collection('user_themes')
                .where('user_id', '==', userId)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                // Update existing theme
                const docRef = snapshot.docs[0].ref;
                const updateData = {
                    ...theme,
                    updated_at: new Date().toISOString(),
                };
                await docRef.update(updateData);

                const updatedDoc = await docRef.get();
                return { id: updatedDoc.id, ...updatedDoc.data() } as UserTheme;
            } else {
                // Create new theme
                const newThemeData = {
                    user_id: userId,
                    ...theme,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                const docRef = await db.collection('user_themes').add(newThemeData);
                const newDoc = await docRef.get();
                return { id: newDoc.id, ...newDoc.data() } as UserTheme;
            }
        } catch (error: any) {
            console.error('[ThemeService] Error updating theme:', error);
            throw new Error(`Failed to update theme: ${error.message}`);
        }
    }

    /**
     * Reset user's theme to defaults
     */
    static async resetUserTheme(userId: string): Promise<void> {
        try {
            const snapshot = await db.collection('user_themes')
                .where('user_id', '==', userId)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } catch (error: any) {
            console.error('[ThemeService] Error resetting theme:', error);
            throw new Error(`Failed to reset theme: ${error.message}`);
        }
    }

    /**
     * Check if user has access to personalized themes
     */
    static async hasThemeAccess(userId: string): Promise<boolean> {
        try {
            // Get user subscription
            const subSnapshot = await db.collection('subscriptions') // Assuming 'subscriptions' collection
                .where('user_id', '==', userId)
                .where('status', '==', 'active')
                .limit(1)
                .get();

            if (subSnapshot.empty) {
                return false;
            }

            const subData = subSnapshot.docs[0].data();
            const planId = subData.plan_id;

            if (!planId) return false;

            // Get plan details
            // Check hardcoded or fetch from 'subscription_plans' collection
            // Assuming simplified logic: pro and core have access
            if (planId === 'pro' || planId === 'core') return true;

            // Or fetch plan
            const planDoc = await db.collection('subscription_plans').doc(planId).get();
            if (planDoc.exists) {
                return planDoc.data()?.personalized_themes === true;
            }

            return false;
        } catch (error) {
            console.error('[ThemeService] Error checking access:', error);
            return false;
        }
    }
}
