import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '@ioc:Adonis/Core/Env';

export default class UsersController {
    public async registerUser({ request, response }: HttpContextContract) {
        const { first_name,
                second_name,
                surname,
                second_surname,
                document_type_id,
                document_number,
                email,
                password,
                role_id,
                phone,
                state } = request.all();

        const user = new User();
        const salt = bcrypt.genSaltSync();

        user.first_name = first_name;
        user.second_name = second_name;
        user.surname = surname;
        user.second_surname = second_surname;
        user.document_type_id = document_type_id;
        user.document_number = document_number;
        user.email = email;
        user.password = password;
        user.role_id = role_id;
        user.phone = phone;
        user.state = state;

        let token: string;

        try{
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            token = jwt.sign({ id: user.id, role_id: user.role_id }, env.get('JWT_SECRET'));
        }catch(e){
            return response.status(400).json({ message: 'Error al crear el usuario' });
        }

        return response.status(200).json({
            message: 'Usuario creado exitosamente',
            token
        });
    }

    public async loginUser({ request, response }: HttpContextContract) {
        const { email, password } = request.all();

        let token: string;
        let user: User;

        try{
            user = await User.findByOrFail('email', email);
        }catch(e){
            return response.status(400).json({ message: 'No user found!' });
        }
        
        try{
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) return response.status(400).json({ message: 'Invalid credentials' });
            token = jwt.sign({ id: user.id, role_id: user.role_id }, env.get('JWT_SECRET'));
        }catch(e){
            return response.status(400).json({ message: 'Invalid credentials' });
        }

        return response.status(200).json({ message: 'User logged in successfully', token });
    }

    public async logoutUser({ request, response }: HttpContextContract) {
        let token: string;
        try{
            token = request.header('Authorization')?.split(' ')[1] as string;
            jwt.verify(token, env.get('JWT_SECRET'));

            // I'm not sure if this is the best way to invalidate a token
        }catch(e){
            return response.status(400).json({ message: 'Invalid token' });
        }

        return response.status(200).json({ message: 'User logged out successfully' });
    }

    public async listUsersWithPagination({ request, response }: HttpContextContract) {
        const { page, limit, filter } = request.all();
        let users;
        if(!filter) users = await User.query().paginate(page, limit);
        else users = await User.query().where("name", "LIKE", `%${filter['name']}%`).paginate(page, limit);

        return response.status(200).json({ 
            message: 'Users listed successfully', 
            users
        });
    }

    public async updateUser({ request, response, params }: HttpContextContract) {
        const { first_name,
                second_name,
                surname,
                second_surname,
                document_type_id,
                document_number,
                email,
                password,
                role_id,
                phone,
                state } = request.all();
        const { id } = params;

        let user: User;

        try{
            user = await User.findOrFail(id);
        }catch(e){
            return response.status(404).json({ message: 'Error al actualizar' });
        }

        user.first_name = first_name;
        user.second_name = second_name;
        user.surname = surname;
        user.second_surname = second_surname;
        user.document_type_id = document_type_id;
        user.document_number = document_number;
        user.email = email;
        user.password = password;
        user.role_id = role_id;
        user.phone = phone;
        user.state = state;
        
        await user.save();

        return response.status(200).json({ message: 'Se actualizo correctamente' });
    }

    public async getUser({ response, params }: HttpContextContract) {
        const { id } = params;

        let user: User;

        try{
            user = await User.findOrFail(id);
        }catch(e){
            return response.status(404).json({ message: 'Error al al consultar el detalle del usuario' });
        }

        return response.status(200).json({ user });
    }

}
