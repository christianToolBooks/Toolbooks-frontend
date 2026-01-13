import { NextResponse } from "next/server";
import { setSignedCookie } from "../_utils/verify-cookie";

export async function POST() {
  try {
    await setSignedCookie("get_started_complete");
    return NextResponse.json({ 
      success: true,
      message: "Get started cookie saved" 
    });
  } catch (error) {
    console.error("Error guardando cookie:", error);
    return NextResponse.json(
      { success: false, message: "Error saving cookie" },
      { status: 500 }
    );
  }
}