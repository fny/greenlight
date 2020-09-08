# Generates a JWT token pair
set -e

ssh-keygen -t rsa -b 4096 -m PEM -f jwt-RS256.key -q -N ""
openssl rsa -in jwt-RS256.key -pubout -outform PEM -out jwt-RS256.key.pub
echo
echo "Private Key"
cat jwt-RS256.key | tr -d '\n'
echo
echo "Public Key"
cat jwt-RS256.key.pub | tr -d '\n'

rm jwt-RS256.key jwt-RS256.key.pub
