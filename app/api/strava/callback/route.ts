import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      console.error('Missing code');
      return NextResponse.json({ error: 'Missing code from Strava' }, { status: 400 });
    }

    const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

    console.log('Using STRAVA_CLIENT_ID:', STRAVA_CLIENT_ID);
    console.log('Using code:', code);

    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    console.log('Strava token response:', data);

    if (data.access_token) {
      return NextResponse.redirect(
        new URL(`/strava/success?access_token=${data.access_token}`, req.url)
      );
    } else {
      return NextResponse.json({ error: 'Failed to get access token', details: data }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in Strava callback:', error);
    return NextResponse.json({ error: 'Something went wrong', details: String(error) }, { status: 500 });
  }
}
