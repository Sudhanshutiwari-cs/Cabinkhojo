import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const text = await file.text();
    const students = JSON.parse(text);

    const logs: string[] = [];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    for (const s of students) {
      const { error } = await supabase.auth.admin.createUser({
        email: s.email,
        password: s.password,
        email_confirm: true,
        user_metadata: {
          name: s.name,
          roll: s.roll,
          department: s.department,
          role: "student",
        },
      });

      if (error) logs.push(`❌ ${s.email}: ${error.message}`);
      else logs.push(`✅ Created: ${s.email}`);
    }

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
