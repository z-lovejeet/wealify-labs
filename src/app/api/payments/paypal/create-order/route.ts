import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { error: 'PayPal payments are currently disabled. Please use cryptocurrency checkout.' },
        { status: 403 }
    );
}
