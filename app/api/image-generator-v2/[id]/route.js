// pages/api/fetch/[id].js
import { NextResponse } from 'next/server';

export async function POST(req) {
    const reqBody = await req.json();
    const apiUrl = `https://modelslab.com/api/v6/realtime/fetch/${id}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        });

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
