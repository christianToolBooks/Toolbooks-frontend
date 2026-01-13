import { NextRequest, NextResponse } from "next/server";
import { getUserStatus } from "@/src/lib/server/getUserStatus";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const internalSecret = request.headers.get("x-internal-secret");

  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized - Internal API only" },
      { status: 401 }
    );
  }

  const accessToken = request.headers.get("x-access-token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 400 }
    );
  }

  const status = await getUserStatus(accessToken);

  if (!status) {
    return NextResponse.json(
      { error: "Failed to fetch user status" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    get_started_complete: status.getStartedComplete,
    onboarding_complete: status.onboardingComplete,
    has_subscription: status.hasSubscription,
  });
}
