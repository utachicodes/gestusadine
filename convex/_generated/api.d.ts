/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authz from "../authz.js";
import type * as classes from "../classes.js";
import type * as community from "../community.js";
import type * as config from "../config.js";
import type * as daily from "../daily.js";
import type * as events from "../events.js";
import type * as fixAdminRole from "../fixAdminRole.js";
import type * as gamification from "../gamification.js";
import type * as http from "../http.js";
import type * as library from "../library.js";
import type * as llm from "../llm.js";
import type * as naboopay from "../naboopay.js";
import type * as podcasts from "../podcasts.js";
import type * as posthog from "../posthog.js";
import type * as prayers from "../prayers.js";
import type * as products from "../products.js";
import type * as prompts from "../prompts.js";
import type * as quizzes from "../quizzes.js";
import type * as quranProgress from "../quranProgress.js";
import type * as rag from "../rag.js";
import type * as ragInternal from "../ragInternal.js";
import type * as rateLimiter from "../rateLimiter.js";
import type * as seed from "../seed.js";
import type * as seedIslamic from "../seedIslamic.js";
import type * as stats from "../stats.js";
import type * as subscription from "../subscription.js";
import type * as users from "../users.js";
import type * as videos from "../videos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authz: typeof authz;
  classes: typeof classes;
  community: typeof community;
  config: typeof config;
  daily: typeof daily;
  events: typeof events;
  fixAdminRole: typeof fixAdminRole;
  gamification: typeof gamification;
  http: typeof http;
  library: typeof library;
  llm: typeof llm;
  naboopay: typeof naboopay;
  podcasts: typeof podcasts;
  posthog: typeof posthog;
  prayers: typeof prayers;
  products: typeof products;
  prompts: typeof prompts;
  quizzes: typeof quizzes;
  quranProgress: typeof quranProgress;
  rag: typeof rag;
  ragInternal: typeof ragInternal;
  rateLimiter: typeof rateLimiter;
  seed: typeof seed;
  seedIslamic: typeof seedIslamic;
  stats: typeof stats;
  subscription: typeof subscription;
  users: typeof users;
  videos: typeof videos;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
