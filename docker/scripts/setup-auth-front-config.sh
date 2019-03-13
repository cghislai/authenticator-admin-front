#!/bin/bash
[ "$DEBUG" = "1" ] && set -x

CHECK_FILE=/var/www/template/.auth-front-entrypoint
if [ -f "$CHECK_FILE" ] ; then
  echo "auth-front config already generated:"
  cat  /var/www/template/authenticator-admin-config.json
  exit 0
fi

if [ -f "/var/www/template/authenticator-admin-config.json" ] ; then
  echo "auth-front config already present:"
  cat  /var/www/template/authenticator-admin-config.json
  exit 0
fi



echo "auth-front config not present. Persist $(dirname ${CHECK_FILE}) to bypass this step"

AUTHENTICATOR_URL="${AUTHENTICATOR_URL:-}"

if [[ -z "$AUTHENTICATOR_URL" ]]; then
  echo "No AUTHENTICATOR_URL provided"
  exit 1
fi

mkdir -p /var/www/template/
cat << EOF > /var/www/template/authenticator-admin-config.json
{
  "authenticatorApiUrl": "${AUTHENTICATOR_URL}",
  "authenticatorAdminApiUrl": "${AUTHENTICATOR_URL}/admin"
}
EOF

echo "auth-front config:"
cat  /var/www/template/authenticator-admin-config.json
echo

touch ${CHECK_FILE}
[ "$DEBUG" = "1" ] && set +x || echo
