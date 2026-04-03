import { User } from "../../entities/usuario/user.entity.js";

export interface UserRepository {
    save(user: User): Promise<void>;
    update(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    delete(id: string): Promise<void>;
}