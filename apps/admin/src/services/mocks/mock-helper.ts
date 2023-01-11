import { rest } from "msw";
import { isFunction } from "lodash";

export type JsonResolver = Parameters<typeof rest.post>[1];
export type Request = Parameters<JsonResolver>[0];

type DataSet<Record> = Record[] | ((req: Request) => Record[]);

export const createFixResponseHandler =
  (response: any): JsonResolver =>
  (_, res, ctx) =>
    res(ctx.json(response));

export const createEmptyHandler =
  (statusCode = 200): JsonResolver =>
  (_, res, ctx) =>
    res(ctx.status(statusCode));

export const createDetailHandler =
  <Data extends { id: any }>(dataSet: DataSet<Data>, idParam: string): JsonResolver =>
  (req, res, ctx) => {
    const paramValue = req.params[idParam];
    const data = isFunction(dataSet) ? dataSet(req) : dataSet;

    const matchedItem = data.find((s) => s.id === paramValue);

    return res(matchedItem ? ctx.json(matchedItem) : ctx.status(404));
  };
