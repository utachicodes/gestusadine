import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { ThemeService } from '../../../theme-service/theme.service.js';

const router = Router();

/**
 * GET /api/themes/me
 * Get current user's theme
 */
router.get('/me', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const theme = await ThemeService.getUserTheme(userId);

        res.json({
            success: true,
            theme,
        });
    } catch (error: any) {
        console.error('[ThemeRoutes] Error fetching theme:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch theme',
            message: error.message,
        });
    }
});

/**
 * PUT /api/themes/me
 * Update current user's theme (requires Core/Pro tier)
 */
router.put('/me', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;

        // Check if user has access to personalized themes
        const hasAccess = await ThemeService.hasThemeAccess(userId);

        if (!hasAccess) {
            res.status(403).json({
                success: false,
                error: 'Upgrade required',
                message: 'Personalized themes require Core or Pro subscription',
                upgrade_url: '/pricing',
            });
            return;
        }

        const { primary_color, accent_color, background_light, background_dark, font_family, border_radius } = req.body;

        // Validate hex colors
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (primary_color && !hexColorRegex.test(primary_color)) {
            res.status(400).json({
                success: false,
                error: 'Invalid color format',
                message: 'primary_color must be a valid hex color (e.g., #8B7355)',
            });
            return;
        }

        if (accent_color && !hexColorRegex.test(accent_color)) {
            res.status(400).json({
                success: false,
                error: 'Invalid color format',
                message: 'accent_color must be a valid hex color (e.g., #D4AF37)',
            });
            return;
        }

        const theme = await ThemeService.updateUserTheme(userId, {
            primary_color,
            accent_color,
            background_light,
            background_dark,
            font_family,
            border_radius,
        });

        res.json({
            success: true,
            theme,
            message: 'Theme updated successfully',
        });
    } catch (error: any) {
        console.error('[ThemeRoutes] Error updating theme:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update theme',
            message: error.message,
        });
    }
});

/**
 * DELETE /api/themes/me
 * Reset current user's theme to defaults
 */
router.delete('/me', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;

        await ThemeService.resetUserTheme(userId);

        res.json({
            success: true,
            message: 'Theme reset to defaults',
        });
    } catch (error: any) {
        console.error('[ThemeRoutes] Error resetting theme:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset theme',
            message: error.message,
        });
    }
});

/**
 * GET /api/themes/access
 * Check if current user has access to personalized themes
 */
router.get('/access', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const hasAccess = await ThemeService.hasThemeAccess(userId);

        res.json({
            success: true,
            hasAccess,
            feature: 'personalized_themes',
        });
    } catch (error: any) {
        console.error('[ThemeRoutes] Error checking access:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check access',
            message: error.message,
        });
    }
});

export default router;
