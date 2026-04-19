export type RedirectSearchParams = {
  redirect?: string;
};

export type RequestWithSearchParams<T = RedirectSearchParams> = {
  searchParams?: Promise<T>;
  redirectUrl?: string;
  forceRedirect?: string;
  forceOnboard?: boolean;
};
