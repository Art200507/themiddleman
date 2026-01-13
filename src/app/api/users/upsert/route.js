import { NextResponse } from 'next/server';
import { execute } from '@/lib/mysql';

export async function POST(request) {
  try {
    const { uid, name, email, role } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    await execute(
      `INSERT INTO users (uid, name, email, role, created_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         role = VALUES(role)`,
      [uid, name || null, email, role || 'seller']
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error upserting user:', error);
    return NextResponse.json(
      { error: 'Failed to upsert user' },
      { status: 500 }
    );
  }
}
