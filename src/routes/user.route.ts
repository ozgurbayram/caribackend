import { Router } from "express"

const userRouter = Router()

userRouter.post('/login',(req,res)=>{
    const {email,password} = req.body 
    
})

export default userRouter