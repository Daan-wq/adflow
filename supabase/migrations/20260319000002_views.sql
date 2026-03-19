CREATE VIEW dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM campaigns WHERE status = 'live') AS active_campaigns,
  (SELECT COUNT(*) FROM clients WHERE status = 'active') AS active_clients,
  (SELECT COUNT(*) FROM pages WHERE status = 'active') AS active_pages,
  (SELECT COALESCE(SUM(your_margin), 0) FROM campaigns WHERE status = 'completed'
    AND created_at >= date_trunc('month', now())) AS margin_this_month,
  (SELECT COALESCE(SUM(client_pays), 0) FROM campaigns WHERE status = 'completed'
    AND created_at >= date_trunc('month', now())) AS revenue_this_month,
  (SELECT COUNT(*) FROM payments WHERE status = 'pending' AND direction = 'incoming') AS pending_incoming,
  (SELECT COUNT(*) FROM payments WHERE status = 'pending' AND direction = 'outgoing') AS pending_outgoing;

CREATE VIEW client_profitability AS
SELECT
  c.id, c.name, c.contact_name,
  COUNT(cam.id) AS total_campaigns,
  COALESCE(SUM(cam.client_pays), 0) AS total_revenue,
  COALESCE(SUM(cam.your_margin), 0) AS total_margin,
  ROUND(AVG(cam.your_margin), 2) AS avg_margin_per_campaign
FROM clients c
LEFT JOIN campaigns cam ON cam.client_id = c.id AND cam.status = 'completed'
GROUP BY c.id, c.name, c.contact_name
ORDER BY total_margin DESC;

CREATE VIEW page_performance AS
SELECT
  p.id, p.handle, p.niche, p.follower_count, p.reliability_score,
  COUNT(cp.id) AS campaigns_run,
  ROUND(AVG(cp.reach), 0) AS avg_reach,
  ROUND(AVG(cp.impressions), 0) AS avg_impressions,
  ROUND(AVG(cp.cost), 2) AS avg_cost
FROM pages p
LEFT JOIN campaign_pages cp ON cp.page_id = p.id AND cp.status = 'completed'
GROUP BY p.id, p.handle, p.niche, p.follower_count, p.reliability_score
ORDER BY avg_reach DESC NULLS LAST;
