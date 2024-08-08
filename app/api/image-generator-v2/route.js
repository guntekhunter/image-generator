import { NextResponse } from 'next/server';

export async function POST(req) {
    const reqBody = await req.json();
    const apiUrl = 'https://modelslab.com/api/v5/interior';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(reqBody),
        });

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
        }, {
            status: 500,
        });
    }
}