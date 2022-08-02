import jwt from 'jsonwebtoken'
export default function generateJWT(id:string,email:string) {
    const secret_key = process.env.SECRET_KEY as string
    return jwt.sign({
        id:id,
        email:email
    },secret_key)
}