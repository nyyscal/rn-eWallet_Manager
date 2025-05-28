import ratelimit from "../config/upstash.js";

const rateLimiter = async(req,res,next)=>{
  try {
    const {success} = await ratelimit.limit("my-rate-limit")
    if(!success) {
      return res.status(429).json({message:"Please try again later! Rate limiter is set."})
    }
    next()
  } catch (error) {
    console.log("Rate limit error",error)
    next(error)
  }
}
export default rateLimiter