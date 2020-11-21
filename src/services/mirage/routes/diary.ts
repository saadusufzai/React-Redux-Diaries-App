import dayjs from "dayjs";
import { Diary } from "../../../interfaces/diary.interface";
import { User } from "../../../interfaces/user.interface";
import { handelError } from "../server";
import { Response, Request } from "miragejs";
import { Entry } from "../../../interfaces/entry.interface";

export const create = (
  schema: any,
  req: Request
):
  | {
      user: User;
      diary: Diary;
    }
  | Response => {
  try {
    const { title, type, userId } = JSON.parse(
      req.requestBody
    ) as Partial<Diary>;
    const existingUser = schema.users.findBy({ id: userId });
    if (!existingUser) {
      return handelError(null, "No user exists");
    }
    const now = dayjs().format();
    const diary = existingUser.createdDiary({
      title,
      type,
      createdAt: now,
      updatedAt: now,
    });
    return {
      user: {
        ...existingUser.attrs,
      },
      diary: diary.attr,
    };
  } catch (err) {
    return handelError(err, "Failed to create diary");
  }
};

export const updateDiary = (schema: any, req: Request): Diary | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    const data = JSON.parse(req.requestBody) as Partial<Diary>;
    const now = dayjs().format();
    diary.update({
      ...data,
      updatedAt: now,
    });
    return diary.attrs as Diary;
  } catch (err) {
    return handelError(err, "Failed to update diary");
  }
};

export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
  try {
    const user = schema.users.find(req.params.id);
    return user.diary as Diary[];
  } catch (err) {
    return handelError(err, "Failed to get user diaries");
  }
};

export const addEntry = (
  schema: any,
  req: Request
): { diary: Diary; entry: Entry } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
    diary.update({
      ...diary.attrs,
      updatedAt: now,
    });
    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (err) {
    return handelError(err, "Failed to save entry");
  }
};

export const getEntries = (
  schema: any,
  req: Request
): { entries: Entry[] } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    return diary.entry;
  } catch (err) {
    return handelError(err, "failed to get diary entries");
  }
};

export const updateEntry = (schema: any, req: Request): Entry | Response => {
  try {
    const entry = schema.entries.find(req.params.id);
    const data = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    entry.update({
      ...data,
      updatedAt: now,
    });
    return entry.attrs as Entry;
  } catch (err) {
    return handelError(err, "failed to update entry");
  }
};
