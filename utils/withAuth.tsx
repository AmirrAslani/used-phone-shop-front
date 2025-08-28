import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

interface WithAuthOptions<P> {
  redirectIf?: (token: string | undefined, ctx: GetServerSidePropsContext) => boolean;
  destination?: string;
  permanent?: boolean;
}

export function withAuth<P extends { [key: string]: unknown }>(
  gssp: GetServerSideProps<P>,
  options: WithAuthOptions<P> = {}
): GetServerSideProps<P> {
  const { redirectIf = (token) => !!token, destination = "/", permanent = false } = options;

  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const token = ctx.req.cookies["accessToken"];

    if (redirectIf(token, ctx)) {
      return {
        redirect: {
          destination,
          permanent,
        },
      };
    }

    return gssp(ctx);
  };
}
