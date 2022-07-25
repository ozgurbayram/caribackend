import { Router,Request,Response } from "express"
import { prisma } from "../utils/PrismaClient"
import {genSalt,hash,compare} from 'bcrypt'
const userRouter = Router()

userRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body     
    if(email && password){
        const user = await prisma.user.findUnique({where:{email:email}})
        if(user){
            const passsword_check = await compare(password,user.password)
            if(passsword_check){
                return res.status(200).json({
                    "user":user
                })
            }
            return res.status(400).json({
                "message":"wrong password"
            })
        }
        return res.status(400).json({
            "message":"user not exist"
        }) 
    }
})

userRouter.post('/register',async (req:Request,res:Response)=>{
    const {email,password,password_confirm} = req.body
    if(email && password && password_confirm){
        const isExist = await prisma.user.findUnique({where:{email:email}})
        if(isExist){
            return res.status(409).json({
                "message":"User is exist"
            })
        }else{
            if(password != password_confirm){
                return res.status(400).json({
                    "message":"Passwords are not same"
                })
            }
            const salt = await genSalt(10)
            const hashed_password = await hash(password,salt)
            const user = await prisma.user.create({
                data:{email:email,password:hashed_password}
            })
            return res.status(200).json({
                "message":"User created",
                "user":user
            })
        }
    }
    return res.status(400).json({
        "message":"please send email,passsword and password_confirm"
    })
})

export default userRouter