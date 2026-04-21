import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Fetch all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role');

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    // For each member role user, create/update member profile
    for (const user of users) {
      if (user.role === 'member') {
        // Check if member already exists
        const { data: existingMember } = await supabase
          .from('members')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!existingMember) {
          // Create member profile
          const { error: insertError } = await supabase
            .from('members')
            .insert({
              name: user.name,
              email: user.email,
              status: 'Active',
              plan: 'Basic',
            });

          if (insertError) {
            console.error(`Error syncing member ${user.email}:`, insertError);
            skippedCount++;
          } else {
            syncedCount++;
            console.log(`✅ Synced member: ${user.email}`);
          }
        } else {
          skippedCount++;
        }
      }
    }

    return NextResponse.json({
      message: "Sync completed",
      syncedCount,
      skippedCount,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
