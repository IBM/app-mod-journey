# Role Based Access Control (RBAC)

- RBAC restricts access based on a user's role rather than granting permissions per user, following the principle of least privilege
- Available in Application Modernization Accelerator version 5.0.0 and later
- Requires an external OAuth2 source: AMA maps OAuth2 groups to AMA roles and, optionally, to specific workspaces

## Roles

- **Admin**: can assign roles and create/delete workspaces
- **Writer**: can modify workspace contents and create groups and tags
- **Reader**: view-only access

## Workspace Access

- OAuth2 groups can also be mapped to specific workspaces, restricting visibility to only those workspaces
- By default, all users can see all workspaces until workspace access restrictions are enabled

## Configuring RBAC on OpenShift (OCP)

- RBAC is disabled by default; enable it in the AMA operator's yaml (**Installed Operators > IBM Application Modernization Accelerator > AppMods > ama > yaml**) by setting `rbacEnabled: true` (and `amaAuditEnabled: true` if you want audit logging)
- The server pod restarts automatically to apply the change
- Configure an identity provider so users can log in, e.g. the htpasswd identity provider
- Create `Reader` and `Writer` groups and assign users to them:
  ```
  oc adm groups new Reader
  oc adm groups new Writer
  oc adm groups add-users Reader user1
  oc adm groups add-users Writer user1
  ```

## Configuring RBAC on non-OCP installs

- Requires an OAuth2/OIDC server; AMA supports **OAuth auto-discovery** (recommended, for OIDC-compliant providers like Keycloak, Azure AD, Okta, Auth0) or **manual configuration** of each endpoint, set via `scripts/.security_config`
- Register the OAuth callback (`/auth/callback`) and post-logout (`/revoked`) redirect URIs in your identity provider
- See [Configuring Authentication](configureAuthentication.md) for the full setup steps and configuration reference

## Getting Started

- Once RBAC is enabled, the next user to sign in is prompted to map one of their OAuth2 groups to the Admin role (this mapping cannot be removed)
- The Admin can then map further OAuth2 groups to roles and workspaces from **Roles and permissions**
- OAuth2 group names support regex, e.g. `Dev*` matches any group starting with `Dev`
- Audit tracking can be enabled to log all create/update/delete actions with the associated user id

For further information, see [Role Based Access Control (RBAC)](https://www.ibm.com/docs/en/ama?topic=accelerator-role-based-access-control-rbac)
