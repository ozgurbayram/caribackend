import { Router,Request,Response } from 'express'
import { prisma } from '../utils/PrismaClient'
import {genSalt,hash,compare} from 'bcrypt'
import generateJWT from '../utils/generateJwt'

const userRouter = Router()

userRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body     
    console.log(email,password)
    if(email && password) {
        const user = await prisma.user.findUnique({where:{email:email}})
        if(user) {
            const passsword_check = await compare(password,user.password)
            const token = generateJWT(user.id,email)
            if(passsword_check) {
                return res.status(200).json({
                    'access-token':token,
                    'email':user.email
                })
            }
            return res.status(400).json({
                'message':'Şifre Yanlış'
            })
        }
        return res.status(400).json({
            'message':'Bu E-posta adresi ile kayıtlı bir kullanıcı bulunmamaktadır.'
        }) 
    }
})

userRouter.post('/register',async (req:Request,res:Response)=>{
    const {email,password,password_confirm} = req.body
    if(email && password && password_confirm) {
        const isExist = await prisma.user.findUnique({where:{email:email}})
        if(isExist) {
            return res.status(409).json({
                'message':'E-posta adresi kullanılıyor'
            })
        }else{
            if(password != password_confirm) {
                return res.status(400).json({
                    'message':'Girilen şifreler uyuşmuyor.'
                })
            }
            const salt = await genSalt(10)
            const hashed_password = await hash(password,salt)
            const user = await prisma.user.create({
                data:{email:email,password:hashed_password}
            })
            const token = generateJWT(user.id,user.email)
            return res.status(200).json({
                'access-token':token,
                'email':user.email
            })
        }
    }
    return res.status(400).json({
        'message':'Form eksik.'
    })
})

export default userRouter
