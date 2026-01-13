import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    cookieStore.delete("accessToken");
    cookieStore.delete("user");
    cookieStore.delete("get_started_complete");
    cookieStore.delete("onboarding_complete");
    cookieStore.delete("has_subscription");

    return NextResponse.json({
      success: true,
      message: "Logout successful" 
    });
  } catch (error) {
    console.error("Error deleting cookies:", error);
    return NextResponse.json(
      { success: false, message: "Error during logout" },
      { status: 500 }
    );
  }
}