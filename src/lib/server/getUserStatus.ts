import "server-only";

export async function getUserStatus(accessToken: string) {
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  );

  if (!userResponse.ok) return null;

  const userData = await userResponse.json();

  const getStartedComplete =
    userData?.data?.businessProfiles?.get_started_complete ?? false;

  const onboardingComplete =
    userData?.data?.businessProfiles?.onboarding_complete ?? false;

  let hasSubscription = false;

  try {
    const subRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/active`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    if (subRes.ok) {
      const subData = await subRes.json();
      hasSubscription = Boolean(subData?.data?.id);
    }
  } catch {}

  return {
    getStartedComplete,
    onboardingComplete,
    hasSubscription,
  };
}
