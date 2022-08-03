import { Request, Response, Router } from 'express';
import { prisma } from '../utils/PrismaClient';
import authMiddleware from '../middleware/authMiddleware';

const paymentRoute = Router()

paymentRoute.post('/create',authMiddleware,async(req:Request,res:Response)=>{
    const {id} = req.body.user
    const {amount,products,companyName,recipient} = req.body
    if(amount&&products&&companyName&&recipient) {
        const newPayment = await prisma.payment.create({
            data:{
                amount:amount,
                companyName:companyName,
                products:products,
                recipient:recipient,
                userId:id
            }
        })
        if(newPayment) {
            return res.status(200).json({
                'message':'Ödeme Oluşturuldu',
                'payment':newPayment
            })
        }else{
            return res.status(400).json({
                'message':'Bir hata oluştu'
            })
        }
    }else{
        return res.status(400).json({
            'message':'Eksik form'
        })
    }
})

paymentRoute.get('/list',authMiddleware,async(req:Request,res:Response)=>{
    const {id} = req.body.user 
    const payments = await prisma.payment.findMany({
        where:{
            userId:id
        }
    })
    if(payments) {
        return res.status(200).json({
            'payments':payments
        })
    }
    return res.status(400).json({
        'message':'Bir hata oluştu'
    })
    
})

export default paymentRoute