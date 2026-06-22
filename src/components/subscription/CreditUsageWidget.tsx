import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Clock, CalendarDays, Zap } from 'lucide-react';
import { useSubscription } from '@/data/subscription';
import { useTr } from '@/lib/i18n';

export function CreditUsageWidget() {
  const { hourlyUsed, hourlyLimit, dailyUsed, dailyLimit } = useSubscription();
  const tr = useTr();

  const hourlyPct = Math.min(100, Math.round((hourlyUsed / hourlyLimit) * 100));
  const dailyPct = Math.min(100, Math.round((dailyUsed / dailyLimit) * 100));

  const hourlyCritical = hourlyPct >= 80;
  const dailyCritical = dailyPct >= 80;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {tr({ en: 'Council Usage', fr: 'Utilisation du Conseil' })}
        </h3>
      </div>

      {/* Hourly */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{tr({ en: 'This hour', fr: 'Cette heure' })}</span>
          </div>
          <span className={`font-medium ${hourlyCritical ? 'text-destructive' : 'text-foreground'}`}>
            {hourlyUsed}/{hourlyLimit}
          </span>
        </div>
        <Progress value={hourlyPct} className="h-1.5" />
      </div>

      {/* Daily */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="w-3 h-3" />
            <span>{tr({ en: 'Today', fr: "Aujourd'hui" })}</span>
          </div>
          <span className={`font-medium ${dailyCritical ? 'text-destructive' : 'text-foreground'}`}>
            {dailyUsed}/{dailyLimit}
          </span>
        </div>
        <Progress value={dailyPct} className="h-1.5" />
      </div>
    </Card>
  );
}
