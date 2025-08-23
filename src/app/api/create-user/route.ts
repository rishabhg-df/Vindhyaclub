
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Ensure you have the service account key in your environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName,
    });
    
    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    console.error('API Route Error creating user:', error);
    // Provide a more specific error message for existing email
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'auth/email-already-exists: The email address is already in use by another account.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
