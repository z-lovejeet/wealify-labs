import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { message: 'PayPal webhooks are disabled.' },
        { status: 200 }
    );
}
