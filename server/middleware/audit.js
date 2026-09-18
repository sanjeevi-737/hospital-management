const AuditLog = require("../models/AuditLog");

const METHOD_ACTION_MAP = {
  POST: "CREATE",
  PATCH: "UPDATE",
  PUT: "UPDATE",
  DELETE: "DELETE",
};

function extractEntity(url) {
  const parts = url.split("/").filter(Boolean);
  const apiIndex = parts.findIndex((p) => p === "api");
  if (apiIndex !== -1 && parts[apiIndex + 1]) {
    return parts[apiIndex + 1];
  }
  return parts[parts.length - 1] || "unknown";
}

const auditLog = (req, res, next) => {
  const action = METHOD_ACTION_MAP[req.method];
  if (!action) return next();

  if (!req.user) return next();

  const entity = extractEntity(req.originalUrl);

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    res.json = originalJson;

    const data = body && body.data ? body.data : body;

    let entityId = data && (data._id || data.id);
    if (!entityId) entityId = req.params.id;
    entityId = entityId ? String(entityId) : undefined;

    const logData = {
      userId: req.user?._id,
      hospitalId: req.user?.hospitalId,
      action,
      entity,
      entityId: entityId ? String(entityId) : undefined,
      newData: req.method !== "DELETE" ? req.body : undefined,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get("user-agent"),
    };

    AuditLog.create(logData).catch((err) => {
      console.error("Audit log creation failed:", err.message);
    });

    return originalJson(body);
  };

  next();
};

module.exports = auditLog;
