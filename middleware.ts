import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const protectedRoutes=createRouteMatcher([
    '/'
  
  ])
export default clerkMiddleware((auth,req)=>{
    if(protectedRoutes(req)){
      //if trying to access protected route
      auth().protect();
    }
    
  });
  
  export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };