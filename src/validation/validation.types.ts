export type ValidationError = {
  type: "validation";
  details: {
    field: string;
    message: string;
  }[];
};
