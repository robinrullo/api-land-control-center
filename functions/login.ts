import {getTemplate} from "./template";

export async function onRequestGet(context: {
  request: Request;
}) {
  const {searchParams} = new URL(context.request.url);
  const {error, redirect} = Object.fromEntries(searchParams);

  return new Response(getTemplate({redirectPath: redirect ?? '/', withError: error === '1'}), {
    headers: {
      'content-type': 'text/html'
    }
  });

}
