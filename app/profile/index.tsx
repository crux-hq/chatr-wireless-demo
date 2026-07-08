import { Redirect } from 'expo-router';

/** Deep-link shim — profile lives under tabs for persistent tab bar. */
export default function ProfileRedirect() {
  return <Redirect href="/(tabs)/profile" />;
}
