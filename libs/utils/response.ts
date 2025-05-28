//libs/utils/response


export function successResponse(data: any = null, message = "") {
  return Response.json({
    status: true,
    data,
    message,
  });
}

export function errorResponse(message = "", data: any = null) {
  return Response.json({
    status: false,
    data,
    message,
  });
}
