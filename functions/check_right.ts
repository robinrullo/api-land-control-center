import {getCookieKeyValue} from "./utils";
import {CFP_ALLOWED_PATHS} from "./constants";

export async function onRequestPost(context: {
  request: Request;
  env: { CFP_PASSWORD?: string };
}): Promise<Response> {
  const {request, env} = context;
  const {path} = await request.json();
  const cookie = request.headers.get('cookie') || '';
  const cookieKeyValue = await getCookieKeyValue(env.CFP_PASSWORD);


  return new Response(JSON.stringify({
    access:
        cookie.includes(cookieKeyValue) ||
        CFP_ALLOWED_PATHS.some(p => p.test(path)) ||
        !env.CFP_PASSWORD
  }));
}
