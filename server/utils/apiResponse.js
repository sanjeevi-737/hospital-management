class ApiResponse {
  static success(res, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static error(res, message = "Internal Server Error", statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginated(res, data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;
