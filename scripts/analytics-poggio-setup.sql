-- REVIEW ONLY: execute on the approved Analytics database during a separate rollout.
CREATE SCHEMA IF NOT EXISTS analytics_private;
REVOKE ALL ON SCHEMA analytics_private FROM PUBLIC;
CREATE TABLE IF NOT EXISTS analytics_private.ingest_limits (
 key text PRIMARY KEY, bucket bigint NOT NULL, count integer NOT NULL CHECK (count>=0)
);
REVOKE ALL ON analytics_private.ingest_limits FROM PUBLIC;
-- Grant USAGE + SELECT/INSERT/UPDATE only to the actual collector role, privately.
-- Expired IP quota keys contain HMACs only; schedule scoped deletion after 48 hours.
-- Registration remains a separate approved operation, not an automatic mock entry.
INSERT INTO sites(site_key,name,domain,enabled)
VALUES ('poggio_alla_pieve','Poggio alla Pieve','https://www.poggioallapieve.com/',true)
ON CONFLICT(site_key) DO UPDATE SET name=EXCLUDED.name,domain=EXCLUDED.domain,enabled=EXCLUDED.enabled;
