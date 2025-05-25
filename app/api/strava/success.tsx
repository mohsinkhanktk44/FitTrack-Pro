// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export default function StravaSuccess() {
//   const router = useRouter();
//   const { access_token } = router.query;

//   useEffect(() => {
//     if (access_token) {
//       localStorage.setItem('strava_access_token', access_token as string);
//       console.log('Access token saved to localStorage!');
//       // Redirect or load data
//     }
//   }, [access_token]);

//   return <p>Connected to Strava! You can now fetch activities.</p>;
// }
