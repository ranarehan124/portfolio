import type { FilterQuery, SortOrder, Model } from 'mongoose';
import type { Request } from 'express';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface QueryOptions {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
  searchFields: string[];
  filter: Record<string, string>;
  select: string;
  populate: string;
}

function parseQueryOptions(req: Request): QueryOptions {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string, 10) || 20),
  );
  const sort = (req.query.sort as string) || 'createdAt';
  const order = (req.query.order as 'asc' | 'desc') || 'desc';
  const search = (req.query.search as string) || '';
  const searchFields = (req.query.searchFields as string)?.split(',') || [];
  const select = (req.query.select as string) || '';
  const populate = (req.query.populate as string) || '';

  const filter: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (
      !['page', 'limit', 'sort', 'order', 'search', 'searchFields', 'select', 'populate'].includes(key) &&
      typeof value === 'string'
    ) {
      filter[key] = value;
    }
  }

  return { page, limit, sort, order, search, searchFields, filter, select, populate };
}

function buildSearchFilter<T>(
  searchFields: string[],
  search: string,
): FilterQuery<T> {
  if (!search || searchFields.length === 0) return {};
  return {
    $or: searchFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })),
  } as FilterQuery<T>;
}

function buildFilter<T>(
  rawFilter: Record<string, string>,
): FilterQuery<T> {
  const mongoFilter: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rawFilter)) {
    if (value === 'true' || value === 'false') {
      mongoFilter[key] = value === 'true';
    } else if (value.includes(',')) {
      mongoFilter[key] = { $in: value.split(',').map((v) => v.trim()) };
    } else {
      mongoFilter[key] = value;
    }
  }
  return mongoFilter as FilterQuery<T>;
}

export async function paginate<T>(
  model: Model<T>,
  req: Request,
  baseFilter: FilterQuery<T> = {},
  searchFields: string[] = [],
): Promise<PaginationResult<T>> {
  const options = parseQueryOptions(req);
  const { page, limit, sort, order, search, filter, select, populate } = options;

  const skip = (page - 1) * limit;
  const sortDirection: SortOrder = order === 'asc' ? 1 : -1;

  const searchFilter = buildSearchFilter<T>(searchFields, search);
  const customFilter = buildFilter<T>(filter);

  const combinedFilter: FilterQuery<T> = {
    ...baseFilter,
    ...searchFilter,
    ...customFilter,
  };

  let query = model.find(combinedFilter);

  if (select) {
    query = query.select(select);
  }

  if (populate) {
    const populateFields = populate.split(',');
    for (const field of populateFields) {
      query = query.populate(field.trim());
    }
  }

  const sortObj: Record<string, SortOrder> = { [sort]: sortDirection };
  query = query.sort(sortObj).skip(skip).limit(limit);

  const [data, totalItems] = await Promise.all([
    query.exec(),
    model.countDocuments(combinedFilter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export { parseQueryOptions };