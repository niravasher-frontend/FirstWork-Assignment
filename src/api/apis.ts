import { FormSchema } from "../types/types";

const FORM_SCHEMA_KEY = "form-schema";

const MIN_DELAY = 1000;
const MAX_DELAY = 3000;

export async function saveFormSchema(schema: FormSchema): Promise<void> {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    setTimeout(() => {
      try {
        const serializedSchema = JSON.stringify(schema);
        localStorage.setItem(FORM_SCHEMA_KEY, serializedSchema);

        resolve();
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error("Unknown error occurred while saving form"));
        }
      }
    }, delay);
  });
}

export async function getFormSchema(): Promise<FormSchema | null> {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    setTimeout(() => {
      try {
        // Retrieve from localStorage
        const serializedSchema = localStorage.getItem(FORM_SCHEMA_KEY);

        if (!serializedSchema) {
          resolve(null);
          return;
        }

        const parsedSchema: unknown = JSON.parse(serializedSchema);

        if (Array.isArray(parsedSchema)) {
          resolve(parsedSchema as FormSchema);
        } else {
          throw new Error("Invalid form schema format");
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error("Unknown error occurred while loading form"));
        }
      }
    }, delay);
  });
}
