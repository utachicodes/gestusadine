import { Request, Response } from "express";
import { CircleOrchestrator } from "../../../../orchestrator/circle.ts";
import { SubscriptionService } from "../../../subscription-service/subscription.service.js";

// Singleton instance to keep agents warm if needed
const orchestrator = new CircleOrchestrator();

export async function askCircle(req: Request, res: Response) {
    try {
        const { query } = req.body;
        const userId = req.authUser?.sub;

        if (!query || typeof query !== "string") {
            res.status(400).json({ error: "Query is required and must be a string." });
            return;
        }

        // Check credits if user is authenticated
        if (userId) {
            const hasCredits = await SubscriptionService.checkCreditsAvailable(userId);
            if (!hasCredits) {
                const usage = await SubscriptionService.getUsageStats(userId);
                res.status(429).json({
                    error: "Credit limit exceeded",
                    message: "You've used all your chat credits for this billing period. Upgrade to continue.",
                    usage,
                    upgradeUrl: "/pricing"
                });
                return;
            }
        }

        console.log(`[CircleRoute] Received query: ${query}`);

        const result = await orchestrator.processQuery(query);

        // Track usage after successful response (only for authenticated users)
        if (userId) {
            try {
                await SubscriptionService.trackUsage(userId, 1);
            } catch (trackError) {
                console.error('[CircleRoute] Failed to track usage:', trackError);
                // Don't fail the request if tracking fails
            }
        }

        res.json(result);
    } catch (error: any) {
        console.error(`[CircleRoute] Error processing query:`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message || "An error occurred in the Circle of Knowledge."
        });
    }
}
