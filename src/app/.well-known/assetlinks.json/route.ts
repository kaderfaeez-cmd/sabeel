/**
 * Digital Asset Links — required by Android to prove that the Play Store app and this
 * domain belong to the same owner.
 *
 * Without a matching fingerprint here, a Trusted Web Activity still installs but shows a
 * browser URL bar across the top, which fails the "looks like an app" bar and looks
 * broken to a user.
 *
 * The fingerprint comes from the signing key Google Play uses, found under
 * Play Console → Release → Setup → App signing → "SHA-256 certificate fingerprint".
 * Set it as the SABEEL_ANDROID_FINGERPRINT environment variable in Vercel.
 *
 * Until it is set this route returns an empty list, which is valid JSON and simply means
 * "no app is yet associated" — rather than publishing a placeholder fingerprint that
 * would silently never match.
 */

export const dynamic = 'force-static';
export const revalidate = 3600;

const PACKAGE_NAME = 'com.sabeelthepath.app';

export function GET() {
  const fingerprint = process.env.SABEEL_ANDROID_FINGERPRINT?.trim();

  const statements = fingerprint
    ? [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: PACKAGE_NAME,
            sha256_cert_fingerprints: [fingerprint],
          },
        },
      ]
    : [];

  return Response.json(statements, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
