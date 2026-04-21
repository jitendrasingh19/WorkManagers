import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Fetch all members that don't have user accounts
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*');

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 });
    }

    if (!members || members.length === 0) {
      return NextResponse.json({ message: "No members found" });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    for (const member of members) {
      // Check if user account already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', member.email)
        .single();

      if (!existingUser) {
        // Check if member has a password stored
        let password = member.password;

        if (!password) {
          // Generate a default password if none exists
          password = await bcrypt.hash('password123', 10); // Default password
          console.log(`Generated default password for ${member.email}`);
        }

        // Create user account
        const { error: userError } = await supabase
          .from('users')
          .insert({
            name: member.name,
            email: member.email,
            password: password,
            role: 'member',
          });

        if (userError) {
          console.error(`Error creating user for ${member.email}:`, userError);
          skippedCount++;
        } else {
          console.log(`Created user account for ${member.email}`);
          syncedCount++;
        }
      } else {
        console.log(`User account already exists for ${member.email}`);
        skippedCount++;
      }
    }

    return NextResponse.json({
      message: `Sync completed. Created ${syncedCount} user accounts, skipped ${skippedCount} members.`
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}