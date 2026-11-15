BEGIN;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM customers
        WHERE email IS NULL OR btrim(email) = ''
    ) THEN
        RAISE EXCEPTION 'Cannot merge accounts: every customer must have a non-empty email';
    END IF;
END $$;

CREATE TEMP TABLE account_email_merge ON COMMIT DROP AS
SELECT
    user_id,
    first_value(user_id) OVER (
        PARTITION BY lower(btrim(email))
        ORDER BY (password IS NOT NULL) DESC, user_id::text
    ) AS canonical_user_id
FROM customers;

CREATE TEMP TABLE merged_user_providers ON COMMIT DROP AS
SELECT DISTINCT
    account_email_merge.canonical_user_id AS user_id,
    user_provider.provider
FROM user_provider
JOIN account_email_merge
    ON account_email_merge.user_id = user_provider.user_id;

DO $$
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN
        SELECT constraint_info.conname
        FROM pg_constraint AS constraint_info
        WHERE constraint_info.conrelid = 'url_mapping'::regclass
          AND constraint_info.contype = 'u'
          AND (
              SELECT string_agg(attribute_info.attname::text, ',' ORDER BY attribute_info.attname::text)
              FROM unnest(constraint_info.conkey) AS key_info(attnum)
              JOIN pg_attribute AS attribute_info
                ON attribute_info.attrelid = constraint_info.conrelid
               AND attribute_info.attnum = key_info.attnum
          ) = 'long_url,user_id'
    LOOP
        EXECUTE format('ALTER TABLE url_mapping DROP CONSTRAINT %I', constraint_name);
    END LOOP;
END $$;

UPDATE url_mapping
SET user_id = account_email_merge.canonical_user_id
FROM account_email_merge
WHERE url_mapping.user_id = account_email_merge.user_id
  AND account_email_merge.user_id <> account_email_merge.canonical_user_id;

DO $$
DECLARE
    user_column text;
BEGIN
    SELECT column_name
    INTO user_column
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'refresh_token'
      AND column_name IN ('user_user_id', 'user_id')
    ORDER BY CASE column_name WHEN 'user_user_id' THEN 0 ELSE 1 END
    LIMIT 1;

    IF user_column IS NULL THEN
        RAISE EXCEPTION 'Cannot merge accounts: refresh_token user foreign key column was not found';
    END IF;

    EXECUTE format(
        'UPDATE refresh_token AS refresh
         SET %1$I = account_email_merge.canonical_user_id
         FROM account_email_merge
         WHERE refresh.%1$I = account_email_merge.user_id
           AND account_email_merge.user_id <> account_email_merge.canonical_user_id',
        user_column
    );
END $$;

DELETE FROM user_provider;

INSERT INTO user_provider (user_id, provider)
SELECT user_id, provider
FROM merged_user_providers;

UPDATE customers AS customer
SET email = lower(btrim(customer.email))
FROM account_email_merge
WHERE customer.user_id = account_email_merge.user_id;

DELETE FROM customers AS duplicate
USING account_email_merge
WHERE duplicate.user_id = account_email_merge.user_id
  AND account_email_merge.user_id <> account_email_merge.canonical_user_id;

ALTER TABLE customers ALTER COLUMN email SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_normalized_email
    ON customers (lower(btrim(email)));

COMMIT;
