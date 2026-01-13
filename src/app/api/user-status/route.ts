import { NextRequest, NextResponse } from "next/server";
import { getUserStatus } from "@/src/lib/server/getUserStatus";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
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
