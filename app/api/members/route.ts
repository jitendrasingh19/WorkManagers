import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, password, plan, age, weight, height, phone, gender } = await request.json();

    if (!name || !email || !password || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Check if member profile already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: "Member profile already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: 'member',
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create member profile
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        name,
        email,
        plan,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        phone: phone || "",
        gender: gender || "",
        password: hashedPassword, // Store hashed password for member table too
        status: "Active"
      })
      .select()
      .single();

    if (memberError) {
      // If member creation fails, we should probably delete the user account
      await supabase.from('users').delete().eq('id', user.id);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user, member });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}