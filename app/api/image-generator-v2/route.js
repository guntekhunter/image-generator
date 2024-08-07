// pages/api/proxy.js

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const apiUrl = 'https://modelslab.com/api/v6/realtime/img2img';
        const apiKey = 'gxc4b7xeac7vspDFHiQpXbptRyhbZYECun0yPPT71gxMLjl6yqzwb4HDwDDv';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            res.status(response.status).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
