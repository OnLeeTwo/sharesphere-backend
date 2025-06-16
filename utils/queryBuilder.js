function buildListQuery({ table, searchField = "title", filters = {} }) {
  const {
    page = 1,
    per_page = 10,
    search = "",
    sort_by = "created_at",
    sort_order = "desc",
    access_tier,
    category,
  } = filters;

  const offset = (page - 1) * per_page;

  let conditions = [];
  let values = [];
  let index = 1;

  if (search) {
    conditions.push(`${searchField} ILIKE $${index++}`);
    values.push(`%${search}%`);
  }

  if (access_tier) {
    conditions.push(`access_tier = $${index++}`);
    values.push(access_tier);
  }

  if (category) {
    conditions.push(`category = $${index++}`);
    values.push(filters.category);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const query = `
    SELECT * FROM ${table}
    ${whereClause}
    ORDER BY ${sort_by} ${sort_order.toUpperCase()}
    LIMIT $${index++} OFFSET $${index}
  `;

  values.push(per_page);
  values.push(offset);

  return { query, values };
}

module.exports = { buildListQuery };
