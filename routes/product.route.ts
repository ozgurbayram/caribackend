import { Request, Response, Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { Product } from '../types';
import { prisma } from '../utils/PrismaClient';

const productRouter = Router()

productRouter.get('/list',authMiddleware,async(req:Request,res:Response)=>{
    const {id} = req.body.user    
    const produts = await prisma.product.findMany({
        where:{
            userId:id
        }
    })
    return res.status(200).json({
        'products':produts
    })
})

productRouter.post('/create',authMiddleware,async(req:Request,res:Response)=>{
    const {id} = req.body.user 
    const {barcode,name,price}:Product = req.body
    if(barcode && name && price) {
        const isExist = await prisma.product.findFirst({
            where:{
                barcode:barcode,
                userId:id
            }
        })
        if(isExist) {
            return res.status(400).json({
                'message':'Bu Barkod ile bir ürün kayıtlı'
            })
        }
        const product = await prisma.product.create({
            data:{
                barcode:barcode,
                name:name,
                price:price,
                userId:id
            },
        })
        return res.status(200).json({
            'message':'Product Created',
            'product':product
        })
    }
})

productRouter.delete('/:id',authMiddleware,async(req,res)=>{
    const id = req.params.id
    if(id) {
        const product = await prisma.product.findUnique({where:{id:id}})
        if(product) {
            try {
                await prisma.product.delete({where:{id:id}})
                return res.status(200).json({
                    'message':'Product deleted'
                })
                
            } catch (error) {
                return res.status(400).json({
                    'message':error
                })
            }
        }else{
            return res.status(400).json({
                'message':'Product with given id is not exist'
            })
        }
    }
    return res.status(400).json({
        'message':'Id must be given'
    })
})

export default productRouter
