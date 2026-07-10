from django.core import signing

VAULT_TOKEN_SALT = "vault-category-lock"
VAULT_TOKEN_MAX_AGE = 15 * 60

def generate_vault_token(user_id, category_id):
    return signing.dumps(
        {"user_id": str(user_id), "category_id": str(category_id)},
        salt=VAULT_TOKEN_SALT,
    )

def verify_vault_token(token, user_id, category_id):
    try:
        data = signing.loads(token, salt=VAULT_TOKEN_SALT, max_age=VAULT_TOKEN_MAX_AGE)
    except signing.BadSignature:
        return False
    return data.get("user_id") == str(user_id) and data.get("category_id") == str(category_id)