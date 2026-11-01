# Configuring Authentication (non-OCP, Version 5.0.0 and later)

- Applies to non-OpenShift installs; requires an OAuth2/OIDC server
- Two setup methods are supported: **OAuth auto-discovery** (recommended) and **manual configuration**

## OAuth auto-discovery (recommended)

Use this if your provider is OIDC-compliant (e.g. Keycloak, Azure AD, Okta, Auth0).

1. Stop AMA: `./launch.sh` > Stop Application Modernization Accelerator
2. Edit `scripts/.security_config` and add:
   ```
   APPMOD_AUTH_ENABLED=true
   TA_AUTH_OIDC_ISSUER=https://your-idp.example.com
   TA_AUTH_OIDC_CLIENT_ID=your-client-id
   TA_AUTH_OIDC_CLIENT_SECRET=your-client-secret
   ```
3. Start AMA: `./launch.sh` > Start Application Modernization Accelerator

All other OAuth endpoints, the callback URI, and scope (`openid`) are discovered automatically from the issuer.

## Manual configuration (alternative)

Use this if your provider does not support OIDC discovery.

1. Stop AMA
2. Copy the variables from `scripts/.security_config_sample` into `scripts/.security_config` (drop any `#` comments) and fill in the actual endpoint values from your provider. See [Configuration reference](#configuration-reference)
3. Start AMA

## Configuration reference

**Required**: `APPMOD_AUTH_ENABLED`, `TA_AUTH_OIDC_CLIENT_ID`, `TA_AUTH_OIDC_CLIENT_SECRET`

**Auto-discovery**: `TA_AUTH_OIDC_ISSUER`

**Manual only**: `TA_AUTH_IDENTITY_REQUEST_ENDPOINT(_PATH|_SCOPE)`, `TA_AUTH_TOKEN_REQUEST_ENDPOINT(_PATH)`, `TA_AUTH_TOKEN_VERIFICATION_ENDPOINT(_PATH)`, `TA_AUTH_TOKEN_REVOCATION_ENDPOINT(_PATH)`, `TA_AUTH_END_SESSION_ENDPOINT(_PATH)`

**Optional**: `TA_AUTH_CALLBACK_STATE_PREFIX_PADDING`, `TA_AES_IV`, `TA_AES_KEY` (leave empty unless your provider requires them)

## Configuring the OAuth client in your identity provider

Register these redirect URIs in your IdP's OAuth client:

- Redirect URI: `https://<hostname>:<port>/auth/callback` (`http://localhost:<port>/auth/callback` for dev)
- Post-logout redirect URI: `https://<hostname>:<port>/revoked` (`http://localhost:<port>/revoked` for dev)

Default ports are `3443` (HTTPS) / `3000` (HTTP). If using default ports 443/80, register both the with-port and without-port variants, since some providers (e.g. Keycloak) require an exact string match.

**Common issue**: a "400 Bad Request" or "Invalid redirect URI" on login/logout usually means the redirect URI doesn't exactly match what's registered in the IdP.

MFA is configured at the IdP level. Enable it there and AMA will enforce it during login.
