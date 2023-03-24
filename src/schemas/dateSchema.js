import coreJoi from "joi";
import joiDate from "@joi/date";

const joi = coreJoi.extend(joiDate) //as typeof coreJoi;

export const dateSchema = joi.object({
    date: joi.date().format("YYYY-MM-DD")
})