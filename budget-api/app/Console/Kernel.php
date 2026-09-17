<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('sanctum:prune-expired --hours=24')->daily();

        $schedule->command('gtarabar:sync')
            ->everyFifteenMinutes()
            ->withoutOverlapping()
            ->runInBackground()
            ->onFailure(function () {
                Log::error('Scheduled gtarabar:sync failed.');
            });

        $schedule->command('gtarabar:status')
            ->dailyAt('08:00')
            ->appendOutputTo(storage_path('logs/hr-sync-status.log'));

        $schedule->command('training:sync-all --months=6 --delay=100')
            ->dailyAt('02:00')
            ->withoutOverlapping()
            ->runInBackground()
            ->onFailure(function () {
                Log::error('Scheduled training sync failed.');
            });
    }

    protected function commands(): void
    {
        require base_path('routes/console.php');
    }
}
