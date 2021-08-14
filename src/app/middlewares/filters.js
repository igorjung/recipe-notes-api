export default async function(request, response, next) {
  const { query } = request;

  const filters = { ...query };

  delete filters.page;
  delete filters.limit;

  request.filters = filters;

  return next();
}
