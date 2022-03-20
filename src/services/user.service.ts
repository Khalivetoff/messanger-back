import Users from "../api/users";
import {IUser} from "../models/user";

class AuthService {
    private async getUser(): undefined | IUser {

    }
    
    public async Login(login: string, password: string): Promise<void> {
        const userData = await Users.findOne({ login })
    }
}

export default AuthService;
