import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Palette, RefreshCw, Sparkles } from 'lucide-react';

interface ThemeColors {
    primary_color: string;
    accent_color: string;
    background_light?: string;
    background_dark?: string;
}

interface ThemeCustomizerProps {
    onThemeChange?: (colors: ThemeColors) => void;
}

export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
    const [colors, setColors] = useState<ThemeColors>({
        primary_color: '#8B7355',
        accent_color: '#D4AF37',
        background_light: '#FFFFFF',
        background_dark: '#1A1A1A',
    });
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const applyTheme = useCallback((theme: any) => {
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary_color);
        root.style.setProperty('--accent', theme.accent_color);

        if (onThemeChange) {
            onThemeChange(theme);
        }
    }, [onThemeChange]);

    /**
     * Fix for exhaustive-deps lint warning:
     * checkAccess and fetchTheme are only used on mount, so we can define them inside useEffect
     * or use stable refs. Moving them inside is cleaner here.
     */
    useEffect(() => {
        const checkAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/api/themes/access`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setHasAccess(data.hasAccess);
            } catch (error) {
                console.error('Failed to check theme access:', error);
                setHasAccess(false);
            }
        };

        const fetchTheme = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/api/themes/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success && data.theme) {
                    setColors({
                        primary_color: data.theme.primary_color,
                        accent_color: data.theme.accent_color,
                        background_light: data.theme.background_light,
                        background_dark: data.theme.background_dark,
                    });
                    applyTheme(data.theme);
                }
            } catch (error) {
                console.error('Failed to fetch theme:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
        fetchTheme();
    }, [applyTheme]);



    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        const newColors = { ...colors, [key]: value };
        setColors(newColors);
        applyTheme(newColors);
    };

    const saveTheme = async () => {
        if (!hasAccess) {
            toast.error('Upgrade to Core or Pro to customize your theme');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/themes/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(colors),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Theme saved successfully!');
            } else if (response.status === 403) {
                toast.error(data.message || 'Upgrade required for custom themes');
            } else {
                toast.error(data.message || 'Failed to save theme');
            }
        } catch (error) {
            toast.error('Failed to save theme');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const resetTheme = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:4000/api/themes/me', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const defaults = {
                primary_color: '#8B7355',
                accent_color: '#D4AF37',
                background_light: '#FFFFFF',
                background_dark: '#1A1A1A',
            };

            setColors(defaults);
            applyTheme(defaults);
            toast.success('Theme reset to defaults');
        } catch (error) {
            toast.error('Failed to reset theme');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Custom Theme Colors</h3>
                {!hasAccess && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Core/Pro Only
                    </span>
                )}
            </div>

            {!hasAccess && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        🎨 Upgrade to <strong>Core</strong> or <strong>Pro</strong> to unlock custom theme colors and make the platform truly yours!
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                        <input
                            id="primary-color"
                            type="color"
                            value={colors.primary_color}
                            onChange={(e) => handleColorChange('primary_color', e.target.value)}
                            className="h-10 w-16 rounded border cursor-pointer disabled:opacity-50"
                            disabled={!hasAccess}
                        />
                        <input
                            type="text"
                            value={colors.primary_color}
                            onChange={(e) => handleColorChange('primary_color', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-50"
                            placeholder="#8B7355"
                            disabled={!hasAccess}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2 mt-1">
                        <input
                            id="accent-color"
                            type="color"
                            value={colors.accent_color}
                            onChange={(e) => handleColorChange('accent_color', e.target.value)}
                            className="h-10 w-16 rounded border cursor-pointer disabled:opacity-50"
                            disabled={!hasAccess}
                        />
                        <input
                            type="text"
                            value={colors.accent_color}
                            onChange={(e) => handleColorChange('accent_color', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-50"
                            placeholder="#D4AF37"
                            disabled={!hasAccess}
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-2">
                    <Button
                        onClick={saveTheme}
                        disabled={!hasAccess || saving}
                        className="flex-1"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Theme'
                        )}
                    </Button>
                    <Button
                        onClick={resetTheme}
                        variant="outline"
                        disabled={!hasAccess}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {hasAccess && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>Pro tip:</strong> Changes are previewed live. Click "Save Theme" to persist your customizations.
                    </p>
                </div>
            )}
        </Card>
    );
}
