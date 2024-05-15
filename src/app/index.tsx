import { Redirect } from 'expo-router';
import { useAppAuth } from '@/context/auth';

export default function Splashscreen() {
  const { ready } = useAppAuth();

  if (ready) {
    return <Redirect href="/home" />;
  }

  return null;
}
