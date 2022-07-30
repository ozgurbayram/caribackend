import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
type User ={
    email:string,
    password:string
}
export default function authMiddleware(req:Request, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401).json({
    "message":"Token is missing"
  })

  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    req.body.user = user
    next()
  })
}
