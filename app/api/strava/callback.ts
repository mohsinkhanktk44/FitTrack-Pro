// // app/api/strava/callback/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get('code');

//   if (!code) {
//     return NextResponse.json({ error: 'Missing code from Strava' }, { status: 400 });
//   }

//   try {
//     const response = await fetch('https://www.strava.com/oauth/token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         client_id: process.env.next_PUBLIC_STRAVA_CLIENT_ID,
//         client_secret: process.env.STRAVA_CLIENT_SECRET,
//         code,
//         grant_type: 'authorization_code',
//       }),
//     });

//     const data = await response.json();

//     if (data.access_token) {
//       // Redirect to /strava/success with token in query
//       return NextResponse.redirect(
//         new URL(`/strava/success?access_token=${data.access_token}`, req.url)
//       );
//     } else {
//       return NextResponse.json({ error: 'Failed to get access token', details: data }, { status: 500 });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: 'Something went wrong', details: String(error) }, { status: 500 });
//   }
// }
