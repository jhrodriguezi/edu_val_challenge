import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken';
import env from '@ioc:Adonis/Core/Env';

export default class JwtAuth {
  public async handle({request, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const authHeader = request.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return response.status(401).send({ message: 'No token provided' });

    // Verify token
    jwt.verify(token, env.get('JWT_SECRET'), (err: any) => {
      if (err) return response.status(403).send({ message: 'Invalid token' });
    });
    
    await next()
  }
}
