import { MiddlewareFn } from "type-graphql";

const ErrorInterceptor: MiddlewareFn<any> = async (_, next) => {
  let hideEverything = true;
  try {
    return await next();
  } catch (err) {
    console.log(err); // log every error

    if (hideEverything) {
      throw new Error(
        "This error is a new error, the original is hidden from the client, pass hideEverything to false to see original error"
      );
    } else {
      throw err; // throw the original error to send it to client
    }
  }
};

export default ErrorInterceptor;
