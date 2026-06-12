import { CONFIG } from 'src/config-global';

import Profile from 'src/sections/profile/Profile';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <Profile />
    </>
  );
}
