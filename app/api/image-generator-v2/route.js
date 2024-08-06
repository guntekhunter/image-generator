import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, imagePath } = await req.json();
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            key,
            prompt,
            negative_prompt,
            init_image,
            width,
            height,
            samples,
            temp,
            safety_checker,
            strength,
            seed,
            webhook,
            track_id
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://modelslab.com/api/v6/realtime/img2img", requestOptions);
            const result = await response.text();
            res.status(200).json({ result });
        } catch (error) {
            res.status(500).json({ error: 'Error generating image' });
        }

    } catch (error) {
        console.log(error)
    }
}