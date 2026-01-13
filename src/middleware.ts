import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_SECRET = process.env.COOKIE_SECRET!;

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(COOKIE_SECRET);
  const valueData = encoder.encode(value);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, valueData);
  const signatureHex = arrayBufferToHex(signature);

  return `${value}.${signatureHex}`;
}

async function verifyCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;

  const [value, signatureHex] = parts;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(COOKIE_SECRET);
  const valueData = encoder.encode(value);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expectedSignature = await crypto.subtle.sign("HMAC", key, valueData);
  const expectedSignatureHex = arrayBufferToHex(expectedSignature);

  return expectedSignatureHex === signatureHex && value === "true";
}


async function getUserCompletionStatus(accessToken: string, requestUrl: string) {
  try {
    const baseUrl = new URL(requestUrl).origin;
    const apiUrl = `${baseUrl}/api/internal/user-status`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
        'x-access-token': accessToken,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[MIDDLEWARE] Error fetching user status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.error) {
      console.error("[MIDDLEWARE] Error en respuesta de API interna:", data.error);
      return null;
    }
    
    const result = {
      getStartedComplete: data.get_started_complete || false,
      onboardingComplete: data.onboarding_complete || false,
      hasSubscription: data.has_subscription || false,
    };

    return result;
  } catch (error) {
    console.error("[MIDDLEWARE] Error fetching user completion status:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const onboardingComplete = request.cookies.get("onboarding_complete")?.value;
  const getStartedComplete = request.cookies.get("get_started_complete")?.value;
  const hasSubscriptionCookie = request.cookies.get("has_subscription")?.value;
  const isOnboardingCompleteCookie = await verifyCookie(onboardingComplete);
  const isGetStartedCompleteCookie = await verifyCookie(getStartedComplete);
  const hasSubscriptionFromCookie = await verifyCookie(hasSubscriptionCookie);
  const onboardingTampered = onboardingComplete && !isOnboardingCompleteCookie;
  const getStartedTampered = getStartedComplete && !isGetStartedCompleteCookie;
  const subscriptionTampered = hasSubscriptionCookie && !hasSubscriptionFromCookie;

  const response = NextResponse.next();
  let cookiesModified = false;

  if (onboardingTampered) {
    console.warn("[MIDDLEWARE] onboarding_complete tampered, deleting...");
    response.cookies.delete("onboarding_complete");
    cookiesModified = true;
  }

  if (getStartedTampered) {
    console.warn("[MIDDLEWARE] get_started_complete tampered, deleting...");
    response.cookies.delete("get_started_complete");
    cookiesModified = true;
  }

  if (subscriptionTampered) {
    console.warn("[MIDDLEWARE] has_subscription tampered, deleting...");
    response.cookies.delete("has_subscription");
    cookiesModified = true;
  }

  const publicRoutes = ["/auth"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";
  const hasValidAuth = accessToken && userCookie;

  if (!hasValidAuth && !isPublicRoute) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  const requiresStatusCheck = 
    pathname.startsWith("/onboarding") || 
    pathname.startsWith("/dashboard") ||
    pathname === "/auth/get-started";

  let actualStatus = null;

  if (hasValidAuth && requiresStatusCheck && accessToken) {
    const shouldCheckApi = 
      cookiesModified || 
      !isGetStartedCompleteCookie || 
      !isOnboardingCompleteCookie ||
      !hasSubscriptionFromCookie;

    if (shouldCheckApi) {
      actualStatus = await getUserCompletionStatus(accessToken, request.url);
      
      if (actualStatus) {

        if (actualStatus.getStartedComplete && !isGetStartedCompleteCookie) {
          const signedValue = await signValue("true");
          response.cookies.set("get_started_complete", signedValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          cookiesModified = true;
        }

        if (actualStatus.onboardingComplete && !isOnboardingCompleteCookie) {
          const signedValue = await signValue("true");
          response.cookies.set("onboarding_complete", signedValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          cookiesModified = true;
        }

        if (actualStatus.hasSubscription && !hasSubscriptionFromCookie) {
          const signedValue = await signValue("true");
          response.cookies.set("has_subscription", signedValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          cookiesModified = true;
        }
      } else {
      }
    }
  }

  const isGetStartedComplete = actualStatus?.getStartedComplete ?? isGetStartedCompleteCookie;
  const isOnboardingComplete = actualStatus?.onboardingComplete ?? isOnboardingCompleteCookie;
  const hasSubscription = actualStatus?.hasSubscription ?? hasSubscriptionFromCookie;

  function applyModifiedCookies(redirectResponse: NextResponse) {
    if (cookiesModified) {
      if (onboardingTampered) redirectResponse.cookies.delete("onboarding_complete");
      if (getStartedTampered) redirectResponse.cookies.delete("get_started_complete");
      if (subscriptionTampered) redirectResponse.cookies.delete("has_subscription");
    }
    return redirectResponse;
  }


  if (hasValidAuth && pathname.startsWith("/auth")) {
    
    if (!isGetStartedComplete) {
      if (pathname === "/auth/get-started") {
        return cookiesModified ? response : NextResponse.next();
      }
      return applyModifiedCookies(
        NextResponse.redirect(new URL("/auth/get-started", request.url))
      );
    }

    if (isGetStartedComplete && !hasSubscription) {
      if (pathname === "/auth/get-started") {
        return cookiesModified ? response : NextResponse.next();
      }
      return applyModifiedCookies(
        NextResponse.redirect(new URL("/auth/get-started", request.url))
      );
    }

    if (isGetStartedComplete && hasSubscription) {

  if (pathname === "/auth/get-started") {
    return applyModifiedCookies(
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  if (isOnboardingComplete && pathname.startsWith("/onboarding")) {
    return applyModifiedCookies(
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }
}
  }

  if (hasValidAuth && pathname.startsWith("/onboarding")) {
    if (!isGetStartedComplete) {
      return applyModifiedCookies(
        NextResponse.redirect(new URL("/auth/get-started", request.url))
      );
    }

    if (!hasSubscription) {
      return applyModifiedCookies(
        NextResponse.redirect(new URL("/auth/get-started", request.url))
      );
    }
    
    if (isOnboardingComplete) {
      return applyModifiedCookies(
        NextResponse.redirect(new URL("/dashboard", request.url))
      );
    }
  }

  // if (hasValidAuth && pathname.startsWith("/dashboard")) {
    
  //   if (!isGetStartedComplete) {
  //     return applyModifiedCookies(
  //       NextResponse.redirect(new URL("/auth/get-started", request.url))
  //     );
  //   }

  //   if (!hasSubscription) {
  //     return applyModifiedCookies(
  //       NextResponse.redirect(new URL("/auth/get-started", request.url))
  //     );
  //   }
  // }

  return cookiesModified ? response : NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/internal|api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};