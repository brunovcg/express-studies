export const logRequestInConsole =  (request, response, next) => {
  console.log(request.method);
  return next();
};