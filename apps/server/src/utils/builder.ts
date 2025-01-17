import { FilterQuery, Model, PipelineStage, Types } from "mongoose";

export type Sort = {
  value: string | undefined;
  fields: string[];
};

export type Search = {
  value: string | undefined;
  trash: string | undefined;
  fields: string[];
};

export type Project = {
  value: string | undefined;
  fields: {
    default: Record<string, boolean>;
    alt?: Record<string, Record<string, boolean>>;
  };
};

export type Data = {
  sort: Sort;
  project: Project;
  search: Search;
  page: string | undefined;
};

export const build = (
  data: Data,
  defaultStaging: PipelineStage[] = []
): PipelineStage[] => {
  let pipeLineStages: PipelineStage[] = [...defaultStaging];

  pipeLineStages.push({ $match: queryBuilder(data.search) });

  if (data.project.value) {
    const project = projectionBuilder(data.project)

    if (Object.keys(project).length) pipeLineStages.push({ $project: projectionBuilder(data.project) });
  }

  if (data.sort.value) {
    pipeLineStages.push({ $sort: sortingBuilder(data.sort) });
  }

  let pagination = paginationBuilder(data.page);

  pipeLineStages = [
    ...pipeLineStages,
    { $skip: pagination.skip },
    { $limit: pagination.limit },
  ];

  console.log(
    JSON.stringify(pipeLineStages, null, 4)
  )

  return pipeLineStages;
};

export const queryBuilder = (search: Search) => {
  let query: FilterQuery<any> = {};

  if (search.value) {
    query.$or = [];

    if (Types.ObjectId.isValid(search.value)) {
      query.$or.push({ _id: search.value });
    }

    search.fields.forEach((field: string) => {
      query.$or?.push({
        [field]: { $regex: new RegExp(search.value ?? "", "ig") },
      });
    });
  }

  query.deletedAt = search.trash ? { $ne: null } : null;

  return query;
};

export const projectionBuilder = (projectFields: Project) => {
  // Define an empty object to hold the final projection result
  let projection: Record<string, boolean> = {};

  // Include some default fields in the projection result
  projectFields.fields.default = {
    ...projectFields.fields.default,
    updatedAt: true,
    deletedAt: true,
    createdAt: true,
  };

  // Check if any specific fields were requested for projection
  if (projectFields.value) {
    // Split the comma-separated fields into an array
    let splitFields = projectFields.value.split(",");

    // Loop over each requested field
    for (let field of splitFields) {
      // If the requested field is a default field, include it in the projection
      if (projectFields.fields.default[field]) {
        projection[field] = true;
        continue;
      }

      // If there are no alternative fields, skip to the next field
      if (!projectFields.fields.alt) {
        continue;
      }

      // If the requested field is an alternative field, check if any subfields were included
      if (projectFields.fields.alt[field]) {
        let foundSubfield = false;

        for (let subfield of splitFields) {
          if (subfield.includes(field + ".")) {
            foundSubfield = true;
            break;
          }
        }

        // If no subfields were included, include the alternative field in the projection
        if (!foundSubfield) {
          projection[field] = true;
        }

        continue;
      }

      // If the requested field is a combination of multiple fields, check if both fields exist in the alternative fields
      if (field.includes(".")) {
        // Split the field into two subfields
        let splitField = field.split(".");
        // Check if both subfields exist in the alternative fields
        if (
          projectFields.fields.alt[splitField[0]] &&
          projectFields.fields.alt[splitField[0]][splitField[1]]
        ) {
          projection[field] = true;
        }
      }
    }
  }

  return projection;
};

export const sortingBuilder = (sort: {
  value: string | undefined;
  fields: string[];
}) => {
  let sortingCriteria: Record<string, 1 | -1> = {};

  sort.fields = [...sort.fields, "createdAt", "updatedAt", "deletedAt"];

  if (sort.value) {
    let splitedfields = sort.value.split(",");

    for (let field of splitedfields) {
      if (field.includes(":")) {
        let [fieldName, order] = field.split(":");

        if (!sort.fields.includes(fieldName)) {
          continue;
        }

        sortingCriteria[fieldName] = order === "desc" ? -1 : 1;

        continue;
      }

      if (!sort.fields.includes(field)) {
        continue;
      }

      sortingCriteria[field] = 1;
    }
  }

  return sortingCriteria;
};

/**
 * This function used to create pagination
 *
 * @param paginationValue : number = 8 is the number of displayed documents
 * @param page : number = 0 is the displayed page
 * @returns { skib : number, limit : number }
 * */
export const paginationBuilder = (
  page: string | undefined,
  paginationValue: number = 8
): { skip: number; limit: number } => {
  let pagination: { skip: number; limit: number } = {
    skip: 0,
    limit: paginationValue,
  };

  if (Number(page) && Number(page) > 0) {
    pagination.skip = Number(page) * paginationValue - paginationValue;
  }

  return pagination;
};

/**
 * generate random id that can be used to index a file in storage
 * */
export const randomId = () => {
  return Date.now() + "-" + Math.round(Math.random() * 1e9);
};

export const paginate = async (
  data: any,
  page: string | undefined,
  Model: Model<any>,
  trash: string | undefined
) => {
  const pagination = paginationBuilder(page);

  return {
    data,
    limit: pagination.limit,
    skip: pagination.skip,
    count: await Model.count({ deletedAt: trash ? { $ne: null } : null }),
    page: Number(page) ? Number(page) : 1,
  };
};
