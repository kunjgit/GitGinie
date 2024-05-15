import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
  
  },
)

export const config = { matcher: ['/profile','/repoconfig','/labelconfig'] }